import { NextResponse } from "next/server";
import { campaignStore } from "@/lib/services/campaign-store";

// Returns campaigns that still have mock (ungenerated) visual assets.
// Claude Code polls this and generates real Magnific images via MCP.
export async function GET() {
  const store = (
    globalThis as unknown as { campaignStore?: Map<string, import("@/lib/types").Campaign> }
  ).campaignStore;

  if (!store) return NextResponse.json([]);

  const pending = Array.from(store.values())
    .filter((c) => c.visualConcepts.some((v) => v.assetProvider === "mock-magnific"))
    .map((c) => ({
      id: c.id,
      visualConcepts: c.visualConcepts.map((v, i) => ({
        index: i,
        title: v.title,
        prompt: v.prompt,
        format: v.format,
        needsImage: v.assetProvider === "mock-magnific",
      })),
    }));

  return NextResponse.json(pending);
}
