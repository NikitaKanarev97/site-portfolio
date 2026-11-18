import { partnerPortal, partnerPortalStory } from './partner-portal.ts';
import { learn, learnStory } from './learn.ts';
import { vetClinic, vetClinicStory } from './vet-clinic.ts';
import { pawly, pawlyStory } from './pawly.ts';

/** Accepted stories. Home, Next, sitemap and both locales keep this order. Agent Ops removed 18.11.2026 (stage 1: no publication permit). */
export const cases = [
  { ...partnerPortal, theme: partnerPortalStory.theme, story: partnerPortalStory, meta: { ...partnerPortal.meta, description: partnerPortalStory.cover.outcome } },
  { ...learn, theme: learnStory.theme, story: learnStory, meta: { ...learn.meta, description: learnStory.cover.outcome } },
  { ...vetClinic, theme: vetClinicStory.theme, story: vetClinicStory, meta: { ...vetClinic.meta, description: vetClinicStory.cover.outcome } },
  { ...pawly, theme: pawlyStory.theme, story: pawlyStory, meta: { ...pawly.meta, description: pawlyStory.cover.outcome } },
];

export type Case = (typeof cases)[number];
