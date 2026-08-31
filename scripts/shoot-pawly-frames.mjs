/**
 * Производство кадров кейса Pawly — та же норма, что у DSSL и Vet Clinic OS.
 *
 * Обложка сайта всегда 16:10, а продукт Pawly мобильный. Портретный экран
 * нельзя положить в ScreenStack напрямую: object-fit: cover срежет большую
 * часть сценария. Поэтому три обложечных кадра снимаются широким окном:
 * индекс экранов и два экрана внутри нейтрального viewer продукта. Рамок
 * устройств, перспективы и дополнительной обработки нет; скругление
 * принадлежит ScreenStack на сайте-портфолио.
 *
 * Остальные кадры снимаются в собственной высоте. Экраны идут в
 * MediaFrame ratio=natural, матрицы компонентов — из Storybook AllVariants,
 * а не собираются руками.
 *
 * Запуск:
 *   1. в d:\Claude-projects\PETS-walking — npm run dev -- --port 5201
 *   2. там же, в storybook-static       — python -m http.server 6008
 *   3. здесь                             — node scripts/shoot-pawly-frames.mjs
 */
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5201';
const STORYBOOK_ORIGIN = process.env.STORYBOOK_ORIGIN ?? 'http://127.0.0.1:6008';
const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/PETS-walking';
const LOCALE = process.env.FRAME_LOCALE === 'ru' ? 'ru' : 'en';
const ROUTE_PREFIX = LOCALE === 'ru' ? '/ru' : '';
const STORY_GLOBALS = LOCALE === 'ru' ? '&globals=locale:ru' : '';

const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 1.5;
const VIEWPORT_OUTPUT = { width: 2000, height: 1250 };
const WEBP_QUALITY = 82;
const NATURAL_MAX = 2000;
const TRIM_MARGIN = 24;

const MEDIA_DIR = path.resolve(`public/media/case-pawly${LOCALE === 'ru' ? '-ru' : ''}`);
const COVER_DIR = path.join(MEDIA_DIR, 'cover');

/** Стопка обложки, от переднего кадра к дальнему. */
const COVER_FRAMES = [
  { file: 'screen-gallery.webp', route: '/app', mode: 'gallery' },
  { file: 'owner-home.webp', route: '/app/owner-home', mode: 'viewer' },
  {
    file: 'handover-photo-review.webp',
    route: '/app/handover-photo-review',
    mode: 'viewer',
  },
];

/** Артефакты процесса и доказательства решений, в собственной высоте. */
const NATURAL_FRAMES = [
  { file: 'screen-index.webp', route: '/app', selector: 'body', gallery: true },
  { file: 'address-input.webp', route: '/app/address-input' },
  { file: 'walker-profile.webp', route: '/app/walker-profile' },
  { file: 'handover-photo-review.webp', route: '/app/handover-photo-review' },
  { file: 'replacement-offer.webp', route: '/app/replacement-offer' },
];

/** Матрицы CaseSystemGrid и один артефакт процесса. */
const STORY_FRAMES = [
  { file: 'storybook-matrix.webp', id: 'components-button--all-variants' },
  { file: 'system-info-note.webp', id: 'components-infonote--all-variants' },
  { file: 'system-empty-state.webp', id: 'components-emptystate--all-variants' },
  { file: 'system-bottom-sheet.webp', id: 'components-bottomsheet--all-variants' },
  { file: 'system-photo-proof.webp', id: 'components-photoproof--all-variants' },
  { file: 'system-timeline-row.webp', id: 'components-timelinerow--all-variants' },
  { file: 'system-icon-button.webp', id: 'components-iconbutton--all-variants' },
];

const HIDE_SCROLLBARS = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

/**
 * Natural screen captures contain only the product device. The viewer bar is
 * fixed, so Playwright otherwise paints it over an element screenshot even
 * when the bar sits outside the device's document-flow bounds.
 */
const NATURAL_VIEWER_CSS = `
  ${HIDE_SCROLLBARS}
  [class*="viewerBar"] { display: none !important; }
  [class*="viewer"] {
    padding-block-start: 0 !important;
    min-height: 0 !important;
  }
`;

/**
 * Viewer остаётся частью кадра как нейтральное поле вокруг мобильного
 * интерфейса, но его служебная шапка скрывается. Экран продукта не
 * растягивается и не кадрируется.
 */
