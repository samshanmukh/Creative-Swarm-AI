import { routingAdapter } from "@/lib/adapters/akamai";
import { OpenAIInferenceAdapter } from "@/lib/adapters/inference";
import { magnificAdapter } from "@/lib/adapters/magnific";
import { demoCampaign } from "@/lib/mock-data";
import { AgentRun, Campaign, Region } from "@/lib/types";

const agentPlan: { agentName: string; region: Region; output: string }[] = [
  {
    agentName: "TrendAgent",
    region: "Global",
    output:
      "Found four high-signal trends across AI coding agents, MCP, browser automation, and vibe coding.",
  },
  {
    agentName: "ResearchAgent",
    region: "Global",
    output: demoCampaign.researchSummary,
  },
  {
    agentName: "StrategyAgent",
    region: "Global",
    output:
      "Created three differentiated campaign angles anchored in reclaimed developer time.",
  },
  {
    agentName: "USRegionalAgent",
    region: "US",
    output: demoCampaign.regionalCampaigns[0].body,
  },
  {
    agentName: "EURegionalAgent",
    region: "EU",
    output: demoCampaign.regionalCampaigns[1].body,
  },
  {
    agentName: "APACRegionalAgent",
    region: "APAC",
    output: demoCampaign.regionalCampaigns[2].body,
  },
  {
    agentName: "VisualPromptAgent",
    region: "Global",
    output: "Created three visual directions for hero and social placements.",
  },
  {
    agentName: "MagnificAgent",
    region: "Global",
    output: "Prepared three high-resolution enhancement jobs.",
  },
  {
    agentName: "CriticAgent",
    region: "Global",
    output: "Validated regional tone, message consistency, and channel fit.",
  },
];

export async function runSingleAgent(
  agentName: string,
  input: string,
  region: Region = "Global",
): Promise<AgentRun> {
  const started = Date.now();
  const route = await routingAdapter.route(region);
  const planned =
    agentPlan.find((a) => a.agentName === agentName)?.output ||
    "Agent completed its assigned creative task.";
  let output = planned;
  let tokens = 120 + agentName.length * 9;
  if (process.env.USE_REAL_OPENAI === "true") {
    const result = await new OpenAIInferenceAdapter().complete(
      `You are ${agentName}, a specialized creative campaign agent. Return concise campaign-ready output.`,
      input,
    );
    output = result.text;
    tokens = result.tokens;
  }
  return {
    agentName,
    region,
    input: `${input} · routed via ${route.edge}`,
    output,
    latencyMs: Math.max(
      Date.now() - started + route.overheadMs,
      route.overheadMs + 80 + agentName.length * 7,
    ),
    tokensUsed: tokens,
    status: "completed",
  };
}

export async function generateCampaign(product: string): Promise<Campaign> {
  const runs = await Promise.all(
    agentPlan.map((agent) =>
      runSingleAgent(agent.agentName, product, agent.region),
    ),
  );
  const visualConcepts = await Promise.all(
    demoCampaign.visualConcepts.map(async (concept, index) => ({
      ...concept,
      assetUrl: await magnificAdapter.enhance(concept.prompt, index),
    })),
  );
  return {
    ...demoCampaign,
    id: `swarm-${Date.now().toString(36)}`,
    product,
    createdAt: new Date().toISOString(),
    visualConcepts,
    agentRuns: runs,
  };
}
