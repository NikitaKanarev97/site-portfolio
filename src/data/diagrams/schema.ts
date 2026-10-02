/**
 * Схема данных диаграмм — ds/patterns.md §Диаграммы, src/data/diagrams/README.md
 *
 * Данные — TS, а не JSON: опечатку в id узла и неизвестный тип элемента
 * ловит `astro check`, а подписи EN/RU лежат рядом с геометрией.
 *
 * Все координаты и размеры — в клетках `--diagram-cell` (8 px). Пикселей
 * в данных нет ни одного: клетку задаёт токен, данные — только раскладку.
 *
 * Единственное место, где в данных разрешены hex и кегли, — лист
 * библиотеки: это палитра и шрифтовая шкала чужого продукта, а не токены
 * нашей ДС.
 */

/** Подпись в двух локалях. Геометрия у локалей одна. */
export interface Label {
  en: string;
  ru: string;
}

/** Точка в клетках поля. */
export type Point = readonly [x: number, y: number];

/** Сторона узла, откуда выходит или куда входит связь. */
export type Side = 'l' | 'r' | 't' | 'b';

/* ------------------------------------------------------------------ */
/* Узлы                                                                */
/* ------------------------------------------------------------------ */

export type NodeType =
  | 'screen' /*   экран: белая плашка без обводки */
  | 'entry' /*    точка входа: плашка с обводкой */
  | 'decision' /* ромб с вопросом */
  | 'input' /*    параллелограмм ввода */
  | 'flowLink' /* переход в другой флоу: ссылка, а не шаг */
  | 'start' /*    текст запуска и черта-ограничитель */
  | 'group' /*    пунктирная рамка вокруг набора узлов */
  | 'frame'; /*   экран прототипа с вайрфреймом */

/** Строка-действие под экраном карты: функция или внешняя ссылка. */
export interface Action {
  label: Label;
  external?: boolean;
}

/**
 * Блок вайрфрейма. Блоки стоят столбиком сверху вниз во всю ширину
 * рамки, `tabbar` прижат к низу. Запись `'row*3'` — три строки подряд.
 */
export type WireBlock =
  | 'bar'
  | 'title'
  | 'text'
  | 'row'
  | 'card'
  | 'button'
  | 'field'
  | 'image'
  | 'tabs'
  | 'tabbar'
  | 'gap';
export type WireEntry = WireBlock | `${WireBlock}*${number}`;

export interface DiagramNode {
  id: string;
  type: NodeType;
  /** Левый верхний угол. */
  at: Point;
  /** Ширина; по умолчанию — из длины самой длинной локали подписи. */
  w?: number;
  /** Высота; по умолчанию у каждого типа своя. */
  h?: number;
  label?: Label;
  /** Номер экрана — связывает карту с прототипом и кадрами кейса. */
  num?: number;
  /** Строки-действия под экраном; узел получает пунктирную рамку. */
  actions?: Action[];
  /** Бледный общий префикс флоу. */
  dim?: boolean;
  /** Вайрфрейм экрана прототипа. */
  wire?: WireEntry[];
}

/* ------------------------------------------------------------------ */
/* Связи                                                               */
/* ------------------------------------------------------------------ */

export interface DiagramEdge {
  from: string;
  /** Цель. Без неё связь прототипа уходит в `toPoint` — за край поля. */
  to?: string;
  toPoint?: Point;
  /** Стороны выхода и входа; по умолчанию — из взаимного положения. */
  exit?: Side;
  enter?: Side;
  /** Точки излома. Без них — маршрут L или Z. */
  via?: Point[];
  /** Координата ствола Z-маршрута: x для горизонтальной связи, y для вертикальной. */
  bend?: number;
  /** Таблетка ответа на линии сразу за ромбом. */
  answer?: 'yes' | 'no';
  /** Наконечник. У флоу и прототипа по умолчанию есть, у карты нет. */
  arrow?: boolean;
  dim?: boolean;
  /** Прототип: точка нажатия в клетках относительно рамки-источника. */
  hotspot?: Point;
}

/* ------------------------------------------------------------------ */
/* Диаграмма                                                           */
/* ------------------------------------------------------------------ */

interface DiagramBase {
  /** Имя схемы: aria-label и подпись области прокрутки. */
  title: Label;
  /** Расшифровка для скринридера: одна-две фразы о том, что на схеме. */
  summary: Label;
}

export interface GraphDiagram extends DiagramBase {
  kind: 'map' | 'flow' | 'prototype';
  /** Поле в клетках. Всё, что за ним, обрезается — так связи уходят за край. */
  size: { w: number; h: number };
  /** Шапка флоу: «User flow» + название сценария серым. */
  heading?: { lead: Label; name: Label };
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/* Лист библиотеки ---------------------------------------------------- */

export interface TypeRow {
  style: string;
  usage: Label;
  /** Кегль и интерлиньяж продукта в px — данные чужой шкалы. */
  size: number;
  lineHeight: number;
  weight: 400 | 500 | 600 | 700;
  sample: Label;
}

export interface Swatch {
  name: string;
  hex: string;
  /** Процент непрозрачности для полупрозрачных оттенков. */
  alpha?: number;
}

export interface ColorGroup extends Swatch {
  tints?: Swatch[];
}

export type LibraryBlock =
  | 'button'
  | 'field'
  | 'row'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'tab'
  | 'badge';
export type LibraryState = 'default' | 'pressed' | 'light' | 'focus' | 'filled' | 'disabled' | 'error' | 'on';

export interface LibraryItem {
  block: LibraryBlock;
  state?: LibraryState;
  label: Label;
  /** Подпись над полем или вторая строка ряда. */
  hint?: Label;
}

export interface LibrarySet {
  title: Label;
  items: LibraryItem[];
}

export interface LibraryDiagram extends DiagramBase {
  kind: 'library';
  heading: Label;
  /** Семейство продукта. Шрифт не грузится: без него образец набран Manrope. */
  fontFamily: string;
  type: TypeRow[];
  colors: ColorGroup[];
  /** Палитра, которой окрашены наборы. */
  palette: {
    primary: string;
    primaryPressed: string;
    primaryLight: string;
    ink: string;
    muted: string;
    line: string;
    surface: string;
    error: string;
  };
  /** Скругление контролов продукта, px. */
  radius: number;
  sets: LibrarySet[];
}

export type Diagram = GraphDiagram | LibraryDiagram;

/** Обёртка без рантайма: даёт вывод типов и проверку id связей на сборке. */
export function defineDiagram<const T extends Diagram>(diagram: T): T {
  if (diagram.kind !== 'library') {
    const ids = new Set(diagram.nodes.map((node) => node.id));
    for (const edge of diagram.edges) {
      for (const id of [edge.from, edge.to]) {
        if (id !== undefined && !ids.has(id)) {
          throw new Error(`Диаграмма «${diagram.title.en}»: связь ссылается на узел «${id}», которого нет`);
        }
      }
    }
  }
  return diagram;
}
