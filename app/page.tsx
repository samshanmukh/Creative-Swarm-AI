import { ProductForm } from "@/components/product-form";

const swarmSteps = [
  ["01", "Discover", "Trend + research agents find the market signal."],
  ["02", "Strategize", "A strategy agent turns signal into campaign angles."],
  ["03", "Distribute", "Regional agents localize for US, EU, and APAC."],
  ["04", "Create", "Visual + Magnific agents prepare campaign assets."],
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
            className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300"
          >
            View demo
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
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="eyebrow">HOW THE SWARM WORKS</p>
            <h2 className="mt-4 max-w-md">Distributed by design.</h2>
            <p className="section-copy mt-4">
              One orchestrated workflow, routed across mock Akamai edge regions
              and built to swap cleanly to real infrastructure.
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
    </main>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">
        {label}
      </p>
    </div>
  );
}
