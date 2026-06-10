import { demoCampaign } from "@/lib/mock-data";
import { Campaign } from "@/lib/types";
const globalStore = globalThis as unknown as {
  campaignStore?: Map<string, Campaign>;
};
const store =
  globalStore.campaignStore ?? new Map([[demoCampaign.id, demoCampaign]]);
globalStore.campaignStore = store;
export const campaignStore = {
  get: (id: string) => store.get(id),
  set: (campaign: Campaign) => store.set(campaign.id, campaign),
};
