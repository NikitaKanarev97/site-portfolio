/**
 * Тексты главной — Site-portfolio, маршрут /
 *
 * Слой контента, отделённый от композиции. Источник — ia/wireframes/home.md
 * и ia/wireframes/mobile-home.md: формулировки взяты оттуда дословно, а не
 * пересказом. Мобильная версия использует те же строки — вайрфрейм требует
 * этого прямо: если фраза не читается на 360 в четыре строки, она слишком
 * длинная и для десктопа тоже, и правится в обоих местах сразу.
 *
 * Строка права на работу — из ia/authorization-copy.md, решение владельца
 * №1 от 24.08.2026. Единственная строка сайта с жёстким лимитом по числу
 * строк: максимум две на 360 px.
 *
 * v1.0 выходит на английском. Сквозные строки — в site.ts.
 *
 * Без `as const`: массивы уходят пропами в WorkRow и MetaList, а readonly
 * не присваивается изменяемому типу. Точечно менять сигнатуры компонентов
 * ради формы файла текстов не стоит.
 */
import { NAME } from './site.ts';

/**
 * Не подтверждено владельцем: URL взяты из PROJECT.md §Референсы, где те же
 * четыре сборки перечислены как reference pool. Бриф называет их своими и
 * живыми (outputs/brief.md §6), но списка ссылок в артефактах нет.
 */
const TODO_WEBFLOW = {
  common: 'https://common---digital-design-studio.webflow.io/',
  synk: 'https://synk-battle-prod.webflow.io/',
  scrib3: 'https://scrib3-prod.webflow.io/',
  bloomblex: 'https://bloomblex-prod.webflow.io/',
};

