/** Owner-requested portfolio canvas adjustment, not a product-source change.
 * Widen the native blue Home surface and extend its padding, keeping the UI
 * content at the same size and page coordinates. Capture the whole surface.
 */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { captureNativeAlpha } from '../lib/native-alpha-capture.mjs';
const { chromium } = await import(process.env.PW ?? 'playwright');
const root = 'audit/trassir-learn-case-v2/composition-v23';
const media = JSON.parse(await readFile('src/data/learn-v2-media.json', 'utf8'));
const source = JSON.parse(await readFile('public/prototypes/learn-manifest.json', 'utf8')).source;
const browser = await chromium.launch();
const changes = [];
for (const lang of ['en', 'ru']) for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4415/prototypes/learn/home/?lang=${lang}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const target = page.locator('main > header');
  const extra = width === 1440 ? 24 : 16;
  const geometry = await target.evaluate((node, extra) => {
    const title = node.querySelector('h1');
    const before = title.getBoundingClientRect();
    const css = getComputedStyle(node), box = node.getBoundingClientRect();
    const fields = ['Top', 'Right', 'Bottom', 'Left'].map(side => parseFloat(css[`padding${side}`]));
    node.style.width = `${box.width + extra * 2}px`;
    node.style.padding = fields.map(p => `${p + extra}px`).join(' ');
    node.style.margin = `${-extra}px`;
    node.style.borderRadius = '16px';
    const after = title.getBoundingClientRect();
    return {
      originalWidth: box.width, expandedWidth: node.getBoundingClientRect().width,
      originalPadding: fields, expandedPadding: fields.map(p => p + extra),
      titleBefore: { x: before.x, y: before.y, width: before.width, height: before.height },
      titleAfter: { x: after.x, y: after.y, width: after.width, height: after.height },
    };
  }, extra);
  for (const axis of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(geometry.titleBefore[axis] - geometry.titleAfter[axis]) < 1, `Home content moved: ${lang}/${width}/${axis}`);
  const raw = await captureNativeAlpha(page, target, { bleed: 0 });
  const info = await sharp(raw).metadata();
  const key = width === 1440 ? 'home-wide' : 'home-mobile';
  await mkdir(`${root}/product/${lang}`, { recursive: true });
  const sourcePath = `${root}/product/${lang}/${key}.png`;
  await writeFile(sourcePath, raw);
  await mkdir(`public/media/case-learn-v2/composition/${lang}`, { recursive: true });
  const src = `/media/case-learn-v2/composition/${lang}/${key}.webp`;
  const { data, info: result } = await sharp(raw).webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
  await writeFile(`public${src}`, data);
  media[`${lang}/${key}`] = {
    src, width: info.width, height: info.height, cssWidth: info.width / 2,
    source: sourcePath, productCommit: source.commit, route: page.url(), bytes: result.size,
    presentation: { extraCanvasPadding: extra, contentGeometryUnchanged: true, screenshotRadius: 16, ...geometry },
    note: 'Owner-directed extension of the actual blue Home canvas; unchanged UI content and layout. No external white frame or transparent bleed.',
  };
  changes.push({ lang, width, key, ...geometry });
  await context.close();
}
await browser.close();
await writeFile('src/data/learn-v2-media.json', JSON.stringify(media, null, 2) + '\n');
await writeFile(`${root}/home-canvas.json`, JSON.stringify({ source, changes }, null, 2) + '\n');
console.log('Four full Home canvases captured; content positions and size unchanged.');
