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

/**
 * Личные данные владельца. Подтверждены им 24.08.2026 — до этого стояли
 * заглушками `TODO_*`. В артефактах проекта их нет, источник только
 * владелец, поэтому правка идёт здесь и нигде больше.
 *
 * EMAIL — отдельный рабочий адрес для найма, не адрес личного аккаунта.
 * Он же стоит в шапке CV: cv/build.mjs §CONTACTS. Правятся оба места.
 */
export const NAME = 'Nikita Kanarev';
export const EMAIL = 'nikita.kanarev.dev@outlook.com';
export const LINKEDIN = 'https://www.linkedin.com/in/nikita-kanarev/';

export interface SiteCopy {
  brand: string;
  accessibility: { skipToContent: string; noscript: string };
  navigation: {
    label: string;
    trigger: string;
    close: string;
    languageLabel: string;
  };
  nav: readonly { label: string; href: string }[];
  contact: {
    heading: string;
    lead: string;
    email: string;
    links: readonly { label: string; href: string; external: boolean }[];
    copyLabel?: string;
    copyHint?: string;
    copiedLabel?: string;
    announce?: string;
    fallbackAnnounce?: string;
  };
  /**
   * Надпись перехода к следующему кейсу в конце страницы кейса.
   * Строка сквозная, адрес — нет: следующий кейс считается по реестру
   * src/copy/cases/index.ts, а не пишется в тексте кейса (US-20).
   */
  nextCase: string;
  zoom: { label: string; open: string; close: string };
  footer: {
    location: string;
    utcLabel: string;
    timeZone: string;
    timeLabel: string;
    copyright: string;
  };
}

export const site = {
  brand: NAME,
  accessibility: {
    skipToContent: 'Skip to content',
    noscript:
      'This site works without JavaScript: every piece of text and every link is available. The script only drives motion.',
  },
  navigation: {
    label: 'Main navigation',
    trigger: 'Menu',
    close: 'Close menu',
    languageLabel: 'Language',
  },
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
    email: EMAIL,
    links: [
      { label: 'LinkedIn', href: LINKEDIN, external: true },
      { label: 'CV (PDF)', href: '/cv.pdf', external: false },
    ],
  },
  nextCase: 'Next case',
  /**
   * Строки увеличения кадра (MediaZoom). Подпись кнопки-источника читает
   * только скринридер: видимая подсказка на кадре закрывала бы сам кадр,
   * а курсор zoom-in говорит то же самое зрячему пользователю.
   */
  zoom: {
    label: 'Enlarged screenshot',
    open: 'Open full size',
    close: 'Close',
  },
  footer: {
    /** Факт, решение владельца №1 от 24.08.2026. PRD SCR-03 расходится — см. ia/open-questions.md №9. */
    location: 'Kazakhstan',
    utcLabel: 'UTC+5',
    timeZone: 'Asia/Almaty',
    timeLabel: 'local time',
    copyright: '© 2026',
  },
} as const satisfies SiteCopy;

/**
 * Preview-режим деплоя (PLAYBOOK-site-portfolio.md §5 Чат 3).
 *
 * Пока true — каждая страница отдаёт <meta name="robots" content="noindex, nofollow">,
 * а /robots.txt закрывает сайт целиком. Снимается в боевом деплое (Чат 10)
 * одним коммитом вместе с доменом в astro.config.mjs: канонические URL и
 * индексация должны включиться в один момент. Домен kanarev.com подключён,
 * поэтому публичные EN/RU-маршруты открыты для индексации.
 */
export const PREVIEW_NOINDEX = false;
