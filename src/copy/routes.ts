/**
 * Реестр маршрутов и локалей — Site-portfolio
 *
 * Один источник правды для трёх потребителей, которые обязаны сходиться:
 * `hreflang` в BaseLayout, `sitemap.xml` и `robots.txt`. Разойдутся —
 * поисковик получит взаимно противоречивые указания, и чинится это уже
 * после индексации, то есть дорого.
 *
 * Каркас под две локали закладывается в MVP (TECH-13, ia/screens-inventory.md
 * №38). Закрывает вопрос №6 из ia/open-questions.md, решение владельца от
 * 24.08.2026: **механизм на все маршруты, материализована одна страница**.
 * Локале-осведомлённый путь, эмиттер hreflang и alternates в sitemap
 * написаны сразу под четыре маршрута; физически существует только `/ru/`.
 * Добавление `/ru/about` — строка `locales` в этом файле плюс один файл
 * страницы; вёрстка, мета и sitemap не трогаются.
 *
 * Маршрут `/kit` — витрина компонентов, не страница продукта: в sitemap
 * не входит и отдаёт noindex собственным пропом, независимо от превью-режима.
 */
import { cases } from './cases/index.ts';

/** Локали продукта. Порядок значим: первая — основная. */
export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Префикс маршрута. Основная локаль идёт без префикса. */
const LOCALE_PREFIX: Record<Locale, string> = { en: '', ru: '/ru' };

/** Значение атрибута hreflang. Регион не указываем: язык, не рынок. */
const LOCALE_HREFLANG: Record<Locale, string> = { en: 'en', ru: 'ru' };

/**
 * Флаг публикации RU-локали.
 *
 * `false` — `/ru/` собирается, отвечает и несёт hreflang, но отдаёт
 * `noindex` собственным пропом и в `sitemap.xml` не попадает: рекламировать
 * поиску непереведённую заглушку нельзя. `true` снимает noindex и добавляет
 * RU-строки в sitemap вместе с `xhtml:link` alternates.
 *
 * Переключается ОДНОВРЕМЕННО с появлением RU-контента, не раньше. Если к
 * боевому запуску (PLAYBOOK §5 Чат 10, снятие PREVIEW_NOINDEX) перевода
 * всё ещё нет — либо флаг остаётся false и `/ru/` живёт под noindex, либо
 * маршрут снимается со сборки. Индексируемая заглушка — третий вариант,
 * и он неверный.
 */
export const RU_PUBLISHED = false;

export interface RouteDef {
  /** Путь БЕЗ префикса локали, всегда с ведущим слешем. */
  path: string;
  /** Локали, в которых маршрут существует физически. */
  locales: readonly Locale[];
  /** Входит в sitemap.xml. Служебные и витрина — нет. */
  sitemap: boolean;
  /** Приоритет для sitemap. Относительный вес внутри одного сайта. */
  priority?: number;
}

/**
 * Маршруты продукта. Кейсы разворачиваются из реестра src/copy/cases:
 * US-20 требует, чтобы новый кейс был новым файлом, а не правкой в шести
 * местах — sitemap и hreflang не исключение.
 */
export const ROUTES: readonly RouteDef[] = [
  { path: '/', locales: ['en', 'ru'], sitemap: true, priority: 1.0 },
  { path: '/about', locales: ['en'], sitemap: true, priority: 0.8 },
  ...cases.map((entry) => ({
    path: `/work/${entry.slug}`,
    locales: ['en'] as const,
    sitemap: true,
    priority: 0.9,
  })),
];

/**
 * Форма URL. `build.format: 'directory'` отдаёт каталоги, значит
 * канонический вид — с завершающим слешем. Корень уже с ним.
 * Совпадение canonical и self-referencing hreflang обязательно:
 * расхождение в один символ обнуляет обе аннотации.
 */
export function canonicalPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : `${trimmed}/`;
}

/** Путь без завершающего слеша — форма для сравнения, не для вывода. */
function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Путь маршрута в конкретной локали, в каноническом виде. */
export function localizedPath(route: RouteDef, locale: Locale): string {
  return canonicalPath(`${LOCALE_PREFIX[locale]}${route.path}`);
}

/**
 * Разбор входящего pathname обратно в маршрут и локаль.
 * Возвращает undefined для служебных страниц: 404, 500 и /kit в реестре
 * не стоят, alternates им не положены.
 */
export function resolveRoute(
  pathname: string,
): { route: RouteDef; locale: Locale } | undefined {
  const path = normalize(pathname);

  for (const locale of LOCALES) {
    const prefix = LOCALE_PREFIX[locale];
    if (prefix && !(path === prefix || path.startsWith(`${prefix}/`))) continue;

    const bare = prefix ? normalize(path.slice(prefix.length)) : path;
    const route = ROUTES.find((candidate) => normalize(candidate.path) === bare);
    if (route && route.locales.includes(locale)) return { route, locale };
  }

  return undefined;
}

export interface Alternate {
  hreflang: string;
  path: string;
}

/**
 * Аннотации hreflang для страницы. Пустой массив — когда у маршрута одна
 * локаль: hreflang на самого себя без пары смысла не несёт и только шумит.
 *
 * Набор взаимный по определению — все локали маршрута, включая текущую
 * (self-referencing обязателен по спецификации). `x-default` уводит на
 * основную локаль: она же язык по умолчанию продукта.
 */
export function alternatesFor(pathname: string): Alternate[] {
  const resolved = resolveRoute(pathname);
  if (!resolved || resolved.route.locales.length < 2) return [];

  const alternates: Alternate[] = resolved.route.locales.map((locale) => ({
    hreflang: LOCALE_HREFLANG[locale],
    path: localizedPath(resolved.route, locale),
  }));

  alternates.push({
    hreflang: 'x-default',
    path: localizedPath(resolved.route, DEFAULT_LOCALE),
  });

  return alternates;
}

export interface SitemapEntry {
  path: string;
  priority: number;
  alternates: Alternate[];
}

/**
 * Строки sitemap.xml. RU появляется здесь только вместе с RU_PUBLISHED —
 * и тогда же у EN-строк появляются xhtml:link alternates. До этого момента
 * карта сайта описывает ровно то, что реально переведено.
 */
export function sitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const route of ROUTES) {
    if (!route.sitemap) continue;

    const published = route.locales.filter(
      (locale) => locale === DEFAULT_LOCALE || RU_PUBLISHED,
    );
    const alternates: Alternate[] =
      published.length < 2
        ? []
        : [
            ...published.map((locale) => ({
              hreflang: LOCALE_HREFLANG[locale],
              path: localizedPath(route, locale),
            })),
            { hreflang: 'x-default', path: localizedPath(route, DEFAULT_LOCALE) },
          ];

    for (const locale of published) {
      entries.push({
        path: localizedPath(route, locale),
        priority: route.priority ?? 0.5,
        alternates,
      });
    }
  }

  return entries;
}
