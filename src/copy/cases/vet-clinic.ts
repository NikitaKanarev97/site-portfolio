/**
 * Тексты кейса Vet Clinic OS — маршрут /work/vet-clinic
 *
 * Композиция — ds/screens/case-vet.md. Фактура собрана из проекта
 * d:\Claude-projects\Veterinary-clinic: CLAUDE.md, outputs/brief.md,
 * outputs/interview_primary_persona.md, outputs/mvp_scope.md,
 * ds/foundation.md, ds/components.md, ds/screens/_index.md и история
 * коммитов (QA-волны 1–4). Ни одна цифра здесь не выдумана: 85 Variables,
 * 21 текстовый стиль, 31 компонент, 136 вариантов, 31 Must из 62, 44 экрана
 * sitemap, 12 кадров, 31 edge case, 13 маршрутов прототипа, 24 варианта
 * кнопки — всё из перечисленных файлов.
 *
 * Три правила, которые этот файл обязан держать:
 *
 * 1. Ни одной бизнес-метрики (CASE-12, US-09). Клиника под NDA, baseline
 *    нет. Метрики пилота названы планом измерения, а не результатом.
 * 2. Ни одного реального названия и реквизита (CASE-22, US-19). Данные на
 *    кадрах выдуманы, включая саму клинику: `Lesnaya Clinic` — декорация
 *    прототипа, а не заказчик, и оговорка шапки говорит это прямо.
 * 3. Заголовки — утверждения (CASE-14). Прочтение только заголовков и
 *    подписей обязано давать связный пересказ логики.
 *
 * **Факты шапки — решение владельца 2026-08-25.** Артефакты проекта
 * заявляют «живого заказчика нет, интервью — симуляция»; владелец сообщил
 * обратное: клиника реальная, под NDA, интервью — несколько живых
 * разговоров со знакомым практикующим врачом. На странице стоит версия
 * владельца. Закрытая фактура: единственный дизайнер, один врач и
 * несколько разговоров, работа дошла до дизайна и прототипа, 2026, две
 * недели. Ничего сверх этого не додумывалось — обоснование в
 * ds/screens/case-vet.md §Решения карты №1.
 *
 * Сквозные строки — в ../site.ts.
 */

/**
 * Срок подтверждается датами артефактов проекта (11–25 августа 2026) и
 * историей коммитов. Год продублирован в src/copy/home.ts: правятся оба
 * места.
 */
const YEAR = '2026';
const TEAM = 'Sole designer — research, product decisions, design system and the prototype';
const RESEARCH = 'Conversations with a practising veterinarian; no research team';
const DURATION = 'Two weeks, brief to working prototype';

/**
 * Адрес живого прототипа. Стоит константой с 2026-08-28: носителей два —
 * пара `Prototype` в мете шапки и ссылка внутри `process`, и разойтись
 * они не должны.
 */
const PROTOTYPE = 'https://veterinary-clinic-gules.vercel.app/';

const media = '/media/case-vet';

