import { routingAdapter } from "@/lib/adapters/akamai";
import { OpenAIInferenceAdapter } from "@/lib/adapters/inference";
import { magnificAdapter } from "@/lib/adapters/magnific";
import { demoCampaign } from "@/lib/mock-data";
import {
  AgentName,
  AgentRun,
  Campaign,
  Region,
  RegionalCampaign,
  VisualConcept,
} from "@/lib/types";

interface AgentResult<T> {
  data: T;
  run: AgentRun;
}

const agentRegions: Record<AgentName, Region> = {
  TrendAgent: "Global",
  ResearchAgent: "Global",
  StrategyAgent: "Global",
  USRegionalAgent: "US",
  EURegionalAgent: "EU",
  APACRegionalAgent: "APAC",
  VisualPromptAgent: "Global",
  MagnificAgent: "Global",
  CriticAgent: "Global",
};

const agentInstructions: Record<AgentName, string> = {
  TrendAgent:
    'Return {"trendInsights":["four concise current market or content trends"]}.',
  ResearchAgent:
    'Return {"researchSummary":"a concise audience and category insight paragraph"}.',
  StrategyAgent:
    'Return {"campaignAngles":[{"title":"","hook":"","rationale":""}]} with exactly three differentiated angles.',
  USRegionalAgent:
    'Return {"region":"US","headline":"","body":"","cta":"","channel":""} with punchy US developer-market copy.',
  EURegionalAgent:
    'Return {"region":"EU","headline":"","body":"","cta":"","channel":""} with credible, transparent, efficiency-led EU copy.',
  APACRegionalAgent:
    'Return {"region":"APAC","headline":"","body":"","cta":"","channel":""} with momentum and distributed-team-focused APAC copy.',
  VisualPromptAgent:
    'Return {"visualConcepts":[{"title":"","prompt":"","format":""}]} with exactly three premium campaign image prompts and no text rendered in the images.',
  MagnificAgent:
    'Return {"summary":"a concise description of three assets prepared for high-resolution enhancement"}.',
  CriticAgent:
    'Return {"criticSummary":"a concise final quality review covering consistency, differentiation, and regional fit"}.',
};

function isRealOpenAI() {
  return process.env.USE_REAL_OPENAI === "true";
}

