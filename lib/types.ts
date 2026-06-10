export type Region = "Global" | "US" | "EU" | "APAC";
export type AgentStatus = "completed" | "running" | "failed";

export interface AgentRun {
  agentName: string;
  region: Region;
  input: string;
  output: string;
  latencyMs: number;
  tokensUsed: number;
  status: AgentStatus;
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
  trendInsights: string[];
  researchSummary: string;
  campaignAngles: { title: string; hook: string; rationale: string }[];
  regionalCampaigns: RegionalCampaign[];
  visualConcepts: VisualConcept[];
  agentRuns: AgentRun[];
}
