/**
 * Partner Portal case V2 — copy for the case-scoped renderer
 * `src/components/portal/PortalCase.astro`. Composition map:
 * `ds/screens/case-dssl.md §V2`. Media keys resolve against
 * `src/data/partner-portal-v2-media.json` (built by scripts/b2b-v2/).
 *
 * Every frame is a fresh capture of b2b-partner-portal @ 6bbe1cd on synthetic
 * data; numbers in the copy are read off those frames, not invented.
 * EN and RU share structure and media keys; `assertPortalPair` checks it.
 */

export type PortalShot = {
  /** Media key without locale: `workspace-1280`. */
  desktop: string;
  /** Authentic 390 px capture for phones; omitted = desktop frame scales. */
  mobile?: string;
  alt: string;
};

export type PortalCaseCopy = {
  cover: {
    eyebrow: string;
    title: string;
    promise: string;
    main: PortalShot & { label: string };
    detail: PortalShot & { label: string };
    note: string;
  };
  facts: { term: string; value: string; href?: string }[];
  problem: {
    label: string; thesis: string; body: string;
    before: { src: string; alt: string; caption: string };
    after: PortalShot & { caption: string };
  };
  flow: { label: string; thesis: string; body: string; steps: { name: string; text: string }[] };
  decision: {
    label: string; thesis: string; body: string;
    compare: PortalShot & { caption: string };
    confirmed: PortalShot & { caption: string };
    why: { label: string; text: string };
  };
  verify: {
    label: string; thesis: string; body: string;
    shot: PortalShot & { caption: string };
    proofs: { term: string; text: string }[];
  };
  commerce: {
    label: string; thesis: string; body: string;
    line: PortalShot & { caption: string };
    bar: PortalShot & { caption: string };
  };
  supply: { label: string; thesis: string; body: string; shot: PortalShot & { caption: string } };
  outcome: {
    label: string; thesis: string; body: string;
    costLabel: string;
    costs: { term: string; text: string }[];
    cta: { label: string; href: string; note: string };
  };
};

export const PROTOTYPE_EN = 'https://b2b-partner-portal-five.vercel.app/';

