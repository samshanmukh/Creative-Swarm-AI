import { NextRequest, NextResponse } from "next/server";
import { generateCampaign } from "@/lib/agents/orchestrator";
import { campaignStore } from "@/lib/services/campaign-store";

export async function POST(request: NextRequest) {
  let body: { product?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.product !== "string" || !body.product.trim()) {
    return NextResponse.json(
      { error: "Product URL or description is required" },
      { status: 400 },
    );
  }
  if (body.product.trim().length > 2000) {
    return NextResponse.json(
      { error: "Product input must be 2,000 characters or fewer" },
      { status: 400 },
    );
  }

  try {
    const campaign = await generateCampaign(body.product.trim());
    campaignStore.set(campaign);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Campaign generation failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Campaign generation failed",
      },
      { status: 500 },
    );
  }
}
