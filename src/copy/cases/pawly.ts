/**
 * Тексты кейса Pawly — маршрут /work/pawly
 *
 * Композиция — ds/screens/case-pawly.md. Фактура собрана из проекта
 * d:\Claude-projects\PETS-walking: outputs/{brief,prd,prioritization,
 * competitive_analysis_final,interview_primary_persona}.md,
 * ia/{sitemap,open-questions}.md, ds/{foundation,components,patterns}.md,
 * audit/review-2026-08-25.md, dashboard/seed/test-suites.json и README.md.
 *
 * Четыре правила, которые этот файл обязан держать:
 *
 * 1. Это интерактивный продуктовый концепт, а не работающий маркетплейс.
 *    Бронирований, выручки, конверсии и пользовательской валидации нет.
 * 2. Интервью primary-персоны было симуляцией. Оно может менять гипотезу,
 *    но не называется живым исследованием и не доказывает спрос.
 * 3. «81 designed, 16 assembled» — точная формулировка из
 *    ia/open-questions.md. Восемьдесят один экран не был собран.
 * 4. Все цифры QA — качество прототипа, не adoption: 73 находки
 *    рассмотрены, 71 закрыта, две сняты как ложные; 91 скриншот,
 *    девять отчётов, ноль ошибок консоли на финальной приёмке.
 */
import { EMAIL } from '../site';

const YEAR = '2026';
const TEAM =
  'Sole designer — product framing, research synthesis, IA, UX/UI, design system, prototype and QA';
const RESEARCH = 'Desk research, five competitors and one simulated interview; no human validation';
const DURATION = 'Sixteen days, brief to audited interactive prototype';

const media = '/media/case-pawly';