export const portalCaseEn: PortalCaseCopy = {
  cover: {
    eyebrow: 'DSSL · B2B procurement workspace',
    title: 'B2B Partner Portal',
    promise: 'Turning ambiguous product requests into traceable procurement decisions.',
    main: {
      desktop: 'workspace-1280', mobile: 'workspace-top-390',
      label: 'Specification review · 7 of 48 imported lines still need the buyer',
      alt: 'Review specification for office_north_v8.xlsx: 41 of 48 lines confirmed, seven open lines marked Ambiguous, Missing or Changed, each with its source row and next action',
    },
    detail: {
      desktop: 'change-390',
      label: 'Cart · a changed price waits for approval on its source row',
      alt: 'Cart line for source row 19: price moved from ₽34,900 to ₽35,800, +2.6%, with the impact on the line and Accept change or Remove line',
    },
    note: 'Real product screens · synthetic data',
  },
  facts: [
    { term: 'Role', value: 'Sole product designer · research, IA, UX/UI, design system' },
    { term: 'Period', value: '2024–2026' },
    { term: 'Status', value: 'Redesign shipped at DSSL · rebuilt here on synthetic data' },
    { term: 'Prototype', value: 'Live product, EN and RU', href: PROTOTYPE_EN },
  ],
  problem: {
    label: '01 · Problem',
    thesis: 'Buyers arrived with a specification. The portal greeted them like a shop.',
    body: 'Integrators bring a ten-to-fifty-line spreadsheet for a dated project. The old dashboard led with a training banner and promotions, and every ambiguous line ended in a message to a manager.',
    before: {
      src: '/media/case-dssl/legacy-dashboard.webp',
      alt: 'The original portal dashboard: an unlabelled icon rail, a training banner, three action tiles and a promotional bonus block',
      caption: 'Before · the shipped original opened with a banner and a bonus offer',
    },
    after: {
      desktop: 'dashboard-1280', mobile: 'dashboard-390',
      alt: 'Procurement workspace: the current purchase office_north_v8.xlsx with 41 of 48 lines confirmed, a Resume review action, order updates and three ways to start a specification',
      caption: 'After · the workspace opens on the purchase in progress and what blocks it',
    },
  },
  flow: {
    label: '02 · System',
    thesis: 'Two ways in. One specification. Every line keeps its source.',
    body: 'An XLS import and pasted SKUs produce the same document. File, row, original text and quantity travel with each line all the way to the order.',
    steps: [
      { name: 'Import', text: 'An XLS file or pasted SKU and quantity pairs' },
      { name: 'Specification', text: '48 lines, each tied to its source row' },
      { name: 'Resolve', text: 'The buyer settles what ambiguous lines mean' },
      { name: 'Cart', text: 'Price and stock, checked apart from identity' },
      { name: 'Fulfillment', text: 'Timing, handovers and delivery cost' },
      { name: 'Order', text: 'Placed, and still traceable to the file' },
    ],
  },
  decision: {
    label: '03 · The human decision',
    thesis: 'The system narrows the options. The buyer makes the call.',
    body: '“nvr 8ch poe” matches two recorders that differ in one thing: object detection. The panel compares exactly that, keeps the file’s wording in view, and applies nothing until the buyer confirms.',
    compare: {
      desktop: 'decision-1280', mobile: 'decision-390',
      alt: 'Line 19 opened in the review queue: the source text “nvr 8ch poe”, 2 pcs, two candidate recorders compared by detection and storage bays, the first selected, and Apply to line 19',
      caption: 'Compare · only the attribute that separates the candidates',
    },
    confirmed: {
      desktop: 'confirmed-1280', mobile: 'confirmed-390',
      alt: 'Row 19 after applying: KX-7608NXI-K2, Confirmed, marked “was Ambiguous · Candidate chosen by the buyer”, with Undo',
      caption: 'Confirmed · still marked as the buyer’s choice, and reversible',
    },
    why: {
      label: 'Why not automate it',
      text: 'Compatibility rules for this equipment were not formalised anywhere I could verify. An automatic match would move the risk to the installation site.',
    },
  },
  verify: {
    label: '04 · Verification',
    thesis: 'Identity, price and stock answer different questions.',
    body: 'Product Details puts the technical identity beside the buyer’s own price and warehouse stock, and says where each answer comes from.',
    shot: {
      desktop: 'product-1280', mobile: 'product-390',
      alt: 'Product Details for the 4 MP object-detect bullet camera: photos, key specifications, a verified ERP price of ₽12,900 and 24 pcs in Moscow DC',
      caption: 'Product Details · reached from the catalog or from a specification line',
    },
    proofs: [
      { term: 'Identity', text: 'SKU, manufacturer and the specs that separate near-identical cameras' },
      { term: 'Price', text: 'The contract price from ERP, marked Verified with the time it was checked' },
      { term: 'Stock', text: 'Units per warehouse and dispatch time; delivery is priced later' },
    ],
  },
  commerce: {
    label: '05 · Commercial review',
    thesis: 'Uncertainty must never look like a price.',
    body: 'A price that moved after import waits on its own line for the buyer’s approval — see the cover. A missing price stays “Not confirmed”, leaves the total and blocks fulfillment. It never becomes zero.',
    line: {
      desktop: 'unpriced-1280', mobile: 'unpriced-390',
      alt: 'Cart line for an 8 MP dome camera: price and line total Not confirmed, with a note that the line is not in the total and a Remove line action',
      caption: 'An unpriced line says so, and offers a way forward',
    },
    bar: {
      desktop: 'cartbar-1280', mobile: 'cartbar-390',
      alt: 'Cart summary bar: Not ready for fulfillment, five unpriced lines and one open change explained, estimated total ₽1,362,600 for 43 of 48 lines, Choose fulfillment disabled',
      caption: 'The total names what it counts — and what still blocks the next step',
    },
  },
  supply: {
    label: '06 · Fulfillment',
    thesis: 'Same goods, three plans. The buyer chooses the trade-off.',
    body: 'Only after commercial review does the portal compare completion date, handovers and delivery cost. Speed versus fewer shipments becomes a visible choice, not a hidden default.',
    shot: {
      desktop: 'fulfillment-1280', mobile: 'fulfillment-390',
      alt: 'Choose a fulfillment plan: three plans for the same 48 lines compared by availability, completion date, shipments, warehouses and delivery cost; Fewest shipments selected',
      caption: 'Fastest by 01 Nov for ₽7,400, or one consolidated handover three days later for ₽4,200',
    },
  },
  outcome: {
    label: 'Outcome',
    thesis: 'A traceable path from spreadsheet to order.',
    body: 'The commercial redesign shipped at DSSL. What you see here is my later rebuild on synthetic data: it demonstrates the decisions, not measured post-launch results.',
    costLabel: 'What it cost',
    costs: [
      { term: 'Matching is not compatibility', text: 'Ambiguous lines wait for a person. It is the slowest step in the flow, by design.' },
      { term: 'Unknown is not zero', text: 'Unpriced lines stay out of the total until a manager quotes them.' },
      { term: 'Delivery is priced last', text: 'Its cost appears only once a fulfillment plan is chosen.' },
    ],
    cta: { label: 'Open the live prototype', href: PROTOTYPE_EN, note: 'Synthetic data · desktop and mobile · EN and RU' },
  },
};

/** Same shape, same media keys in the same order; strings are free. */
export function assertPortalPair(en: PortalCaseCopy, ru: PortalCaseCopy) {
  const keys = (copy: PortalCaseCopy) => JSON.stringify(copy, (k, v) => (typeof v === 'string' && !['desktop', 'mobile', 'src'].includes(k) ? '' : v));
  if (keys(en) !== keys(ru)) throw new Error('Partner Portal V2: EN and RU differ in structure or media');
}
