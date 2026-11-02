/**
 * Partner Portal case V3 — copy for the case-scoped renderer
 * `src/components/portal/PortalCase.astro`. Composition map:
 * `ds/screens/case-dssl.md §V3`. Media keys resolve against
 * `src/data/partner-portal-v2-media.json`; V3 entries are built by
 * scripts/b2b-v3/build-media.mjs, earlier ones by scripts/b2b-v2/.
 *
 * Every product frame is a capture of b2b-partner-portal on synthetic data.
 * Frames come from three recorded commits (6bbe1cd, c899933, 36be1d8); the
 * registry names the commit per image. Numbers in the copy are read off those
 * frames or the product source, not invented.
 * EN and RU share structure and media keys; `assertPortalPair` checks it.
 */

export type PortalShot = {
  /** Media key without locale: `workspace-1280`. */
  desktop: string;
  /** Authentic 390 px capture for phones; omitted = desktop frame scales. */
  mobile?: string;
  alt: string;
};

/** Archival screenshot of the original portal, opened full size on demand. */
export type ArchiveShot = { src: string; width: number; height: number; alt: string; caption: string };

type Term = { term: string; text: string };

export type PortalCaseCopy = {
  cover: {
    eyebrow: string;
    title: string;
    promise: string;
    role: string;
    main: PortalShot & { label: string };
    detail: PortalShot & { label: string };
    note: string;
    /** Phones: role and shipped/rebuild status in one line, replacing `role` + `note`. */
    brief: string;
  };
  facts: { term: string; value: string; href?: string }[];
  diagnosis: {
    label: string; thesis: string; body: string;
    observedLabel: string; directionLabel: string;
    evidence: { shot: ArchiveShot; findings: { symptom: string; direction: string }[] }[];
    after: PortalShot & { caption: string };
  };
  architecture: {
    label: string; thesis: string; body: string;
    inputsLabel: string;
    /** `to` names where the intake lands; on phones it is the visible route. */
    inputs: { name: string; text: string; to: string }[];
    /** Label on the catalog's direct line into the cart. */
    bypass: string;
    spec: { name: string; text: string; provenance: string[]; states: string[]; ruleLabel: string; rule: string };
    cart: { name: string; text: string; states: string[]; ruleLabel: string; loop: string };
    supply: { name: string; text: string };
    order: { name: string; text: string };
    bands: string[];
    note: string;
  };
  decision: {
    label: string; thesis: string; body: string;
    stages: { name: string; text: string; shot: PortalShot }[];
    why: { label: string; text: string };
    note: string;
  };
  verify: {
    label: string; thesis: string; body: string;
    shot: PortalShot & { caption: string };
    proofs: Term[];
  };
  commerce: {
    label: string; thesis: string; body: string;
    chain: Term[];
    line: PortalShot & { caption: string };
    bar: PortalShot & { caption: string };
  };
  supply: { label: string; thesis: string; body: string; dims: string[]; shot: PortalShot & { caption: string } };
  system: {
    label: string; thesis: string; body: string;
    typeLabel: string; colorLabel: string;
    colors: { token: string; role: string }[];
    families: { name: string; argument: string; states: { key: string; label: string }[] }[];
    /** Phones: names the count of a sideways-scrolling state row; `{n}` is replaced. */
    scrollCue: string;
    note: string;
  };
  process: {
    label: string; thesis: string; body: string;
    /** `origin` separates DSSL-era material from 2026 rebuild artifacts; `source` pins file and commit. */
    steps: { phase: string; title: string; text: string; origin: string; source: string }[];
    note: string;
  };
  outcome: {
    label: string; thesis: string; body: string;
    evidence: Term[];
    costLabel: string;
    costs: Term[];
    cta: { label: string; href: string; note: string };
  };
};

export const PROTOTYPE_EN = 'https://b2b-partner-portal-five.vercel.app/';

