import { NextRequest, NextResponse } from "next/server";
import { generateCampaign } from "@/lib/agents/orchestrator";
import { campaignStore } from "@/lib/services/campaign-store";
export async function POST(request: NextRequest) {
  const { product } = await request.json();
  if (!product?.trim())
    return NextResponse.json(
      { error: "Product URL or description is required" },
      { status: 400 },
    );
  const campaign = await generateCampaign(product.trim());
  campaignStore.set(campaign);
  return NextResponse.json(campaign, { status: 201 });
}
