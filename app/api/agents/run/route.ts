import { NextRequest, NextResponse } from "next/server";
import { runSingleAgent } from "@/lib/agents/orchestrator";
import { AgentName } from "@/lib/types";

const agentNames: AgentName[] = [
  "TrendAgent",
  "ResearchAgent",
  "StrategyAgent",
  "USRegionalAgent",
  "EURegionalAgent",
  "APACRegionalAgent",
  "VisualPromptAgent",
  "MagnificAgent",
  "CriticAgent",
];

export async function POST(request: NextRequest) {
  let body: { agentName?: unknown; input?: unknown; context?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body.agentName !== "string" ||
    !agentNames.includes(body.agentName as AgentName) ||
    typeof body.input !== "string" ||
    !body.input.trim()
  ) {
    return NextResponse.json(
      { error: "A valid agentName and input are required" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      await runSingleAgent(
        body.agentName as AgentName,
        body.input.trim(),
        typeof body.context === "string" ? body.context : "",
      ),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent run failed" },
      { status: 500 },
    );
  }
}
