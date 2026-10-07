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
import { NAME_RU } from './ru/site.ts';
import { homeRu } from './ru/home.ts';
import { aboutRu } from './ru/about.ts';
import { casesRu } from './ru/cases/index.ts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  /** Идентификатор маршрута /og/<id>.png. */
  id: string;
  /** Род страницы. Пропорциональный Onest, капсом — роль ds-meta-xs. */
  eyebrow: string;
  /** Название. Display-ступень, до трёх строк. */
  title: string;
  /**
   * Вторая строка названия цветом ссылки — только у главной: карточка
   * повторяет первый экран сайта, «Complex systems. / Clear decisions.»
   * (06.10.2026; до этого на главной стояло одно имя, и в ленте карточка
   * не отвечала, чем человек занимается).
   */
  accent?: string;
  /** Подпись автора. На главной вместо неё идёт специализация. */
  footnote: string;
}

/** Подпись автора, общая для всех карточек, кроме главной. */
const BYLINE = `${NAME} — Product Designer`;
const BYLINE_RU = `${NAME_RU} — продуктовый дизайнер`;

export const OG_CARDS: readonly OgCard[] = [
  {
    id: 'default',
    eyebrow: `${NAME} · ${home.hero.role}`,
    title: home.hero.headline[0],
    accent: home.hero.headline[1],
    footnote: `B2B product design · ${site.footer.location}, open to relocation`,
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
    title: entry.story.cover.title,
    footnote: BYLINE,
  })),
  {
    id: 'default-ru',
    eyebrow: `${NAME_RU} · ${homeRu.hero.role}`,
    title: homeRu.hero.headline[0],
    accent: homeRu.hero.headline[1],
    footnote: 'Продуктовый дизайн B2B-систем',
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
    title: entry.story.cover.title,
    footnote: BYLINE_RU,
  })),
];

export function ogCard(id: string): OgCard {
  const card = OG_CARDS.find((candidate) => candidate.id === id);
  if (!card) throw new Error(`OG card "${id}" не объявлена в src/copy/og.ts`);
  return card;
}

/**
 * Обложки кейсов для LinkedIn Featured (25.09.2026; Onest 07.10.2026).
 *
 * Featured показывает og:image карточкой 237–364 px, и типографская
 * карточка с одним названием там неотличима от соседней. Для трёх кейсов
 * рендер сохраняет документальную половину прежнего PNG без изменения
 * пикселей; внешние заголовок, описание и статус собирает в Onest.
 * Новые -onest URL обходят immutable-кэш прежних карточек. Старые PNG
 * остаются исходниками изображения, метаданные на них больше не ссылаются.
 */
export const OG_FEATURES: Record<string, { title: string; description: string; status?: string }> = {
  'work-agent-ops-console': {
    title: 'Agent Ops Console',
    description: 'Oversight for a team running an AI support agent',
    status: 'Paid client · accepted',
  },
  'work-partner-portal': {
    title: 'B2B Partner Portal',
    description: 'Ordering on a legacy backend at DSSL',
    status: 'Shipped',
  },
  'work-vet-clinic': {
    title: 'Vet Clinic OS',
    description: 'Records that fit a 30-second gap between patients',
  },
};

/** Путь картинки маршрута. Служебные страницы берут карточку default. */
export function ogImage(id: string): string {
  return `/og/${ogCard(id).id}-onest.png`;
}

/**
 * Текстовая альтернатива og:image. Карточка типографская, значит её
 * альтернатива — ровно то, что на ней написано, а не описание вида.
 */
export function ogImageAlt(id: string): string {
  const card = ogCard(id);
  const feature = OG_FEATURES[card.id];
  if (feature) return `${feature.title} — ${feature.description}.${feature.status ? ` ${feature.status}.` : ''}`;
  return `${card.eyebrow}: ${card.title}${card.accent ? ` ${card.accent}` : ''}. ${card.footnote}`;
}
