/**
 * Ordered case modules — frozen Common A contract, 04.10.2026.
 *
 * Contract: ds/story-contract.md. Shared renderer: CaseStory.astro.
 * Published work/[slug] keeps its explicit legacy composition until each
 * full EN/RU story is accepted by the coordinator.
 *
 * Бюджеты текста (harmony-checklist.md §3, правила 8–10): тезис до 60
 * знаков, абзац до 35 слов, подпись одной строкой до 12 слов, кейс
 * целиком до редакционного бюджета, без минимума. Проверяет harmony на собранной
 * странице, а не здесь.
 */
import type { Diagram } from '../../data/diagrams/schema';

export type CaseTheme = 'agent' | 'portal' | 'learn' | 'vet' | 'pawly';
export type PlateTone = 'light' | 'dark';

/**
 * Цвет кейса и тон текста поверх него. Цвет живёт только на обложке и в
 * переходе к следующему кейсу (ds/screens/case.md §5). Контраст тона
 * проверен там же, §4.
 */
export const caseThemes: Record<CaseTheme, { surface: string; tone: PlateTone }> = {
  agent: { surface: 'var(--surface-cover-agent)', tone: 'dark' },
  portal: { surface: 'var(--surface-cover-portal)', tone: 'light' },
  learn: { surface: 'var(--surface-cover-learn)', tone: 'dark' },
  vet: { surface: 'var(--surface-cover-vet)', tone: 'light' },
  pawly: { surface: 'var(--surface-cover-pawly)', tone: 'light' },
};

/** Один экран кадра. Десктоп 1440×900 @2x, телефон 390×844 @3x (§6). */
export interface ShotItem {
  src: string;
  alt: string;
  device: 'desktop' | 'phone' | 'panel';
  /** Реальная узкая панель прототипа, а не уменьшенный десктоп. */
  srcNarrow?: string;
  altNarrow?: string;
  /** Клип взаимодействия: адрес без расширения, `src` — постер. */
  video?: string;
  /** Manual native film; requires video, preserves the poster and static states. */
  film?: boolean;
  /** Actual specimen capture width in CSS pixels; prevents enlarging a tiny control. */
  nativeWidth?: number;
  /** A self-contained product panel needs no second coloured container. */
  field?: 'plain';
}

export interface Shot {
  /** desktop — один экран; pair — десктоп и телефон одного экрана; phones — 2–3 телефона. */
  layout: 'desktop' | 'pair' | 'phones';
  items: ShotItem[];
  caption: string;
}

export interface Callout {
  src: string;
  alt: string;
  srcNarrow?: string;
  altNarrow?: string;
  /** Source observation coordinates; each numbered explanation renders once beside the image. */
  marks: { x: number; y: number; text: string }[];
  caption: string;
}

export interface Artifact {
  data: Diagram;
  caption: string;
  source?: { kind: 'original' | 'reconstruction' | 'editorial'; ref: string };
}

export interface Thesis {
  label: string;
  thesis: string;
  body?: string;
}

export type CoverMedia =
  | { variant: 'proof'; eyebrow: string; caption: string; shot: ShotItem; panels?: ShotItem[]; layout?: 'interlock' | 'procurement'; gate?: string;
      workflow?: { sourceLabel: string; reviewLabel: string; resultLabel: string; source: string; request: string; quantity: string; total: string; exceptions: string; decision: string } }
  | {
      variant: 'video';
      /** Адрес ролика без расширения. Нет ролика — читаемый постер. */
      video?: string;
      poster: string;
      /** Постер без ролика под ширину: mid — bp-md…bp-xl, narrow — ниже bp-md. */
      posterMid?: string;
      posterNarrow?: string;
      alt: string;
    }
  | { variant: 'screen'; layout: 'screen' | 'screen-detail' | 'phones'; items: ShotItem[] };

