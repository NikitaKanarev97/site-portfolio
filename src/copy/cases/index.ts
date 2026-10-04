import { agentOpsConsole, agentOpsStory } from './agent-ops-console.ts';
import { partnerPortal, partnerPortalStory } from './partner-portal.ts';
import { learn, learnStory } from './learn.ts';
import { vetClinic, vetClinicStory } from './vet-clinic.ts';
import { pawly, pawlyStory } from './pawly.ts';

/** Five accepted stories. Home, Next, sitemap and both locales keep this order. */
export const cases = [
  { ...agentOpsConsole, theme: agentOpsStory.theme, story: agentOpsStory, meta: { ...agentOpsConsole.meta, description: agentOpsStory.cover.outcome } },
  { ...partnerPortal, theme: partnerPortalStory.theme, story: partnerPortalStory, meta: { ...partnerPortal.meta, description: partnerPortalStory.cover.outcome } },
  { ...learn, theme: learnStory.theme, story: learnStory, meta: { ...learn.meta, description: learnStory.cover.outcome } },
  { ...vetClinic, theme: vetClinicStory.theme, story: vetClinicStory, meta: { ...vetClinic.meta, description: vetClinicStory.cover.outcome } },
  { ...pawly, theme: pawlyStory.theme, story: pawlyStory, meta: { ...pawly.meta, description: pawlyStory.cover.outcome } },
];

export type Case = (typeof cases)[number];
