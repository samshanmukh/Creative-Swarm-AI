import { NextResponse } from "next/server";
import { campaignStore } from "@/lib/services/campaign-store";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const campaign = campaignStore.get(params.id);
  return campaign
    ? NextResponse.json(campaign)
    : NextResponse.json({ error: "Campaign not found" }, { status: 404 });
}
