/**
 * Обложка карточки портфолио Upwork. Одна на два пакета — кейсы
 * (`build-upwork-card.mjs`) и Webflow-сборки (`build-webflow-card.mjs`).
 *
 * ## Почему модуль, а не по копии в каждом скрипте
 *
 * До 2026-09-01 обложки собирались двумя разными геометриями: кейсы
 * 2000×1600 (1.25), сборки 1448×1086 (1.333). В сетке Portfolio плитка одна
 * на всех, поэтому четыре обложки кропились не так, как другие четыре, и
 * восемь работ не читались набором. Пропорция обязана быть одна, а
 * скопированная в два скрипта она разошлась бы на первой правке — та же
 * причина, по которой `ScreenStack` в ДС вынесен отдельным файлом
 * (`ds/patterns.md` §ScreenStack).
 *
 * ## Что изменилось против прежней обложки, и почему
 *
 * 1. **Поле стало равным.** Было 64 px по бокам (3.2 %) против 194 сверху
 *    (12 %) у кейсов и 58 против 168 у сборок: кадр упирался в края холста,
 *    а сверху оставалась пустая полоса. Теперь `field` 160 px = 8 % — со
 *    всех четырёх сторон одинаково.
 *
 * 2. **Стопка заменена коллажем.** `ScreenStack` рассчитан на страницу
 *    сайта, где вокруг обложки воздух и кромки дальних слоёв читаются. В
 *    плитке сетки шириной ~300 px эти кромки превращаются в две серые
 *    полоски у правого края, и обложка читается одним экраном с дефектом.
 *    Коллаж показывает три экрана тремя экранами: перекрытие 40 px вместо
 *    сдвига на шаг, приглушение 0.90 вместо 0.80/0.60.
 *
 * 3. **Фон — градиент, а не заливка.** Плоский тон «на тон темнее продукта»
 *    выглядел дефолтом превью. Оба стопа выводятся из того же тона, что и
 *    прежняя заливка, — подмешиванием белого и чёрного, — поэтому холст
 *    по-прежнему принадлежит продукту, а не придуман отдельно.
 *
 * 4. **Плашка формата снизу.** Приём взят у конкурента по нише: в сетке из
 *    восьми плиток цветная полоса ловится первой и отвечает на вопрос
 *    «что это за работа» до заголовка. Цвет — `--accent-500` `#C1440E` из
 *    `ds/tokens.css`, белый текст на нём даёт 5.12:1.
 *
 * **CASE-20 соблюдается: ни поворота, ни перспективы, ни тени, ни подставок.**
 * Решение владельца 2026-09-01: экран показывается экраном и на бирже тоже,
 * иначе биржевые обложки заводят второй визуальный язык рядом с сайтом.
 * Глубину держат перекрытие, волосяная обводка и приглушение — те же три
 * средства, что у `ScreenStack`.
 */
import path from "node:path";
import sharp from "sharp";

/**
 * Холст. 2000×1600 — ровно 1.25, пропорция плитки в сетке Portfolio: обложка
 * входит в плитку целиком. Диалог `Thumbnail preview` отдаёт 1.333 и режет по
 * 100 px сверху и снизу — это поле холста и низ плашки, не кадр.
 */
export const COVER = {
  w: 2000,
  h: 1600,
  /**
   * Поле вокруг коллажа. 6.5 % ширины — нижняя граница диапазона, в котором
   * работают конкуренты по нише (6–10 %). Прежние 8 % давали композицию,
   * висящую в пустоте: коллаж из трёх широких кадров не может заполнить
   * холст 1.25 по высоте, и весь остаток уходил в воздух над плашкой.
   */
  field: 130,
  /**
   * Плашка формата. 160 = 10 % высоты, и это размер под плитку, а не под
   * файл. В сетке Portfolio обложка показывается шириной ~440 px: ярлык,
   * набранный кеглем 46 на холсте 2000, приезжает туда десятью пикселями и
   * не читается. У конкурента по нише та же полоса несёт ~16 px, что на
   * нашем холсте даёт 72. Отсюда и высота: кегль 72 требует полосы 160.
   */
  badge: 160,
  /** Шаг композиции. `--space-6` 24 px в масштабе холста, как у ScreenStack. */
  step: 56,
  /** Перекрытие коллажа. Меньше шага: экран-сосед обязан остаться читаемым. */
  overlap: 40,
  /**
   * Спутник от героя. 0.85, а не 0.62, и это следствие пропорций, а не вкуса.
   * Высота столбца спутников — единственное, чем композиция заполняет холст:
   * герой в 16:10 при ширине 1680 даёт всего 660 px высоты. При 0.62 столбец
   * выходил 880 против 1120 бокса, и 240 px пустоты садились ровно над
   * плашкой. При 0.85 столбец — 1044, и провал закрывается. Иерархия
   * остаётся: герой шире спутника в 1.18 раза, лежит спереди и не приглушён.
   */
  satellite: 0.85,
  /** `--radius-lg` 16 px в масштабе холста. */
  radius: 26,
  /** `--rule-width` 1 px в том же масштабе. */
  border: 2,
  /** Приглушение спутника. Отступает от героя, но остаётся разборчивым. */
  dim: 0.9,
  /** `--accent-500`. Белый текст на нём — 5.12:1. */
  accent: { r: 193, g: 68, b: 14 },
};

