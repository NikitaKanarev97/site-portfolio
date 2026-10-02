/**
 * Геометрия диаграмм — Site-portfolio
 *
 * Считает на сборке всё, что Diagram.astro выводит в SVG: рамки узлов,
 * маршруты связей со скруглёнными изломами, кривые прототипа, блоки
 * вайрфреймов. Модуль билдовый, как src/lib/tokens.ts, в браузер не уходит.
 *
 * Размерные константы — в клетках `--diagram-cell`, сама клетка и
 * скругления читаются из токенов. Цвета модуль не знает вовсе: они
 * приходят в SVG классами и переключаются темой в CSS.
 *
 * Ширина подписи оценивается, а не измеряется: шрифт на сборке не
 * загружается. Оценка берёт с запасом и по самой длинной локали, поэтому
 * раскладка у EN и RU одна и та же, а подпись центрирована и запас не виден.
 */
import { px } from './tokens';
import type { DiagramEdge, DiagramNode, GraphDiagram, Label, Point, Side, WireBlock, WireEntry } from '../data/diagrams/schema';

export const CELL = px('diagram-cell');
const CORNER = px('diagram-corner');
/** Поле вокруг данных: ни узел, ни подпись не касаются края схемы. */
export const PAD = px('diagram-pad');
const NODE_SIZE = px('diagram-label-size');
const SMALL_SIZE = px('diagram-note-size');

/* Клетки. Значения — нотация HA (ha-deep-dive.md §4), сведённые к сетке 8. */
const NODE_H = 5;
const NODE_PAD_X = 3;
const DECISION = 16;
const FRAME_W = 24;
const FRAME_H = 42;
const ACTION_ROW = 3;
const GROUP_PAD = 1.5;
const SKEW = 2;
const BADGE = 2;
const PILL_H = 2.25;

/* ------------------------------------------------------------------ */
/* Текст                                                               */
/* ------------------------------------------------------------------ */

/** Оценка ширины строки в px. Коэффициенты — Manrope с запасом. */
export function measure(text: string, size: number): number {
  let em = 0;
  for (const char of text) {
    if (char === ' ') em += 0.28;
    else if (/[А-ЯЁ]/.test(char)) em += 0.72;
    else if (/[а-яё]/.test(char)) em += 0.6;
    else if (/[A-Z]/.test(char)) em += 0.68;
    else if (/[0-9]/.test(char)) em += 0.6;
    else if (/[a-z]/.test(char)) em += 0.55;
    else em += 0.5;
  }
  return em * size;
}

/** Перенос по словам под ширину в px. */
export function wrap(text: string, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, size) > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

const longest = (label: Label | undefined, size: number) =>
  label ? Math.max(measure(label.en, size), measure(label.ru, size)) : 0;

/* ------------------------------------------------------------------ */
/* Узлы                                                                */
/* ------------------------------------------------------------------ */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LaidNode {
  node: DiagramNode;
  /** Рамка самого узла, px. */
  box: Box;
  /** Пунктирная рамка функций, если у узла есть действия. */
  frame?: Box;
  /** Строки-действия: базовая линия текста и подчёркивание. */
  actions: { y: number; x: number; w: number; label: Label; external?: boolean }[];
}

function defaultWidth(node: DiagramNode): number {
  switch (node.type) {
    case 'decision':
      return DECISION;
    case 'frame':
      return FRAME_W;
    case 'start':
      return Math.ceil(longest(node.label, NODE_SIZE) / CELL) + 3;
    case 'input':
      return Math.ceil((longest(node.label, NODE_SIZE) + 2 * NODE_PAD_X * CELL) / CELL) + SKEW;
    default:
      return Math.ceil((longest(node.label, NODE_SIZE) + 2 * NODE_PAD_X * CELL) / CELL);
  }
}

function defaultHeight(node: DiagramNode): number {
  if (node.type === 'decision') return DECISION;
  if (node.type === 'frame') return FRAME_H;
  return NODE_H;
}

