import { Campaign } from "@/lib/types";
import { Observability } from "@/components/observability";
import { AkamaiInfrastructurePanel } from "@/components/akamai-infrastructure";
import { VisualConceptSection } from "@/components/visual-concept-section";

export function CampaignView({ campaign }: { campaign: Campaign }) {
  const totalTokens = campaign.agentRuns.reduce(
    (sum, run) => sum + run.tokensUsed,
    0,
  );
  const usesAkamaiCloud = campaign.agentRuns.some(
    (run) => run.routeProvider === "akamai-cloud",
  );
  const infrastructureRegions = Array.from(
    new Set(campaign.agentRuns.map((run) => run.infrastructureRegion)),
  );

  return (
    <main className="pb-24">
      <header className="border-b border-white/10 bg-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="font-semibold text-white">
            <span className="mr-2 text-lime">✦</span>Creative Swarm
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-slate-500 sm:block">
              Campaign / {campaign.id}
            </span>
            <a
              href="#observability"
              className="rounded-full border border-white/10 bg-panel px-4 py-2 text-xs text-white transition hover:border-white/20"
            >
              View trace
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-14">
        <div className="eyebrow">CAMPAIGN INTELLIGENCE / COMPLETE</div>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-.04em] text-white md:text-6xl">
          Your creative swarm
          <br />
          <span className="text-slate-500">found the signal.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400">
          {campaign.product}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Pill>9 agents completed</Pill>
          <Pill>US · EU · APAC</Pill>
          <Pill>{usesAkamaiCloud ? "Akamai Cloud live" : "Mock Akamai routing"}</Pill>
          <Pill>{infrastructureRegions.join(" · ")}</Pill>
          <Pill>{campaign.mode === "openai" ? "OpenAI live" : "Mock inference"}</Pill>
          <Pill>{totalTokens.toLocaleString()} tokens</Pill>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <AkamaiInfrastructurePanel compact />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="card-label">LIVE WORKFLOW MAP</p>
            <span className="text-[10px] text-lime">COMPLETE</span>
          </div>
          <div className="grid gap-0 md:grid-cols-4">
            <WorkflowStage label="DISCOVER" agents="Trend + Research" region="GLOBAL" />
            <WorkflowStage label="STRATEGIZE" agents="Strategy" region="GLOBAL" />
            <WorkflowStage
              label="LOCALIZE"
              agents="US + EU + APAC"
              region={usesAkamaiCloud ? "AKAMAI CLOUD" : "3 MOCK EDGES"}
            />
            <WorkflowStage label="DELIVER" agents="Visual + Magnific + Critic" region="GLOBAL" last />
          </div>
        </div>
      </section>

      <Section
        num="01"
        label="MARKET SIGNAL"
        title="Trends worth building on"
        copy="Live cultural and category signals translated into campaign opportunities."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {campaign.trendInsights.map((t, i) => (
            <div className="card group" key={t}>
              <p className="mb-8 font-mono text-xs text-lime">0{i + 1} / SIGNAL</p>
              <p className="text-lg leading-7 text-slate-200">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        num="02"
        label="GLOBAL STRATEGY"
        title="Three ways into the story"
        copy={campaign.researchSummary}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {campaign.campaignAngles.map((a, i) => (
            <div className="card relative overflow-hidden" key={a.title}>
              <span className="absolute right-4 top-2 text-7xl font-bold text-white/[.025]">
                {i + 1}
              </span>
              <p className="card-label">ANGLE 0{i + 1}</p>
              <h3>{a.title}</h3>
              <p className="mt-3 text-lg text-lime">"{a.hook}"</p>
              <p className="mt-5 text-sm leading-6 text-slate-500">{a.rationale}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        num="03"
        label="EDGE LOCALIZATION"
        title="Global idea. Local instinct."
        copy="Regional agents adapt tone, value, and channel to the market."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {campaign.regionalCampaigns.map((c) => (
            <div className="card" key={c.region}>
              <div className="flex items-center justify-between">
                <span className="region-tag">{c.region}</span>
                <span className="text-[10px] text-slate-500">{c.channel}</span>
              </div>
              <h3>{c.headline}</h3>
              <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">{c.body}</p>
              <button className="mt-6 w-full rounded-lg border border-white/10 bg-panel py-3 text-xs font-medium text-white transition hover:border-white/20 hover:bg-white/5">
                {c.cta} →
              </button>
            </div>
          ))}
        </div>
      </Section>

      <VisualConceptSection
        concepts={campaign.visualConcepts}
        campaignId={campaign.id}
        hasLiveProvider={campaign.visualConcepts.some((c) => c.assetProvider === "magnific")}
      />

      <section className="section-shell">
        <div className="rounded-2xl border border-lime/20 bg-lime/[.045] p-6 md:flex md:items-center md:justify-between md:gap-12">
          <div>
            <p className="eyebrow">CRITIC AGENT / FINAL VERDICT</p>
            <h2 className="mt-3 text-2xl md:text-3xl">Creative is cleared to ship.</h2>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:mt-0">
            {campaign.criticSummary}
          </p>
        </div>
      </section>

      <Observability runs={campaign.agentRuns} />
    </main>
  );
}

function WorkflowStage({
  label,
  agents,
  region,
  last = false,
}: {
  label: string;
  agents: string;
  region: string;
  last?: boolean;
}) {
  return (
    <div className={`relative border-white/10 p-5 md:border-r ${last ? "md:border-r-0" : ""}`}>
      {!last && (
        <span className="absolute right-[-5px] top-1/2 z-10 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_15px_#c7ff47] md:block" />
      )}
      <p className="font-mono text-[9px] tracking-[.18em] text-lime">{region}</p>
      <p className="mt-5 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{agents}</p>
    </div>
  );
}

function Section({
  num,
  label,
  title,
  copy,
  children,
}: {
  num: string;
  label: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-shell">
      <div className="eyebrow">
        {num} / {label}
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <h2>{title}</h2>
        <p className="section-copy md:justify-self-end">{copy}</p>
      </div>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-panel px-3 py-1.5 text-[11px] text-slate-400">
      {children}
    </span>
  );
}
