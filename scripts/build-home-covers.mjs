/**
 * Обложки трёх главных кейсов, ревизия 25.09.2026 (вторая за день).
 *
 * Первая ревизия ставила в карточку один фрагмент в натуральную величину.
 * Владелец: «скучно; у Agent Ops один текст и две кнопки — почему человек
 * должен по этому перейти в работу». Фрагмент без контекста не показывает
 * ни продукта, ни масштаба. Теперь, как на обложках кейсов на FL.ru: экран
 * продукта целиком — фоном, 1–2 ключевых элемента вынесены поверх крупно,
 * с тенью. Название на картинке не ставится: на сайте оно стоит над обложкой.
 *
 * Элементы — вырезки из тех же экранов в 3x (scripts/shoot-cover-sources.mjs),
 * ничего не перерисовано. Край вырезки идёт в промежутке между строками.
 *
 * Выход: public/media/<folder>[-ru]/cover/home-{desktop,mobile}.webp
 * Запуск: node scripts/shoot-cover-sources.mjs && node scripts/build-home-covers.mjs [agent|dssl|learn]
 */
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

const SRC = 'tmp/cover-sources';
const only = process.argv[2];

// Вьюпорт, в котором снят каждый исходник, в CSS px.
const VIEWPORT = {
  'agent-queue': [1920, 1200], 'agent-approvals': [1920, 1200],
  'dssl-fulfillment': [1440, 1080], 'dssl-resolution': [1440, 1080],
  'learn-home': [1440, 1000], 'learn-trajectory': [1440, 1000],
};

/**
 * Слой: src — ключ исходника; clip — [x, y, w, h] в CSS px экрана (без clip —
 * экран целиком); x, y — место на холсте; scale — масштаб относительно CSS px.
 * `lift` — вынесенный элемент: сильнее тень и обводка.
 * `radius` — собственное скругление элемента в CSS px экрана: рамка вырезки
 * повторяет его, иначе в углах проступает фон страницы. `inset` — срез
 * внутрь на столько px: дуга с тем же центром и меньшим радиусом лежит
 * внутри сглаженного края источника, светлых пикселей по углам не остаётся.
 * При уменьшении вдвое и сильнее фильтр задевает соседние пиксели — срез глубже.
 * Клипы можно задать по локали: { en: [...], ru: [...] }.
 */
const COVERS = {
  agent: {
    folder: 'case-agent-ops',
    bg: '#253332',
    dark: true,
    desktop: { w: 1280, h: 720, layers: [
      { src: 'agent-queue', x: 40, y: 40, scale: 0.53 },
      { src: 'agent-queue', clip: [256, 191, 420, 112], x: 690, y: 74, scale: 1.45, lift: true },
      { src: 'agent-queue', clip: { en: [250, 364, 668, 82], ru: [250, 364, 800, 82] }, x: 24, y: 470, scale: 1.24, lift: true },
    ] },
    mobile: { w: 360, h: 450, layers: [
      { src: 'agent-queue', x: 18, y: 22, scale: 0.19 },
      { src: 'agent-queue', clip: [256, 191, 420, 112], x: 18, y: 188, scale: 0.77, lift: true },
      { src: 'agent-queue', clip: { en: [250, 364, 668, 82], ru: [250, 364, 800, 82] }, x: 18, y: 318, scale: 0.405, lift: true },
    ] },
  },
  dssl: {
    folder: 'case-dssl',
    bg: '#DCE7F3',
    desktop: { w: 1280, h: 720, layers: [
      { src: 'dssl-resolution', x: 40, y: 34, scale: 0.6 },
      { src: 'dssl-resolution', clip: { en: [265, 488, 765, 69], ru: [265, 506, 812, 69] }, x: 24, y: 520, scale: 1.1, lift: true },
      { src: 'dssl-fulfillment', clip: { en: [1056, 545, 360, 396], ru: [1056, 557, 360, 417] }, x: 880, y: 150, scale: 0.98, lift: true, radius: 8 },
    ] },
    mobile: { w: 360, h: 450, layers: [
      { src: 'dssl-resolution', x: 18, y: 22, scale: 0.225 },
      { src: 'dssl-fulfillment', clip: { en: [1056, 545, 360, 396], ru: [1056, 557, 360, 417] }, x: 150, y: 120, scale: 0.53, lift: true, radius: 8 },
      { src: 'dssl-resolution', clip: { en: [265, 488, 765, 69], ru: [265, 506, 812, 69] }, x: 18, y: 372, scale: 0.4, lift: true },
    ] },
  },
  learn: {
    folder: 'case-learn',
    bg: '#243C56',
    desktop: { w: 1280, h: 720, layers: [
      { src: 'learn-home', x: 40, y: 44, scale: 0.62 },
      { src: 'learn-home', clip: { en: [32, 540, 640, 82], ru: [32, 540, 640, 82] }, x: 24, y: 560, scale: 1.2, lift: true },
      { src: 'learn-trajectory', clip: { en: [1088, 338, 320, 548], ru: [1088, 389, 320, 590] }, x: 900, y: 86, scale: 1.0, lift: true, radius: 20, inset: 1 },
    ] },
    mobile: { w: 360, h: 450, layers: [
      { src: 'learn-home', x: 18, y: 22, scale: 0.225 },
      { src: 'learn-trajectory', clip: { en: [1088, 338, 320, 548], ru: [1088, 389, 320, 590] }, x: 176, y: 58, scale: 0.5, lift: true, radius: 20, inset: 3 },
      { src: 'learn-home', clip: { en: [32, 540, 640, 82], ru: [32, 540, 640, 82] }, x: 18, y: 372, scale: 0.5, lift: true },
    ] },
  },
};