function parseJson<T>(text: string, agentName: AgentName): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${agentName} returned invalid JSON`);
  }
}

function mockDataFor(agentName: AgentName) {
  switch (agentName) {
    case "TrendAgent":
      return { trendInsights: demoCampaign.trendInsights };
    case "ResearchAgent":
      return { researchSummary: demoCampaign.researchSummary };
    case "StrategyAgent":
      return { campaignAngles: demoCampaign.campaignAngles };
    case "USRegionalAgent":
      return demoCampaign.regionalCampaigns[0];
    case "EURegionalAgent":
      return demoCampaign.regionalCampaigns[1];
    case "APACRegionalAgent":
      return demoCampaign.regionalCampaigns[2];
    case "VisualPromptAgent":
      return {
        visualConcepts: demoCampaign.visualConcepts.map(
          ({ title, prompt, format }) => ({ title, prompt, format }),
        ),
      };
    case "MagnificAgent":
      return { summary: "Prepared three high-resolution enhancement jobs." };
    case "CriticAgent":
      return { criticSummary: demoCampaign.criticSummary };
  }
}

export async function runAgent<T>(
  agentName: AgentName,
  product: string,
  context = "",
): Promise<AgentResult<T>> {
  const region = agentRegions[agentName];
  const startedAt = new Date().toISOString();
  const started = Date.now();
  const route = await routingAdapter.route(region);
  const input = context
    ? `PRODUCT:\n${product}\n\nUPSTREAM CONTEXT:\n${context}`
    : `PRODUCT:\n${product}`;

  let data: T;
  let tokensUsed: number;

  if (isRealOpenAI()) {
    const result = await new OpenAIInferenceAdapter().complete(
      `You are ${agentName}, one specialist in a distributed creative campaign swarm. ${agentInstructions[agentName]} Return JSON only.`,
      input,
    );
    data = parseJson<T>(result.text, agentName);
    tokensUsed = result.tokens;
  } else {
    data = mockDataFor(agentName) as T;
    tokensUsed = 145 + agentName.length * 11 + Math.min(context.length, 500) / 10;
  }

  const latencyMs = Math.max(
    Date.now() - started + route.overheadMs,
    route.overheadMs + 92 + agentName.length * 8,
  );

  return {
    data,
    run: {
      agentName,
      region,
      input: `${input} · routed via ${route.edge}`,
      output: JSON.stringify(data),
      latencyMs: Math.round(latencyMs),
      tokensUsed: Math.round(tokensUsed),
      status: "completed",
      edge: route.edge,
      startedAt,
      routeProvider: route.provider,
      infrastructureRegion: route.infrastructureRegion,
      routeFallback: route.fallback,
    },
  };
}

export async function runSingleAgent(
  agentName: AgentName,
  input: string,
  context = "",
): Promise<AgentRun> {
  return (await runAgent(agentName, input, context)).run;
}

export async function generateCampaign(product: string): Promise<Campaign> {
  const runs: AgentRun[] = [];

  const [trend, research] = await Promise.all([
    runAgent<{ trendInsights: string[] }>("TrendAgent", product),
    runAgent<{ researchSummary: string }>("ResearchAgent", product),
  ]);
  runs.push(trend.run, research.run);

  const strategyContext = JSON.stringify({
    trends: trend.data.trendInsights,
    research: research.data.researchSummary,
  });
  const strategy = await runAgent<{
    campaignAngles: Campaign["campaignAngles"];
  }>("StrategyAgent", product, strategyContext);
  runs.push(strategy.run);

  const creativeContext = JSON.stringify({
    research: research.data.researchSummary,
    angles: strategy.data.campaignAngles,
  });
  const [us, eu, apac, visuals] = await Promise.all([
    runAgent<RegionalCampaign>("USRegionalAgent", product, creativeContext),
    runAgent<RegionalCampaign>("EURegionalAgent", product, creativeContext),
    runAgent<RegionalCampaign>("APACRegionalAgent", product, creativeContext),
    runAgent<{ visualConcepts: Omit<VisualConcept, "assetUrl">[] }>(
      "VisualPromptAgent",
      product,
      creativeContext,
    ),
  ]);
  runs.push(us.run, eu.run, apac.run, visuals.run);

  const enhanced = await Promise.all(
    visuals.data.visualConcepts.map((concept, index) =>
      magnificAdapter.enhance(concept.prompt, index),
    ),
  );
  const visualConcepts = visuals.data.visualConcepts.map((concept, index) => ({
    ...concept,
    assetUrl: enhanced[index].assetUrl,
    assetProvider: enhanced[index].provider,
    assetStatus: enhanced[index].status,
  }));
  const magnific = await runAgent<{ summary: string }>(
    "MagnificAgent",
    product,
    JSON.stringify(visualConcepts),
  );
  runs.push(magnific.run);

  const critic = await runAgent<{ criticSummary: string }>(
    "CriticAgent",
    product,
    JSON.stringify({
      angles: strategy.data.campaignAngles,
      regionalCampaigns: [us.data, eu.data, apac.data],
      visualConcepts,
    }),
  );
  runs.push(critic.run);

  return {
    id: `swarm-${Date.now().toString(36)}`,
    product,
    createdAt: new Date().toISOString(),
    mode: isRealOpenAI() ? "openai" : "mock",
    status: "completed",
    trendInsights: trend.data.trendInsights,
    researchSummary: research.data.researchSummary,
    campaignAngles: strategy.data.campaignAngles,
    regionalCampaigns: [us.data, eu.data, apac.data],
    visualConcepts,
    criticSummary: critic.data.criticSummary,
    agentRuns: runs,
  };
}
