import { partnerPortalRu, partnerPortalStoryRu } from './partner-portal.ts';
import { learnRu, learnStoryRu } from './learn.ts';
import { vetClinicRu, vetClinicStoryRu } from './vet-clinic.ts';
import { pawlyRu, pawlyStoryRu } from './pawly.ts';

/** Accepted stories. Home, Next, sitemap and both locales keep this order. Agent Ops removed 18.11.2026 (stage 1: no publication permit). */
export const casesRu = [
  { ...partnerPortalRu, theme: partnerPortalStoryRu.theme, story: partnerPortalStoryRu, meta: { ...partnerPortalRu.meta, description: partnerPortalStoryRu.cover.outcome } },
  { ...learnRu, theme: learnStoryRu.theme, story: learnStoryRu, meta: { ...learnRu.meta, description: learnStoryRu.cover.outcome } },
  { ...vetClinicRu, theme: vetClinicStoryRu.theme, story: vetClinicStoryRu, meta: { ...vetClinicRu.meta, description: vetClinicStoryRu.cover.outcome } },
  { ...pawlyRu, theme: pawlyStoryRu.theme, story: pawlyStoryRu, meta: { ...pawlyRu.meta, description: pawlyStoryRu.cover.outcome } },
];
