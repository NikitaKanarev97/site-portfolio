/**
 * Partner Portal V3 — design-system specimens from the product's own Storybook.
 *   node scripts/b2b-v3/capture-specimens.mjs
 *
 * Storybook is built from b2b-partner-portal @ 36be1d8 and served at SB_ORIGIN.
 * Each specimen is an element screenshot of the story root (DPR 2): no injected
 * CSS, no DOM edits, no repainting. Token values are read as computed custom
 * properties of the same iframe and written next to the PNGs.
 *
 * ResolutionRow specimens come from the real queue instead (capture-line.mjs):
 * coherent fixture rows and a native Russian locale.
 *
 * Source equality: Availability and FileUpload are identical in
 * 6bbe1cd, c899933 and 36be1d8. FulfillmentPlan differs from c899933 only in
 * `.plan-comparison-row[data-state=selected]` (the wide comparison table);
 * the script asserts that rule's selector matches nothing in the card stories.
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

const SB = process.env.SB_ORIGIN ?? 'http://127.0.0.1:5211';
const OUT = 'audit/b2b-portfolio-case-premium-v3/captures/specimens';
const PRODUCT_COMMIT = '36be1d80277c536b94424ac49aa5ff82662d8ee7';

/** family, story id suffix, capture viewport width, file suffix. */
const STORIES = [
  ['availability', 'verified', 420],
  ['availability', 'stale', 420],
  ['availability', 'not-confirmed', 420],
  ['fileupload', 'empty', 560],
  ['fileupload', 'complete', 560],
  ['fileupload', 'error', 560],
  ['fulfillmentplan', 'default', 360],
  ['fulfillmentplan', 'selected', 360],
  ['fulfillmentplan', 'unavailable', 360],
];

const COLORS = ['surface-canvas', 'surface-default', 'surface-subtle', 'surface-action-primary', 'surface-selected', 'text-default', 'text-muted', 'text-success', 'text-warning', 'text-error', 'text-info', 'border-default'];
const TYPE = ['4xl', '2xl', 'xl', 'base', 'sm', 'xs'];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const entries = [];
let tokens;
try {
  for (const [family, story, width, suffix = ''] of STORIES) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const id = `components-domain-${family}--${story}`;
    await page.goto(`${SB}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const root = page.locator('#storybook-root > *').first();
    await root.waitFor();
    await root.evaluate(async el => { for (const img of el.querySelectorAll('img')) await img.decode().catch(() => {}); });
    const comparisonRuleHits = await page.evaluate(() => document.querySelectorAll('.plan-comparison-row[data-state="selected"]').length);
    if (family === 'fulfillmentplan' && comparisonRuleHits) throw new Error(`${id}: c899933 comparison rule applies`);
    const buffer = await root.screenshot({ animations: 'disabled' });
    const name = `${family}-${story}${suffix}`;
    await writeFile(`${OUT}/${name}.png`, buffer);
    entries.push({ name, story: id, viewport: width, dpr: 2, box: await root.boundingBox(), sha256: createHash('sha256').update(buffer).digest('hex'), text: (await root.innerText()).trim(), errors });
    if (!tokens) {
      tokens = await page.evaluate(({ COLORS, TYPE }) => {
        const css = getComputedStyle(document.documentElement);
        const read = name => css.getPropertyValue(`--${name}`).trim();
        return {
          font: read('font-sans'),
          colors: COLORS.map(name => ({ name, value: read(name) })),
          type: TYPE.map(step => ({ step, size: read(`size-${step}`), lineHeight: read(`line-height-${step}`) })),
        };
      }, { COLORS, TYPE });
    }
    console.log(name, Math.round(entries.at(-1).box.width), 'x', Math.round(entries.at(-1).box.height), errors.length ? errors : '');
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(`${OUT}/manifest.json`, `${JSON.stringify({ product: PRODUCT_COMMIT, source: 'storybook build of the product at this commit', tokens, entries }, null, 2)}\n`);
}