/** Historical /kit fixture only. Published entry uses the explicit legacy route. */
export interface LegacyKitStory {
  theme: CaseTheme;
  /** dark — только у тёмного продукта, одинаковая во всех кадрах (правило 12). */
  plate: PlateTone;
  /** 01 */
  cover: { title: string; outcome: string; media: CoverMedia };
  facts: { term: string; value: string; href?: string }[];
  /** 02 */
  challenge?: Thesis & { numbers?: { value: string; caption: string }[] };
  /** Метод и ограничения оценки; показывать сразу под числами, без count. */
  estimateNote?: string;
  /** 03 */
  system?: Thesis & { diagrams: Artifact[] };
  /** 04 */
  before?: Thesis & { issue: Callout; after?: Shot };
  /** 05 */
  process?: Thesis & { slides: ({ shot: ShotItem } | { diagram: Diagram })[]; captions: string[] };
  /** 06 */
  steps?: { label: string; variant?: 'focus'; composition?: 'checkpoint'; gate?: string; items: (Thesis & { shot: ShotItem; layout?: 'wide' | 'split'; caption?: string; desktopOnly?: boolean; scene?: 'overview' | 'workspace' | 'promise' | 'decision' })[] };
  /** 07 */
  moments?: Thesis & { shot: Shot };
  /** 08 */
  details?: Thesis & { callout?: Callout; library?: Artifact };
  /** 09 */
  result?: Thesis & {
    cards: { value: string; caption: string }[];
    quote?: { text: string; who: string };
    cost?: { label: string; text: string };
  };
  /** Scope и цена решения: MetaList statements, без вымышленных метрик. */
  closing?: { term: string; value: string }[];
  /** 10 — следующий кейс берётся из реестра, здесь только прототип. */
  prototype?: { label: string; href: string };
}

export interface Steps {
  label: string;
  composition?: 'checkpoint';
  gate?: string;
  items: (Thesis & { shot: ShotItem; layout?: 'wide' | 'split'; caption?: string; desktopOnly?: boolean; scene?: 'overview' | 'workspace' | 'promise' | 'decision' })[];
}

/** The product's own values are documentary data, never portfolio tokens. */
export interface Specimen {
  title: string;
  fontFamily: string;
  type: import('../../data/diagrams/schema').TypeRow[];
  colors: import('../../data/diagrams/schema').ColorGroup[];
  groups: { id: string; title: string }[];
  sets: {
    id: string;
    title: string;
    group: string;
    wide?: boolean;
    states: { id: string; label: string; mediaId: string; shot: ShotItem }[];
  }[];
  caption: string;
}

export interface Outcome {
  result: Thesis;
  evidence: { label: string; text: string };
  tradeoff: { label: string; text: string };
  nextEvidence?: { label: string; text: string };
  cards?: { value: string; caption: string }[];
  quote?: { text: string; who: string };
}

interface BlockBase { id: string; evidenceId?: string; mediaId?: string }
type Block<T extends string, P, M extends string = 'reveal'> = BlockBase & {
  type: T; payload: P; motion?: M | 'static';
};

/** Ordered, discriminated modules. No section numbers, raw selectors or GSAP vars in data. */
export type CaseBlock =
  | Block<'thesis', Thesis>
  | Block<'numbers', { thesis: Thesis; items: { value: string; caption: string }[]; note?: string }, 'count'>
  | Block<'artifact', { thesis?: Thesis; artifact: Artifact & { source: NonNullable<Artifact['source']> } }, 'draw'>
  | Block<'comparison', { thesis: Thesis; issue: Callout; after?: Shot }>
  | Block<'process', { thesis: Thesis; slides: ({ shot: ShotItem } | { diagram: Diagram })[]; captions: string[] }>
  | Block<'steps', Steps, 'focus' | 'pin-swap'>
  | Block<'shot', { thesis?: Thesis; shot: Shot }>
  | Block<'detail', { thesis: Thesis; callout: Callout }>
  | Block<'specimen', { thesis?: Thesis; specimen: Specimen }>
  | (Block<'outcome', Outcome, 'count'> & { evidenceId: string });

export interface CaseStory {
  theme: CaseTheme;
  plate: PlateTone;
  cover: { title: string; outcome: string; media: CoverMedia };
  facts: { term: string; value: string; href?: string }[];
  blocks: CaseBlock[];
  prototype?: { label: string; href: string };
}

