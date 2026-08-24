/**
 * Карточки превью для соцсетей — Site-portfolio
 *
 * Спека содержимого, не картинка: рендер стоит в src/pages/og/[card].png.ts
 * и собирается на билде. Здесь только текст, и он берётся из тех же файлов
 * src/copy, что и сами страницы — иначе заголовок кейса на карточке и
 * заголовок кейса на странице разойдутся при первой же правке.
 *
 * TECH-04 требует свой og:image каждому маршруту, TECH-05 — чтобы на
 * карточке кейса стояло его название. Скриншот интерфейса в этой роли не
 * годится: в ленте он читается как случайная картинка, а на превью нужен
 * ответ «что это». Поэтому карточка типографская — три уровня, ничего
 * больше: род страницы, её название, подпись автора.
 *
 * Формат PNG, не WebP: LinkedIn и часть корпоративных клиентов WebP в
 * og:image не разворачивают. 1200×630 — размер, который все три сети
 * (LinkedIn, X, Telegram) кропают одинаково.
 */
import { site, TODO_NAME } from './site.ts';
import { home } from './home.ts';
import { about } from './about.ts';
import { cases } from './cases/index.ts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  /** Идентификатор маршрута /og/<id>.png. */
  id: string;
  /** Род страницы. Моноширинный, капсом — роль ds-meta-xs. */
  eyebrow: string;
  /** Название. Display-ступень, до трёх строк. */
  title: string;
  /** Подпись автора. На главной вместо неё идёт специализация. */
  footnote: string;
}

/** Подпись автора, общая для всех карточек, кроме главной. */
const BYLINE = `${TODO_NAME} — Product Designer`;

export const OG_CARDS: readonly OgCard[] = [
  {
    id: 'default',
    eyebrow: 'Portfolio',
    title: TODO_NAME,
    footnote: `${home.hero.role} · ${site.footer.location}, open to relocation`,
  },
  {
    id: 'about',
    eyebrow: 'About',
    title: about.intro.heading,
    footnote: BYLINE,
  },
  ...cases.map((entry) => ({
    id: `work-${entry.slug}`,
    eyebrow: 'Case',
    title: entry.header.title,
    footnote: BYLINE,
  })),
];

export function ogCard(id: string): OgCard {
  const card = OG_CARDS.find((candidate) => candidate.id === id);
  if (!card) throw new Error(`OG card "${id}" не объявлена в src/copy/og.ts`);
  return card;
}

/** Путь картинки маршрута. Служебные страницы берут карточку default. */
export function ogImage(id: string): string {
  return `/og/${ogCard(id).id}.png`;
}

/**
 * Текстовая альтернатива og:image. Карточка типографская, значит её
 * альтернатива — ровно то, что на ней написано, а не описание вида.
 */
export function ogImageAlt(id: string): string {
  const card = ogCard(id);
  return `${card.eyebrow}: ${card.title}. ${card.footnote}`;
}