export function layoutNode(node: DiagramNode): LaidNode {
  const box: Box = {
    x: node.at[0] * CELL,
    y: node.at[1] * CELL,
    w: (node.w ?? defaultWidth(node)) * CELL,
    h: (node.h ?? defaultHeight(node)) * CELL,
  };

  if (!node.actions?.length) return { node, box, actions: [] };

  const pad = GROUP_PAD * CELL;
  const rowsW = Math.max(box.w, ...node.actions.map((a) => longest(a.label, SMALL_SIZE) + 3 * CELL));
  const actions = node.actions.map((action, index) => ({
    x: box.x,
    w: rowsW,
    y: box.y + box.h + CELL + (index + 1) * ACTION_ROW * CELL,
    label: action.label,
    external: action.external,
  }));
  const bottom = actions[actions.length - 1].y + pad;

  return {
    node,
    box,
    actions,
    frame: { x: box.x - pad, y: box.y - pad, w: rowsW + 2 * pad, h: bottom - box.y + pad },
  };
}

/** Номер экрана: квадрат в правом верхнем углу, наполовину над узлом. */
export function badgeBox(box: Box, num: number): Box {
  const size = BADGE * CELL;
  // Двузначный номер не помещается в квадрат: плашка растёт вбок на полклетки.
  const w = String(num).length > 1 ? size + CELL / 2 : size;
  return { x: box.x + box.w - w - CELL / 2, y: box.y - size / 2, w, h: size };
}

/** Ромб в рамке узла. */
export function diamond({ x, y, w, h }: Box): string {
  return `M${x + w / 2},${y} L${x + w},${y + h / 2} L${x + w / 2},${y + h} L${x},${y + h / 2} Z`;
}

/** Параллелограмм ввода: скос вправо на SKEW клеток. */
export function parallelogram({ x, y, w, h }: Box): string {
  const s = SKEW * CELL;
  return `M${x + s},${y} L${x + w},${y} L${x + w - s},${y + h} L${x},${y + h} Z`;
}

/** Строки подписи ромба: мелкий кегль, перенос под ширину ромба. */
export function decisionLines(box: Box, text: string): string[] {
  return wrap(text, SMALL_SIZE, box.w * 0.58);
}

/* ------------------------------------------------------------------ */
/* Связи                                                               */
/* ------------------------------------------------------------------ */

type Vec = [number, number];

const horizontal = (side: Side) => side === 'l' || side === 'r';

const OUTWARD: Record<Side, Vec> = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] };

/** Точка стороны. У узла с рамкой функций связь касается рамки, а не плашки. */
function port(laid: LaidNode, side: Side): Vec {
  const { box, frame } = laid;
  const outer = frame ?? box;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  if (laid.node.type === 'start') {
    // Связь уходит от черты-ограничителя, а не от края текста.
    return side === 'r' ? [box.x + box.w, cy] : [box.x, cy];
  }
  switch (side) {
    case 'l':
      return [outer.x, cy];
    case 'r':
      return [outer.x + outer.w, cy];
    case 't':
      return [cx, outer.y];
    case 'b':
      return [cx, outer.y + outer.h];
  }
}

/** Стороны по взаимному положению рамок. */
function sides(a: Box, b: Box): [Side, Side] {
  if (b.x >= a.x + a.w) return ['r', 'l'];
  if (b.x + b.w <= a.x) return ['l', 'r'];
  if (b.y >= a.y + a.h) return ['b', 't'];
  return ['t', 'b'];
}