const modes: Record<CaseBlock['type'], readonly string[]> = {
  thesis: ['reveal'], numbers: ['count'], artifact: ['draw'], comparison: ['reveal'],
  process: ['reveal'], steps: ['focus', 'pin-swap'], shot: ['reveal'], detail: ['reveal'],
  specimen: ['reveal'], outcome: ['count'],
};

export function assertShotMedia(shot: ShotItem): void {
  if (shot.film !== undefined && typeof shot.film !== 'boolean') throw new Error('Shot film must be boolean');
  if (shot.film && !shot.video) throw new Error('Shot film requires video');
}

function* storyShots(story: CaseStory): Generator<ShotItem> {
  const media = story.cover.media;
  if (media.variant === 'proof') { yield media.shot; yield* media.panels ?? []; }
  if (media.variant === 'screen') yield* media.items;
  for (const block of story.blocks) {
    if (block.type === 'shot') yield* block.payload.shot.items;
    if (block.type === 'comparison') yield* block.payload.after?.items ?? [];
    if (block.type === 'steps') for (const item of block.payload.items) yield item.shot;
    if (block.type === 'process') for (const slide of block.payload.slides) if ('shot' in slide) yield slide.shot;
    if (block.type === 'specimen') for (const set of block.payload.specimen.sets) for (const state of set.states) yield state.shot;
  }
}

/** Build-time guard, also for data assembled from object spreads or JS. */
export function defineStory<const T extends CaseStory>(story: T): T {
  for (const shot of storyShots(story)) assertShotMedia(shot);
  const ids = new Set<string>();
  for (const block of story.blocks) {
    if (!/^[a-z][a-z0-9-]*$/.test(block.id) || ids.has(block.id)) throw new Error(`Invalid/duplicate story ID: ${block.id}`);
    ids.add(block.id);
    if (!modes[block.type] || (block.motion && block.motion !== 'static' && !modes[block.type].includes(block.motion))) {
      throw new Error(`Unsupported story motion: ${block.id}`);
    }
    if (block.type === 'outcome' && (!block.evidenceId || !block.payload.evidence.text || !block.payload.tradeoff.text)) {
      throw new Error(`Outcome needs evidence and tradeoff: ${block.id}`);
    }
    if (block.type === 'specimen') {
      const groupIds = new Set(block.payload.specimen.groups.map(group => group.id));
      if (!groupIds.size || groupIds.size !== block.payload.specimen.groups.length) throw new Error(`Invalid specimen groups: ${block.id}`);
      const setIds = new Set<string>();
      for (const set of block.payload.specimen.sets) {
        if (setIds.has(set.id) || !set.states.length || !groupIds.has(set.group)) throw new Error(`Invalid specimen set: ${set.id}`);
        setIds.add(set.id);
        const stateIds = new Set<string>();
        for (const state of set.states) {
          if (stateIds.has(state.id) || !state.mediaId) throw new Error(`Invalid specimen state: ${state.id}`);
          stateIds.add(state.id);
        }
      }
    }
  }
  return story;
}

/** Locales keep the same structure, evidence/media identities and motion semantics. */
export function assertStoryPair(en: CaseStory, ru: CaseStory): void {
  const signature = (story: CaseStory) => JSON.stringify({ theme: story.theme, plate: story.plate,
    films: [...storyShots(story)].map(shot => Boolean(shot.film)),
    blocks: story.blocks.map(b => ({ id: b.id, type: b.type, evidenceId: b.evidenceId, mediaId: b.mediaId, motion: b.motion,
      groups: b.type === 'specimen' ? b.payload.specimen.groups.map(g => g.id) : undefined,
      sets: b.type === 'specimen' ? b.payload.specimen.sets.map(s => ({ id: s.id, group:s.group, wide:s.wide, states: s.states.map(v => ({ id: v.id, mediaId: v.mediaId })) })) : undefined,
    })),
  });
  if (signature(en) !== signature(ru)) throw new Error('EN/RU story structure diverged');
}