export const portalCaseEn: PortalCaseCopy = {
  cover: {
    eyebrow: 'DSSL · B2B procurement portal',
    title: 'B2B Partner Portal',
    promise: 'From spreadsheet to purchase — without losing control of the decisions.',
    role: 'Sole product designer: research, information architecture, UX/UI and the design system.',
    main: {
      desktop: 'workspace-1280', mobile: 'workspace-top-390',
      label: 'Specification review · 7 of 48 imported lines still need the buyer',
      alt: 'Review specification for office_north_v8.xlsx: 41 of 48 lines confirmed, seven open lines marked Ambiguous, Missing or Changed, each with its source row and next action',
    },
    detail: {
      desktop: 'change-detail-390',
      label: 'Cart · separate recording · a moved price waits for approval on its line',
      alt: 'Native price-change detail, recorded separately from the row 19 session: source row 19, ₽34,900 to ₽35,800, +2.6%, with its supplier-update reason',
    },
    note: 'The commercial redesign shipped at DSSL. The screens here are my later rebuild of its decisions on synthetic data, not the shipped release.',
    brief: 'Sole product designer. The commercial redesign shipped at DSSL; these screens are my later rebuild on synthetic data, not the shipped release.',
  },
  facts: [
    { term: 'Role', value: 'Sole product designer' },
    { term: 'Period', value: '2024–2026' },
    { term: 'Shipped', value: 'Commercial redesign, DSSL partner portal' },
    { term: 'Prototype', value: 'Public version · predates these screens', href: PROTOTYPE_EN },
  ],
  diagnosis: {
    label: '01 · Diagnosis',
    thesis: 'Buyers arrived with a specification. The portal greeted them like a shop.',
    body: 'Integrators bring a ten-to-fifty-line spreadsheet for a dated project. The original portal’s own screens show where its hierarchy worked against that job.',
    observedLabel: 'Observed',
    directionLabel: 'Direction',
    evidence: [
      {
        shot: {
          src: '/media/case-dssl/legacy-dashboard.webp', width: 713, height: 220,
          alt: 'The original portal dashboard: an unlabelled icon rail, a training banner, three equal action tiles and a promotional bonus block',
          caption: 'Original portal · dashboard, archival screenshot',
        },
        findings: [
          { symptom: 'A training banner and a bonus offer came first. Uploading a file was one of three equal tiles.', direction: 'Open on the purchase in progress and on what still blocks it.' },
        ],
      },
      {
        shot: {
          src: '/media/rebuild/partner-portal/v3/legacy-cart-alternative.webp', width: 1076, height: 299,
          alt: 'The original cart: a line with an empty price column and a red stock dot, its “best alternative” with a green dot, an AI-assistant hint that may contain mistakes, and a one-click Replace button',
          caption: 'Original portal · cart, archival screenshot',
        },
        findings: [
          { symptom: 'An unavailable item got one “best alternative” and a one-click Replace, justified by an AI hint that “may make mistakes”.', direction: 'Show the real candidates and how they differ. The buyer confirms.' },
          { symptom: 'The price column was blank, and stock was a red or green dot with no words.', direction: 'Name unknown prices and stock states in words, and keep them out of totals.' },
        ],
      },
    ],
    after: {
      desktop: 'dashboard-1280', mobile: 'dashboard-390',
      alt: 'Procurement workspace: the current purchase office_north_v8.xlsx with 41 of 48 lines confirmed, a Resume review action, order updates and three ways to start a specification',
      caption: 'Direction, built · the workspace opens on the purchase in progress and what blocks it',
    },
  },
  architecture: {
    label: '02 · Architecture',
    thesis: 'Different ways in. One specification. One place to resolve it.',
    body: 'A file and a pasted list become one specification, resolved in one place. A product the buyer already knows goes from the catalog straight to the cart. Each stage answers one kind of question, so identity, price and delivery never blur into a single “OK”.',
    inputsLabel: 'Ways in',
    inputs: [
      { name: 'XLS import', text: 'The buyer’s specification as it is', to: 'Into the specification' },
      { name: 'Quick order', text: 'Pasted SKU and quantity pairs', to: 'Into the specification' },
      { name: 'Catalog & search', text: 'A known product, from the list or its product page', to: 'Straight to the cart' },
    ],
    bypass: 'Known product · picked in the catalog, nothing to resolve',
    spec: {
      name: 'Specification',
      text: 'Every line keeps where it came from',
      provenance: ['file', 'row', 'source text', 'quantity'],
      states: ['Exact', 'Ambiguous', 'Missing', 'Changed'],
      ruleLabel: 'Resolved here',
      rule: 'One resolver for the file and the pasted list. The buyer confirms every open line.',
    },
    cart: {
      name: 'Cart',
      text: 'Commercial review, line by line',
      states: ['Verified', 'Stale', 'Not confirmed'],
      ruleLabel: 'Approved here',
      loop: 'A price or lead time that moved waits for the buyer’s approval on its own line',
    },
    supply: { name: 'Fulfillment', text: 'The buyer picks a plan: date, shipments, delivery cost' },
    order: { name: 'Checkout → Order', text: 'Terms confirmed, order created' },
    bands: ['Product identity', 'Commercial certainty', 'Fulfillment'],
    note: 'Editorial diagram drawn for this case from the rebuild’s sitemap, intake flows, routes and decisions D007 and D029. Simplified: sign-in, counterparty choice and post-order screens are left out.',
  },
  decision: {
    label: '03 · The source line',
    thesis: 'The system proposes. The buyer makes the call.',
    body: 'Row 19 of the file reads “nvr 8ch poe”, 2 pcs. Two recorders match, and they differ in one thing: object detection. Follow that one line from the file to the cart.',
    stages: [
      {
        name: 'Imported as written',
        text: 'The file’s wording and quantity stay on the row. The status names the problem, the button the next step.',
        shot: { desktop: 'line-source-1280', mobile: 'line-source-390', alt: 'Row 19, “nvr 8ch poe”, 2 pcs, marked Ambiguous: both candidates are PoE, 8 channel, with a Choose action' },
      },
      {
        name: 'Compared, then chosen',
        text: 'Only the attribute that separates the candidates is compared. Apply stays disabled until one is selected; selecting alone changes nothing.',
        shot: { desktop: 'line-choose-1280', mobile: 'line-choose-390', alt: 'Decision panel for line 19: from the file “nvr 8ch poe”, 2 pcs; KX-7608NXI-K2 with object detection on all channels selected, KX-7608NI-K2 with no object detection, both with 2 HDD bays; Apply to line 19 and Cancel' },
      },
      {
        name: 'Confirmed, still traceable',
        text: 'Confirmed, yet still marked as Ambiguous and chosen by the buyer. Undo stays available.',
        shot: { desktop: 'line-confirmed-1280', mobile: 'line-confirmed-390', alt: 'Row 19, “nvr 8ch poe” mapped to KX-7608NXI-K2, 2 pcs, Confirmed, was Ambiguous, candidate chosen by the buyer, with Undo' },
      },
      {
        name: 'In the cart',
        text: 'The same product enters commercial review with source row 19 and 2 pcs.',
        shot: { desktop: 'line-cart-1280', mobile: 'line-cart-390', alt: 'Cart line: 8-channel NVR with object detection, SKU KX-7608NXI-K2, source row 19, ₽34,900, 2 pcs, ₽69,800, 7 pcs in Moscow DC' },
      },
    ],
    why: {
      label: 'Why not automate it',
      text: 'Compatibility rules for this equipment were not formalised anywhere I could verify. An automatic match would move the risk to the installation site.',
    },
    note: 'One recorded browser session in the rebuild. Row 19 was resolved through the real controls; to reach the cart in that session, the other six open lines were marked resolved in the starting data.',
  },
  verify: {
    label: '04 · Product and price',
    thesis: 'Identity, price and stock answer different questions.',
    body: 'Product Details puts the technical identity beside the buyer’s own price and warehouse stock, and says where each answer comes from. None of them stands in for another.',
    shot: {
      desktop: 'product-1280', mobile: 'product-390',
      alt: 'Product Details for the 4 MP object-detect bullet camera: photos, key specifications, a verified ERP price of ₽12,900 and 24 pcs in Moscow DC',
      caption: 'Product Details · reached from the catalog or from a specification line',
    },
    proofs: [
      { term: 'Identity is not compatibility', text: 'SKU, manufacturer and the specs that separate near-identical cameras. Fit with the rest of the order is still the buyer’s check.' },
      { term: 'A price has a source and a time', text: 'Verified means checked against the contract price, with when. In the rebuild the ERP is simulated.' },
      { term: 'Stock is not a delivery promise', text: 'Units per warehouse and dispatch time. Delivery is priced only once a plan is chosen.' },
    ],
  },
  commerce: {
    label: '05 · Commercial review',
    thesis: 'Uncertainty must never look like a price.',
    body: 'A price that moved after import waits on its own line for approval. A price nobody confirmed stays visible as unknown, and the next step says why it is blocked.',
    chain: [
      { term: 'The line says it', text: '“Not confirmed”, never zero or a blank cell' },
      { term: 'The total excludes it', text: '43 of 48 lines priced, stated under the total' },
      { term: 'The next step waits', text: 'Fulfillment stays disabled, and the bar explains why' },
    ],
    line: {
      desktop: 'commerce-sheet-1280', mobile: 'commerce-sheet-390',
      alt: 'Cart line for an 8 MP dome camera: price and line total Not confirmed, with a note that the line is not in the total and a Remove line action',
      caption: 'The line · an unpriced item says so and offers a way forward',
    },
    bar: {
      desktop: 'cartbar-1280', mobile: 'cartbar-390',
      alt: 'Cart summary bar: Not ready for fulfillment, five unpriced lines and one open change explained, estimated total ₽1,362,600 for 43 of 48 lines, Choose fulfillment disabled',
      caption: 'The total · it names what it counts, and what still blocks the next step',
    },
  },
  supply: {
    label: '06 · Fulfillment',
    thesis: 'Same goods, three plans. The buyer chooses the trade-off.',
    body: 'Only after commercial review does the portal compare plans for the same 48 lines. Speed against fewer handovers becomes a visible choice, not a default the system takes quietly.',
    dims: ['Availability', 'Completion date', 'Shipments', 'Warehouses', 'Delivery cost'],
    shot: {
      desktop: 'fulfillment-1280', mobile: 'fulfillment-390',
      alt: 'Choose a fulfillment plan: three plans for the same 48 lines compared by availability, completion date, shipments, warehouses and delivery cost; Fewest shipments selected',
      caption: 'Fastest by 01 Nov for ₽7,400, or one consolidated handover three days later for ₽4,200',
    },
  },
  system: {
    label: '07 · Design system',
    thesis: 'Complex states, designed once and used everywhere.',
    body: 'A status means the same thing on every screen. Four domain components carry most of the procurement logic, and every state below is the product’s own rendering.',
    typeLabel: 'Type · Inter',
    colorLabel: 'Semantic colour',
    colors: [
      { token: 'surface-action-primary', role: 'Action' },
      { token: 'surface-selected', role: 'Selected' },
      { token: 'text-default', role: 'Text' },
      { token: 'text-muted', role: 'Secondary' },
      { token: 'text-success', role: 'Confirmed' },
      { token: 'text-warning', role: 'Needs a decision' },
      { token: 'text-error', role: 'Blocking' },
      { token: 'text-info', role: 'Changed' },
    ],
    families: [
      {
        name: 'ResolutionRow',
        argument: 'What the match returned is history; whether a person confirmed it is work. Two axes, never merged.',
        states: [
          { key: 'row-ambiguous', label: 'Ambiguous · open' },
          { key: 'row-missing', label: 'Missing · open' },
          { key: 'row-changed', label: 'Changed · open' },
          { key: 'line-confirmed', label: 'Ambiguous · confirmed' },
        ],
      },
      {
        name: 'Availability',
        argument: 'Freshness is a state with a source and a time, spelled out in words.',
        states: [
          { key: 'spec-availability-verified', label: 'Verified' },
          { key: 'spec-availability-stale', label: 'Stale' },
          { key: 'spec-availability-not-confirmed', label: 'Not confirmed' },
        ],
      },
      {
        name: 'FileUpload',
        argument: 'A file that cannot be read says which row failed and how to fix it.',
        states: [
          { key: 'spec-fileupload-empty', label: 'Empty' },
          { key: 'spec-fileupload-complete', label: 'Read' },
          { key: 'spec-fileupload-error', label: 'Error' },
        ],
      },
      {
        name: 'FulfillmentPlan',
        argument: 'Plans keep the same anatomy, so they can be compared at a glance.',
        states: [
          { key: 'spec-fulfillmentplan-default', label: 'Default' },
          { key: 'spec-fulfillmentplan-selected', label: 'Selected' },
          { key: 'spec-fulfillmentplan-unavailable', label: 'Unavailable' },
        ],
      },
    ],
    scrollCue: '{n} states · scroll sideways',
    note: 'ResolutionRow states are rows of the real review queue. The other specimens are element screenshots from the product’s Storybook catalogue, in its English UI. Synthetic data; colour values read from the same build.',
  },
  process: {
    label: '08 · How the work was done',
    thesis: 'One designer, from the old screens to a working system.',
    body: 'I owned the structure and the reasoning, not just the screens. Each step left an artifact the next one had to respect.',
    steps: [
      { phase: 'Observe', title: 'Audit of the original portal', text: 'Ten archived screens of the shipped portal, read against the buyer’s real job.', origin: 'DSSL · original portal', source: 'pages-default/ · 10 archived screenshots' },
      { phase: 'Structure', title: 'Sitemap and intake flows', text: 'Sixteen MVP screens, three ways in, one path to the order.', origin: '2026 rebuild', source: 'ia/sitemap.md · ia/flows/xls-to-order.mmd · quick-order.mmd · main @ 5aad49a' },
      { phase: 'Decide', title: 'Written design decisions', text: 'Matching is not confirmation; freshness is not a price change. Each rule is recorded with its reason and cost.', origin: '2026 rebuild', source: 'ds/DECISIONS.md · D007, D010, D026, D029 · main @ 5aad49a' },
      { phase: 'Build', title: 'Components, states, real screens', text: 'Every state in a component catalogue, assembled into working screens and checked in the browser on desktop and phone.', origin: '2026 rebuild', source: 'src/components · Storybook · 8cb6579' },
    ],
    note: 'References name the file and commit in the rebuild’s product repository, which is private. The original DSSL working files are not public; the archived screenshots are the only DSSL-era material shown.',
  },
  outcome: {
    label: 'Outcome',
    thesis: 'A traceable path from spreadsheet to order.',
    body: 'Three kinds of evidence, kept apart on purpose.',
    evidence: [
      { term: 'Shipped', text: 'The commercial redesign of the partner portal went live at DSSL. Its business results are under NDA and not claimed here.' },
      { term: 'Shown', text: 'My later interactive rebuild of the decisions, on synthetic data. It does not connect to a real ERP or place real orders.' },
      { term: 'Owned', text: 'Research, information architecture, UX/UI and the design system, as the sole product designer.' },
    ],
    costLabel: 'What the decisions cost',
    costs: [
      { term: 'Matching is not compatibility', text: 'Ambiguous lines wait for a person. It is the slowest step in the flow, by design.' },
      { term: 'Unknown is not zero', text: 'Unpriced lines stay out of the total until a manager quotes them.' },
      { term: 'Delivery is priced last', text: 'Its cost appears only once a fulfillment plan is chosen, after commercial review.' },
    ],
    cta: { label: 'Open the public version', href: PROTOTYPE_EN, note: 'The public version predates the screens shown here · synthetic data' },
  },
};

/** Same shape, same media keys in the same order; strings are free. */
export function assertPortalPair(en: PortalCaseCopy, ru: PortalCaseCopy) {
  const keep = ['desktop', 'mobile', 'src', 'key', 'token'];
  const keys = (copy: PortalCaseCopy) => JSON.stringify(copy, (k, v) => (typeof v === 'string' && !keep.includes(k) ? '' : v));
  if (keys(en) !== keys(ru)) throw new Error('Partner Portal V3: EN and RU differ in structure or media');
}
