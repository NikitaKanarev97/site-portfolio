/**
 * Тексты кейса B2B Partner Portal — маршрут /work/partner-portal
 *
 * Композиция — ds/screens/case-dssl.md. Фактура собрана из проекта
 * d:\Claude-projects\b2b-dssl: outputs/brief.md, ds/DECISIONS.md,
 * ds/patterns.md, ds/components.md, audit/audit_report.md,
 * audit/agent_qa_2026-08-23.md. Ни одна цифра здесь не выдумана: 17,9 с и
 * 0,9–2,8 с, семь находок, два критических, 560 px, три прогона из трёх,
 * 24 + 21 компонент — всё из перечисленных файлов.
 *
 * Три правила, которые этот файл обязан держать:
 *
 * 1. Ни одной бизнес-метрики (CASE-12, US-09). Результаты закрыты NDA, и
 *    baseline у проекта нет. Числа выше — про прогон и про систему, не про
 *    бизнес, и в тексте это названо прямо.
 * 2. Ни одного реального названия, артикула и коммерческого условия
 *    (CASE-22, US-19). Данные на кадрах synthetic по D013 проекта b2b-dssl.
 *    Имя заказчика — исключение, подтверждённое владельцем 2026-08-24.
 * 3. Заголовки — утверждения (CASE-14). Прочтение только заголовков и
 *    подписей обязано давать связный пересказ логики.
 *
 * v1.0 выходит на английском. Сквозные строки — в ../site.ts.
 */

/**
 * Факты о реальной работе с порталом — решение владельца 2026-08-24. В
 * артефактах проекта b2b-dssl их нет ни в одном файле; источник — владелец.
 *
 * Год. Задача началась в 2024, надолго откладывалась, возобновилась и была
 * закрыта зимой 2026 — отсюда широкий диапазон при шести месяцах активной
 * работы. Начало подтверждается кадрами живого портала в b2b-dssl/
 * pages-default: акция на них датирована 1 октября — 31 декабря 2024.
 * Верхняя граница сходится с трудовой хронологией: DSSL, сентябрь 2023 —
 * март 2026. Duration называет паузу прямо, иначе диапазон читается как
 * приписанный срок.
 *
 * Год продублирован в src/copy/home.ts: правятся оба места.
 */
const YEAR = '2024–2026';
const TEAM = 'Sole designer — with frontend, backend, a product manager, QA and the team lead';
const RESEARCH = 'Product manager on the team; no researcher — the research was mine';
const DURATION = 'Roughly six months of active work, spread across a long pause';

/**
 * Адрес живого прототипа. Стоит константой с 2026-08-28: носителей два —
 * пара `Prototype` в мете шапки и ссылка внутри `process`, и разойтись
 * они не должны.
 */
const PROTOTYPE = 'https://b2b-partner-portal-five.vercel.app/';

const media = '/media/case-dssl';

