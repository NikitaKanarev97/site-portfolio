/**
 * Русская пересъёмка Partner Portal из отдельного `/ru`-маршрута исходного
 * приложения. Геометрия каждого результата фиксируется по английскому кадру:
 * русская строка может переноситься иначе, но файл остаётся совместим с той же
 * рамкой и композицией кейса.
 *
 * Запуск:
 *   1. b2b-dssl: npm run dev -- --port 5199
 *   2. b2b-dssl/storybook-static: python -m http.server 6009
 *   3. portfolio: node scripts/shoot-dssl-ru-frames.mjs
 */
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b';
const STORYBOOK_ORIGIN = process.env.STORYBOOK_ORIGIN ?? 'http://127.0.0.1:6009';
const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/b2b-dssl';
const MEDIA_DIR = path.resolve('public/media/case-dssl-ru');
const EN_MEDIA_DIR = path.resolve('public/media/case-dssl');
const COVER_DIR = path.join(MEDIA_DIR, 'cover');
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 1.5;
const WEBP_QUALITY = 82;
const ONLY_NAV = process.env.DSSL_ONLY_NAV === '1';

const COVER_FRAMES = [
  { file: 'resolution-center.webp', route: '/resolution-center' },
  { file: 'fulfillment.webp', route: '/fulfillment' },
  { file: 'dashboard.webp', route: '/dashboard' },
];

const VIEWPORT_FRAMES = [
  /* candidate-select снят 31.08.2026: артефакт первого решения теперь ролик
     `clip-line-identity` (`shoot-clips.mjs`), и снимок этого экрана на
     странице не стоит ни в одной локали. */
  { file: 'cart-change-review.webp', route: '/cart/change-review' },
];

const STORY_FRAMES = [
  { file: 'system-product-row-v2.webp', id: 'components-domain-productrow--all-variants' },
  { file: 'system-price-block.webp', id: 'components-domain-priceblock--all-variants' },
  { file: 'system-availability.webp', id: 'components-domain-availability--all-variants' },
  { file: 'system-resolution-row-v2.webp', id: 'components-domain-resolutionrow--all-variants' },
  { file: 'system-fulfillment-plan.webp', id: 'components-domain-fulfillmentplan--all-variants' },
  { file: 'system-empty-state.webp', id: 'components-domain-emptystate--all-variants' },
  { file: 'storybook-matrix.webp', id: 'components-actions-button--all-variants' },
];

const HIDE_SCROLLBARS = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

const STORY_CSS = `
  html, body { scrollbar-width: none; }
  #storybook-root { width: 1000px !important; margin: 0 !important; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
const { chromium } = require('playwright');

async function saveToEnglishGeometry(raw, out, english) {
  const target = await sharp(english).metadata();
  if (!target.width || !target.height) throw new Error(`Нет геометрии ${english}`);
  await sharp(raw)
    .resize({
      width: target.width,
      height: target.height,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(out);
  console.log(`  → ${path.relative(process.cwd(), out)} (${target.width}×${target.height})`);
}

async function shoot() {
  if (!ONLY_NAV) await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(COVER_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  await context.route('**/track.js', route => route.fulfill({ body: '' }));
  await context.route('**/b2b-api/**', route => route.abort());
  const page = await context.newPage();

  async function open(url, css = HIDE_SCROLLBARS) {
    if (url.startsWith(ORIGIN)) {
      await page.goto(`${ORIGIN}/ru`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
    }
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: css });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
  }

  /* Compact sidebar fragment used in the case's component anatomy section. */
  if (ONLY_NAV) {
    await open(`${ORIGIN}/ru/dashboard`);
    const raw = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 260, height: 352 },
    });
    await saveToEnglishGeometry(
      raw,
      path.join(MEDIA_DIR, 'nav-rail.webp'),
      path.join(EN_MEDIA_DIR, 'nav-rail.webp'),
    );
    await browser.close();
    return;
  }

  for (const frame of COVER_FRAMES) {
    await open(`${ORIGIN}/ru${frame.route}`);
    if (await page.evaluate(() => document.documentElement.lang) !== 'ru') {
      throw new Error(`Русская локаль не активна: ${frame.route}`);
    }
    const raw = await page.screenshot({ type: 'png' });
    await saveToEnglishGeometry(
      raw,
      path.join(COVER_DIR, frame.file),
      path.join(EN_MEDIA_DIR, 'cover', frame.file),
    );
  }

  for (const frame of VIEWPORT_FRAMES) {
    await open(`${ORIGIN}/ru${frame.route}`);
    const raw = await page.screenshot({ type: 'png' });
    await saveToEnglishGeometry(raw, path.join(MEDIA_DIR, frame.file), path.join(EN_MEDIA_DIR, frame.file));
  }

  await open(`${ORIGIN}/ru`);
  const index = await page.$('#root > div > div');
  if (!index) throw new Error('Не найдена русская карта экранов');
  await saveToEnglishGeometry(
    await index.screenshot({ type: 'png' }),
    path.join(MEDIA_DIR, 'screen-index.webp'),
    path.join(EN_MEDIA_DIR, 'screen-index.webp'),
  );

  for (const frame of STORY_FRAMES) {
    await open(`${STORYBOOK_ORIGIN}/iframe.html?id=${frame.id}&viewMode=story&globals=locale:ru`, STORY_CSS);
    const root = await page.$('#storybook-root');
    if (!root) throw new Error(`Не найден Storybook root: ${frame.id}`);
    await saveToEnglishGeometry(
      await root.screenshot({ type: 'png' }),
      path.join(MEDIA_DIR, frame.file),
      path.join(EN_MEDIA_DIR, frame.file),
    );
  }

  await browser.close();
}

shoot().catch(error => {
  console.error(error);
  process.exit(1);
});
