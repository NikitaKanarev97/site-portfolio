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
    caseEntry: 'Read the case: B2B Partner Portal',
    cv: 'Download CV (PDF)',
  },

  featured: {
    eyebrow: 'Selected work',
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
    /** Кадр снят с живой сборки прототипа, данные synthetic (D013 проекта b2b-dssl). */
    cover: '/media/case-dssl/resolution-center.webp',
    /** Вертикальный кроп под bp-md: горизонталь на 375 даёт полоску 327×153. */
    coverMobile: '/media/case-dssl/resolution-center-portrait.webp',
    coverAlt:
      'B2B Partner Portal: specification review screen with forty-eight imported lines and their resolution status',
  },

  works: {
    heading: 'Three more projects. Their cases are not written yet.',
    lead: 'Listed with what they were and why they are not open. The first full case is above.',
    items: [
      {
        title: 'Vet Clinic OS',
        type: 'B2B SaaS for veterinary clinics, desktop-first',
        year: '2025',
        role: 'Product Designer',
        description: [
          'Several roles working on one dataset: reception, doctor, manager.',
          'Emergency intake and weight-based dosing — where a wrong number has a price.',
        ],
        reason: "Not open yet: the visual pass isn't finished. It follows DSSL, by the same template.",
      },
      {
        title: 'Pawly',
        type: 'Mobile marketplace for dog walking, iOS / Android',
        year: '2024',
        role: 'Product Designer',
        description: [
          'End-to-end: brief, research, personas, PRD, design system.',
          '33 React components in Storybook.',
        ],
        reason: 'Not open yet: same reason — the visual pass is behind the rest of the work.',
      },
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

  development: {
    heading: 'Webflow development',
    lead: "Sites built in Webflow to someone else's design. Listed for completeness — this is not product work.",
    /** DEV-02: подпись роли стоит у каждой сборки, не одной строкой на секцию. */
    roleLabel: 'Role',
    roleValue: 'Webflow development',
    previewAlt: 'site preview',
    /** Внешний характер ссылки помечен текстом, не только иконкой (ds/patterns.md §DevelopmentCard). */
    liveLabel: 'Live site',
    liveHint: ', opens in a new tab',
    items: [
      { name: 'Common', href: TODO_WEBFLOW.common },
      { name: 'Synk', href: TODO_WEBFLOW.synk },
      { name: 'Scrib3', href: TODO_WEBFLOW.scrib3 },
      { name: 'Bloomblex', href: TODO_WEBFLOW.bloomblex },
    ],
    preview: '/media/placeholder-wide.svg',
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
