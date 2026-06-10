import { Campaign } from "@/lib/types";

export const DEMO_PRODUCT =
  "An AI coding assistant that automates repetitive developer workflows.";
export const demoCampaign: Campaign = {
  id: "demo-swarm-001",
  product: DEMO_PRODUCT,
  createdAt: new Date("2026-06-10T09:30:00Z").toISOString(),
  mode: "mock",
  status: "completed",
  trendInsights: [
    "AI coding agents are shifting from autocomplete to autonomous, multi-step workflows.",
    "MCP is becoming the connective tissue between developer tools and AI agents.",
    "Browser automation is turning repetitive QA and research into delegatable work.",
    "Vibe coding is expanding the builder audience beyond traditional software teams.",
  ],
  researchSummary:
    "Developers want leverage without losing control. The strongest position combines visible orchestration, safe handoffs, and measurable time reclaimed.",
  campaignAngles: [
    {
      title: "Ship the boring stuff away",
      hook: "Your backlog has busywork. Your swarm has time.",
      rationale: "Leads with an immediate, relatable developer pain point.",
    },
    {
      title: "From copilot to crew",
      hook: "One assistant answers. A swarm delivers.",
      rationale:
        "Differentiates autonomous workflow execution from autocomplete.",
    },
    {
      title: "Your workflow, now self-driving",
      hook: "Connect the tools. Set the goal. Watch work move.",
      rationale: "Makes MCP-powered orchestration tangible and outcome-led.",
    },
  ],
  regionalCampaigns: [
    {
      region: "US",
      headline: "Delete busywork from your sprint.",
      body: "Deploy an AI coding swarm that handles repetitive workflows while your team ships what matters.",
      cta: "Start shipping faster",
      channel: "LinkedIn + X",
    },
    {
      region: "EU",
      headline: "Automate the routine. Keep control.",
      body: "A transparent AI coding assistant built for efficient, accountable developer workflows.",
      cta: "See the workflow",
      channel: "LinkedIn + developer newsletters",
    },
    {
      region: "APAC",
      headline: "Scale every developer's momentum.",
      body: "Turn repeatable engineering tasks into always-on workflows for fast-moving distributed teams.",
      cta: "Build at swarm speed",
      channel: "LinkedIn + community channels",
    },
  ],
  visualConcepts: [
    {
      title: "Neon workflow swarm",
      prompt:
        "Editorial 3D visualization of luminous AI agents moving code tasks through a distributed workflow graph, obsidian background, electric lime and violet, premium SaaS campaign, no text",
      format: "16:9 hero",
      assetUrl:
        "https://placehold.co/1200x675/171a28/c7ff47?text=Magnific+Enhanced+01",
    },
    {
      title: "Before / after sprint",
      prompt:
        "Split-screen conceptual ad: overloaded developer task board transforming into an elegant autonomous agent pipeline, cinematic studio lighting, dark UI aesthetic, no text",
      format: "1:1 social",
      assetUrl:
        "https://placehold.co/800x800/171a28/8b5cf6?text=Magnific+Enhanced+02",
    },
    {
      title: "Global agent relay",
      prompt:
        "Abstract global relay of software agents across US Europe and APAC, flowing code particles, sophisticated technical visualization, black background, lime accents, no text",
      format: "4:5 social",
      assetUrl:
        "https://placehold.co/800x1000/171a28/c7ff47?text=Magnific+Enhanced+03",
    },
  ],
  criticSummary:
    "The campaign is cohesive across regions, makes the product differentiation clear, and balances speed with a credible sense of user control.",
  agentRuns: [
    ["TrendAgent", "Global", 228, 291],
    ["ResearchAgent", "Global", 246, 318],
    ["StrategyAgent", "Global", 241, 336],
    ["USRegionalAgent", "US", 213, 273],
    ["EURegionalAgent", "EU", 224, 282],
    ["APACRegionalAgent", "APAC", 236, 300],
    ["VisualPromptAgent", "Global", 251, 327],
    ["MagnificAgent", "Global", 194, 237],
    ["CriticAgent", "Global", 205, 219],
  ].map(([agentName, region, latencyMs, tokensUsed], index) => ({
    agentName: agentName as import("@/lib/types").AgentName,
    region: region as "Global" | "US" | "EU" | "APAC",
    input: `${DEMO_PRODUCT} · routed through mock Akamai edge`,
    output: `${agentName} completed its assigned creative task.`,
    latencyMs: latencyMs as number,
    tokensUsed: tokensUsed as number,
    status: "completed" as const,
    edge:
      region === "US"
        ? "iad-edge-07"
        : region === "EU"
          ? "fra-edge-03"
          : region === "APAC"
            ? "sin-edge-12"
            : "global-orchestrator",
    startedAt: new Date(
      new Date("2026-06-10T09:30:00Z").getTime() + index * 90,
    ).toISOString(),
  })),
};
