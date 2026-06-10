import { NextResponse } from "next/server";
import { campaignStore } from "@/lib/services/campaign-store";
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
  return NextResponse.json({
    campaignId: campaign.id,
    totalTokens,
    totalLatencyMs,
    agentRuns: campaign.agentRuns,
  });
}
