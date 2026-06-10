import { NextRequest, NextResponse } from "next/server";
import { runSingleAgent } from "@/lib/agents/orchestrator";
import { Region } from "@/lib/types";
export async function POST(request: NextRequest) {
  const { agentName, input, region = "Global" } = await request.json();
  if (!agentName || !input)
    return NextResponse.json(
      { error: "agentName and input are required" },
      { status: 400 },
    );
  return NextResponse.json(
    await runSingleAgent(agentName, input, region as Region),
  );
}
