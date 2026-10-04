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
/**
 * Вторая половина — прогон продуктовой доводки `VET-PP-2026-09-12`: чаты
 * 01–07 шли 12–13 сентября 2026 (`audit/product-polish/STATE.md` продукта).
 */
const DURATION = 'Two weeks to a working prototype, then a two-day polish pass';

/**
 * Адрес живого прототипа. Стоит константой с 2026-08-28: носителей два —
 * пара `Prototype` в мете шапки и ссылка внутри `process`, и разойтись
 * они не должны.
 */
const PROTOTYPE = 'https://veterinary-clinic-gules.vercel.app/';

const media = '/media/case-vet';

import {defineStory,type CaseStory,type ShotItem} from './story';
import {vetRoleFlow} from '../../data/diagrams/vet-clinic/role-flow';

/** D is preview-only. The historical public object below stays unchanged. */
export function makeVetStory(lang:'en'|'ru'):CaseStory {
  const t=(en:string,ru:string)=>lang==='ru'?ru:en;
  const root='/media/rebuild/vet-clinic';
  const shot=(name:string,en:string,ru:string,nativeWidth?:number):ShotItem=>({src:`${root}/${name}-${lang}-wide.webp`,srcNarrow:`${root}/${name}-${lang}-narrow.webp`,alt:t(en,ru),device:'panel',nativeWidth});
  return defineStory({theme:'vet',plate:'light',
    cover:{title:'Vet Clinic OS',outcome:t('One visit. Different responsibilities.','Один визит. Разные зоны ответственности.'),media:{variant:'proof',eyebrow:t('Concept · not deployed in a clinic','Концепт · в клинике не внедрён'),shot:{...shot('cover','Quick trace: Marsik, weight, complete dose calculation and Save actions.','Короткий след: Марсик, вес, целый расчёт дозы и действия сохранения.')},caption:t('Clinical workspace · seed example 4.8 kg / 0.95 ml.','Рабочая поверхность · исходный пример 4.8 кг / 0.95 мл.')}},
    facts:[
      {term:t('Role','Роль'),value:t('Sole product designer','Единственный продуктовый дизайнер')},
      {term:t('Input','Основание'),value:t('Conversations with one practising vet','Разговоры с одним практикующим врачом')},
      {term:t('Delivery','Результат'),value:t('Working prototype · 2026','Рабочий прототип · 2026')},
      {term:t('Data','Данные'),value:t('Real clinic under NDA','Реальная клиника под NDA')},
    ],blocks:[
      {id:'room-window',type:'shot',evidenceId:'vet-window',mediaId:'vet-queue',motion:'static',payload:{
        thesis:{label:t('Constraint','Ограничение'),thesis:t('A trace before the next patient','След за время паузы'),body:t('I separated a useful trace from the complete record. Thirty seconds between patients was the original constraint, not a measured speed of the new interface.','Я отделил полезный след от полной записи. Тридцать секунд между пациентами — исходное ограничение, а не измеренная скорость нового интерфейса.')},
        shot:{layout:'desktop',items:[{src:`${root}/queue-${lang}.webp`,srcNarrow:`${root}/queue-${lang}-narrow.webp`,device:'panel',alt:t('Today’s queue: all patients at the clinic and an emergency action; wide view includes expected visits.','Очередь дня: все пациенты в клинике и экстренное действие; широкий кадр также показывает ожидаемых.')}],caption:t('Patients first; unfinished records stay visible.','Сначала пациенты; незавершённые записи остаются видны.')},
      }},
      {id:'role-boundaries',type:'artifact',evidenceId:'vet-roles',mediaId:'vet-role-flow',motion:'draw',payload:{thesis:{label:t('Role flow','Ролевой сценарий'),thesis:t('Each role receives its own part','У каждой роли своя часть')},artifact:{data:vetRoleFlow,source:{kind:'editorial',ref:'Veterinary-clinic: current ProductScreens / clinicData; visit-trace + discharge-and-invoice'},caption:t('Editorial flow; roles named inside their zones.','Схема текущего прототипа; роли подписаны внутри зон.')}}},
      {id:'one-visit',type:'steps',evidenceId:'vet-roles',mediaId:'vet-handoff',motion:'focus',payload:{label:t('One visit · three views','Один визит · три представления'),items:[
        {label:t('Veterinarian · tablet','Врач · планшет'),thesis:t('Save the useful facts','Вес, препарат и доза'),body:t('Weight, medication and dose become sourced facts. The full note can follow later. Here: Marsik, 4.9 kg, Meloxicam, 1.00 ml. Saved at 09:12.','Вес, препарат и доза становятся фактами с источником. Полную запись можно дописать позже. Здесь: Марсик, 4.9 кг, мелоксикам, 1.00 мл. Сохранено в 09:12.'),shot:shot('trace','Marsik’s saved facts: 4.9 kg, Meloxicam, 1.00 ml, frequency, source and time.','Сохранённые факты Марсика: 4.9 кг, мелоксикам, 1.00 мл, частота, источник и время.')},
        {label:t('Reception · desktop','Регистратура · desktop'),thesis:t('Bill the work, keep the note private','Счёт готов'),body:t('Selected services create the invoice. Reception sees payer, items and total. Diagnosis and private notes stay in the clinic; payment happens outside the prototype. Two services for Marsik.','Выбранные услуги составляют счёт. Регистратура видит плательщика, позиции и итог. Диагноз и приватная заметка остаются в клинике; оплата происходит вне прототипа. Две услуги Марсика.'),shot:shot('invoice','Complete invoice: payer, selected services, total and payment action.','Целый счёт: плательщик, выбранные услуги, итог и действие отметки оплаты.',640)},
        {label:t('Owner · phone','Владелец · телефон'),thesis:t('Publish a stable document','План уже у семьи'),body:t('The owner receives the same prescription in a published snapshot. A later saved edit does not silently rewrite it. Publishing a new version is explicit. Published at 09:13; viewports share one browser.','Владелец получает то же назначение в опубликованном снимке. Поздняя сохранённая правка не переписывает его молча. Новая версия публикуется явно. Публикация 09:13; размеры окна одного браузера.'),shot:{src:`${root}/owner-detail-${lang}.webp`,srcNarrow:`${root}/owner-${lang}.webp`,device:'panel',nativeWidth:390,alt:t('Phone details: Marsik, publication 09:13, Meloxicam 1.00 ml and complete discharge action; mobile shows the full owner view.','Детали телефона: Марсик, публикация 09:13, мелоксикам 1.00 мл и целое действие выписки; на mobile — полный кабинет владельца.')}},
      ]}},
      {id:'save-is-not-publish',type:'process',evidenceId:'vet-publication',mediaId:'vet-boundaries',motion:'static',payload:{thesis:{label:t('State boundaries','Границы состояний'),thesis:t('Saved does not mean published','Запись и выписка живут отдельно'),body:t('Unsaved form, saved record and published document are independent states. The owner can still read an older publication while the doctor edits the record.','Несохранённая форма, сохранённая запись и опубликованный документ — независимые состояния. Владелец может читать прежнюю публикацию, пока врач меняет запись.')},slides:[
        {shot:shot('draft','Unsaved changes, weight 4.9 and complete Save actions.','Несохранённые правки, вес 4.9 и целые действия сохранения.',768)},
        {shot:shot('saved','Saved at 09:12; weight persists after reload.','Сохранено в 09:12; вес переживает перезагрузку.',768)},
        {shot:shot('publication','Published version 1, Changes are not published, Publish new version.','Опубликована версия 1, новые правки не опубликованы, действие новой публикации.',358)},
      ],captions:[t('Unsaved edits live only in this form.','Несохранённые правки живут только в этой форме.'),t('Save survives reload; it does not publish.','Сохранение переживает перезагрузку, но не публикует.'),t('The owner still reads the published snapshot.','Владелец всё ещё читает опубликованный снимок.')]}},
      {id:'prototype-boundary',type:'outcome',evidenceId:'vet-outcome',motion:'static',payload:{result:{label:t('Result','Результат'),thesis:t('A working path, with clear limits','Рабочий путь с ясными границами')},evidence:{label:t('Evidence','Подтверждение'),text:t('The trace, invoice and recommendations connect in the current prototype. This run checked the chain and both locales. One doctor informed the concept; clinical safety and adoption were not tested.','След, счёт и рекомендации связаны в текущем прототипе. Этот прогон проверил цепочку и обе локали. Концепт опирается на ввод одного врача; клиническая безопасность и внедрение не проверялись.')},tradeoff:{label:t('Cost','Цена решения'),text:t('Save and Publish are separate actions. Unsaved edits disappear on reload. Data stays in one browser; past published versions are not stored.','Сохранение и публикация — отдельные действия. Несохранённые правки теряются при перезагрузке. Данные живут в одном браузере; прошлые опубликованные версии не хранятся.')},nextEvidence:{label:t('Next evidence','Следующая проверка'),text:t('Observe real handoffs, interrupted work and record recovery in a practice.','Наблюдать передачу, прерванную работу и восстановление записи в реальной практике.')}}},
    ],prototype:{label:t('Open the demo','Открыть демо'),href:PROTOTYPE+(lang==='ru'?'ru/':'')},
  });
}
export const vetClinicStory=makeVetStory('en');

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
      { term: 'Prototype', value: 'Live', href: PROTOTYPE },
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
      text: 'The clinic is real and so is the NDA. The work went as far as research, a design system and a working prototype; it was not taken into production.',
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
    alt: 'The veterinarian’s queue for the day: counts in the header, one line naming three records still open from earlier in the week, patients at the clinic and patients expected — with the patient card and the schedule behind it',
    caption:
      'The veterinarian’s day — who is here, who is expected, and three records still open from earlier in the week.',
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
      alt: 'The day queue at 1440, 768 and 390 px side by side: the navigation rail collapses into a menu button, the tablet table folds the owner under the patient’s name, and on the phone each visit becomes a labelled card ending in Start visit',
      caption: 'The same day at 1440, 768 and 390 px: columns drop, rows become cards.',
    },
  },

  process: {
    heading: 'I checked the incumbent before I drew anything, and wrote down what I could not check.',
    body: [
      'This clinic was not coming from paper: practices of this size already run specialised software, so the product had to beat an incumbent rather than replace a filing cabinet — which makes it the only hard evidence there is. I audited it screen by screen against heuristics, with a severity scale that keeps “blocks the work” apart from “looks untidy”, and with a limit written into the report: the veterinarian’s own visit screen, the schedule and the owner cabinet were not in the material I had, and no conclusions were drawn about them.',
      'Then desk research on the market and on the regulation around veterinary records. Three of its numbers could not be traced to a primary source, so they were marked unverified and kept out of the PRD rather than rounded into it. Everything the conversations could not confirm carries the same mark and stays a hypothesis for real customer development — including the two that changed the product, because a hypothesis that flatters your redesign is still a hypothesis.',
      'Then scope: 31 Must-haves out of 62 requirements, with the core of the appointment declared indivisible — seven parts that ship together or not at all. Then a 44-screen sitemap, three flows, twelve low-fidelity frames. Then the design system, then twelve high-fidelity frames carrying one story end to end, from the queue to the discharge summary on the owner’s phone, with 31 edge cases built as hidden states instead of described in prose. Then a React prototype, a catalogue in Storybook, and agent runs over three scenarios, whose findings came back in four waves of fixes.',
      /**
       * Стадия продуктовой доводки после приёмки — прогон
       * `Veterinary-clinic/audit/product-polish/` (`VET-PP-2026-09-12`),
       * чаты 01–07, 12–13 сентября 2026. Место и форма — как у последнего
       * абзаца `process` в кейсах Agent Ops и DSSL: этап работы, а не список
       * правок. Нового раздела нет.
       *
       * Каждое утверждение перепроверяемо по отчётам прогона: однообразие —
       * запрос владельца (`USER-DIRECTION.md`) и аудит `00-audit.md`; три
       * неправды прототипа — VET-014 (Start visit у Тима открывал Марсика),
       * VET-015 (перенос двигал строку, где стоял Рекс другого врача), VET-016
       * (правка после публикации молча меняла документ владельца); формы
       * поверхностей — отчёты 02–06; «три цепочки скриптом на обоих языках,
       * 360–1440» — `07-acceptance.md` §0, §2, §3. Это браузерные прогоны, не
       * пользовательская проверка, и абзац так и говорит.
       */
      'After acceptance I ran a separate polish pass: thirteen working screens still read as one screen repeated. Each surface got its own form — the queue a ledger where the emergency holds the only primary action, the calculation an answer above its arithmetic, the schedule a timeline where height is duration, the owner’s view a letter. The pass also caught the prototype saying false things: Start visit on one patient opened another, the emergency shift moved a different doctor’s appointment, and an edit silently rewrote a summary the owner already had. The visit is now keyed to its patient, the shift moves appointments by id, and publishing stores a snapshot. Three end-to-end chains pass by script in both languages, 360 to 1440 px.',
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
      note: 'The prototype after the polish pass — thirteen screens, three roles; changes stay in your browser.',
    },
    /**
     * Клип — `CASE-20`, съёмка `scripts/shoot-clips.mjs vet`.
     *
     * **С 13.09.2026 — взаимодействие, а не перестроение ширин.** Прежний
     * ролик показывал адаптив, потому что прототип был галереей экранов без
     * продуктовых обработчиков. После доводки у него настоящее поведение, и
     * «видео реального взаимодействия» больше не пришлось бы разыгрывать.
     * Адаптив по-прежнему доказывает кадр диапазона в `reframe`.
     *
     * Сюжет — шаг 0:12 маршрута показа (`DEMO.md` прогона): вес 4.8 → 5.2 →
     * 4.8 в коротком следе. Доза, три строки расчёта и статус сохранения
     * отвечают на месте; петля сходится сама, потому что статус считается от
     * состояния формы (VET-021).
     */
    clip: {
      src: `${media}/clip-dose-from-weight-poster.webp`,
      video: `${media}/clip-dose-from-weight`,
      alt: 'Screen recording of the quick trace: the weight is switched from 4.8 to 5.2 kg, the dose, formula, substitution and rounding recalculate to 1.05 ml and the status turns to Unsaved changes; switching back restores 0.95 ml and the saved state',
      caption: 'Change the weight, and the dose, its arithmetic and the save status answer in place.',
    },
    artifacts: [
      {
        src: `${media}/screen-index.webp`,
        alt: 'Index of the prototype: a header counting thirteen screens, and the veterinarian’s group of seven live previews from the queue to the discharge preview',
        caption:
          'Thirteen screens grouped by role — here the veterinarian’s seven, from the queue to the published summary.',
      },
      {
        src: `${media}/storybook-matrix.webp`,
        alt: 'Component catalogue: every variant of the button side by side, twenty-four in all',
        caption:
          'Every variant the button is allowed — twenty-four, checked in the catalogue rather than on screens.',
      },
      /**
       * Три пары «до / после доводки» — `scripts/shoot-vet-pairs.mjs`. Одна
       * задача на пару, те же демоданные, локаль и ширина; «до» — сборка
       * `main@0413e29` с Vercel, с которой начался прогон, «после» — сборка
       * коммита приёмки `c2a65cc`. Задачи — из пакета приёмки 07
       * (`evidence/07-final/case/manifest.json`): очередь, перенос, кабинет
       * владельца. Остальные типы экранов — карта, расчёт, приём с
       * приватностью, публикация — стоят ниже артефактами решений.
       * Телефон владельца — на квадратной подложке, иначе портрет 390 px был
       * бы втрое выше соседних пар.
       */
      {
        src: `${media}/polish-before-queue.webp`,
        alt: 'The day queue before the polish pass, at 1440 px: a wide warning banner above the table, the emergency row tinted red, and a filled Start visit button on every row',
        caption: 'Before: a banner over the table, and a primary button in every row.',
      },
      {
        src: `${media}/polish-after-queue.webp`,
        alt: 'The same queue after the pass, on the same data: counts for the day in the header, one line naming the records still open, the emergency marked by an edge and the only filled Start visit button',
        caption: 'After: counts in the header, open records in one line, one primary action.',
      },
      {
        src: `${media}/polish-before-shift.webp`,
        alt: 'The emergency shift review before the pass: the added appointment in a card, before and after times in two boxes, a table of owners to notify and a card saying other veterinarians are unaffected',
        caption: 'Before: times in two boxes, and a card promising no other doctor moves.',
      },
      {
        src: `${media}/polish-after-shift.webp`,
        alt: 'The same review after the pass: each move as a struck-through old time and a new time, where the delay comes from, owners to call with both times, and Rex in another veterinarian’s column listed as not affected',
        caption: 'After: old time, new time, why — and Rex, in another column, left alone.',
      },
      {
        src: `${media}/polish-before-owner.webp`,
        alt: 'The owner’s view on a phone before the pass: stacked cards, with the instruction to stop the drops printed twice in the first one',
        caption: 'Before: the owner’s view as cards, the instruction printed twice.',
      },
      {
        src: `${media}/polish-after-owner.webp`,
        alt: 'The owner’s view after the pass, on the same phone width: the pet’s name, one published status with time and doctor, what to do today, then the prescription',
        caption: 'After: a letter — the pet, one status, today, then the prescription.',
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
          src: `${media}/visit-quick-trace-crop.webp`,
          zoomSrc: `${media}/visit-quick-trace.webp`,
          layout: 'wide',
          rounded: true,
          alt: 'The quick trace: weight with its clinic history, medication from the formulary and the dose with formula, substitution and rounding as three adjacent steps, then the private note and two separate actions',
          caption:
            'Three steps stay visible together, followed by one private line. Saving the trace and opening the full record remain separate actions.',
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
          /** С 13.09.2026 `wide`: после доводки панель расчёта широкая, и
           *  боковой слот 453 px резал бы её посреди строки округления. */
          layout: 'wide',
          alt: 'Dose calculation: weight, concentration and dose each with its source, the answer 0.95 ml, then formula, substitution and rounding to the syringe step',
          caption:
            'The weight arrives from the card with its source and cannot be typed here. The answer comes first, then its arithmetic.',
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
          layout: 'wide',
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
          layout: 'wide',
          alt: 'Review before publishing: the document the owner will receive, and beside the publish button the list of what stays in the clinic — private note, diagnosis, internal comments, invoice',
          caption: 'The owner’s document exactly as it will arrive, and beside the publish button, what stays in the clinic.',
        },
      },
    ],
  },

  system: {
    heading: 'Thirty-one components, and one I deleted.',
    body: [
      'Eighty-six variables — 54 primitive, 32 semantic — 25 text styles and 137 variants. Every fill and stroke resolves through a semantic variable, every text node through a named style. The last full scan of the design file found no hardcoded colours, unstyled text or detached instances; the polish pass has since added one colour, four numeric styles and a variant axis in code, and the file’s lag is listed as debt, not hidden behind a claim of parity.',
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
