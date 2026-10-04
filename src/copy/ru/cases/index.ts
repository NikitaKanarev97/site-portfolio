import { agentOpsConsoleRu, agentOpsStoryRu } from './agent-ops-console.ts';
import { partnerPortalRu, partnerPortalStoryRu } from './partner-portal.ts';
import { learnRu, learnStoryRu } from './learn.ts';
import { vetClinicRu, vetClinicStoryRu } from './vet-clinic.ts';
import { pawlyRu, pawlyStoryRu } from './pawly.ts';

/** Five accepted stories. Home, Next, sitemap and both locales keep this order. */
export const casesRu = [
  { ...agentOpsConsoleRu, theme: agentOpsStoryRu.theme, story: agentOpsStoryRu, meta: { ...agentOpsConsoleRu.meta, description: agentOpsStoryRu.cover.outcome } },
  { ...partnerPortalRu, theme: partnerPortalStoryRu.theme, story: partnerPortalStoryRu, meta: { ...partnerPortalRu.meta, description: partnerPortalStoryRu.cover.outcome } },
  { ...learnRu, theme: learnStoryRu.theme, story: learnStoryRu, meta: { ...learnRu.meta, description: learnStoryRu.cover.outcome } },
  { ...vetClinicRu, theme: vetClinicStoryRu.theme, story: vetClinicStoryRu, meta: { ...vetClinicRu.meta, description: vetClinicStoryRu.cover.outcome } },
  { ...pawlyRu, theme: pawlyStoryRu.theme, story: pawlyStoryRu, meta: { ...pawlyRu.meta, description: pawlyStoryRu.cover.outcome } },
];
