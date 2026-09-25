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
import { site, NAME } from './site.ts';
import { home } from './home.ts';
import { about } from './about.ts';
import { cases } from './cases/index.ts';
import { siteRu, NAME_RU } from './ru/site.ts';
import { homeRu } from './ru/home.ts';
import { aboutRu } from './ru/about.ts';
import { casesRu } from './ru/cases/index.ts';

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
const BYLINE = `${NAME} — Product Designer`;
const BYLINE_RU = `${NAME_RU} — продуктовый дизайнер`;

export const OG_CARDS: readonly OgCard[] = [
  {
    id: 'default',
    eyebrow: 'Portfolio',
    title: NAME,
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
  {
    id: 'default-ru',
    eyebrow: 'Портфолио',
    title: NAME_RU,
    footnote: `${homeRu.hero.role} · ${siteRu.footer.location}`,
  },
  {
    id: 'about-ru',
    eyebrow: 'Обо мне',
    title: aboutRu.intro.heading,
    footnote: BYLINE_RU,
  },
  ...casesRu.map((entry) => ({
    id: `work-${entry.slug}-ru`,
    eyebrow: 'Кейс',
    title: entry.header.title,
    footnote: BYLINE_RU,
  })),
];

export function ogCard(id: string): OgCard {
  const card = OG_CARDS.find((candidate) => candidate.id === id);
  if (!card) throw new Error(`OG card "${id}" не объявлена в src/copy/og.ts`);
  return card;
}

/**
 * Обложки кейсов для LinkedIn Featured (25.09.2026).
 *
 * Featured показывает og:image карточкой 237–364 px, и типографская
 * карточка с одним названием там неотличима от соседней. Для трёх кейсов,
 * которые стоят в профиле, превью — готовая обложка с экраном продукта
 * (исходник — D:\Freelance\linkedin\coversuild\covers.html).
 * Отдельный путь, а не замена /og/*.png: те отдаются с immutable-кэшем,
 * и LinkedIn держал бы старую картинку. Подпись — текст самой обложки.
 */
const CASE_COVERS: Record<string, string> = {
  'work-agent-ops-console': 'Agent Ops Console — oversight for a team running an AI support agent. Paid client, accepted.',
  'work-partner-portal': 'B2B Partner Portal — ordering on a legacy backend at DSSL. Shipped.',
  'work-vet-clinic': 'Vet Clinic OS — records that fit a 30-second gap between patients. Concept.',
};

/** Путь картинки маршрута. Служебные страницы берут карточку default. */
export function ogImage(id: string): string {
  const cardId = ogCard(id).id;
  if (cardId in CASE_COVERS) return `/media/linkedin/og/${cardId}.png`;
  return `/og/${cardId}.png`;
}

/**
 * Текстовая альтернатива og:image. Карточка типографская, значит её
 * альтернатива — ровно то, что на ней написано, а не описание вида.
 */
export function ogImageAlt(id: string): string {
  const card = ogCard(id);
  if (card.id in CASE_COVERS) return CASE_COVERS[card.id];
  return `${card.eyebrow}: ${card.title}. ${card.footnote}`;
}
