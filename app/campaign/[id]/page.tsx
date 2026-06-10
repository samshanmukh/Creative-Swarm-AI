import { notFound } from "next/navigation";
import { CampaignView } from "@/components/campaign-view";
import { campaignStore } from "@/lib/services/campaign-store";
export default function CampaignPage({ params }: { params: { id: string } }) {
  const campaign = campaignStore.get(params.id);
  if (!campaign) return notFound();
  return <CampaignView campaign={campaign} />;
}