const RENDER_SCALE = { desktop: 2, mobile: 3 };

function html(cover, form, locale, data) {
  const spec = cover[form];
  const shade = cover.dark
    ? { base: '0 18px 50px rgba(0,0,0,.40), 0 0 0 1px rgba(255,255,255,.10)', lift: '0 30px 70px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.16)' }
    : { base: '0 18px 44px rgba(20,40,70,.16), 0 0 0 1px rgba(20,40,70,.08)', lift: '0 28px 64px rgba(20,40,70,.30), 0 0 0 1px rgba(20,40,70,.10)' };
  const layers = spec.layers.map((l) => {
    const [full, fullHeight] = VIEWPORT[l.src];
    const clip = l.clip ? (Array.isArray(l.clip) ? l.clip : l.clip[locale]) : [0, 0, full, fullHeight];
    const inset = l.inset ?? 0;
    const [cx, cy, cw, ch] = [clip[0] + inset, clip[1] + inset, clip[2] - 2 * inset, clip[3] - 2 * inset];
    const s = l.scale;
    const r = l.radius !== undefined ? (l.radius - inset) * s : (l.lift ? 10 : 12);
    return `<div style="position:absolute;left:${l.x}px;top:${l.y}px;width:${cw * s}px;height:${ch * s}px;overflow:hidden;border-radius:${r}px;box-shadow:${l.lift ? shade.lift : shade.base}">
      <img src="${data[l.src]}" style="position:absolute;left:${-cx * s}px;top:${-cy * s}px;width:${full * s}px;max-width:none">
    </div>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}</style></head>
    <body><div id="c" style="position:relative;width:${spec.w}px;height:${spec.h}px;background:${cover.bg};overflow:hidden">${layers}</div></body></html>`;
}

const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
for (const [key, cover] of Object.entries(COVERS)) {
  if (only && only !== key) continue;
  for (const locale of ['en', 'ru']) {
    const data = {};
    for (const l of [...cover.desktop.layers, ...cover.mobile.layers]) {
      data[l.src] ??= `data:image/png;base64,${(await readFile(`${SRC}/${l.src}-${locale}.png`)).toString('base64')}`;
    }
    for (const form of ['desktop', 'mobile']) {
      const spec = cover[form];
      const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: RENDER_SCALE[form] });
      await page.setContent(html(cover, form, locale, data), { waitUntil: 'load' });
      const png = await page.locator('#c').screenshot();
      const file = `public/media/${cover.folder}${locale === 'ru' ? '-ru' : ''}/cover/home-${form}.webp`;
      await sharp(png).webp({ quality: 88 }).toFile(file);
      console.log(file);
      await page.close();
    }
  }
}
await browser.close();
