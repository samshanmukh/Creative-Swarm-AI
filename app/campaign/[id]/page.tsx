import { notFound } from "next/navigation";
import { CampaignView } from "@/components/campaign-view";
import { CampaignPoller } from "@/components/campaign-poller";
import { campaignStore } from "@/lib/services/campaign-store";

export default function CampaignPage({ params }: { params: { id: string } }) {
  const campaign = campaignStore.get(params.id);
  if (!campaign) return notFound();

  const hasPendingImages = campaign.visualConcepts.some(
    (v) => v.assetProvider === "mock-magnific",
  );

  return (
    <>
      {hasPendingImages && <CampaignPoller campaignId={params.id} />}
      <CampaignView campaign={campaign} />
    </>
  );
}
