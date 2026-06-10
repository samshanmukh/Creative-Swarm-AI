import { Campaign } from "@/lib/types";
import { Observability } from "@/components/observability";
export function CampaignView({ campaign }: { campaign: Campaign }) {
  return (
    <main className="pb-24">
      <header className="border-b border-white/10">
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
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white"
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
          <Pill>Mock Akamai edge</Pill>
          <Pill>Magnific ready</Pill>
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
              <p className="mb-8 font-mono text-xs text-lime">
                0{i + 1} / SIGNAL
              </p>
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
              <p className="mt-3 text-lg text-lime">“{a.hook}”</p>
              <p className="mt-5 text-sm leading-6 text-slate-500">
                {a.rationale}
              </p>
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
              <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">
                {c.body}
              </p>
              <button className="mt-6 w-full rounded-lg border border-white/10 py-3 text-xs font-medium text-white">
                {c.cta} →
              </button>
            </div>
          ))}
        </div>
      </Section>
      <Section
        num="04"
        label="VISUAL SYSTEM"
        title="Prompts with a point of view"
        copy="Campaign-ready image directions generated from the strategy."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {campaign.visualConcepts.map((v) => (
            <div className="card" key={v.title}>
              <div className="mb-5 aspect-[4/3] rounded-xl bg-[radial-gradient(circle_at_30%_20%,#c7ff4733,transparent_35%),radial-gradient(circle_at_75%_70%,#8b5cf633,transparent_40%),#090b13] p-5">
                <div className="flex h-full items-end">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] text-slate-300">
                    {v.format}
                  </span>
                </div>
              </div>
              <h3 className="mt-0 text-lg">{v.title}</h3>
              <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-500">
                {v.prompt}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section
        num="05"
        label="MAGNIFIC ENHANCEMENT"
        title="Assets prepared for polish"
        copy="Mock enhancement jobs preserve a clean integration seam for the Magnific API."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {campaign.visualConcepts.map((v, i) => (
            <div className="card" key={v.assetUrl}>
              <div className="flex aspect-[3/2] items-center justify-center rounded-xl border border-white/[.08] bg-gradient-to-br from-violet/20 via-panel to-lime/10">
                <div className="text-center">
                  <span className="text-3xl">✦</span>
                  <p className="mt-3 text-xs font-medium text-white">
                    MAGNIFIC ENHANCED 0{i + 1}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Placeholder · high resolution
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-300">{v.title}</p>
                <span className="text-xs text-lime">READY</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Observability runs={campaign.agentRuns} />
    </main>
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
    <span className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-[11px] text-slate-400">
      {children}
    </span>
  );
}
