/** Pawly Case V2 — one walk, two people, proved step by step.
 * Composition and evidence: audit/pawly-portfolio-case-v2/v2/SECTION_MAP.md. Screens are fresh captures of
 * NikitaKanarev97/pawly a327d73 on one fixture (22 August, 14:00–14:45 slot, pickup 14:05, return 14:52).
 * Media keys resolve through src/data/pawly-case-v2-media.json as `${locale}/${key}`.
 */
export interface PawlyShot { key: string; alt: string }
export interface PawlyChapter { id: string; time: string; label: string; thesis: string; body: string }

export interface PawlyCaseCopy {
  meta: { title: string; description: string };
  cover: {
    eyebrow: string; title: string; thesis: string; role: string;
    status: PawlyShot; photoAlt: string; caption: string;
    clockLabel: string;
  };
  facts: { term: string; value: string; href?: string }[];
  match: PawlyChapter & { steps: { label: string; caption: string; shot: PawlyShot }[]; rule: string };
  roles: PawlyChapter & {
    owner: { label: string; shot: PawlyShot }; walker: { label: string; shot: PawlyShot };
    rows: { term: string; owner: string; walker: string }[]; note: string;
  };
  branches: PawlyChapter & { items: { kicker: string; title: string; refuses: string; shot: PawlyShot }[]; note: string };
  proof: PawlyChapter & {
    vocabulary: { term: string; text: string }[];
    steps: { label: string; caption: string; shot: PawlyShot }[];
  };
  settle: PawlyChapter & {
    lines: { amount: string; text: string }[]; balance: string;
    owner: { label: string; shot: PawlyShot }; walker: { label: string; shot: PawlyShot };
  };
  outcome: { label: string; thesis: string; body: string; evidence: { term: string; text: string }[]; cta: { label: string; href: string; note: string } };
  zoom: string;
}