export const partnerPortal = {
  slug: 'partner-portal',

  meta: {
    title: 'B2B Partner Portal — DSSL',
    description:
      'A distributor’s partner portal rebuilt around the specification: a purchase list keeps its source row from the imported file all the way to the placed order.',
  },

  header: {
    title: 'B2B Partner Portal',
    lead: 'A distributor’s partner portal, rebuilt so a partner can turn a purchase list into an order without a manager in the middle — on top of a pricing and stock system that was never going to be replaced.',
    meta: [
      { term: 'Client', value: 'DSSL' },
      { term: 'Product', value: 'Distributor partner portal, redesign' },
      { term: 'Year', value: YEAR },
      { term: 'Role', value: 'Product Designer' },
      { term: 'Platform', value: 'Web, desktop-first' },
      { term: 'Evidence', value: 'Commercial redesign · shipped in full' },
      { term: 'Prototype', value: 'Live, on synthetic data', href: PROTOTYPE },
    ],
    /** CASE-02: что решено и какой ценой, в шапке, одним абзацем. */
    outcome:
      'Outcome. The specification became the thing the system tracks, not the catalogue. A line keeps its source row — file, row number, original text, original quantity — from the imported spreadsheet to the placed order. What it cost: the buyer resolves every ambiguous line by hand, because nothing in the data could confirm compatibility on their behalf.',
    team: [
      { term: 'Team', value: TEAM },
      { term: 'Product / research', value: RESEARCH },
      { term: 'Duration', value: DURATION },
    ],
    /**
     * CASE-04. Вариант flagged, а не muted — решение карты №2.
     *
     * Порядок фактов перевёрнут 2026-08-28, находка `L1-2`. Метка была
     * «A rebuild, not the shipped product», и то, что редизайн дошёл до прода
     * целиком, стояло третьим предложением внутри абзаца. Рекрутер читает
     * метку, а не абзац, и уходил с выводом «это не production» — при том,
     * что это единственный отгруженный коммерческий редизайн в портфолио.
     * Ни один факт не снят и не смягчён: отгрузка и пересборка обе названы,
     * поменялось только что стоит первым.
     */
    rework: {
      label: 'Shipped at DSSL — rebuilt here on synthetic data',
      text: 'The redesign shipped in full: every page of the portal went live at DSSL. What you see on this page is not that build — I designed the solution again from the original product and my own research, and every screen of that rebuild carries synthetic data — no real client, vendor, article number or commercial term appears on any of them. One archival frame of the original portal is shown for comparison, cropped so that no order, article number or price is in it.',
    },
  },

  cover: {
    /**
     * Обложка-стопка: три кадра одного продукта, от переднего к дальнему.
     * Сняты одним прогоном scripts/shoot-case-frames.mjs — один viewport,
     * один фон, одна обработка. Пересъёмка идёт всей тройкой сразу: слои
     * стоят рядом, и разошедшийся кадр видно на обложке немедленно.
     */
    screens: [
      `${media}/cover/resolution-center.webp`,
      `${media}/cover/fulfillment.webp`,
      `${media}/cover/dashboard.webp`,
    ],
    alt: 'Specification review screen: forty-eight imported lines with their resolution status, with two more screens of the portal behind it',
    caption:
      'Specification review — the queue where a line’s identity is settled. Data is synthetic.',
  },

  context: {
    heading: 'The old portal answered every question with a manager.',
    body: [
      'The distributor sells professional video-surveillance equipment to system integrators. Its partners are not shoppers: they buy from a list they already have, for a project that has a date, at prices that belong to their contract. The portal they were given behaved like a shop.',
      'I audited its ten screens before touching anything, and the pattern held across all of them. The left rail was icons with no labels. The dashboard opened with a training banner and promotions, so a professional buyer’s workspace led with marketing. The filter panel listed dozens of technical attributes at one level, alphabetically, with no search inside it and no count of what was already selected. A product card never said whether the item was in the cart, and never said how old its stock number was.',
      'None of that is fatal alone. Together it meant every non-trivial step ended the same way — a message to the personal manager. The manager was the only place a partner’s terms actually lived, and the portal was the thing you used before writing to them.',
    ],
    /**
     * Пара «было → стало» — находка `L3-4`, решение владельца 2026-08-28,
     * закрывает вопрос ИА №12. До этого кейс подробно рассказывал, каким был
     * старый портал, и не показывал его: единственный отгруженный
     * коммерческий редизайн в портфолио оставался без доказательства.
     *
     * Показывается один экран, а не десять, и один вопрос: чем открывается
     * рабочее место закупщика. Старый отвечает баннером обучения и промо,
     * новый — тем, что блокирует работу. Остальные девять кадров старого
     * портала не публикуются: там живые артикулы, склады и суммы.
     *
     * Кадр обрезан так, чтобы ретушь не потребовалась вовсе: карточка заказа
     * с номером, кодом ДП и суммой осталась за границей кропа. Обрезать
     * надёжнее, чем замазывать — замазанное можно не заметить.
     */
    comparison: [
      {
        src: `${media}/legacy-dashboard.webp`,
        alt: 'The original portal dashboard: an unlabelled icon rail, a training banner across the top, three action tiles and a promotional bonus block',
        caption:
          'Before. The buyer’s workspace opened with a training banner and a bonus promotion. Interface in Russian, as it shipped; the partner’s own name is masked.',
      },
      {
        src: `${media}/new-dashboard.webp`,
        alt: 'The redesigned dashboard: a procurement workspace opening with a Requires attention table of blocking items ranked by impact and due time',
        caption:
          'After. The same question — what does the workspace open with — answered by what is blocking work, ranked by impact and due time.',
      },
    ],
  },

  reframe: {
    heading: 'The real object of the redesign was the specification, not the catalogue.',
    body: [
      'The brief asked for a modern interface. The unit of work behind it — find a product, add it to a cart — was the shop’s unit, not the buyer’s.',
      'A buyer works in specifications: ten to fifty lines for one project, written in a spreadsheet, passed around by email, corrected by hand. By the time it reaches the portal it already exists. The old flow made the partner key it in again line by line, and the moment a line was ambiguous — a code matching two products, a code the catalogue had superseded, a line whose quantity column could not be read — the only resolution available was a person.',
      'So the object the system has to hold is not the product. It is the line: where it came from, what it originally said, and what it was resolved into. Everything downstream — pricing, warehouse planning, the order, an argument about a delivery six weeks later — needs to be able to point back at it.',
    ],
    statement:
      'Take a specification the partner already has, and carry it to a placed order without losing a single source row.',
  },

  process: {
    heading: 'Before drawing anything, I audited what already existed.',
    body: [
      'The only hard evidence I had was the old product, so that is where I started: ten screens, one cognitive walkthrough each, four questions per step — goal, discoverability, mapping, feedback — and a severity scale that keeps “blocks the flow” apart from “looks untidy”. Where a static screen could not prove something, such as keyboard order or what happens after a click, I recorded it as not confirmed rather than counting it as a defect.',
      'From there: a brief that keeps what is known about the old product separate from what is a target assumption, and never lets the second quietly become the first. Scenario work across the real buying shapes — a five-line reorder, a fifty-line project, a two-hundred-line import. A market pass over sixteen comparable screens, each recorded as adopt, adapt or reject with its reason, so a pattern rejected once does not come back merely because it surfaced in search again.',
      'Then the design system, then twenty screens, then the implementation in React with a component catalogue on top of it. The last step was a synthetic run: an agent walking nine scenarios through the built prototype, thirty-five runs across three rounds, recorded as real test runs with their own events. That step is what found the things the screens were still missing.',
    ],
    /**
     * Живой прототип — решение владельца 2026-08-25. До этого адрес не
     * стоял в кейсе нигде, и абзац выше ссылался на «the built prototype»,
     * которого читателю негде было увидеть.
     *
     * **Носителей стало два, 2026-08-28** — находка `L2-6`, решение
     * владельца. Прежнее обоснование держало ссылку только здесь и
     * запрещало шапку. Оно снято не целиком: из двух его доводов один
     * остаётся в силе, второй к шапке не относился.
     *
     * Довод «рядом с CTA он спорил бы за одну цель» — про главную:
     * `ds/patterns.md` §`FeaturedCaseCover` запрещает две цели фокуса
     * подряд внутри обложки-ссылки. В шапке кейса CTA нет вовсе, и
     * запрет сюда не переносится.
     *
     * Довод «в шапке он обещал бы продукт» остаётся в силе и решается
     * формулировкой, а не отказом от места: значение пары называет
     * природу ссылки прямо — `Live, on synthetic data`. Обещание снято
     * там же, где дано, а не абзацем ниже.
     *
     * Эта ссылка остаётся, потому что делает другую работу: в шапке
     * прототип отвечает на «есть ли что открыть», здесь — на «то самое,
     * через что прошёл агентский прогон». Один адрес, две разные роли;
     * поэтому и `PROTOTYPE` вынесен константой — разойтись они не должны.
     *
     * `external`: маркер ↗ в этом продукте значит ровно «внешняя ссылка».
     */
    prototype: {
      href: PROTOTYPE,
      label: 'Open the prototype',
      note: 'The built prototype, on synthetic data — the same one the agent run walked through.',
    },
    artifacts: [
      {
        src: `${media}/screen-index.webp`,
        alt: 'Index of the twenty screens, grouped by the job each one serves',
        caption:
          'Twenty screens as one index — every route the product has, grouped by the job it serves.',
      },
      {
        src: `${media}/storybook-matrix.webp`,
        alt: 'Component catalogue showing every variant of one component side by side',
        caption:
          'One component, every variant it is allowed to have. The matrix is checked in the catalogue, not on the screen.',
      },
    ],
  },

  failure: {
    heading: 'Six screens were finished before I checked their structure. That order was wrong.',
    body: [
      'The market pass has two jobs — structure before the screens exist, finish after they do. I ran only the second. By the time I compared layouts against comparable products, fourteen screens were built and passing their own audit, so a structural finding on them had nowhere cheap to land. It costs a paragraph in a spec before the screen exists, and a rebuild afterwards.',
      'The agent run then found seven defects on screens I considered done, two of them critical. The catalogue’s facet rail rendered and filtered nothing. Quick order had no paste state at all — the state a user lands in first — because in the design file it existed as a hidden layer and no one had built it. A stack of toasts could grow tall enough to swallow the button underneath it.',
      'Two of those I wrote up wrong the first time. The toast was not mispositioned: four stacked confirmations had grown 560 px upward and the card was still catching clicks. The orders list was not unopenable: its order number was inert while the only working entry point was labelled “Pay invoice”. Fixing either first diagnosis would have fixed nothing.',
    ],
  },

  decisions: {
    heading: 'Four decisions, and what each one cost.',
    items: [
      {
        decision:
          'File import and typed entry are two intakes for one specification. Exactly one screen resolves what a line is.',
        why: 'Two intakes with two resolution mechanics produce two audit trails for the same decision, and a specification is a document people argue about later. The provenance of a line — source file, row number, original text, original quantity — has to survive to the order, or a disputed delivery has nothing to check itself against.',
        cost: 'Quick order lost its own candidate picker. A partner who typed four lines is sent to a different screen to finish two of them, and that hand-off has to be spelled out on the button before they press it.',
        artifact: {
          src: `${media}/candidate-select-crop.webp`,
          zoomSrc: `${media}/candidate-select.webp`,
          alt: 'Two catalogue candidates for one ambiguous imported line before the choice is applied',
          caption: 'Both candidates for one imported line, compared before the choice is applied.',
        },
      },
      {
        decision:
          'Price and availability carry two independent axes: verified, stale or not confirmed — and changed or unchanged.',
        why: 'A price that moved is still a verified price. The first build had a single list of four statuses, which made one component both the source of truth about freshness and the record of a movement. Cart change review reads the movement; the buyer’s trust reads the freshness. One axis could not answer both.',
        cost: 'Two axes on the two most reused components in the product, and a wider column: “not confirmed” prints those words, never a zero and never an empty cell, because a blank in a price column reads as free.',
        artifact: {
          src: `${media}/cart-change-review-crop.webp`,
          zoomSrc: `${media}/cart-change-review.webp`,
          alt: 'One cart line showing a price change, its reason and its source row',
          caption: 'One changed price, with the reason and its source row, before acceptance.',
        },
      },
      {
        decision:
          'An ambiguous line is never resolved on the buyer’s behalf, however confident the match.',
        why: 'Compatibility rules for this equipment are not formalised anywhere I could verify. Automating a check that does not exist moves the risk of an incompatible delivery from the system to the buyer, who finds out on site, with a crew already there.',
        cost: 'The resolution queue is the slowest screen in the product — a median of 17.9 seconds against 0.9 to 2.8 elsewhere in the agent run. That time is the price of the guarantee, and it is paid in full by the person the guarantee protects.',
      },
      {
        decision:
          'Navigation does not advertise screens that do not exist. Price lists and a global document registry left the rail; documents live inside the order that produced them.',
        why: 'Neither had a confirmed source of truth or a route behind it. A rail item that leads nowhere teaches that the rail cannot be trusted, and that lesson is more expensive than the missing item, because it is charged against every other item too.',
        cost: 'The back-office job — find one invoice without knowing its order — has no address of its own. It comes back the day a document registry has a real source.',
        artifact: {
          src: `${media}/nav-rail.webp`,
          alt: 'The navigation rail: four items, each with a screen behind it',
          caption: 'Four items in the rail, and every one of them has a screen behind it.',
        },
      },
    ],
  },

  system: {
    heading: 'Forty-five components, and one row I refused to fork.',
    body: [
      'Twenty-four generic families and twenty-one domain components. The generic half is taken selectively from an open library and only where an approved screen needed it. The domain half — procurement tables, resolution rows, price and availability blocks, shipment groups, fulfillment plans, the order timeline — is the product’s own, because that is where its argument lives.',
      'The most reused element is the product row, and it appears in three places doing two different jobs: choosing, in the catalogue, and reviewing, in the cart. Forking it was the obvious move and the wrong one. It carries a context property instead, and its matrix is deliberately incomplete — a browse row has no disabled state, and a commercial change cannot happen to something you have not added yet. An incomplete matrix with a reason beats a full one that invents states to fill itself.',
      'Coverage is not checked by eye. A script walks the catalogue against the variant matrix, and a smoke run loads every story to catch the ones that compile but do not paint.',
    ],
    /** CASE-10, US-18: состояния в подписи обязательны. */
    grid: [
      {
        src: `${media}/system-product-row-v2.webp`,
        alt: 'Product row in both contexts and all of its states',
        component: 'ProductRow',
        states: 'Cart / Browse × default · attention · disabled · added',
      },
      {
        src: `${media}/system-price-block.webp`,
        alt: 'Price block in three freshness states with and without a change',
        component: 'PriceBlock',
        states: 'verified · stale · not confirmed × unchanged / changed',
      },
      {
        src: `${media}/system-availability.webp`,
        alt: 'Availability block in three freshness states with and without a change',
        component: 'Availability',
        states: 'verified · stale · not confirmed × unchanged / changed',
      },
      {
        src: `${media}/system-resolution-row-v2.webp`,
        alt: 'Resolution row in its four identity states and its separate parse-error state',
        component: 'ResolutionRow',
        states: 'exact · ambiguous · missing · changed + parse error',
      },
      {
        src: `${media}/system-fulfillment-plan.webp`,
        alt: 'Fulfillment plan row, selected and unavailable',
        component: 'FulfillmentPlan',
        states: 'default · selected · unavailable',
      },
      {
        src: `${media}/system-empty-state.webp`,
        alt: 'Empty state in its three variants',
        component: 'EmptyState',
        states: 'no results · nothing yet · could not load',
      },
    ],
  },

  result: {
    heading: 'What got solved, and what it cost.',
    statements: [
      {
        term: 'Solved',
        value:
          'The path from a forty-eight-line file to a placed order runs without a manager reading it first, and every line keeps the row it came from. Three agent runs out of three reached a created order.',
      },
      {
        term: 'Sacrificed',
        value:
          'Speed at the point of ambiguity, and a document registry of its own. Both were traded for guarantees the interface can actually keep.',
      },
      {
        term: 'Why the price was right',
        value:
          'Both cuts protect something the system cannot verify by itself: equipment compatibility, and a document source that does not exist yet. A portal that promised either would break on the first real order, and break the trust of the person who believed it.',
      },
      {
        term: 'What changed in how I work',
        value:
          'I run the structural check before the screens now, not after. Here I did it in the wrong order once, and a finding that would have cost a paragraph cost a rebuild instead.',
      },
    ],
    /** CASE-12. Стоит здесь, не в шапке и не в подвале. */
    nda: 'Numbers from this project are covered by an NDA and are not published, and there is no baseline to publish them against. The three-of-three above is an agent run, not adoption. What I would measure, given one: the share of specification lines that reach an order without a manager touching them, how long an ambiguous line waits before someone resolves it, and how often a delivery argument can be settled by pointing at the source row. The last one is the reason the source row exists at all.',
  },

  /**
   * Переход в конце кейса (`CASE-16`). Надписи и адреса здесь нет: строка
   * сквозная (`site.nextCase`), а следующий кейс считается по реестру
   * `src/copy/cases/index.ts` с замыканием на первый.
   *
   * **Прежний `href: '#contact'` снят 2026-08-28, `L2-3`.** Он был верен для
   * своей задачи — проверен по собранной странице 2026-08-25, узел
   * `id="contact"` на месте, и `mailto:` в трёх соседних кейсах был хуже,
   * потому что уводил мимо блока с тремя другими способами связи. Но сама
   * задача была временной: `CASE-16` отдаёт роль «дальше» контакту только
   * «в версии 1, с появлением второго кейса возвращается Next case без
   * возврата на главную». Кейсов четыре. `ContactBlock` печатает `PageShell`
   * сразу за этим блоком на всех маршрутах (`IA-06`), поэтому связь от
   * правки не теряется — она перестаёт быть единственным, что предлагает
   * конец страницы.
   */
  outro: {
    heading: 'This case probably raised a question.',
    lead: 'Most of it is a compromise, and compromises are worth arguing about.',
  },
};
