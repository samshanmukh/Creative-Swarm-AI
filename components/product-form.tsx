"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_PRODUCT } from "@/lib/mock-data";
export function ProductForm() {
  const router = useRouter();
  const [product, setProduct] = useState(DEMO_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push(`/campaign/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="relative mx-auto mt-12 max-w-3xl rounded-[28px] border border-white/10 bg-white/[.055] p-3 shadow-glow backdrop-blur-xl"
    >
      <textarea
        aria-label="Product URL or description"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        rows={3}
        className="w-full resize-none bg-transparent px-4 py-4 text-lg text-white outline-none placeholder:text-slate-500"
        placeholder="Paste a product URL or describe what you’re launching…"
      />
      <div className="flex items-center justify-between border-t border-white/10 px-3 pt-3">
        <span className="hidden text-xs text-slate-500 sm:block">
          9 specialized agents · 3 edge regions · one creative brief
        </span>
        <button
          disabled={loading}
          className="rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Deploying swarm…" : "Generate campaign →"}
        </button>
      </div>
      {error && <p className="px-3 pt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
