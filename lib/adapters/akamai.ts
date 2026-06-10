import { Region } from "@/lib/types";
export interface RoutingAdapter {
  route(
    region: Region,
  ): Promise<{ edge: string; region: Region; overheadMs: number }>;
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