export const home = {
  meta: {
    title: `${NAME} — Product Designer`,
    description:
      'Product designer working on B2B products where the hard part is the constraint, not the canvas. Based in Kazakhstan, open to relocation.',
  },

  hero: {
    name: NAME,
    role: 'Product Designer',
    specialization:
      'I design B2B products where the hard part is the constraint, not the canvas — legacy systems, several roles on one dataset, decisions with a real price.',
    /** Дословно из ia/authorization-copy.md. Не переписывать в отрыве от файла. */
    authorization:
      'Kazakhstan · open to relocation with visa sponsorship, remote until then.',
    /**
     * С 2026-08-25 открытых кейсов больше одного, и прежняя строка «Read the case:
     * B2B Partner Portal» называла один из них. Ведёт якорем в секцию
     * Selected work: выбор между двумя делает читатель, а не шапка.
     */
    caseEntry: 'Read the cases',
    cv: 'Download CV (PDF)',
  },

  /**
   * Открытые кейсы. С 2026-08-25 их три, и секция стала списком: разметка
   * index.astro повторяет паттерн FeaturedCaseCover по числу записей, новых
   * компонентов не заводится (ds/screens/case-vet.md §Что этот экран меняет
   * на главной).
   *
   * Порядок — решение владельца 2026-08-25: DSSL первым, затем Vet Clinic
   * OS, затем Pawly. Новые кейсы добавляются ниже уже открытых.
   */
  featured: {
    eyebrow: 'Selected work',
    items: [
      {
        href: '/work/partner-portal',
        title: 'B2B Partner Portal — DSSL',
        outcome:
          'Partners order without a manager — on top of a legacy system that could not be replaced.',
        /** Одна строка вайрфрейма, разобранная на пары: MetaList требует ключей. */
        meta: [
          { term: 'Product', value: 'Distributor partner portal, redesign' },
          { term: 'Year', value: '2024–2026' },
          { term: 'Role', value: 'Product Designer' },
          { term: 'Platform', value: 'Web, desktop-first' },
        ],
        cta: 'Read the case',
        /**
         * Обложка-стопка: три кадра живой сборки прототипа, данные synthetic
         * (D013 проекта b2b-dssl). Порядок — от переднего к дальнему. Тот же
         * набор стоит на CaseCover: обложка кейса на главной и на самой
         * странице кейса — один объект, а не два разных снимка.
         */
        cover: [
          '/media/case-dssl/cover/resolution-center.webp',
          '/media/case-dssl/cover/fulfillment.webp',
          '/media/case-dssl/cover/dashboard.webp',
        ],
        coverAlt:
          'B2B Partner Portal: specification review screen with forty-eight imported lines and their resolution status, with two more screens of the portal behind it',
      },
      {
        href: '/work/vet-clinic',
        title: 'Vet Clinic OS',
        outcome:
          'A visit leaves a trace in thirty seconds — the only window a veterinarian actually has.',
        meta: [
          { term: 'Product', value: 'Clinic operations SaaS: schedule, record, invoicing' },
          { term: 'Year', value: '2026' },
          { term: 'Role', value: 'Product Designer' },
          { term: 'Platform', value: 'Web, desktop and tablet' },
        ],
        cta: 'Read the case',
        /** Тот же набор, что на CaseCover кейса. Данные на кадрах выдуманы. */
        cover: [
          '/media/case-vet/cover/vet-day-queue.webp',
          '/media/case-vet/cover/patient-card.webp',
          '/media/case-vet/cover/schedule.webp',
        ],
        coverAlt:
          'Vet Clinic OS: the veterinarian’s queue for the day with three visits still unfinished, with the patient card and the schedule behind it',
      },
      {
        href: '/work/pawly',
        title: 'Pawly',
        outcome:
          'Trust is evidence, not a badge — from verification to the moment the pet is home.',
        meta: [
          { term: 'Product', value: 'Dog walking and pet sitting marketplace' },
          { term: 'Year', value: '2026' },
          { term: 'Role', value: 'Lead Product Designer' },
          { term: 'Platform', value: 'Mobile, iOS first and Android next' },
        ],
        cta: 'Read the case',
        /** Тот же набор, что на CaseCover кейса. Данные на кадрах выдуманы. */
        cover: [
          '/media/case-pawly/cover/screen-gallery.webp',
          '/media/case-pawly/cover/owner-home.webp',
          '/media/case-pawly/cover/handover-photo-review.webp',
        ],
        coverAlt:
          'Pawly product screen index: the owner home, a walker profile, the pet address check and the safety profile, with the active owner screen and the drop-off proof behind it',
      },
    ],
  },

  /**
   * Список закрытых кейсов. Vet Clinic OS и Pawly ушли отсюда 2026-08-25:
   * их кейсы открыты и стоят выше обложками. Заголовок и подводка правятся
   * вместе с составом — множественное число при одной записи было бы
   * враньём в первом же слове секции.
   */
  works: {
    heading: 'One more project. Its case is not written yet.',
    lead: 'Listed with what it was and why it is not open. The full cases are above.',
    items: [
      {
        title: 'RUUN',
        type: 'DTC e-commerce, handmade brand, product configurator',
        year: '2023',
        role: 'Product Designer',
        description: [
          'Brand, commerce and product customization in one scope.',
          'Built around a strategic constraint the client could not remove.',
        ],
        reason:
          'Not open yet: the case needs a careful telling of that constraint, and that takes longer than a visual pass.',
      },
    ],
  },

  /**
   * Webflow-сборки. Роль поменялась 2026-08-25 решением владельца: дизайн
   * на всех четырёх был его, а не заказчика. Прежняя строка секции — «to
   * someone else's design» — снята, `roleValue` стал «Design and Webflow
   * build». Отстройка `DEV-02` при этом остаётся: подпись роли по-прежнему
   * стоит у каждой сборки, просто теперь она называет полный цикл.
   *
   * Часы на сайте не показываются. На бирже те же сборки подписаны в часах
   * (64 на каждую), но «96 working hours» — язык биржи фриланса, и на
   * портфолио под найм он работает против product-first позиционирования.
   *
   * Описания сняты с живых сборок, а не переписаны с биржевых карточек.
   * Карточка Synk обещает «CMS setup», а в проде коллекций нет; CMS есть
   * только у Bloomlex — пятнадцать узлов и отдельная страница статьи.
   * Проверено 2026-08-25, `scripts/shoot-webflow-frames.mjs` ходит по тем
   * же адресам.
   *
   * Имя `Bloomlex` — то, что стоит в логотипе на самом сайте. Ключ и адрес
   * остались `bloomblex`: это домен, а не название.
   *
   * Года у сборок нет намеренно (решение владельца 2026-08-25). Даты на
   * бирже — даты публикации карточки, а не работы, и выдавать одно за
   * другое на портфолио нельзя.
   */
  development: {
    heading: 'Webflow sites',
    lead: 'Four marketing sites, designed and built end to end in Webflow. Listed for completeness — this is presentation work, not product work.',
    /** DEV-02: подпись роли стоит у каждой сборки, не одной строкой на секцию. */
    roleLabel: 'Role',
    roleValue: 'Design and Webflow build',
    /**
     * Одно слово, не «Built with»: в stacked-раскладке MetaList термин и
     * значение стоят в строку, и на 375 px двусловный термин переносился
     * сам в себе — «BUILT / WITH» двумя строками против одной строки
     * значения рядом.
     */
    builtLabel: 'Stack',
    /**
     * Надпись на карточке. Не «Live site» и без стрелки: карточка открывает
     * разбор, а не уводит на сайт, а стрелка ↗ в этом продукте значит ровно
     * «внешняя ссылка». Живая ссылка стоит внутри диалога.
     */
    openLabel: 'Details',
    /** Скрытая часть надписи: имя сборки в названии кнопки, а не одно «Details» на четыре. */
    openHint: 'about',
    liveLabel: 'Live site',
    closeLabel: 'Close',
    items: [
      {
        slug: 'common',
        name: 'Common',
        href: TODO_WEBFLOW.common,
        summary:
          'One-page site for a design studio that sells research and strategy, not decoration.',
        body: 'The whole page is a single argument in order: what we do, who we are, how we work, what came out of it. Motion carries the order — sections hand off to each other on scroll instead of stacking up.',
        stack: 'Webflow · GSAP · Client-First · custom code',
        preview: '/media/development/common.webp',
        previewAlt:
          'Common — studio home page: the headline “A digital design studio driven by research & strategy” above a row of service labels and two project frames',
      },
      {
        slug: 'synk',
        name: 'Synk',
        href: TODO_WEBFLOW.synk,
        summary:
          'Catalog and pre-order flow for a studio selling postmodern furniture and lamps.',
        body: 'The object does the talking, so the layout gets out of its way: one piece per screen, its provenance in the caption underneath. Orders are captured before the collection ships — a pre-order form, not a checkout.',
        stack: 'Webflow · GSAP · Client-First · pre-order form',
        preview: '/media/development/synk.webp',
        previewAlt:
          'Synk — catalog home page: the wordmark with a green cactus lamp standing inside it, the piece named in the caption below, a running line under that',
      },
      {
        slug: 'scrib3',
        name: 'Scrib3',
        href: TODO_WEBFLOW.scrib3,
        summary:
          'Presentation site for a crypto-native marketing studio working with web3 builders.',
        body: 'Loud by brief: display type at full width, marquees, outlined and filled headlines inside one line. The work was keeping it loud and still readable at every width — services, work, team and careers all live on one scroll.',
        stack: 'Webflow · GSAP · Client-First · custom code',
        preview: '/media/development/scrib3.webp',
        previewAlt:
          'Scrib3 — home page of the marketing studio: the headline “Web3 marketing for web3 builders” set in outlined and filled display type on black',
      },
      {
        slug: 'bloomlex',
        name: 'Bloomlex',
        href: TODO_WEBFLOW.bloomblex,
        summary:
          'Marketing site for a service that generates claims, complaints and lawsuits without a lawyer.',
        body: 'Every block on the page answers one doubt: can a document made in five minutes hold up. What it generates, who it already worked for, what people ask before they trust it — and a CMS blog that keeps answering after launch.',
        stack: 'Webflow · GSAP · CMS · Client-First · forms',
        preview: '/media/development/bloomlex.webp',
        previewAlt:
          'Bloomlex — home page: the headline “Legal made simple 5 minutes, no lawyers” beside a rendered flower, with a start-for-free action under it',
      },
    ],
  },

  about: {
    heading: 'How I work',
    /**
     * Черновик. Вайрфрейм задаёт содержание абзаца — переформулировка задачи
     * до решения, работа в чужих ограничениях, ИИ в собственном процессе, —
     * но готовой формулировки не даёт. Ревьюится вместе с /about.
     */
    body: 'I start by reframing the task, because the question a team brings is rarely the one worth answering. Then I work inside whatever cannot be changed — the legacy system, the roles, the deadline — and treat those limits as the material rather than the obstacle. AI sits inside that process, not next to it.',
    link: 'More about how I work',
    href: '/about',
  },
};