export const pawly = {
  slug: 'pawly',

  meta: {
    title: 'Pawly — trust as evidence in a dog-care marketplace',
    description:
      'A mobile marketplace concept that makes trust inspectable: verified walkers, compatible matching, handover proof, live routes and a recovery path when a walk goes wrong.',
  },

  header: {
    title: 'Pawly',
    lead: 'A dog-care marketplace designed so trust is something an owner can inspect — before a stranger takes the dog, while the walk is happening, and after the pet is home.',
    meta: [
      { term: 'Client', value: 'Independent product concept' },
      { term: 'Product', value: 'Marketplace for dog walking and pet sitting' },
      { term: 'Year', value: YEAR },
      { term: 'Role', value: 'Lead Product Designer' },
      { term: 'Platform', value: 'Mobile — iOS first, Android next; web prototype' },
    ],
    outcome:
      'Outcome. The result was not a polished set of happy-path screens but a testable service model: seven-stage verification is visible, handover produces proof, failure has a recovery path, and the product says what it cannot guarantee. What it cost: a narrower launch, manual operations behind the interface, and several promises deliberately left out.',
    team: [
      { term: 'Team', value: TEAM },
      { term: 'Research', value: RESEARCH },
      { term: 'Duration', value: DURATION },
    ],
    rework: {
      label: 'A concept, not a live service',
      text: 'The product, design system and interactive prototype are real. The company is not registered, nothing on the prototype can be booked or paid for, and there are no human research results, orders, revenue or conversion data. Every name, route, date and payment on the screens is invented. The simulated interview and the synthetic agent runs are labelled as such everywhere they are used.',
    },
  },

  cover: {
    /**
     * Три широких кадра сняты одним прогоном shoot-pawly-frames.mjs.
     * Pawly — мобильный продукт, поэтому портретный экран не кладётся в
     * ScreenStack напрямую: фиксированный 16:10 срезал бы его целиком.
     */
    screens: [
      `${media}/cover/screen-gallery.webp`,
      `${media}/cover/owner-home.webp`,
      `${media}/cover/handover-photo-review.webp`,
    ],
    alt: 'Pawly product screen index: the owner home, a walker profile, the pet address check and the safety profile, with the active owner screen and the drop-off proof behind it',
    caption:
      'The product before the case is explained: availability, compatibility, verification and proof. All data is invented.',
  },

  context: {
    heading: 'The owner is not buying a walk. They are handing over a dog, and sometimes the keys.',
    body: [
      'The starting brief was “Uber for dogs”: open the app, find somebody nearby, book and follow the route. The primary situation was concrete — an owner is at work, needs help during the day and has about fifteen minutes to decide whether a stranger can be trusted with the dog and access to the home. A quick list of profiles answers only the easiest part of that decision.',
      'The market research showed a split. Self-service products made the transaction fast but kept verification shallow; services with institutional trust relied on a manager, a phone call and manual assignment. The gap was not another map with more pins. It was a way to combine speed with evidence without pretending that an early marketplace already has supply everywhere.',
      'The economics narrowed the everyday story as well. Twenty weekday walks at the researched price range would cost eighteen to twenty-two thousand roubles a month, so the realistic starting behaviour became one to three bookings a week, not a daily habit. That moved the product away from a universal convenience promise and toward reliability on the occasions that matter.',
    ],
  },

  reframe: {
    heading: 'Trust could not be a badge. It had to be a chain of evidence.',
    body: [
      'A green check next to a portrait compresses seven different claims into one word: identity, legal status, training, interview, practical skill, references and the date on which any of those were last checked. It asks the owner to trust the interface instead of letting them inspect what the interface knows.',
      'The same problem repeats during the service. A live dot on a map looks precise, but a lost connection can make a safe walk look like a missing dog. A completed route does not prove who was handed over at the door, or that the dog came home. The evidence has to survive failure: last signal instead of a blank map, locally buffered route and photos, pickup and drop-off proof, and an explicit final state that says the pet is home.',
      'So the product object changed from “a walker nearby” to the whole chain: compatible person, visible verification, handover, route, return and recovery. Speed remained a requirement, but never by hiding the part the operation could not guarantee.',
    ],
    statement:
      'Make every promise inspectable before it becomes trust — and keep the evidence intact when the happy path breaks.',
  },

  process: {
    heading: 'I designed the service boundary before I designed the screens.',
    body: [
      'I started with secondary research, five competitors and a focused audit of the closest analogue. The primary-persona interview was simulated, not recruited, and used only to challenge the first hypothesis. It did: the final pickup and drop-off photos mattered more than watching the whole route, and “pet is home” mattered more than a perfect GPS line. Those remain hypotheses for live interviews, but they were strong enough to change what the prototype had to make testable.',
      'Scope came next: 42 Must-haves out of 65 requirements, then a 95-screen product map with 81 core nodes and seven user flows. I deliberately did not turn every node into a frame. Eighty-one were designed at flow and group level; sixteen decision-heavy screens were assembled into seventeen routed frames, plus the landing. That kept the built layer on the questions worth testing — compatibility, verification, handover proof, replacement and two-sided money — instead of spending the same time on routine settings screens.',
      'Then the visual system and the build: 63 primitive tokens, 30 semantic tokens, fourteen text styles and 33 React components with named Storybook matrices. Figma, specifications, React and the catalogue use the same semantic names. The prototype went through structural review, parity review, visual acceptance and synthetic agent runs; the findings returned to the same source instead of being patched only in screenshots.',
    ],
    prototype: {
      href: 'https://pawly-fawn.vercel.app/app',
      label: 'Open the prototype',
      note: 'The interactive concept on invented data — seventeen mobile frames, plus the responsive landing in the same build.',
    },
    artifacts: [
      {
        src: `${media}/screen-index.webp`,
        alt: 'Index of all seventeen Pawly frames: the owner flow, the active service, recovery, the walker flow and earnings',
        caption:
          'Seventeen routed frames as one index. Eighty-one core nodes were designed; these sixteen decision-heavy screens were assembled.',
      },
      {
        src: `${media}/storybook-matrix.webp`,
        alt: 'Button catalogue with primary, secondary, ghost and danger types in default, pressed, disabled and loading states',
        caption:
          'One component across type and state. The matrix is rendered from the same React component the screens use.',
      },
    ],
  },

  failure: {
    heading: 'The inventory was complete. The service logic was not.',
    body: [
      'The first full review found a contradiction in the product’s strongest claim. The landing promised a price with the platform fee included; the booking screen added a separate service fee; the walker payout was calculated from a third model. Each surface looked plausible alone. Together they described two different businesses on the page that asked users to trust one number. The fix began with one price table in the decision log, then made every surface read from it.',
      'The prototype also remembered too much. Cancelling one synthetic booking wrote the state to local storage, and the next visitor could arrive to an empty owner home with no way to reset it. In the gallery, seventeen live screens were mounted inside links, leaving the controls inside every preview in the keyboard order. Both passed a frame review because neither exists in a frame; they appeared only when the build was used as a product.',
      'The main review and consistency pass examined 58 findings; the visual acceptance added fifteen more. Seventy-one were resolved and two were dismissed as false positives. A synthetic agent run found the state-persistence defect, the fix was retested, and the final pass covered seventeen routes and the landing with 91 screenshots, nine reports and no console errors. None of those numbers is user validation. They are evidence that the prototype now tells one story and survives its own interactions.',
    ],
  },

  decisions: {
    heading: 'Four decisions, and what each one cost.',
    items: [
      {
        decision:
          'Availability is checked from the pet’s address before the owner fills the safety profile.',
        why: 'The common case is booking from work for the address at home, so device geolocation answers the wrong question. Competitor audits also showed the most expensive dead end: twenty minutes of profile and payment work before learning that the area is not served. Pawly separates “temporarily no compatible walker” from “this area has not opened” and says which one happened.',
        cost: 'The launch cannot pretend to cover three whole cities. Each city starts with two to four districts and a service area opens only when local supply is dense enough; outside it, the honest result is a wait-list, not a pin that nobody can accept.',
        artifact: {
          src: `${media}/address-input.webp`,
          alt: 'Pet address screen with a two-step progress indicator, address field, location explanation, map and continue action',
          caption:
            'The pet’s address comes before the profile. Current location is a hint; coverage is checked against the service address.',
        },
      },
      {
        decision:
          'Verification is seven named stages with dates, not one “verified” badge.',
        why: 'Owners need to know what the platform did, not how confidently it coloured the checkmark. The same evidence also has to explain why a walker is compatible with this dog: the pet’s required safety fields become hard matching constraints, and an empty result names the constraint instead of offering to clear it.',
        cost: 'Verification is operationally expensive. Only four stages are self-served in the first version; interview, trial walk and reference stay with an operator. The product remains fast for the owner by accepting manual work behind the interface rather than automating a check it cannot perform credibly.',
        artifact: {
          src: `${media}/walker-profile.webp`,
          alt: 'Walker profile showing seven verification stages with dates, compatibility with the dog, review state and the choose action',
          caption:
            'Seven checks with their dates, followed by the reasons this walker matches this dog. The badge is only the summary.',
        },
      },
      {
        decision:
          'Pickup and drop-off photos outrank the live map, and the walk ends only when the pet is home.',
        why: 'The simulated interview challenged the original GPS-first concept: the two boundary moments were the evidence the owner wanted most. A route can disappear with the network and come back later; the handover tells who received the dog, and the return tells that the service actually ended. The capture screen therefore names three quality criteria and makes a bad proof retakable.',
        cost: 'The walker does more than tap “done”, and the service cannot complete until usable proof exists. Pawly also refuses the word “insured”: insurance is not in the MVP, so the absence is disclosed before payment instead of being covered with safety copy.',
        artifact: {
          src: `${media}/handover-photo-review.webp`,
          alt: 'Drop-off proof review with a full photo of the dog, three quality checks, confirm and retake actions',
          caption:
            'A drop-off photo is reviewed against three explicit criteria before it can finish the walk.',
        },
      },
      {
        decision:
          'A compatible replacement is a primary flow: same time, same price, one tap and a timeout.',
        why: 'A cancelled walker is not an exception to a marketplace promise; it is the moment when that promise is tested. The replacement has to match the same risk profile and booking conditions, and the owner should not rebuild the order under pressure. If they do not answer in time, the compatible reserve is assigned so the walk can still happen.',
        cost: 'The feature consumes real supply: the operation has to keep a reserve available and absorb the price difference. When no compatible reserve exists, the interface has to say so immediately; there is no generic “we are looking” state that can buy reliability with time.',
        artifact: {
          src: `${media}/replacement-offer.webp`,
          alt: 'Replacement offer with a verified walker, compatibility checks, the unchanged time and price, a sixty-second confirmation and another-choice action',
          caption:
            'The substitute is already checked against the dog, time and price. The owner confirms; they do not repeat the booking.',
        },
      },
    ],
  },

  system: {
    heading: 'Thirty-three components, with states treated as product decisions.',
    body: [
      'The system has 63 primitive and 30 semantic tokens, fourteen text styles and 33 React components. Component code never reaches for a raw colour, radius or type size; the same semantic layer mirrors the Figma library and the screen specifications. Storybook renders every declared combination from the actual component, so the catalogue cannot quietly become a second implementation.',
      'A full Figma audit covered 448 instances and found zero broken instances, zero text nodes without a design-system style, zero unbound fills or strokes and zero spacing values outside the scale. The screen-to-code parity pass found the opposite class of problem — specifications that had fallen behind a component already used in the build — and fixed the wrong side instead of forcing the code back to an old document.',
      'The matrices below matter because the service lives outside the default state: the network drops, proof is missing, a disclosure opens, a timeline is waiting, an action becomes unavailable. Those are not edge decorations around the interface. They are the interface when trust is at risk.',
    ],
    grid: [
      {
        src: `${media}/system-info-note.webp`,
        alt: 'Information note in plain and disclosure forms, each in default and pressed states',
        component: 'InfoNote',
        states: 'plain / disclose × default · pressed',
      },
      {
        src: `${media}/system-empty-state.webp`,
        alt: 'Empty state with secondary action, primary action and without an action',
        component: 'EmptyState',
        states: 'secondary action · primary action · no action',
      },
      {
        src: `${media}/system-bottom-sheet.webp`,
        alt: 'Bottom sheet without actions, with one action and with two actions',
        component: 'BottomSheet',
        states: 'no action · single action · double action',
      },
      {
        src: `${media}/system-photo-proof.webp`,
        alt: 'Photo proof for pickup, drop-off and the not-yet-uploaded state',
        component: 'PhotoProof',
        states: 'pickup · drop-off · placeholder',
      },
      {
        src: `${media}/system-timeline-row.webp`,
        alt: 'Timeline row when done, current, pending and with a nested proof photo',
        component: 'TimelineRow',
        states: 'done · current · pending · nested photo',
      },
      {
        src: `${media}/system-icon-button.webp`,
        alt: 'Icon button in default, pressed and disabled states across the icon set',
        component: 'IconButton',
        states: 'default · pressed · disabled × icon set',
      },
    ],
  },

  result: {
    heading: 'What got solved, and what did not.',
    statements: [
      {
        term: 'Solved',
        value:
          'The booking now carries a visible chain of evidence: early coverage, hard compatibility constraints, dated verification, handover proof, a route that survives lost connection, an explicit return and a replacement path. The price shown to the owner includes the 18% platform commission and the walker sees the payout before accepting.',
      },
      {
        term: 'Built',
        value:
          'Eighty-one core nodes designed at flow and group level; sixteen key screens assembled into seventeen routed frames, plus the landing. Thirty-three components and their state matrices carry the same semantic variables across Figma, specifications, React and Storybook.',
      },
      {
        term: 'Verified',
        value:
          'Seventy-three review findings examined, seventy-one resolved and two dismissed as false positives. The final acceptance covered all seventeen routes and the landing at 1440, 960 and 375 pixels with 91 screenshots, nine reports and zero console errors. Synthetic agent QA completed the correct first action five times out of five and the happy path three times out of three; the major persistence defect it found passed retest.',
      },
      {
        term: 'What changed in how I work',
        value:
          'I stopped treating a complete happy path as a complete service. The most important fixes lived between screens: one price across two roles, state that must not leak to the next visitor, a keyboard path through the gallery, and recovery when the person the owner chose is no longer coming.',
      },
    ],
    nda: 'This is an interactive product concept, not a launched marketplace. No human interviews or usability sessions were completed, and there are no bookings, users, revenue, conversion or retention figures. The synthetic agent runs measure the prototype’s behaviour, not demand or adoption. PRD targets such as weekly bookings, fill rate and proof coverage remain targets, not results.',
  },

  outro: {
    heading: 'Trust was the interface, not a layer of copy.',
    lead: 'Every screen above either shows evidence, preserves it through failure, or admits what the service cannot guarantee yet.',
    cta: 'Get in touch',
    href: `mailto:${EMAIL}`,
  },
};