/** Ортогональная ломаная от выхода ко входу. */
function route(start: Vec, end: Vec, exit: Side, enter: Side, edge: DiagramEdge): Vec[] {
  if (edge.via?.length) {
    const points: Vec[] = [start];
    let horiz = horizontal(exit);
    for (const target of [...edge.via.map(([x, y]) => [x * CELL, y * CELL] as Vec), end]) {
      const last = points[points.length - 1];
      if (last[0] !== target[0] && last[1] !== target[1]) {
        points.push(horiz ? [target[0], last[1]] : [last[0], target[1]]);
        horiz = !horiz;
      }
      points.push(target);
      horiz = points[points.length - 1][1] === points[points.length - 2][1];
    }
    return points;
  }

  const [sx, sy] = start;
  const [ex, ey] = end;
  if (horizontal(exit) && horizontal(enter)) {
    if (sy === ey) return [start, end];
    const mx = edge.bend !== undefined ? edge.bend * CELL : (sx + ex) / 2;
    return [start, [mx, sy], [mx, ey], end];
  }
  if (!horizontal(exit) && !horizontal(enter)) {
    if (sx === ex) return [start, end];
    const my = edge.bend !== undefined ? edge.bend * CELL : (sy + ey) / 2;
    return [start, [sx, my], [ex, my], end];
  }
  return horizontal(exit) ? [start, [ex, sy], end] : [start, [sx, ey], end];
}

/** Убирает повторы и точки посреди прямого отрезка. */
function simplify(points: Vec[]): Vec[] {
  const out: Vec[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && last[0] === p[0] && last[1] === p[1]) continue;
    const prev = out[out.length - 2];
    if (prev && last && ((prev[0] === last[0] && last[0] === p[0]) || (prev[1] === last[1] && last[1] === p[1]))) {
      out[out.length - 1] = p;
      continue;
    }
    out.push(p);
  }
  return out;
}

