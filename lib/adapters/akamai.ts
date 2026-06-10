import { Region } from "@/lib/types";

export interface RouteDecision {
  edge: string;
  region: Region;
  overheadMs: number;
  provider: "mock-akamai" | "akamai";
}

export interface RoutingAdapter {
  route(region: Region): Promise<RouteDecision>;
}

export class MockAkamaiRoutingAdapter implements RoutingAdapter {
  async route(region: Region) {
    const edges: Record<Region, string> = {
      Global: "global-orchestrator",
      US: "iad-edge-07",
      EU: "fra-edge-03",
      APAC: "sin-edge-12",
    };
    return {
      edge: edges[region],
      region,
      provider: "mock-akamai" as const,
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
}

export const routingAdapter: RoutingAdapter = new MockAkamaiRoutingAdapter();