export const vetClinic = {
  slug: 'vet-clinic',

  meta: {
    title: 'Vet Clinic OS — clinic operations for a veterinary practice',
    description:
      'A veterinary clinic system rebuilt around the thirty seconds a doctor has between two patients: a trace of the visit that survives the room, and a full record written later.',
  },

  header: {
    title: 'Vet Clinic OS',
    lead: 'A clinic operations system rebuilt around the thirty seconds a veterinarian has between two patients — the only window in which a visit gets recorded or stops existing.',
    meta: [
      { term: 'Client', value: 'Private veterinary clinic — name withheld under NDA' },
      { term: 'Product', value: 'Clinic operations SaaS: schedule, medical record, invoicing' },
      { term: 'Year', value: YEAR },
      { term: 'Role', value: 'Product Designer' },
      { term: 'Platform', value: 'Web — responsive: desktop, tablet in the room, owner’s phone' },
      { term: 'Evidence', value: 'Concept · domain input from one vet' },
      { term: 'Prototype', value: 'Live, on invented data', href: PROTOTYPE },
    ],
    /** CASE-02: что решено и какой ценой, в шапке, одним абзацем. */
    outcome:
      'Outcome. The record of a visit stopped being an all-or-nothing document. A thirty-second trace — weight, drug, dose — is made in the room and reaches colleagues immediately; the full record is written later without overwriting it. What it cost: a card that stands openly incomplete for hours, and an incompleteness every reader downstream must be able to see.',
    team: [
      { term: 'Team', value: TEAM },
      { term: 'Product / research', value: RESEARCH },
      { term: 'Duration', value: DURATION },
    ],
    /** CASE-04. Вариант flagged, как в кейсе DSSL: оговорка одна на страницу. */
    rework: {
      label: 'A rebuild, not the clinic’s build',
      text: 'The clinic is real and so is the NDA. Its name, its people, its patients and its prices appear nowhere here: every screen runs on invented data, and the practice on them — “Lesnaya Clinic” — is a fixture, not the client. The work went as far as research, a design system and a working prototype; it was not taken into production.',
    },
  },

  cover: {
    /**
     * Обложка-стопка: три кадра одного продукта, от переднего к дальнему.
     * Сняты одним прогоном scripts/shoot-vet-frames.mjs — один viewport,
     * один фон, одна обработка. Пересъёмка идёт всей тройкой сразу.
     *
     * Передним — очередь дня: единственный экран, на котором проблема кейса
     * читается до первой строки текста, «3 visits are unfinished».
     */
    screens: [
      `${media}/cover/vet-day-queue.webp`,
      `${media}/cover/patient-card.webp`,
      `${media}/cover/schedule.webp`,
    ],
    alt: 'The veterinarian’s queue for the day: patients at the clinic, patients expected, and a notice that three visits from earlier in the week are still unfinished — with the patient card and the schedule behind it',
    caption:
      'The veterinarian’s day — who is here, who is expected, and three visits still unfinished from last week. Data is invented.',
  },

  context: {
    heading: 'Between Thursday and Saturday, the visit did not exist.',
    body: [
      'A veterinarian in a small practice sees ten to twenty patients a day. The clinic’s software is opened before the appointment and after it, and never during: while the patient is on the table, the record lives in a paper notebook. The first reason for the notebook is not privacy, it is physics — she writes with one hand, standing, because the other one is holding the cat.',
      'Everything after that is a transfer between tools: seven of them in one appointment, two of the same number — the weight goes into the system, then by hand into a dose calculator on her phone. That is where her one real near-miss came from: a decimal point moved by hand, caught by her and by nothing else. Services reach reception by voice — “put down two hundred, I’ll clarify later” — and are not clarified. The record itself is written at home at nine in the evening, part of it from memory.',
      'The cost of that is not paperwork. Thursday’s appointment was never entered, so on Saturday a colleague sees the same cat, finds a last entry a year old, examines from scratch and nearly prescribes a second anti-inflammatory on top of the first. What stopped it was a phone call answered on a day off. The system was no part of the safeguard, because it did not know the visit had happened.',
    ],
  },

  reframe: {
    heading: 'The unit of work was never the visit. It was the trace.',
    body: [
      'The brief asked for faster closing of visits, and the metric behind it was the share closed in the system on the day of the appointment. Both are reasonable, and the person they were written for took one sentence to show they were wrong.',
      '“The previous patient hasn’t left yet and the next one is already in the room. I have a choice: sit down and enter it, or smile at the next one. I always smile at the next one. Twelve times a day.” A product that asks for the whole record inside that window does not get half a record. It gets postponed whole — which is exactly what the current one does.',
      'So the object the system has to hold is not the closed visit. It is the trace: the smallest record worth having — weight, drug, dose, one line of free text — made in seconds, visible to a colleague immediately, completed later without being overwritten. The measure moves with it: not completeness by the end of the shift, but whether a trace exists by the time the veterinarian leaves the room.',
    ],
    statement:
      'Make the smallest useful record survive thirty seconds, and let everything else be written later.',
    /**
     * Кадр диапазона — три колонки, а не две: планшет назван платформой в
     * мете кейса. Подпись самая короткая из трёх кейсов не случайно: запас
     * по `CASE-15` здесь исчерпан, см. `ds/screens/case-vet.md` §Бюджет слов.
     */
    range: {
      src: `${media}/range-vet-day-queue.webp`,
      alt: 'The day queue at 1440, 768 and 390 px side by side: the navigation rail collapses into a menu button, the visit table drops its waiting and action columns on the tablet, and on the phone each visit becomes a labelled card ending in Start visit',
      caption: 'The same day at 1440, 768 and 390 px: columns drop, rows become cards.',
    },
  },

  process: {
    heading: 'I checked the incumbent before I drew anything, and wrote down what I could not check.',
    body: [
      'This clinic was not coming from paper: practices of this size already run specialised software, so the product had to beat an incumbent rather than replace a filing cabinet — which makes it the only hard evidence there is. I audited it screen by screen against heuristics, with a severity scale that keeps “blocks the work” apart from “looks untidy”, and with a limit written into the report: the veterinarian’s own visit screen, the schedule and the owner cabinet were not in the material I had, and no conclusions were drawn about them.',
      'Then desk research on the market and on the regulation around veterinary records. Three of its numbers could not be traced to a primary source, so they were marked unverified and kept out of the PRD rather than rounded into it. Everything the conversations could not confirm carries the same mark and stays a hypothesis for real customer development — including the two that changed the product, because a hypothesis that flatters your redesign is still a hypothesis.',
      'Then scope: 31 Must-haves out of 62 requirements, with the core of the appointment declared indivisible — seven parts that ship together or not at all. Then a 44-screen sitemap, three flows, twelve low-fidelity frames. Then the design system, then twelve high-fidelity frames carrying one story end to end, from the queue to the discharge summary on the owner’s phone, with 31 edge cases built as hidden states instead of described in prose. Then a React prototype, a catalogue in Storybook, and synthetic agent runs over three scenarios, whose findings came back in four waves of fixes.',
    ],
    /**
     * Живой прототип на Vercel, без логина — проверено 2026-08-25.
     * Стоит здесь, а не в шапке и не рядом с CTA, по той же причине, что в
     * кейсе DSSL: в шапке ↗ обещал бы продукт заказчика, а это прототип на
     * выдуманных данных, и подпись говорит это прямо.
     */
    prototype: {
      href: PROTOTYPE,
      label: 'Open the prototype',
      note: 'The prototype, on invented data — thirteen screens, the same build the agent runs walked through.',
    },
    artifacts: [
      {
        src: `${media}/screen-index.webp`,
        alt: 'Index of the prototype: thirteen screens as cards, each with the frame it came from',
        caption:
          'Thirteen screens as one index — every route the prototype has, and the frame each one came from.',
      },
      {
        src: `${media}/storybook-matrix.webp`,
        alt: 'Component catalogue: every variant of the button side by side, twenty-four in all',
        caption:
          'One component, every variant it is allowed to have — twenty-four for the button alone. The matrix is checked in the catalogue, not on the screen.',
      },
    ],
  },

  failure: {
    heading: 'The screens passed my own audit. The prototype did not.',
    body: [
      'Booking. A free slot in the schedule created a visit with no patient, no owner and no reason — a record that exists and says nothing, in a product whose whole argument is that a record must be worth having. The scenario was in the sitemap; the screen for it was in neither the design file nor the specification. It appeared first in the prototype and had to be registered there as prototype-only: the design source and the build had diverged quietly.',
      'Saving. The workspace showed the save status twice — once in the header, once in the side rail. On a product whose one dealbreaker is a lost draft, two indicators of the same fact is the defect you can least afford: the first time they disagree, neither is believed again. The fix was not to make them agree. It was to delete one.',
      'And that deletion was not finished when the thing was gone. The rule pinning the save status to the bottom of the rail stayed behind, took the navigation as its new last child, and slid every menu item down into an empty column. The screens passed, the build passed, nobody saw it. I found it weeks later, shooting the frames for this page — a screenshot has no opinion about which part of a rail you meant to look at.',
    ],
  },

  decisions: {
    heading: 'Four decisions, and what each one cost.',
    items: [
      {
        decision:
          'The trace and the full record are one object in two stages, not two documents.',
        why: 'Completeness by the end of the shift cannot survive thirty seconds between patients, and a second document would let the old habit continue under a new name. The trace also has to reach a colleague immediately — otherwise Saturday repeats, with a year-old card and a doctor examining from scratch.',
        cost: 'The card stands openly incomplete for hours, and that has to be legible to everyone downstream: the colleague reading it, the administrator billing from it, and the publication to the owner, which refuses to send a trace at all.',
        artifact: {
          src: `${media}/visit-quick-trace.webp`,
          alt: 'The quick trace on a tablet: three steps — weight, medication, dose — with the draft saved and a private line at the end',
          caption:
            'Three steps, one hand, and a draft that is already saved. The full record is a separate action below.',
        },
      },
      {
        decision:
          'The dose is calculated from the weight already in the system, and the whole calculation is shown — formula, substitution, rounding.',
        why: 'The real near-miss here was not a gap in knowledge, it was a decimal point moved by hand on the way to a phone calculator. Removing that transfer needs no drug reference at all: the weight is already there, and a number the doctor cannot re-type is one she cannot mistype. Showing the arithmetic makes it checkable rather than trusted.',
        cost: 'No species contraindication warnings in the first version. The risk that worries the clinic and its lawyer stays uncovered and became a separate go/no-go decision, because a warning table we cannot license or verify is a promise the interface cannot keep.',
        artifact: {
          src: `${media}/dose-calculator-crop.webp`,
          zoomSrc: `${media}/dose-calculator.webp`,
          alt: 'Dose calculation beside the visit record: weight pulled from the patient card, formula, substitution, rounding and the resulting dose',
          caption:
            'The weight comes from the card and cannot be typed in here. Formula, substitution and rounding are all on screen.',
        },
      },
      {
        decision:
          'The veterinarian’s private zone gets its own colour in the palette, not a label.',
        why: '“I don’t like the look of this” is a class of clinical information that currently lives nowhere: it goes into a notebook that is thrown away, and it is gone by the time the patient comes back. Bringing it into the system only works if the boundary — the owner will not see this — is impossible to miss and impossible to erase. A label survives a rebrand only if someone remembers it; a reserved hue survives it by construction.',
        cost: 'One tone of the palette is spent for good and cannot be reused for anything else, on a product that otherwise runs on a single accent.',
        artifact: {
          src: `${media}/patient-card-private-crop.webp`,
          zoomSrc: `${media}/patient-card-private.webp`,
          alt: 'Patient card with a private note in its own colour, marked as visible only to clinic veterinarians',
          caption:
            'The private note carries its own hue and says who can see it. It is in no discharge summary and on no invoice.',
        },
      },
      {
        decision:
          'Publishing to the owner is an explicit act by the veterinarian, with a preview from the owner’s side.',
        why: 'Premature publication of a draft is irreversible in a way a bug is not, and the response to it is rational: she will write only what she is ready to read aloud — and then the card is empty, the invoice is guesswork and the discharge summary says nothing. The preview is not hygiene here. It is the condition under which anything gets written at all.',
        cost: 'An extra step on every visit, and a discharge summary that cannot be automated even when the record is complete and nothing in it is sensitive.',
        artifact: {
          src: `${media}/discharge-preview-crop.webp`,
          zoomSrc: `${media}/discharge-preview.webp`,
          alt: 'Publishing preview: owner-facing instructions beside a private note and diagnosis withheld from the owner',
          caption: 'Owner-facing instructions beside the private note and diagnosis withheld from the owner.',
        },
      },
    ],
  },

  system: {
    heading: 'Thirty-one components, and one I deleted.',
    body: [
      'Eighty-five variables — 54 primitive, 31 semantic — 21 text styles and 136 variants. Every fill and stroke resolves through a semantic variable, every text node through a named style. A full read-only scan, not a sample, found no hardcoded colours, no unstyled text nodes and no detached instances; the thirty geometry values still unbound are listed as debt, not hidden behind a claim of parity.',
      'The one I deleted is the card container: three variants, zero instances anywhere in the product. A component carries exactly the anatomy it was created with, and this one had a title and a single row, while the real blocks here need two to five elements, several of them nested instances. Keeping it “for later” would have meant every screen quietly working around it, which is worse than not having it.',
      'Coverage is not checked by eye: a script walks the catalogue against the variant matrix, and the states below are shot from the catalogue, not assembled by hand.',
    ],
    /** CASE-10, US-18: состояния в подписи обязательны. */
    grid: [
      {
        src: `${media}/system-save-status.webp`,
        alt: 'Save status in its four states',
        component: 'SaveStatus',
        states: 'saved · saving · unsaved · offline',
      },
      {
        src: `${media}/system-input.webp`,
        alt: 'Input field in three types and four states, with the error state showing its reason',
        component: 'Input',
        states: 'single / multiline / search × default · focus · error · disabled',
      },
      {
        src: `${media}/system-choice-chip.webp`,
        alt: 'Choice chip in three types and four states',
        component: 'ChoiceChip',
        states: 'value / drug / service × default · selected · pressed · disabled',
      },
      {
        src: `${media}/system-weight-reading.webp`,
        alt: 'Weight reading measured at the clinic and reported by the owner, in two sizes',
        component: 'WeightReading',
        states: 'clinic / owner × base · lg',
      },
      {
        src: `${media}/system-time-slot.webp`,
        alt: 'Schedule slot when it is free, booked and closed, in two states each',
        component: 'TimeSlot',
        states: 'free / booked / closed × default · pressed',
      },
      {
        src: `${media}/system-status-tag.webp`,
        alt: 'Status tag in its five variants',
        component: 'StatusTag',
        states: 'neutral · success · warning · error · info',
      },
    ],
  },

  result: {
    heading: 'What got solved, and what it cost.',
    statements: [
      {
        term: 'Solved',
        value:
          'A trace of the visit exists before the veterinarian leaves the room, so the colleague who opens the card on Saturday sees Thursday. The invoice is assembled from what the doctor marked during the appointment, not from a question at the reception desk. The owner receives what was published and nothing that was not.',
      },
      {
        term: 'Sacrificed',
        value:
          'Species contraindication warnings, drug accounting and labelling, and taking payments. All three were cut deliberately and written down as cuts, each with the condition under which it returns.',
      },
      {
        term: 'Why the price was right',
        value:
          'Each refusal covers something the product cannot guarantee on its own: a licensed source of dosing rules, a regulator’s accounting machine, someone else’s money. A system that promises any of them breaks on the first real shift and takes the doctor’s trust with it — the one thing here that does not come back. An inconvenient program she will get used to; one that lets her down once, she will not turn her back on again.',
      },
      {
        term: 'What changed in how I work',
        value:
          'I stopped counting an audit as passed when only the screens passed it. The prototype found a screen that did not exist, and a save indicator duplicated in the one product where a lost draft ends the relationship — neither of which a review of the frames was going to catch.',
      },
    ],
    /** CASE-12. Стоит здесь, не в шапке и не в подвале. */
    /**
     * Граница проверки названа прямо — находка `L1-3`, 2026-08-28. Прежний
     * текст говорил, чего нет (метрик, внедрения), но не говорил, что именно
     * было проверено и на ком. Разговор про «одного врача» лучше вести
     * самому, чем отдавать его интервьюеру: названное ограничение можно
     * обсуждать, необъявленное выглядит найденным.
     */
    nda: 'Validated: workflow and vocabulary, with one practising veterinarian. Not validated: whether either generalises across clinics, roles or regulation. The clinic is under NDA — not named, no figures published — and there is no baseline to publish them against: the metrics here are a plan for measurement, not a claim of results. The ones worth measuring came from the veterinarian as things you can observe: the notebook is not replaced, she leaves at seven instead of nine, the administrator stops asking what to bill. Nothing above is adoption.',
  },

  outro: {
    heading: 'This case is mostly a list of refusals.',
    lead: 'Every decision above bought a guarantee by giving something up, and every one of those trades is arguable.',
  },
};
