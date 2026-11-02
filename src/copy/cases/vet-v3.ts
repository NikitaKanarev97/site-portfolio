import { vetCaseEn, type VetCaseCopy, type VetShotCopy } from './vet-v2';
type Beat = { label: string; title: string; body: string };
export type VetPremiumCopy = VetCaseCopy & {
  authorship: string; scope: string; delivery: string; navLabel: string; publicationReadyTitle: string; publicationBlockedCaption: string;
  nav: { id: string; text: string }[];
  diagnosis: { title: string; body: string }[];
  queue: VetShotCopy;
  model: { source: string; saved: string; clinic: string; branches: { gate: string; title: string; body: string }[]; note: string };
  trace: Beat & { shot: VetShotCopy; rule: string };
  calculation: { title: string; body: string }[];
  process: Beat & { steps: { title: string; body: string; href: string; link: string }[] };
  results: { title: string; body: string }[];
};
const product = 'https://veterinary-clinic-gules.vercel.app/';
export const vetPremiumEn: VetPremiumCopy = {
  ...vetCaseEn,
  meta: { title: 'Vet Clinic OS — one visit, three perspectives', description: 'One visit. Three perspectives. One reliable record. Product architecture, clinical arithmetic and deliberate publication boundaries in a responsive veterinary workspace.' },
  eyebrow: 'Product design · veterinary workflows',
  promise: 'One visit. Three perspectives. One reliable record.',
  authorship: 'Sole product designer', scope: 'Research → UX/UI → design system → implementation',
  delivery: '2026 · Responsive web · Working browser prototype',
  navLabel: 'Inside this case',
  publicationReadyTitle: 'Ready to publish',
  publicationBlockedCaption: 'Blocked · the previous owner document remains available.',
  nav: [{ id: 'problem', text: 'The constraint' },{ id: 'roles', text: 'Information model' },{ id: 'clinical', text: 'Clinical decisions' },{ id: 'publication', text: 'Publication' },{ id: 'process', text: 'Design to code' }],
  problem: { ...vetCaseEn.problem, label: '01 · The constraint', title: 'A full record cannot be the only starting point.', body: 'Input from one practising veterinarian shaped the short recording window between patients. I separated immediate continuity from the full record, then separated that record from each role’s output.', constraint: '30 sec', constraintLabel: 'To leave a useful clinical trace', constraintNote: 'A design constraint; no time saving was measured.' },
  diagnosis: [
    { title: 'Between patients', body: 'Save useful context now; return to the full record later.' },
    { title: 'At reception', body: 'Pass on selected services without exposing clinical notes.' },
    { title: 'At home', body: 'Show reviewed instructions, independent of unfinished clinic edits.' },
  ],
  queue: { desktop: 'queue-desktop', mobile: 'queue-mobile', fullDesktop: 'queue-full-desktop', fullMobile: 'queue-full-mobile', alt: 'Current Day Queue detail: arrival priority and patient-specific next actions, with unfinished-record context above.', caption: 'Day Queue · the entry point into the same patient’s visit.' },
  roles: { ...vetCaseEn.roles, label: '02 · Information architecture', title: 'Share the visit. Control what leaves it.', body: 'I mapped the handoffs around a saved encounter, rather than giving every role the same record. Clinical-only data stays outside both the service invoice and the published owner snapshot.' },
  model: { source: 'Validated Quick Trace', saved: 'Saved clinical record', clinic: 'History · diagnosis · private note stay in the clinic', branches: [
    { gate: 'Selected services →', title: 'Reception invoice', body: 'Services, total and manually recorded payment status.' },
    { gate: 'Review + explicit publication →', title: 'Owner snapshot', body: 'Care plan and prescription; later drafts stay in the clinic.' },
  ], note: 'Information model implemented in browser-local state; server-enforced access control is outside this implementation.' },
  trace: { label: '03 · Clinician continuity', title: 'Capture now. Complete the record later.', body: 'Quick Trace keeps weight, formulation and arithmetic together. The veterinarian can save a validated trace, then continue the Visit Record. An invalid prescription does not become a saveable partial record.', rule: 'Preserve continuity without lowering the validation boundary.', shot: { desktop: 'trace-desktop', mobile: 'trace-mobile', fullDesktop: 'trace-full-desktop', fullMobile: 'trace-full-mobile', alt: 'Native Quick Trace weight entry: current 4.8 kg, change from the last clinic measurement, author, date and distinct clinic or owner sources. The complete trace is available for inspection.', caption: 'Quick Trace detail · choose a weight with its source attached.' } },
  clinical: { ...vetCaseEn.clinical, label: '04 · Inspectable arithmetic', title: 'Show how the number was reached.', body: 'The calculation reuses the visit’s weight and selected formulation. I kept the source, units and rounding beside the result so the clinician can inspect each assumption.', note: 'Arithmetic support only. The clinician must check the product, indication, route and regimen; this is not a safe-dose recommendation.' },
  calculation: [
    { title: 'Source', body: '4.8 kg from this visit; Meloxicam oral suspension, 0.5 mg/ml; illustrative rate 0.1 mg/kg.' },
    { title: 'Substitution', body: '4.8 × 0.1 ÷ 0.5 = 0.960 ml.' },
    { title: 'Rounding', body: '0.95 ml at the 0.05 ml syringe step. Recording the result does not publish it.' },
  ],
  handoff: {
    ...vetCaseEn.handoff,
    invoice: { ...vetCaseEn.handoff.invoice, label: '05 · Reception', title: 'A service handoff with a clear limit.', body: 'The two selected services produce the synthetic 1,500 RUB invoice. Reception marks payment status manually. Clinical notes stay private; there is no payment processing, fiscal receipt or financial integration.' },
    publication: { ...vetCaseEn.handoff.publication, label: '06 · Publication', title: 'A saved edit is not an owner update.', body: 'I made publication a separate commitment: review the owner’s document, then publish that saved snapshot. An empty plan blocks the action; the last published document remains available.', shot: { desktop: 'publish-desktop', mobile: 'publish-mobile', fullDesktop: 'discharge-full-desktop', fullMobile: 'discharge-full-mobile', alt: 'Native publication panel: ready to publish, recipient, owner cabinet destination, clinic-only exclusions and explicit Publish discharge summary action.', caption: 'Ready · review the document, then publish explicitly.' } },
    owner: { ...vetCaseEn.handoff.owner, label: '07 · After the visit', title: 'The same care plan. A different reading context.', body: 'Both layouts show the same published snapshot. Desktop keeps the document and clinic contact beside the plan. On a phone, care instructions and prescription lead the reading sequence.' },
  },
  process: { label: '08 · Design to implementation', title: 'Research. Architecture. Implementation.', body: 'I took the practitioner’s constraint through an information model, responsive workflows and reusable state patterns. The browser implementation makes those decisions inspectable.', steps: [
    { title: 'Research → priorities', body: 'One practitioner’s input informed continuity and handoffs. Simulated research artifacts supplied hypotheses, not additional interview evidence.', href: product+'app/visit-quick-trace?patient=marsik', link: 'Inspect Quick Trace' },
    { title: 'Model → interface', body: 'The published document uses an explicit field allowlist. Save, publish, blocked and missing-dose states have different consequences.', href: product+'app/discharge-preview?patient=marsik', link: 'Inspect publication' },
    { title: 'Components → behavior', body: 'Shared patient context, source labels and state/action pairs carry across native desktop and phone layouts. Validation also runs at the data boundary.', href: product+'app/dose-calculator?patient=marsik', link: 'Inspect calculation' },
  ] },
  results: [
    { title: 'Delivered', body: 'Connected clinical, reception and owner workflows with native responsive views.' },
    { title: 'Verified in the browser', body: 'Explicit publication, retained owner snapshot on a blocked update, and clinic contact when a dose is unavailable.' },
    { title: 'Still to establish', body: 'Real clinic adoption, clinical outcomes and business impact have not been measured.' },
  ],
  outcome: { ...vetCaseEn.outcome, label: '09 · What the work demonstrates', title: 'One record. Deliberate commitments.', body: 'The working product follows one encounter across three responsibilities.', tradeLabel: 'The deliberate cost', trade: 'A second publication step adds work. It keeps unfinished clinical edits out of the owner’s instructions. Browser-local role views do not establish server-level access control.', note: 'Working browser prototype · synthetic patient and treatment data' },
};
export function assertVetPremiumPair(en: VetPremiumCopy, ru: VetPremiumCopy) {
  const structure = (c: VetPremiumCopy) => JSON.stringify(c, (k,v) => typeof v==='string' && !['desktop','mobile','fullDesktop','fullMobile','id'].includes(k) ? '' : v);
  if(structure(en)!==structure(ru)) throw Error('Vet V3: EN/RU structure or media differs');
}
