import { cases } from './cases/index.ts';
import { featuredWork } from './featured-work.ts';
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
      "Product designer for B2B systems: AI oversight, procurement and shared workflows. Based in Armenia, available remotely.",
  },

  hero: {
    name: NAME,
    role: 'Product Designer',
    headline: ['Complex systems.', 'Clear decisions.'],
    specialization:
      "I design B2B tools for decisions that need context: AI oversight, procurement and workflows shared by several roles.",
    /**
     * Дословно из ia/authorization-copy.md. Не переписывать в отрыве от файла.
     *
     * Порядок фактов перевёрнут 28.08.2026, решение владельца: доступен
     * удалённо сейчас → готов переехать со спонсорством. Прежняя редакция
     * начиналась со спонсорства, то есть первым сообщением первого экрана
     * шло то, что нанять сложно. Факты те же и все на месте; 66 знаков
     * против лимита в две строки на 360 px.
     */
    authorization:
      'Armenia · remote now, open to relocation with visa sponsorship.',
    /**
     * С 2026-08-25 открытых кейсов больше одного, и прежняя строка «Read the case:
     * B2B Partner Portal» называла один из них. Ведёт якорем в секцию
     * Selected work: выбор между двумя делает читатель, а не шапка.
     */
    portrait: {
      src: '/media/about/portrait.webp',
      alt: 'Nikita Kanarev in a taupe knit sweater against a light background',
      headline: ['Research.', 'Design.', 'Build.'],
      link: 'About me and my approach',
      href: '/about',
    },
    caseEntry: 'Read the cases',
    cv: 'Download CV (PDF)',
  },

  /**
   * Открытые кейсы. С добавлением Learn их пять, и секция остаётся списком:
   * разметка index.astro повторяет паттерн FeaturedCaseCover по числу
   * записей, новых компонентов не заводится (ds/screens/case-vet.md §Что
   * этот экран меняет на главной).
   *
   * **Порядок переставлен 2026-08-27, решение владельца.** Было DSSL → Vet
   * Clinic OS → Pawly, стало Agent Ops Console → DSSL → Vet Clinic OS →
   * Pawly. Правило «новые кейсы добавляются ниже уже открытых» отменено:
   * порядок идёт по убыванию доказательной силы, а не по дате открытия.
   * Agent Ops единственный из четырёх прошёл полный цикл на живом заказе —
   * платный клиент, живые интервью, юзер-тест прототипа и приёмка
   * заказчиком; DSSL — коммерческий редизайн без пользовательской проверки
   * в этой редакции; Vet Clinic OS — концепт с одним живым врачом; Pawly —
   * концепт целиком. Обоснование целиком — ds/screens/case-agent-ops.md
   * §Что этот экран меняет на главной.
   *
   * Порядок обязан совпадать с реестром src/copy/cases/index.ts: оттуда
   * разворачиваются sitemap, hreflang и OG-карточки.
   * 2026-09-09 владелец поставил Learn третьим, после Partner Portal:
   * рабочий проект, переосмысленный для портфолио, перед двумя концептами.
   */
  featured: {
    eyebrow: 'Selected work',
    expandLabel: 'Show {count} more cases',
    collapseLabel: 'Show fewer cases',
    items: featuredWork(cases, 'en'),
  },

  /*
   * Секция закрытых кейсов (`works`, паттерн WorksList) снята 2026-08-27,
   * решение владельца. Vet Clinic OS и Pawly ушли из неё 2026-08-25, когда
   * открылись их кейсы; последней записью оставался RUUN — «case is not
   * written yet». Кейс по RUUN не пишется: проект убран из портфолио
   * решением владельца, и с уходом единственной записи секция теряет
   * предмет. Вместе с ней сняты заголовок, подводка и разметка секции в
   * index.astro. Пустая секция ради компонента не заводится (`TECH-15`):
   * `WorkRow` остаётся в каталоге и в `/kit`, но носителей на страницах
   * продукта у него больше нет.
   *
   * Восстанавливается из истории вместе с разметкой, если кейс RUUN
   * когда-нибудь будет написан.
   */

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
    /**
     * Заголовок и подводка переписаны 2026-08-28, находка `L1-1`. Было:
     * «Webflow sites» + «Listed for completeness — this is presentation work,
     * not product work». Вторая строка осталась от редакции, где дизайн
     * приписывался заказчику; роль подняли до «Design and Webflow build»
     * решением владельца 2026-08-25, а подводка продолжала говорить читателю
     * не засчитывать блок. Четыре сборки доказывают адаптив, движение,
     * Client-First и кастомный код — то, что в вакансиях идёт отдельным
     * требованием, и добровольно списывать это в примечание нельзя.
     *
     * CMS в подводке не заявляется: коллекции есть только у Bloomlex, и это
     * сказано в его карточке. Общее утверждение про CMS было бы неверным на
     * трёх сборках из четырёх.
     */
    heading: 'Selected web builds',
    lead: 'Four marketing sites, designed and built end to end in Webflow — the second side of my practice: visual design carried through to a working responsive build.',
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
    body: "I start with the decision and the constraints around it. Then I connect roles, states and actions in a prototype, test it, and carry the decisions into a working build.",
    link: 'More about how I work',
    href: '/about',
  },
};
