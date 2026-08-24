/**
 * Сквозные строки продукта — Site-portfolio
 *
 * Слой контента, отделённый от композиции (решение владельца 2026-08-24).
 * Причина: три решения владельца по копирайтингу ещё не приняты
 * (ia/open-questions.md), а каркас RU-локали входит в MVP (TECH-13).
 * Переписывание текстов и добавление /ru/ не должны трогать вёрстку.
 *
 * Здесь только то, что стоит на ВСЕХ маршрутах: навигация, ContactBlock,
 * Footer. Строки отдельных экранов — в соседних файлах этой папки.
 *
 * Папка src/copy, а не src/content: src/content Astro отдаёт под коллекции
 * контента, туда пойдёт текст кейсов (src/content/cases) под шаблон
 * /work/<slug>. Строки страниц коллекцией не являются.
 *
 * v1.0 выходит на английском (ia/wireframes/*.md §Placeholder-контент).
 * Умолчания интерфейсных подписей в компонентах — тоже английские
 * (исправлено 24.08.2026 по находке живого прогона: страница отдаёт
 * lang="en", а «Скопировать email» и «Меню» стояли в скрининговом
 * пакете и в шапке). Русские строки вернутся пропами на маршрутах /ru/,
 * не умолчаниями.
 */

/** Не подтверждено владельцем: в артефактах проекта имя не зафиксировано. */
export const TODO_NAME = '[Имя Фамилия]';
/** Не подтверждено владельцем: email в артефактах отсутствует. */
export const TODO_EMAIL = 'hello@example.com';
/** Не подтверждено владельцем: URL LinkedIn в артефактах отсутствует. */
export const TODO_LINKEDIN = 'https://www.linkedin.com/in/example';

export const site = {
  brand: TODO_NAME,
  /** Три пункта, не четыре: Development появляется вместе с /development в v1.1. */
  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ],
  contact: {
    /** ia/wireframes/home.md §ContactBlock */
    heading: "Let's talk",
    lead: 'If the case above answered your question — or raised one.',
    email: TODO_EMAIL,
    links: [
      { label: 'LinkedIn', href: TODO_LINKEDIN, external: true },
      { label: 'CV (PDF)', href: '/cv.pdf', external: false },
    ],
  },
  footer: {
    /** Факт, решение владельца №1 от 24.08.2026. PRD SCR-03 расходится — см. ia/open-questions.md №9. */
    location: 'Kazakhstan',
    utcLabel: 'UTC+5',
    timeZone: 'Asia/Almaty',
    timeLabel: 'local time',
    copyright: '© 2026',
  },
} as const;

/**
 * Preview-режим деплоя (PLAYBOOK-site-portfolio.md §5 Чат 3).
 *
 * Пока true — каждая страница отдаёт <meta name="robots" content="noindex, nofollow">,
 * а /robots.txt закрывает сайт целиком. Снимается в боевом деплое (Чат 10)
 * одним коммитом вместе с доменом в astro.config.mjs: канонические URL и
 * индексация должны включиться в один момент, иначе поисковик увидит
 * example.com.
 */
export const PREVIEW_NOINDEX = true;