export const pawlyCaseEn: PawlyCaseCopy = {
  meta: {
    title: 'Pawly — a dog walk, proved step by step',
    description: 'Product design for a two-sided dog-walking app: compatibility before booking, separate owner and walker views, explicit failure states and a dated return report. Interactive EN/RU prototype.',
  },
  cover: {
    eyebrow: 'Mobile product design · 2026',
    title: 'Pawly',
    thesis: 'Trust is not a badge. It’s a sequence of confirmed actions.',
    role: 'I designed a dog-walking app for both sides of the walk, the owner and the walker, and built it as an interactive prototype in English and Russian.',
    status: { key: 'hero-status', alt: 'Active walk: Baikal is waiting for return confirmation. Pickup and walk are done, return is still open; picked up at 14:05, estimated return 14:50; Marina K. accepted this walk. Below, the received pickup photo, 14:05, and “Waiting for return photo”.' },
    photoAlt: 'Pickup photo from the prototype: Baikal, a golden retriever, stands in a hallway while the walker holds his lead.',
    caption: '14:05. The owner already has the pickup photo; the return is still open. Demo photo and data from the prototype.',
    clockLabel: 'The walk, chapter by chapter',
  },
  facts: [
    { term: 'Role', value: 'Sole product designer' },
    { term: 'Scope', value: 'Service model, flows, UI, design system, prototype, QA' },
    { term: 'Platform', value: 'Mobile web · English and Russian' },
    { term: 'Prototype', value: 'Open the interactive demo', href: 'https://pawly-fawn.vercel.app/app' },
  ],
  match: {
    id: 'choosing', time: '13:20', label: 'Choosing',
    thesis: 'A match needs a reason, not a rating.',
    body: 'Baikal weighs 38 kg, pulls hard and is wary of other dogs. The list checks those recorded needs against each walker’s limits for the whole 14:00–14:45 slot. Dated checks answer a different question, so they come later.',
    steps: [
      { label: 'Search starts from the dog', caption: 'One recorded match for this slot. No ratings and no invented reviews.', shot: { key: 'match-list', alt: 'Walker list for 22 August, 14:00–14:45, 950 ₽: one recorded match, Marina K., dogs up to 45 kg, strong-pull and muzzle handling.' } },
      { label: 'Suitability before verification', caption: 'Each of Baikal’s needs sits beside Marina’s recorded limit, including the full time window.', shot: { key: 'match-profile', alt: 'Why this walker fits: dogs up to 45 kg, strong-pull handling, reactions on a walk and the whole time window, with a note that the match is not a safety guarantee.' } },
      { label: 'Conditions before confirmation', caption: 'No insurance, the two-hour cancellation tier and home access are stated before booking. No payment is taken.', shot: { key: 'match-review', alt: 'Before you confirm: no insurance coverage, refund and retained amounts if cancelled within two hours, home access shared only after confirmation.' } },
    ],
    rule: 'Another time can change who is available. It cannot remove the dog’s risks.',
  },
  roles: {
    id: 'handoff', time: '14:05', label: 'Handoff',
    thesis: 'One walk, two different first questions.',
    body: 'Same booking, different answers. Each role gets its own first screen instead of one shared status page.',
    owner: { label: 'Owner · Walk updates', shot: { key: 'role-owner', alt: 'Owner’s walk updates: walker assigned, walker accepted the walk, pickup photo at 14:05, walk in progress, drop-off photo next. Route preview: a static preview, not the walker’s live location.' } },
    walker: { label: 'Walker · Current booking', shot: { key: 'role-walker', alt: 'Walker’s current booking: photo 2 of 2, back home by 14:50, Baikal’s handling notes: pulls hard, wary of other dogs, muzzle required, chicken allergy.' } },
    rows: [
      { term: 'First question', owner: 'When will Baikal be back?', walker: 'By when must he be home?' },
      { term: 'Evidence so far', owner: 'Pickup photo received at 14:05', walker: 'Return photo, 2 of 2, is due by 14:50' },
      { term: 'Kept out', owner: 'Live location: there is none, and the map is labelled a static preview', walker: 'Home access codes, until the pre-pickup check passes' },
    ],
    note: 'Home access follows a demo rule in the client, over sample data. It is not server-side authorization.',
  },
  branches: {
    id: 'exceptions', time: '—', label: 'Exceptions',
    thesis: 'When a step fails, nothing is assumed.',
    body: 'In both cases below, the product stops and says so instead of quietly filling the gap.',
    items: [
      { kicker: 'Before pickup', title: 'Marina can’t make it', refuses: 'There is no compatible reserve, so nobody is assigned automatically. The owner picks another time or cancels with the refund shown.', shot: { key: 'branch-reserve', alt: 'Marina K. can’t make it. No compatible walker for this time; nobody will be assigned automatically. The booking for 14:00–14:45 and 950 ₽ is shown below.' } },
      { kicker: 'At the door', title: 'The return photo fails to send', refuses: 'The photo is kept on the phone, but the walk, the report and the payout stay where they were until a retry succeeds.', shot: { key: 'branch-failed', alt: 'Sending failed, photo saved. Not confirmed yet: the selected photo is saved; the booking and payout have not advanced.' } },
    ],
    note: 'Two alternative branches of the same 14:00 booking, captured separately.',
  },
  proof: {
    id: 'return', time: '14:52', label: 'Return',
    thesis: 'A selected photo is not proof yet.',
    body: 'Only a received photo records the return. Only then can the owner’s report say that Baikal is home.',
    vocabulary: [
      { term: 'Expected', text: 'A time to plan around: 14:50.' },
      { term: 'Selected', text: 'A photo on the walker’s phone.' },
      { term: 'Received', text: 'The photo arrived: 14:52.' },
      { term: 'Confirmed', text: 'The report can say the dog is home.' },
    ],
    steps: [
      { label: 'Walker · Selected, not sent', caption: 'A local draft. Return and earnings stay pending.', shot: { key: 'proof-selected', alt: 'Handover photo: selected, not sent. Send to confirm the return; return and earnings stay pending until confirmation succeeds.' } },
      { label: 'Walker · Received', caption: 'Sent after the failed attempt. The return is recorded at 14:52.', shot: { key: 'proof-confirmed', alt: 'Handover photo confirmed, 22 August, 14:52. Return confirmed: safely home and handed over; this confirmation is now visible in the owner’s report.' } },
      { label: 'Owner · Report', caption: 'Two dated handovers. The expected 14:50 stays a plan; 14:52 is the record.', shot: { key: 'proof-report', alt: 'Walk report: return confirmed. Baikal is home, back at 14:52, confirmed by the return photo; pickup 14:05 and return 14:52 photos, walker Marina K. How the walk went: booked 14:00–14:45, picked up at 14:05, walk started 14:05, back home at 14:52.' } },
    ],
  },
  settle: {
    id: 'settlement', time: 'After', label: 'Settlement',
    thesis: 'Both sides can explain the same 950 ₽.',
    body: 'One total for the owner, fee included. One net earning for the walker, recorded once when the return is confirmed. All amounts are demo calculations.',
    lines: [
      { amount: '950 ₽', text: 'the owner’s total' },
      { amount: '− 171 ₽', text: 'platform fee, 18%' },
      { amount: '= 779 ₽', text: 'the walker’s earning' },
    ],
    balance: '3,116 + 779 = 3,895 ₽ available',
    owner: { label: 'Owner · Payment', shot: { key: 'settle-payment', alt: 'Payment: walk, 45 minutes, 950 ₽. Total 950 ₽; the price already includes the 18% platform fee.' } },
    walker: { label: 'Walker · Earnings after this walk', shot: { key: 'settle-earnings', alt: 'Walker earnings: 3,895 ₽ available for payout. Current booking Baikal, 22 August, 14:00–14:45, recorded for this booking 779 ₽.' } },
  },
  outcome: {
    label: 'Outcome',
    thesis: 'The whole chain is clickable.',
    body: 'Matching, handoff, failure, return and settlement all work in the prototype, for both roles, with the same booking, times and money on every screen.',
    evidence: [
      { term: 'Built', text: 'Two roles and 17 routes in English and Russian.' },
      { term: 'Checked', text: 'Scripted browser journeys and screen reviews. Not yet tested with owners or walkers.' },
      { term: 'Simulated', text: 'Payment, upload, location and walker checks. People, photos and amounts are demo data.' },
    ],
    cta: { label: 'Open the prototype', href: 'https://pawly-fawn.vercel.app/app', note: 'Interactive demo. “All screens” switches between the owner and the walker.' },
  },
  zoom: 'Open full size',
};
