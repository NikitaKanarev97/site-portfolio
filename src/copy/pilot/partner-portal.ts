import type { CoverMedia } from '../cases/story';
import { partnerPortal } from '../cases/partner-portal';
export const partnerPortalPilot = {
  title: 'Partner Portal',
  outcome: 'From an imported purchase list to an order — with each source row intact.',
  media: { variant: 'screen', layout: 'screen', items: [{ src: partnerPortal.cover.screens[0], alt: 'Specification review: imported source rows, statuses and seven remaining decisions. Synthetic data.', device: 'desktop' }] } satisfies CoverMedia,
  label: 'Closed motion preview',
  thesis: 'A source row stays with the order',
  body: 'This preview checks the shared cover transition. The full case remains on its existing route. Screens show the reconstructed prototype with synthetic data.',
};
