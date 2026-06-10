import { NextResponse } from "next/server";
import { campaignStore } from "@/lib/services/campaign-store";
import { ObservabilitySummary } from "@/lib/types";

export async function GET(
  _: Request,
  { params }: { params: { campaignId: string } },
) {
  const campaign = campaignStore.get(params.campaignId);
  if (!campaign)
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  const totalTokens = campaign.agentRuns.reduce(
    (sum, run) => sum + run.tokensUsed,
    0,
  );
  const totalLatencyMs = campaign.agentRuns.reduce(
    (sum, run) => sum + run.latencyMs,
    0,
  );
  const firstStart = Math.min(
    ...campaign.agentRuns.map((run) => new Date(run.startedAt).getTime()),
  );
  const lastFinish = Math.max(
    ...campaign.agentRuns.map(
      (run) => new Date(run.startedAt).getTime() + run.latencyMs,
    ),
  );
  const summary: ObservabilitySummary = {
    campaignId: campaign.id,
    totalTokens,
    totalLatencyMs,
    wallClockLatencyMs: lastFinish - firstStart,
    regions: Array.from(new Set(campaign.agentRuns.map((run) => run.region))),
    agentRuns: campaign.agentRuns,
  };
  return NextResponse.json(summary);
}