/** Смешивание тона с белым или чёрным. Дробь — доля примеси. */
const mix = (c, t, k) => ({
  r: Math.round(c.r + (t - c.r) * k),
  g: Math.round(c.g + (t - c.g) * k),
  b: Math.round(c.b + (t - c.b) * k),
});

const rgb = (c) => `rgb(${c.r},${c.g},${c.b})`;

/**
 * Стопы градиента из тона холста. Светлый холст расходится вверх сильнее,
 * тёмный — вниз: на тёмном подмес белого быстро уводит фон в грязь, на
 * светлом подмес чёрного так же быстро делает его грязным.
 */
export function gradientStops(canvas) {
  const lum = 0.2126 * canvas.r + 0.7152 * canvas.g + 0.0722 * canvas.b;
  return lum < 110
    ? [mix(canvas, 255, 0.12), mix(canvas, 0, 0.34)]
    : [mix(canvas, 255, 0.24), mix(canvas, 0, 0.11)];
}

/** Подложка: диагональный градиент 135°, от светлого угла к тёмному. */
async function background(canvas) {
  const [a, b] = gradientStops(canvas);
  const svg = `<svg width="${COVER.w}" height="${COVER.h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${rgb(a)}"/>
      <stop offset="1" stop-color="${rgb(b)}"/>
    </linearGradient></defs>
    <rect width="${COVER.w}" height="${COVER.h}" fill="url(#g)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Слой коллажа: кадр в скруглённой рамке с волосяной обводкой.
 * `position` задаёт, какой край кадра остаётся при кропе, — телефонные кадры
 * сняты во всю длину прокрутки и режутся сверху.
 */
async function plate(
  src,
  w,
  h,
  stroke,
  strokeAlpha,
  alpha,
  position = "centre",
) {
  const frame = await sharp(src)
    .resize(w, h, { fit: "cover", position, kernel: "lanczos3" })
    .toBuffer();

  const { r, g, b } = stroke;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${COVER.radius}" ry="${COVER.radius}" fill="#fff"/></svg>`,
  );
  const line = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="${COVER.border / 2}" y="${COVER.border / 2}"
       width="${w - COVER.border}" height="${h - COVER.border}"
       rx="${COVER.radius}" ry="${COVER.radius}" fill="none"
       stroke="rgba(${r},${g},${b},${strokeAlpha})" stroke-width="${COVER.border}"/></svg>`,
  );

  return sharp(frame)
    .composite([
      { input: mask, blend: "dest-in" },
      { input: line, blend: "over" },
    ])
    .ensureAlpha(alpha)
    .png()
    .toBuffer();
}

/**
 * Верхняя кромка коллажа в боксе. Излишек высоты уходит наверх целиком, а не
 * делится поровну: плашка — сплошная плита во всю ширину, и воздух прямо над
 * ней читается провалом между двумя объектами. Тот же воздух под верхним
 * краем холста читается полем. Поэтому расстояние от коллажа до плашки всегда
 * равно полю, каким бы ни был остаток.
 */
function top(b, contentH) {
  return b.y + Math.max(0, b.h - contentH);
}

/** Бокс под коллаж: холст минус поле со всех сторон и минус плашка снизу. */
function box() {
  return {
    x: COVER.field,
    y: COVER.field,
    w: COVER.w - COVER.field * 2,
    h: COVER.h - COVER.badge - COVER.field * 2,
  };
}

/**
 * Лестница: герой слева, два спутника справа столбиком, перекрытие 40 px.
 * Ширины выведены из бокса и доли спутника, а не подобраны:
 * `hero + hero·0.62 − overlap = boxW`.
 */
function staircase(ratio) {
  const b = box();
  const heroW = Math.round((b.w + COVER.overlap) / (1 + COVER.satellite));
  const satW = Math.round(heroW * COVER.satellite);
  const heroH = Math.round(heroW / ratio);
  const satH = Math.round(satW / ratio);
  const colH = satH * 2 + COVER.step;

  const satX = b.x + b.w - satW;
  const colY = top(b, colH);

  return [
    {
      i: 0,
      w: heroW,
      h: heroH,
      x: b.x,
      y: colY + Math.round((colH - heroH) / 2),
      front: true,
    },
    { i: 1, w: satW, h: satH, x: satX, y: colY },
    { i: 2, w: satW, h: satH, x: satX, y: colY + satH + COVER.step },
  ];
}

/**
 * Веер: телефонные кадры в ряд с перекрытием и шахматным сдвигом по
 * вертикали. Единственная раскладка, отличная от лестницы, и это решение:
 * мобильный кейс, показанный лестницей десктопных кадров, врёт о продукте.
 * Кадры сняты во всю длину прокрутки, поэтому режутся сверху — до пропорции
 * телефона, а не по своей высоте.
 */
function fan(count, ratio) {
  const b = box();
  const stagger = 36;

  /*
   * Веер идёт просветом, а не перекрытием, — единственное место, где он
   * расходится с лестницей, и причина устройственная. На десктопном кадре
   * левые 40 px — это край сайдбара, и сосед закрывает пустоту. У телефона
   * слева стоит контент: те же 40 px срезают начало каждой строки, и три
   * экрана из четырёх читаются обрезанными. Просвет — половина шага.
   *
   * Ширина отсюда и выводится: `count·w + gap·(count−1) = boxW`.
   */
  const gap = COVER.step / 2;
  let w = Math.round((b.w - gap * (count - 1)) / count);
  let h = Math.round(w / ratio);

  // Если веер не влезает по высоте, размер задаёт бокс, а не перекрытие.
  if (h + stagger > b.h) {
    h = b.h - stagger;
    w = Math.round(h * ratio);
  }

  const pitch = count > 1 ? (b.w - w) / (count - 1) : 0;
  const y0 = top(b, h + stagger);

  return Array.from({ length: count }, (_, i) => ({
    i,
    w,
    h,
    x: b.x + Math.round(pitch * i),
    y: y0 + (i % 2 === 0 ? 0 : stagger),
    front: i === 0,
    position: "top",
  }));
}

/**
 * Плашка формата. Кегль подбирается под ширину холста: строка вписывается в
 * `COVER.w − field·2`, иначе длинный ярлык уехал бы за край.
 */
async function badge(text) {
  const inner = COVER.w - COVER.field * 2;
  /*
   * Ярлык уходит в разметку Pango, а не в plain text: `letter_spacing` и
   * цвет задаются тегом. Значит `&` в `CATALOG & PRE-ORDER` — начало
   * сущности, и Pango роняет рендер целиком. Экранирование живёт здесь, а не
   * в конфигурации карточки: ярлык там пишется как текст.
   */
  const safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  /*
   * Кегль стартует с 72 и опускается, пока строка не войдёт в поле. Нижняя
   * граница 44: ниже ярлык перестаёт читаться на плитке, и это сигнал, что
   * укорачивать надо текст, а не кегль.
   */
  let size = 72;
  let img;
  let meta;

  for (;;) {
    img = await sharp({
      text: {
        text: `<span letter_spacing="3600" foreground="#FFFFFF">${safe}</span>`,
        font: `Manrope ${size}`,
        fontfile: path.join("scripts", "og-fonts", "Manrope-800.ttf"),
        rgba: true,
        dpi: 72,
      },
    })
      .png()
      .toBuffer();
    meta = await sharp(img).metadata();
    if (meta.width <= inner || size <= 44) break;
    size -= 2;
  }

  return {
    input: img,
    left: Math.round((COVER.w - meta.width) / 2),
    top: COVER.h - COVER.badge + Math.round((COVER.badge - meta.height) / 2),
  };
}

/**
 * Сборка обложки.
 *
 * @param {object}   card     конфигурация карточки: `canvas`, `stroke`, `badge`
 * @param {string[]} sources  пути к кадрам, первый — герой
 * @param {object}   opts     `{ ratio, layout: 'staircase' | 'fan' }`
 * @param {string}   out      путь готового файла
 */
export async function renderCover(
  card,
  sources,
  { ratio, layout = "staircase" },
  out,
) {
  const slots =
    layout === "fan" ? fan(sources.length, ratio) : staircase(ratio);

  const layers = [];
  // От дальнего к переднему: герой ложится последним и остаётся целым.
  for (const s of [...slots].reverse()) {
    layers.push({
      input: await plate(
        sources[s.i],
        s.w,
        s.h,
        card.stroke,
        s.front ? 0.16 : 0.11,
        s.front ? 1 : COVER.dim,
        s.position,
      ),
      left: s.x,
      top: s.y,
    });
  }

  const bar = Buffer.from(
    `<svg width="${COVER.w}" height="${COVER.badge}"><rect width="${COVER.w}" height="${COVER.badge}" fill="${rgb(COVER.accent)}"/></svg>`,
  );
  layers.push({ input: bar, left: 0, top: COVER.h - COVER.badge });
  layers.push(await badge(card.badge));

  await sharp(await background(card.canvas))
    .composite(layers)
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 92,
      dither: 0,
    })
    .toFile(out);

  return out;
}
