"use client";

import { useState } from "react";
import { VisualConcept } from "@/lib/types";

interface Props {
  concepts: VisualConcept[];
  campaignId: string;
  hasLiveProvider: boolean;
}

export function VisualConceptSection({ concepts, campaignId, hasLiveProvider }: Props) {
  const [active, setActive] = useState<Record<number, number>>(() =>
    Object.fromEntries(concepts.map((_, i) => [i, 0]))
  );
  const [applying, setApplying] = useState<number | null>(null);

  const activeConcepts = concepts.map((c, i) => {
    const vars = c.assetVariations ?? [{ url: c.assetUrl, provider: c.assetProvider }];
    const idx = active[i] ?? 0;
    const chosen = vars[idx];
    return { ...c, assetUrl: chosen.url, assetProvider: chosen.provider };
  });

  async function apply(conceptIdx: number, varIdx: number) {
    setActive((prev) => ({ ...prev, [conceptIdx]: varIdx }));
    const concept = concepts[conceptIdx];
    const vars = concept.assetVariations ?? [{ url: concept.assetUrl, provider: concept.assetProvider }];
    const chosen = vars[varIdx];

    setApplying(conceptIdx);
    try {
      const updated = concepts.map((c, i) => {
        if (i !== conceptIdx) return c;
        return { ...c, assetUrl: chosen.url, assetProvider: chosen.provider, assetStatus: "enhanced" as const };
      });
      await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visualConcepts: updated }),
      });
    } finally {
      setApplying(null);
    }
  }

  return (
    <>
      {/* 04 / VISUAL SYSTEM */}
      <section className="section-shell">
        <div className="eyebrow">04 / VISUAL SYSTEM</div>
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <h2>Prompts with a point of view</h2>
          <p className="section-copy md:justify-self-end">Campaign-ready image directions generated from the strategy.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {activeConcepts.map((v) => (
            <div className="card" key={v.title}>
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_20%,#c7ff4733,transparent_35%),radial-gradient(circle_at_75%_70%,#8b5cf633,transparent_40%),#090b13]">
                {v.assetProvider === "magnific" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.assetUrl} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] text-slate-300 backdrop-blur-sm">
                    {v.format}
                  </span>
                </div>
              </div>
              <h3 className="mt-0 text-lg">{v.title}</h3>
              <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-500">{v.prompt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 / MAGNIFIC ENHANCEMENT */}
      <section className="section-shell">
        <div className="eyebrow">05 / MAGNIFIC ENHANCEMENT</div>
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <h2>Visual assets</h2>
          <p className="section-copy md:justify-self-end">
            {hasLiveProvider
              ? "Select a variation and apply it to update the visual direction above."
              : "Preview assets are rendered from the mock adapter. VS Code MCP authentication is not shared with the app runtime."}
          </p>
        </div>
        <div className="space-y-10">
          {concepts.map((concept, ci) => {
            const vars = concept.assetVariations ?? [{ url: concept.assetUrl, provider: concept.assetProvider }];
            const activeIdx = active[ci] ?? 0;
            return (
              <div key={concept.title}>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{concept.title}</p>
                  <span className="text-[10px] text-slate-500">{vars.length} variation{vars.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {vars.map((v, vi) => {
                    const isActive = vi === activeIdx;
                    return (
                      <button
                        key={vi}
                        onClick={() => apply(ci, vi)}
                        disabled={applying === ci}
                        className={`group relative aspect-[3/2] overflow-hidden rounded-xl border-2 transition-all ${
                          isActive
                            ? "border-lime shadow-[0_0_12px_#c7ff471a]"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        {v.provider === "magnific" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.url} alt={`${concept.title} variation ${vi + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#c7ff4733,transparent_35%),radial-gradient(circle_at_75%_70%,#8b5cf633,transparent_40%),#090b13]" />
                        )}
                        <div className="absolute inset-0 flex flex-col items-start justify-between p-2">
                          <span className="rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[8px] text-white backdrop-blur">
                            {String(vi + 1).padStart(2, "0")}
                          </span>
                          {isActive && (
                            <span className="rounded-full bg-lime px-2 py-0.5 text-[8px] font-semibold text-black">
                              APPLIED
                            </span>
                          )}
                        </div>
                        {applying === ci && !isActive && (
                          <div className="absolute inset-0 bg-black/50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