const COVER_VIEWER_CSS = `
  ${HIDE_SCROLLBARS}
  [class*="viewerBar"] { display: none !important; }
  [class*="viewer"] {
    height: 900px !important;
    min-height: 900px !important;
    padding: 24px 0 0 !important;
    overflow: hidden !important;
  }
`;

/** Шесть колонок держат полный индекс семнадцати экранов в разумной высоте. */
const COMPACT_GALLERY_CSS = `
  ${HIDE_SCROLLBARS}
  [class*="gallery"] { padding: 32px !important; }
  [class*="header"] { margin-bottom: 32px !important; }
  [class*="grid"] {
    width: min(100%, 1680px) !important;
    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
    gap: 12px !important;
  }
  [class*="preview"] { --preview-scale: 0.56 !important; }
`;

const STORY_CSS = `
  ${HIDE_SCROLLBARS}
  #storybook-root { width: 760px !important; margin: 0 !important; }
`;

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
const { chromium } = require('playwright');

async function trimToContent(buffer) {
  const trimmed = await sharp(buffer)
    .trim({ threshold: 8 })
    .toBuffer({ resolveWithObject: true });

  return sharp(trimmed.data)
    .extend({
      top: TRIM_MARGIN,
      bottom: TRIM_MARGIN,
      left: TRIM_MARGIN,
      right: TRIM_MARGIN,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer();
}

async function report(file) {
  const { width, height } = await sharp(file).metadata();
  console.log(`  → ${path.relative(process.cwd(), file)} (${width}×${height})`);
}

async function shoot() {
  await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(COVER_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });

  /* Трекер нужен только agent-qa и к производству кадров не относится. */
  await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
  await context.route('**/collect', (route) => route.abort());

  const page = await context.newPage();

  async function open(url, css = HIDE_SCROLLBARS) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: css });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    if (LOCALE === 'ru' && url.startsWith(ORIGIN)) {
      const lang = await page.evaluate(() => document.documentElement.lang);
      if (lang !== 'ru') throw new Error(`Русская локаль не активна: ${url}`);
    }
  }

  async function element(selector) {
    const node = await page.$(selector);
    if (!node) throw new Error(`селектор ${selector} не найден`);
    return node.screenshot({ type: 'png' });
  }

  async function loadLazyContent() {
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.8, 400);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
  }

  for (const frame of COVER_FRAMES) {
    const css = frame.mode === 'viewer' ? COVER_VIEWER_CSS : HIDE_SCROLLBARS;
    await open(`${ORIGIN}${ROUTE_PREFIX}${frame.route}`, css);
    const raw = await page.screenshot({ type: 'png' });
    const out = path.join(COVER_DIR, frame.file);

    await sharp(raw)
      .resize(VIEWPORT_OUTPUT.width, VIEWPORT_OUTPUT.height, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(frame.route);
    await report(out);
  }

  for (const frame of NATURAL_FRAMES) {
    await open(
      `${ORIGIN}${ROUTE_PREFIX}${frame.route}`,
      frame.gallery ? COMPACT_GALLERY_CSS : NATURAL_VIEWER_CSS,
    );

    let raw;
    if (frame.gallery) {
      await loadLazyContent();
      raw = await page.screenshot({ type: 'png', fullPage: true });
    } else {
      raw = await element('[class*="device"]');
    }

    const out = path.join(MEDIA_DIR, frame.file);
    await sharp(raw)
      .resize({ width: NATURAL_MAX, height: NATURAL_MAX * 3, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(frame.route);
    await report(out);
  }

  for (const frame of STORY_FRAMES) {
    await open(`${STORYBOOK_ORIGIN}/iframe.html?id=${frame.id}&viewMode=story${STORY_GLOBALS}`, STORY_CSS);

    /*
     * Portfolio copy is English. Fail production instead of silently publishing
     * a component matrix with a leftover Russian fixture or cell label.
     */
    const storyText = await page.locator('#storybook-root').innerText();
    const cyrillic = storyText.match(/[А-Яа-яЁё]+/gu);
    if (LOCALE === 'en' && cyrillic) {
      throw new Error(`${frame.id}: Cyrillic text found — ${[...new Set(cyrillic)].join(', ')}`);
    }

    const raw = await element('#storybook-root');
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(await trimToContent(raw))
      .resize({ width: NATURAL_MAX, height: NATURAL_MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(frame.id);
    await report(out);
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