/** Ломаная со скруглением каждого излома на `--diagram-corner`. */
function rounded(points: Vec[]): string {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [px0, py0] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(cx - px0, cy - py0);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(CORNER, inLen / 2, outLen / 2);
    const a: Vec = [cx + ((px0 - cx) / inLen) * r, cy + ((py0 - cy) / inLen) * r];
    const b: Vec = [cx + ((nx - cx) / outLen) * r, cy + ((ny - cy) / outLen) * r];
    d += ` L${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

/** Открытый наконечник в точке `tip`, смотрит по направлению `dir`. */
function arrowHead(tip: Vec, dir: Vec): string {
  const len = 6;
  const half = 4;
  const [dx, dy] = dir;
  const bx = tip[0] - dx * len;
  const by = tip[1] - dy * len;
  return `M${bx - dy * half},${by + dx * half} L${tip[0]},${tip[1]} L${bx + dy * half},${by - dx * half}`;
}

export interface LaidEdge {
  edge: DiagramEdge;
  d: string;
  head?: string;
  pill?: { x: number; y: number; w: number; h: number; answer: 'yes' | 'no' };
  hotspot?: Vec;
}

const PILL_TEXT: Record<'yes' | 'no', Label> = {
  yes: { en: 'yes', ru: 'да' },
  no: { en: 'no', ru: 'нет' },
};
export const pillText = PILL_TEXT;

export function layoutEdge(edge: DiagramEdge, nodes: Map<string, LaidNode>, kind: GraphDiagram['kind']): LaidEdge {
  const source = nodes.get(edge.from)!;
  const target = edge.to ? nodes.get(edge.to) : undefined;
  const wantsArrow = edge.arrow ?? kind !== 'map';

  if (kind === 'prototype') return protoEdge(edge, source, target, wantsArrow);

  const [autoExit, autoEnter] = sides(source.frame ?? source.box, target!.frame ?? target!.box);
  const exit = edge.exit ?? autoExit;
  const enter = edge.enter ?? autoEnter;
  const start = port(source, exit);
  const portEnd = port(target!, enter);
  const inward: Vec = [-OUTWARD[enter][0], -OUTWARD[enter][1]];
  // Наконечник не врезается в узел: линия кончается за полклетки до него.
  const gap = wantsArrow ? CELL / 2 : 0;
  const end: Vec = [portEnd[0] - inward[0] * gap, portEnd[1] - inward[1] * gap];

  const points = simplify(route(start, end, exit, enter, edge));
  const laid: LaidEdge = { edge, d: rounded(points) };
  if (wantsArrow) laid.head = arrowHead(end, inward);

  if (edge.answer) {
    const [a, b] = points;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const dir: Vec = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const w = Math.max(measure(PILL_TEXT[edge.answer].en, SMALL_SIZE), measure(PILL_TEXT[edge.answer].ru, SMALL_SIZE)) + 2 * CELL;
    const h = PILL_H * CELL;
    // Таблетка встаёт вплотную к вершине ромба: зазор между ними читался
    // бы обрубком линии.
    const along = Math.abs(dir[0]) ? w / 2 : h / 2;
    const offset = Math.min(along, len / 2);
    laid.pill = { x: a[0] + dir[0] * offset - w / 2, y: a[1] + dir[1] * offset - h / 2, w, h, answer: edge.answer };
  }
  return laid;
}

/** Связь прототипа: кривая из точки нажатия к стороне экрана-цели. */
function protoEdge(edge: DiagramEdge, source: LaidNode, target: LaidNode | undefined, wantsArrow: boolean): LaidEdge {
  const hs = edge.hotspot ?? [source.node.w ?? FRAME_W, 4];
  const start: Vec = [source.box.x + hs[0] * CELL, source.box.y + hs[1] * CELL];
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  let end: Vec;
  let axis: 'h' | 'v';
  let dir: Vec;
  if (target) {
    const t = target.box;
    const src = source.box;
    const inset = 3 * CELL;
    // Сторону входа решает взаимное положение рамок, а не точки нажатия:
    // иначе экран под экраном получает прямую вертикаль вместо кривой.
    if (t.x >= src.x + src.w || t.x + t.w <= src.x) {
      const fromLeft = t.x >= src.x + src.w;
      end = [fromLeft ? t.x - CELL / 2 : t.x + t.w + CELL / 2, clamp(start[1], t.y + inset, t.y + t.h - inset)];
      axis = 'h';
      dir = [fromLeft ? 1 : -1, 0];
    } else {
      const fromTop = t.y >= src.y + src.h;
      // Вход сверху — в правую четверть рамки: название экрана стоит слева
      // над рамкой, и кривая в центр шла бы через него.
      let x = t.x + t.w * 0.75;
      // Хотспот почти над точкой входа — связь выпрямляется: S-кривая
      // с размахом в пару клеток читается кривой линией, а не решением.
      if (Math.abs(x - start[0]) < 3 * CELL && start[0] >= t.x + inset && start[0] <= t.x + t.w - inset) x = start[0];
      end = [x, fromTop ? t.y - CELL / 2 : t.y + t.h + CELL / 2];
      axis = 'v';
      dir = [0, fromTop ? 1 : -1];
    }
  } else {
    const p = edge.toPoint ?? [0, 0];
    end = [p[0] * CELL, p[1] * CELL];
    axis = Math.abs(end[0] - start[0]) >= Math.abs(end[1] - start[1]) ? 'h' : 'v';
    dir = axis === 'h' ? [Math.sign(end[0] - start[0]) || 1, 0] : [0, Math.sign(end[1] - start[1]) || 1];
  }

  const span = axis === 'h' ? Math.abs(end[0] - start[0]) : Math.abs(end[1] - start[1]);
  const k = Math.max(span / 2, 6 * CELL);
  const c1: Vec = axis === 'h' ? [start[0] + dir[0] * k, start[1]] : [start[0], start[1] + dir[1] * k];
  const c2: Vec = axis === 'h' ? [end[0] - dir[0] * k, end[1]] : [end[0], end[1] - dir[1] * k];

  return {
    edge,
    d: `M${start[0]},${start[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${end[0]},${end[1]}`,
    head: wantsArrow && target ? arrowHead(end, dir) : undefined,
    hotspot: start,
  };
}

/* ------------------------------------------------------------------ */
/* Вайрфрейм                                                           */
/* ------------------------------------------------------------------ */

export interface WireShape {
  kind: 'fill' | 'stroke' | 'line' | 'strong';
  x: number;
  y: number;
  w: number;
  h: number;
}

const WIRE_HEIGHT: Record<WireBlock, number> = {
  bar: 5,
  title: 3,
  text: 2,
  row: 4,
  card: 9,
  button: 4,
  field: 5,
  image: 11,
  tabs: 4,
  tabbar: 5,
  gap: 1,
};

/** Блоки вайрфрейма столбиком сверху вниз; `tabbar` прижат к низу рамки. */
export function wireframe(box: Box, entries: WireEntry[] = []): WireShape[] {
  const blocks: WireBlock[] = entries.flatMap((entry) => {
    const [name, count] = entry.split('*') as [WireBlock, string | undefined];
    return Array.from({ length: count ? Number(count) : 1 }, () => name);
  });

  const pad = 1.5 * CELL;
  const innerX = box.x + pad;
  const innerW = box.w - 2 * pad;
  const shapes: WireShape[] = [];
  let y = box.y;

  for (const block of blocks) {
    const h = WIRE_HEIGHT[block] * CELL;
    if (block === 'tabbar') {
      const top = box.y + box.h - h;
      shapes.push({ kind: 'line', x: box.x, y: top, w: box.w, h: 0 });
      for (let i = 0; i < 5; i += 1) {
        const slot = box.w / 5;
        shapes.push({ kind: 'fill', x: box.x + slot * i + slot / 2 - CELL / 2, y: top + 1.5 * CELL, w: CELL, h: CELL });
      }
      continue;
    }
    if (y === box.y && block !== 'bar') y += pad;

    switch (block) {
      case 'bar':
        shapes.push({ kind: 'fill', x: box.x, y, w: box.w, h });
        break;
      case 'title':
        shapes.push({ kind: 'strong', x: innerX, y: y + 0.5 * CELL, w: innerW * 0.6, h: 1.5 * CELL });
        break;
      case 'text':
        shapes.push({ kind: 'fill', x: innerX, y: y + 0.5 * CELL, w: innerW * 0.85, h: CELL / 2 + 1 });
        break;
      case 'row':
        shapes.push({ kind: 'fill', x: innerX, y: y + 1.5 * CELL, w: innerW * 0.45, h: CELL / 2 + 1 });
        shapes.push({ kind: 'fill', x: innerX + innerW * 0.75, y: y + 1.5 * CELL, w: innerW * 0.25, h: CELL / 2 + 1 });
        shapes.push({ kind: 'line', x: innerX, y: y + h, w: innerW, h: 0 });
        break;
      case 'card':
        shapes.push({ kind: 'stroke', x: innerX, y, w: innerW, h });
        shapes.push({ kind: 'strong', x: innerX + CELL, y: y + 1.5 * CELL, w: innerW * 0.5, h: CELL });
        shapes.push({ kind: 'fill', x: innerX + CELL, y: y + 4 * CELL, w: innerW * 0.7, h: CELL / 2 + 1 });
        shapes.push({ kind: 'fill', x: innerX + CELL, y: y + 5.5 * CELL, w: innerW * 0.55, h: CELL / 2 + 1 });
        break;
      case 'button':
        shapes.push({ kind: 'strong', x: innerX, y, w: innerW, h });
        break;
      case 'field':
        shapes.push({ kind: 'fill', x: innerX, y, w: innerW * 0.3, h: CELL / 2 + 1 });
        shapes.push({ kind: 'stroke', x: innerX, y: y + CELL, w: innerW, h: h - CELL });
        break;
      case 'image':
        shapes.push({ kind: 'fill', x: innerX, y, w: innerW, h });
        break;
      case 'tabs':
        shapes.push({ kind: 'stroke', x: innerX, y, w: innerW / 2, h });
        shapes.push({ kind: 'fill', x: innerX + innerW / 2, y, w: innerW / 2, h });
        break;
      case 'gap':
        break;
    }
    y += h + CELL;
  }
  return shapes;
}

/* ------------------------------------------------------------------ */
/* Сборка                                                              */
/* ------------------------------------------------------------------ */

export function layout(diagram: GraphDiagram) {
  const nodes = new Map(diagram.nodes.map((node) => [node.id, layoutNode(node)]));
  const edges = diagram.edges.map((edge) => layoutEdge(edge, nodes, diagram.kind));
  return {
    width: diagram.size.w * CELL + 2 * PAD,
    height: diagram.size.h * CELL + 2 * PAD,
    nodes: [...nodes.values()],
    edges,
  };
}

export type { Point };
