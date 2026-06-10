export type Region = "Global" | "US" | "EU" | "APAC";
export type AgentStatus = "completed" | "running" | "failed";
export type AgentName =
  | "TrendAgent"
  | "ResearchAgent"
  | "StrategyAgent"
  | "USRegionalAgent"
  | "EURegionalAgent"
  | "APACRegionalAgent"
  | "VisualPromptAgent"
  | "MagnificAgent"
  | "CriticAgent";

export interface AgentRun {
  agentName: AgentName;
  region: Region;
  input: string;
  output: string;
  latencyMs: number;
  tokensUsed: number;
  status: AgentStatus;
  edge: string;
  startedAt: string;
}

export interface RegionalCampaign {
  region: Exclude<Region, "Global">;
  headline: string;
  body: string;
  cta: string;
  channel: string;
}
export interface VisualConcept {
  title: string;
  prompt: string;
  format: string;
  assetUrl: string;
}
export interface Campaign {
  id: string;
  product: string;
  createdAt: string;
  mode: "mock" | "openai";
  status: "completed" | "failed";
  trendInsights: string[];
  researchSummary: string;
  campaignAngles: { title: string; hook: string; rationale: string }[];
  regionalCampaigns: RegionalCampaign[];
  visualConcepts: VisualConcept[];
  criticSummary: string;
  agentRuns: AgentRun[];
}

export interface ObservabilitySummary {
  campaignId: string;
  totalTokens: number;
  totalLatencyMs: number;
  wallClockLatencyMs: number;
  regions: Region[];
  agentRuns: AgentRun[];
}
