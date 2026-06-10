import {
  AkamaiCloudInstance,
  AkamaiInfrastructure,
  Region,
} from "@/lib/types";

const API_BASE = "https://api.linode.com/v4";
const CACHE_TTL_MS = 60_000;

interface LinodeInstanceResponse {
  id: number;
  label: string;
  region: string;
  status: string;
  ipv4: string[];
  tags: string[];
}

interface LinodeRegionResponse {
  id: string;
  label: string;
  country: string;
}

interface Paginated<T> {
  data: T[];
}

export interface RouteDecision {
  edge: string;
  region: Region;
  overheadMs: number;
  provider: "mock-akamai" | "akamai-cloud";
  infrastructureRegion: string;
  fallback: boolean;
}

export interface RoutingAdapter {
  route(region: Region): Promise<RouteDecision>;
}

function mockRoute(region: Region): RouteDecision {
  const edges: Record<Region, string> = {
    Global: "global-orchestrator",
    US: "iad-edge-07",
    EU: "fra-edge-03",
    APAC: "sin-edge-12",
  };
  return {
    edge: edges[region],
    region,
    provider: "mock-akamai",
    infrastructureRegion: region,
    fallback: false,
    overheadMs:
      region === "Global"
        ? 12
        : region === "US"
          ? 18
          : region === "EU"
            ? 27
            : 34,
  };
}

export class MockAkamaiRoutingAdapter implements RoutingAdapter {
  async route(region: Region) {
    return mockRoute(region);
  }
}

let infrastructureCache:
  | { value: AkamaiInfrastructure; expiresAt: number }
  | undefined;
let infrastructureRequest: Promise<AkamaiInfrastructure> | undefined;

async function cloudRequest<T>(path: string, authenticated = true): Promise<T> {
  const token = process.env.AKAMAI_CLOUD_TOKEN;
  if (authenticated && !token) {
    throw new Error("AKAMAI_CLOUD_TOKEN is required for Akamai Cloud routing");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: authenticated ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Akamai Cloud API request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

function classifyRegion(country: string): Exclude<Region, "Global"> {
  const euCountries = new Set([
    "de",
    "fr",
    "gb",
    "it",
    "nl",
    "se",
    "es",
    "pl",
  ]);
  const apacCountries = new Set(["au", "id", "in", "jp", "sg"]);
  const normalized = country.toLowerCase();
  if (euCountries.has(normalized)) return "EU";
  if (apacCountries.has(normalized)) return "APAC";
  return "US";
}

async function loadInfrastructure(): Promise<AkamaiInfrastructure> {
  if (infrastructureCache && infrastructureCache.expiresAt > Date.now()) {
    return infrastructureCache.value;
  }
  if (infrastructureRequest) return infrastructureRequest;

  infrastructureRequest = Promise.all([
    cloudRequest<Paginated<LinodeInstanceResponse>>(
      "/linode/instances?page_size=500",
    ),
    cloudRequest<Paginated<LinodeRegionResponse>>("/regions?page_size=500", false),
  ])
    .then(([instanceResponse, regionResponse]) => {
      const regions = new Map(
        regionResponse.data.map((region) => [region.id, region]),
      );
      const value: AkamaiInfrastructure = {
        provider: "akamai-cloud",
        connected: true,
        fetchedAt: new Date().toISOString(),
        instances: instanceResponse.data.map((instance) => {
          const region = regions.get(instance.region);
          return {
            id: instance.id,
            label: instance.label,
            region: instance.region,
            regionLabel: region?.label ?? instance.region,
            country: region?.country ?? "unknown",
            status: instance.status,
            ipv4: instance.ipv4,
            tags: instance.tags,
          };
        }),
      };
      infrastructureCache = {
        value,
        expiresAt: Date.now() + CACHE_TTL_MS,
      };
      return value;
    })
    .finally(() => {
      infrastructureRequest = undefined;
    });

  return infrastructureRequest;
}

function primaryInstance(instances: AkamaiCloudInstance[]) {
  const preferredId = Number(process.env.AKAMAI_LINODE_ID);
  const preferredLabel =
    process.env.AKAMAI_LINODE_LABEL || "creative-swarm-ai-us-west";
  return (
    instances.find((instance) => instance.id === preferredId) ||
    instances.find((instance) => instance.label === preferredLabel) ||
    instances.find((instance) => instance.status === "running") ||
    instances[0]
  );
}

export class AkamaiCloudRoutingAdapter implements RoutingAdapter {
  async route(region: Region): Promise<RouteDecision> {
    const infrastructure = await loadInfrastructure();
    const primary = primaryInstance(infrastructure.instances);
    if (!primary) throw new Error("No Akamai Cloud Linodes were found");

    const regional =
      region === "Global"
        ? primary
        : infrastructure.instances.find(
            (instance) =>
              instance.status === "running" &&
              classifyRegion(instance.country) === region,
          );
    const selected = regional || primary;
    const fallback = region !== "Global" && !regional;

    return {
      edge: `${selected.label} / ${selected.region}`,
      region,
      provider: "akamai-cloud",
      infrastructureRegion: selected.regionLabel,
      fallback,
      overheadMs: fallback ? 42 : region === "Global" ? 14 : 22,
    };
  }
}

class ResilientAkamaiRoutingAdapter implements RoutingAdapter {
  private readonly mock = new MockAkamaiRoutingAdapter();
  private readonly cloud = new AkamaiCloudRoutingAdapter();

  async route(region: Region) {
    if (
      process.env.USE_REAL_AKAMAI !== "true" ||
      !process.env.AKAMAI_CLOUD_TOKEN
    ) {
      return this.mock.route(region);
    }
    try {
      return await this.cloud.route(region);
    } catch (error) {
      console.error("Akamai Cloud routing unavailable; using mock route", error);
      return this.mock.route(region);
    }
  }
}

export async function getAkamaiInfrastructure() {
  return loadInfrastructure();
}

export const routingAdapter: RoutingAdapter =
  new ResilientAkamaiRoutingAdapter();
