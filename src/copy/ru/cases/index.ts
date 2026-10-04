import { agentOpsConsoleRu } from './agent-ops-console.ts';
import { partnerPortalRu, partnerPortalStoryRu } from './partner-portal.ts';
import { vetClinicRu } from './vet-clinic.ts';
import { pawlyRu } from './pawly.ts';
import { learnRu, learnStoryRu } from './learn.ts';

/** Порядок совпадает с английским реестром и главной. */
export const casesRu = [
  { ...agentOpsConsoleRu, theme: 'agent' as const, story: undefined },
  { ...partnerPortalRu, theme: partnerPortalStoryRu.theme, story: partnerPortalStoryRu,
    meta: { ...partnerPortalRu.meta, description: partnerPortalStoryRu.cover.outcome } },
  { ...learnRu, theme: learnStoryRu.theme, story: learnStoryRu,
    meta: { ...learnRu.meta, description: learnStoryRu.cover.outcome } },
  { ...vetClinicRu, theme: 'vet' as const, story: undefined },
  { ...pawlyRu, theme: 'pawly' as const, story: undefined },
];
