import { NextResponse } from "next/server";
import { campaignStore } from "@/lib/services/campaign-store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const campaign = campaignStore.get(params.id);
  return campaign
    ? NextResponse.json(campaign)
    : NextResponse.json({ error: "Campaign not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const campaign = campaignStore.get(params.id);
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  const updates = await request.json();
  const updated = { ...campaign, ...updates };
  campaignStore.set(updated);
  return NextResponse.json(updated);
}
