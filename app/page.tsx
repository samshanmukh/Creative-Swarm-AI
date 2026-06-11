import { ProductForm } from "@/components/product-form";
import { AkamaiInfrastructurePanel } from "@/components/akamai-infrastructure";

const swarmSteps = [
  ["01", "Discover", "Trend + research agents find the market signal."],
  ["02", "Strategize", "A strategy agent turns signal into campaign angles."],
  ["03", "Distribute", "Regional agents localize for US, EU, and APAC."],
  ["04", "Create", "Visual + Magnific agents prepare campaign assets."],
];

const useCases = [
  {
    category: "Developer Tools",
    icon: "⚡",
    description: "API platforms, CLI tools, coding assistants, CI/CD pipelines",
    output: "Technical hooks · Dev community angles · 3 regional variants",
    accent: "text-lime",
    border: "border-lime/15",
    bg: "bg-lime/[.03]",
  },
  {
    category: "SaaS & Subscriptions",
    icon: "◈",
    description: "Analytics, CRM, project management, and productivity suites",
    output: "Feature-to-benefit copy · Competitor differentiation · Funnel-aware CTAs",
    accent: "text-violet-400",
    border: "border-violet-400/15",
    bg: "bg-violet-400/[.03]",
  },
  {
    category: "Consumer Apps",
    icon: "◎",
    description: "Mobile, gaming, social, health, and lifestyle applications",
    output: "Trend-native hooks · Platform-specific visual direction · Viral angles",
    accent: "text-sky-400",
    border: "border-sky-400/15",
    bg: "bg-sky-400/[.03]",
  },
  {
    category: "Enterprise Software",
    icon: "▦",
    description: "Security, compliance, infrastructure, and ERP solutions",
    output: "Risk-reduction framing · Stakeholder copy · ROI-led regional ads",
    accent: "text-amber-400",
    border: "border-amber-400/15",
    bg: "bg-amber-400/[.03]",
  },
  {
    category: "Agencies & Brands",
    icon: "✦",
    description: "Campaign briefs for client products across any vertical",
    output: "Multi-angle creative routes · Rapid client pitch decks · Global reach",
    accent: "text-rose-400",
    border: "border-rose-400/15",
    bg: "bg-rose-400/[.03]",
  },
  {
    category: "Hardware & Physical",
    icon: "◉",
    description: "Devices, IoT, wearables, and consumer goods launches",
    output: "Unboxing narrative · Lifestyle visual concepts · APAC + US launch copy",
    accent: "text-teal-400",
    border: "border-teal-400/15",
    bg: "bg-teal-400/[.03]",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-lime/5 blur-[100px]" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="font-semibold text-white">
          <span className="mr-2 text-lime">✦</span>Creative Swarm{" "}
          <span className="text-slate-600">AI</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden font-mono text-[10px] text-slate-600 sm:block">
            POWERED BY DISTRIBUTED INTELLIGENCE
          </span>
          <a
            href="/campaign/demo-swarm-001"
            className="rounded-full border border-white/10 bg-panel px-4 py-2 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            View demo
          </a>
          <a
            href="#infrastructure"
            className="hidden rounded-full border border-lime/20 bg-lime/10 px-4 py-2 text-xs text-lime transition hover:bg-lime/15 md:block"
          >
            Akamai live
          </a>
        </div>
      </nav>

      <section className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 text-center md:pt-36">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/5 px-3 py-1.5 font-mono text-[10px] tracking-wider text-lime">
          <span className="animate-pulse">●</span> 9 AGENTS READY TO DEPLOY
        </div>
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[.98] tracking-[-.06em] text-white md:text-8xl">
          One brief.
          <br />
          <span className="bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 bg-clip-text text-transparent">
            A world of ideas.
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
          Turn any product into a globally relevant campaign with a distributed
          swarm of trend, strategy, regional, and visual AI agents.
        </p>
        <ProductForm />
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
          <Stat value="9" label="specialized agents" />
          <Stat value="3" label="edge regions" />
          <Stat value="1" label="unified campaign" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-20">
        <div className="mb-10 grid gap-3 md:grid-cols-2">
          <div>
            <p className="eyebrow">USE CASES</p>
            <h2 className="mt-4">Built for every product story.</h2>
          </div>
          <p className="section-copy md:justify-self-end">
            Paste any product URL or description and the swarm adapts — from
            developer tools to consumer apps, enterprise deals to hardware launches.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.category}
              className={`rounded-2xl border ${uc.border} ${uc.bg} p-5 transition duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xl ${uc.accent}`}>{uc.icon}</span>
                <p className={`font-mono text-[10px] font-semibold tracking-widest ${uc.accent}`}>
                  {uc.category.toUpperCase()}
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{uc.description}</p>
              <div className="mt-4 border-t border-white/[.07] pt-4">
                <p className="font-mono text-[10px] text-slate-600">SWARM OUTPUT</p>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{uc.output}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="infrastructure"
        className="mx-auto max-w-7xl border-t border-white/10 px-6 py-20"
      >
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <div>
            <p className="eyebrow">LIVE INFRASTRUCTURE</p>
            <h2 className="mt-4">Built on Akamai Cloud.</h2>
          </div>
          <p className="section-copy md:justify-self-end">
            Live Linode instance discovery, honest regional fallback, and a
            clean path to distributed workers across US, EU, and APAC.
          </p>
        </div>
        <AkamaiInfrastructurePanel />
      </section>

      <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="eyebrow">HOW THE SWARM WORKS</p>
            <h2 className="mt-4 max-w-md">Distributed by design.</h2>
            <p className="section-copy mt-4">
              One orchestrated workflow backed by live Akamai Cloud metadata
              and designed to fan out across regional workers.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {swarmSteps.map(([number, title, copy]) => (
              <div className="bg-ink p-6" key={number}>
                <p className="font-mono text-[10px] text-lime">{number}</p>
                <h3 className="mt-5">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-20">
        <div className="mb-10 grid gap-3 md:grid-cols-2">
          <div>
            <p className="eyebrow">POWERED BY</p>
            <h2 className="mt-4">The stack behind the swarm.</h2>
          </div>
          <p className="section-copy md:justify-self-end">
            Three real integrations — one for intelligence, one for
            infrastructure, one for visuals — each with an honest resilient
            fallback when the live connection isn't available.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <PoweredByCard
            name="OpenAI"
            badge="LIVE"
            badgeColor="text-lime"
            model="gpt-4o-mini · JSON mode"
            description="Every agent in the swarm calls the OpenAI API. TrendAgent, ResearchAgent, StrategyAgent, three regional copywriters, VisualPromptAgent, MagnificAgent, and CriticAgent all run as independent completions with structured JSON responses — then the orchestrator chains their outputs together."
            contributions={[
              "9 parallel + sequential agent completions",
              "JSON-mode enforced on every call",
              "Temperature 0.65 for creative variance",
              "Token usage tracked per agent run",
            ]}
          />
          <PoweredByCard
            name="Akamai Cloud"
            badge="LIVE"
            badgeColor="text-lime"
            model="Linode API v4 · edge routing"
            description="The routing layer reads live Linode instance metadata from the Akamai Cloud API to assign each agent to a real infrastructure region. US, EU, and APAC intent is preserved with graceful fallback to the primary instance when regional workers aren't deployed yet."
            contributions={[
              "Live instance discovery via /linode/instances",
              "Region classification by country code",
              "Primary orchestrator auto-selection",
              "60-second metadata cache with dedup",
            ]}
          />
          <PoweredByCard
            name="Magnific"
            badge="MOCK-READY"
            badgeColor="text-amber-400"
            model="Enhancement API · resilient adapter"
            description="The VisualPromptAgent generates three campaign image prompts which are then passed to Magnific for high-resolution upscaling and enhancement. The adapter is fully wired — set USE_REAL_MAGNIFIC=true and add your MAGNIFIC_API_KEY to go live. Until then the mock adapter renders SVG concept previews."
            contributions={[
              "One enhance() call per visual concept",
              "Prompt passed as creative direction",
              "Mock SVG previews in fallback mode",
              "ResilientMagnificAdapter with auto-fallback",
            ]}
          />
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">{label}</p>
    </div>
  );
}

function PoweredByCard({
  name,
  badge,
  badgeColor,
  model,
  description,
  contributions,
}: {
  name: string;
  badge: string;
  badgeColor: string;
  model: string;
  description: string;
  contributions: string[];
}) {
  return (
    <div className="card flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-white">{name}</p>
          <p className="mt-1 font-mono text-[10px] text-slate-500">{model}</p>
        </div>
        <span className={`shrink-0 rounded-full border border-white/10 bg-panel px-3 py-1 font-mono text-[9px] ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-6 border-t border-white/[.07] pt-5">
        <p className="card-label mb-3">CONTRIBUTIONS</p>
        <ul className="space-y-2">
          {contributions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[11px] leading-5 text-slate-500">
              <span className="mt-0.5 text-lime">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
