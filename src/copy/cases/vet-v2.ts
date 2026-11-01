export type VetShotCopy = {
  desktop: string; mobile: string; alt: string; altMobile?: string; altFull?: string; caption?: string; captionDesktop?: string;
  fullDesktop?: string; fullMobile?: string;
};
type Section = { label: string; title: string; body: string };
export type VetCaseCopy = {
  meta: { title: string; description: string };
  title: string; eyebrow: string; promise: string; disclosure: string;
  facts: { term: string; value: string; href?: string }[];
  hero: VetShotCopy;
  problem: Section & { constraint: string; constraintLabel: string; constraintNote: string };
  roles: Section & { items: { role: string; task: string; shared: string; private: string }[] };
  clinical: Section & { shot: VetShotCopy; note: string };
  handoff: Section & {
    invoice: Section & { shot: VetShotCopy };
    publication: Section & { shot: VetShotCopy };
    owner: Section & { shot: VetShotCopy; desktopLabel: string; mobileLabel: string };
  };
  states: Section & { items: { title: string; body: string; shot: VetShotCopy }[] };
  outcome: Section & { tradeLabel: string; trade: string; cta: string; href: string; note: string };
  home: { label: string; title: string; body: string };
};
export const VET_PRODUCT = 'https://veterinary-clinic-gules.vercel.app/';
export const vetCaseEn: VetCaseCopy = {
  meta: {
    title: 'Vet Clinic OS — one visit, three connected roles',
    description: 'Designing a connected veterinary workspace: clinical records, transparent dose calculations, reception workflows and explicitly published owner care plans.',
  },
  title: 'Vet Clinic OS',
  eyebrow: 'One visit. Three connected roles.',
  promise: 'A connected workspace for clinical records, reception and post-visit care.',
  disclosure: 'Informed by conversations with one practising veterinarian. Patient, clinical and financial data shown here are synthetic.',
  facts: [
    { term: 'My role', value: 'Sole product designer' },
    { term: 'Scope', value: 'Research · UX/UI · design system · implementation' },
    { term: 'Platform / year', value: 'Responsive web · 2026' },
    { term: 'Product', value: 'Explore the working product', href: VET_PRODUCT },
  ],
  hero: {
    desktop: 'visit-audience-desktop', mobile: 'visit-context-mobile', fullDesktop: 'visit-full-desktop', fullMobile: 'visit-full-mobile',
    alt: 'Visit Record detail: the complete owner-facing care plan and clinic-only private note. Their audience labels and explicit exclusions keep the information boundary visible. The complete record is available below.',
    altFull: 'Visit Record: Marsik’s sourced 4.8 kg trace, clinical fields, private note, 0.95 ml calculation example, selected services and separate save actions.',
    altMobile: 'Native mobile Visit Record detail: Marsik’s visit context and complete saved 4.8 kg Quick Trace. The full record is available below.',
    caption: 'Visit Record · clinical context, prescription and services stay together.',
    captionDesktop: 'Visit Record · owner-facing plan and clinic-only note have explicit audiences.',
  },
  problem: {
    label: '02 · The problem', title: 'Information gets lost between responsibilities.',
    body: 'A full clinical record does not fit into the short transition between patients. Postponing it leaves colleagues without context, reception without billable services and owners without clear instructions. I separated a useful, validated trace from the record completed later.',
    constraint: '30 seconds', constraintLabel: 'The recording window between patients', constraintNote: 'A design constraint, not a measured time saving.',
  },
  roles: {
    label: '03 · One system', title: 'Connected work. Deliberate information boundaries.',
    body: 'One visit supports three responsibilities. Each view exposes what that role needs to act.',
    items: [
      { role: 'Veterinarian', task: 'Record and prescribe', shared: 'Selected services → reception', private: 'Clinical history and private notes stay with the clinic.' },
      { role: 'Reception', task: 'Bill the visit', shared: 'Services → invoice → payment status', private: 'No clinical notes or prescription details.' },
      { role: 'Owner', task: 'Follow the care plan', shared: 'Explicit publication → care instructions', private: 'No private notes, diagnosis or financial totals.' },
    ],
  },
  clinical: {
    label: '04 · Clinical workflow', title: 'Keep the context. Make the calculation inspectable.',
    body: 'From today’s queue, the veterinarian saves a trace before completing the record. The calculator reuses the visit’s sourced weight and selected formulation. It exposes substitution, units and rounding instead of asking the clinician to trust an unexplained number.',
    note: 'The calculation supports arithmetic. It does not replace clinical judgement or recommend a safe regimen.',
    shot: {
      desktop: 'dose-review-desktop', mobile: 'dose-review-mobile', fullDesktop: 'dose-full-desktop', fullMobile: 'dose-full-mobile',
      alt: 'Dose Calculator review: Marsik, selected formulation, 0.95 ml example, weight and rate in dimensional arithmetic, rounding, limitation and record action. Full input workspace is available below.',
      altMobile: 'Complete native mobile calculation review: answer, formula, substitution, rounding, clinical limitation and Record to this visit action.',
      caption: 'Dose Calculator · source, arithmetic and rounding remain visible.',
    },
  },
  handoff: {
    label: '05 · The connected visit', title: 'One record becomes different kinds of action.',
    body: 'Saving the visit, recording payment and publishing care are separate commitments. I made those boundaries visible at the point of action.',
    invoice: {
      label: 'Reception', title: 'Bill the services. Keep the clinical note private.',
      body: 'The services selected by the veterinarian become the invoice. Reception reviews the same total and records payment status. The application does not process payments or issue fiscal receipts.',
      shot: { desktop: 'invoice-document-desktop', mobile: 'invoice-document-mobile', fullDesktop: 'invoice-full-desktop', fullMobile: 'invoice-full-mobile', alt: 'Complete invoice services document: two selected services, 1,500 RUB total, Mark as paid and the manual-status limitation.', caption: 'Invoice · selected services, one total, a manual payment record.' },
    },
    publication: {
      label: 'Veterinarian → owner', title: 'Saving is not publishing.',
      body: 'The preview shows the owner’s document and what stays in the clinic. Publication is explicit. Later saved edits do not silently replace the published copy; the veterinarian must review and publish again.',
      shot: { desktop: 'discharge-full-desktop', mobile: 'discharge-document-mobile', fullMobile: 'discharge-full-mobile', alt: 'Discharge Preview: complete owner document beside publication state, recipient, clinic-only exclusions and Publish discharge summary.', altMobile: 'The complete native mobile owner-document preview: patient, clinician, saved plan, prescription and clinic contact. Full publication controls are available in the complete screen.', caption: 'Discharge Preview · review the actual document before publishing.' },
    },
    owner: {
      label: 'Owner', title: 'A plan the family can return to.',
      body: 'Owners read the published instructions and prescription, open the discharge and contact the clinic. The phone puts care first; desktop gives the document and contact actions a separate rail.',
      desktopLabel: 'Desktop · care and contact side by side', mobileLabel: 'Mobile · one reading sequence',
      shot: { desktop: 'owner-overview-desktop', mobile: 'owner-overview-mobile', fullDesktop: 'owner-full-desktop', fullMobile: 'owner-full-mobile', alt: 'Published Owner Home: Marsik’s care plan, 0.95 ml illustrative prescription, visit provenance, discharge and clinic telephone action.', altMobile: 'Native mobile Owner Home detail: patient context, published plan and complete illustrative prescription. The full screen includes discharge and clinic contact.', caption: 'Owner Home · the same publication, adapted to each screen.' },
    },
  },
  states: {
    label: '06 · Critical states', title: 'Make the boundary clear when information is incomplete.',
    body: 'Visibility, readiness and publication are separate states. Missing information needs a specific next action.',
    items: [
      { title: 'Clinical only', body: 'The private note names its audience and is excluded from the invoice and owner document.', shot: { desktop: 'private-desktop', mobile: 'private-mobile', fullDesktop: 'visit-full-desktop', fullMobile: 'visit-full-mobile', alt: 'Complete private-note section with Veterinarians only and an explicit exclusion from discharge, invoice and owner view.' } },
      { title: 'Publication blocked', body: 'An empty draft plan blocks publication. The owner’s existing published document remains available.', shot: { desktop: 'blocked-desktop', mobile: 'blocked-mobile', fullDesktop: 'blocked-full-desktop', fullMobile: 'blocked-full-mobile', alt: 'Publication panel for an empty saved plan: publication disabled and the previous owner publication retained.' } },
      { title: 'Confirm with the clinic', body: 'An unavailable dose never becomes a guessed number. The owner gets a direct clinic contact action.', shot: { desktop: 'missing-mobile', mobile: 'missing-mobile', fullDesktop: 'missing-full-mobile', fullMobile: 'missing-full-mobile', alt: 'Native owner prescription exception: Dose unavailable, confirmation required before giving medication, and the clinic telephone link.' } },
    ],
  },
  outcome: {
    label: '07 · The outcome', title: 'A connected experience with explicit boundaries.',
    body: 'I designed and implemented responsive clinical, reception and owner workflows in one coherent system. The working product demonstrates the connected visit and its state transitions. Clinic adoption and business impact have not been measured.',
    tradeLabel: 'The deliberate cost', trade: 'Saving and publishing remain separate steps. Role-specific views demonstrate information boundaries; this browser-local implementation does not establish server-enforced access control.',
    cta: 'Explore Vet Clinic OS', href: VET_PRODUCT, note: 'Working public product · synthetic data',
  },
  home: { label: 'Clinical work · reception · post-visit care', title: 'One visit. Three connected roles.', body: 'A clinical record, a service invoice and an explicitly published care plan.' },
};

export function assertVetPair(en: VetCaseCopy, ru: VetCaseCopy) {
  const structure = (copy: VetCaseCopy) => JSON.stringify(copy, (key, value) => typeof value === 'string' && !['desktop', 'mobile', 'fullDesktop', 'fullMobile'].includes(key) ? '' : value);
  if (structure(en) !== structure(ru)) throw Error('Vet V2: EN/RU structure or media differs');
}
