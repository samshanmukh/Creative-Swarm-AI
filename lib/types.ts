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
  routeProvider: "mock-akamai" | "akamai-cloud";
  infrastructureRegion: string;
  routeFallback: boolean;
}

export interface RegionalCampaign {
  region: Exclude<Region, "Global">;
  headline: string;
  body: string;
  cta: string;
  channel: string;
}
export interface AssetVariation {
  url: string;
  provider: "mock-magnific" | "magnific";
}

export interface VisualConcept {
  title: string;
  prompt: string;
  format: string;
  assetUrl: string;
  assetProvider: "mock-magnific" | "magnific";
  assetStatus: "placeholder" | "enhanced";
  assetVariations?: AssetVariation[];
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

export interface AkamaiCloudInstance {
  id: number;
  label: string;
  region: string;
  regionLabel: string;
  country: string;
  status: string;
  ipv4: string[];
  tags: string[];
}

export interface AkamaiInfrastructure {
  provider: "akamai-cloud";
  connected: boolean;
  instances: AkamaiCloudInstance[];
  fetchedAt: string;
}
