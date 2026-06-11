"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function CampaignPoller({ campaignId }: { campaignId: string }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        if (!res.ok) return;
        const campaign = await res.json();
        const stillPending = campaign.visualConcepts?.some(
          (v: { assetProvider: string }) => v.assetProvider === "mock-magnific",
        );
        if (!stillPending) {
          clearInterval(interval);
          router.refresh();
        }
      } catch {
        // network hiccup — keep polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [campaignId, router]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-lime/20 bg-panel px-4 py-2.5 text-xs text-slate-300 shadow-lg">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
      Generating Magnific images…
    </div>
  );
}
