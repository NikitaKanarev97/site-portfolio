/**
 * Partner Portal V3 — the signature source line, captured as ONE real session.
 *   node scripts/b2b-v3/capture-line.mjs
 *
 * Product: b2b-partner-portal @ 36be1d8 (accepted source-parity V1.1), production
 * build served at PRODUCT_ORIGIN. Seed: the product's own dashboard-v3 baseline
 * fixture, frozen clock, reduced motion. The six OTHER open lines are marked
 * resolved in the seed so that the same session can continue to the Cart;
 * row 19 itself is left open and is resolved only through real controls:
 *
 *   source  → row 19 collapsed, Ambiguous, original text and quantity
 *   open    → decision panel opened, nothing chosen, Apply disabled (evidence only)
 *   choose  → first candidate chosen by its radio, Apply enabled, nothing applied yet
 *   confirm → after Apply: Confirmed, "was Ambiguous", Undo
 *   cart    → Continue to cart; the cart line that names source row 19
 *
 * Separately, rows 44 (Ambiguous), 27 (Missing) and 34 (Changed) of the untouched baseline queue
 * are shot as ResolutionRow specimens for the design-system section.
 *
 * No injected CSS, no DOM edits. Square elements are element screenshots. A
 * rounded element (the expanded decision card; every card on phones) is clipped
 * to its box plus FRAME px of the product surface around it: V3.1 found that an
 * element screenshot of a rounded box keeps four corner fragments of whatever
 * sits behind it, which read as white corners on the case plate. The product
 * keeps 12 px of plain surface around every rounded card (margin of the
 * expanded card at 1280, queue gap at 390); FRAME takes 8 of them, because at
 * 1280 the queue's own rounded bottom corner sits on the 12 px line. Every edge
 * pixel of the clip is asserted to be one uniform product background — no
 * neighbouring UI, no corner fragments; a rejected frame is kept as *.rejected.png.
 * Raw PNGs + manifest go to OUT (V3: audit/b2b-portfolio-case-premium-v3/captures/).
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

export const PRODUCT_COMMIT = process.env.PRODUCT_COMMIT ?? '36be1d80277c536b94424ac49aa5ff82662d8ee7';
const PRODUCT_ROOT = process.env.PRODUCT_ROOT ?? 'D:/Claude-projects/sp-b2b-source-ui-v11';
const ORIGIN = process.env.PRODUCT_ORIGIN ?? 'http://127.0.0.1:5210/b2b';
const OUT = process.env.OUT ?? 'audit/b2b-portfolio-case-premium-v3/captures';
const FRAME = 8;
const KEY = 'b2b-dssl.state.v1';
const CLOCK = '2026-10-30T09:00:00.000Z';
const ROW = 19;

const fixture = JSON.parse(await readFile(`${PRODUCT_ROOT}/audit/dashboard-v3/baseline-state.json`, 'utf8'));
const browser = await chromium.launch();
const manifest = { product: PRODUCT_COMMIT, browser: browser.version(), clock: CLOCK, seed: 'audit/dashboard-v3/baseline-state.json; rows other than 19 pre-resolved', entries: [] };
await mkdir(OUT, { recursive: true });

const sha = buffer => createHash('sha256').update(buffer).digest('hex');

async function shoot(page, locator, name, meta) {
  // Centre the element: on phones the product keeps a fixed progress bar at the bottom.
  await locator.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.mouse.move(0, 0);
  // decode() of an off-screen lazy image never settles: only wait for the target.
  await locator.evaluate(async el => { for (const img of el.querySelectorAll('img')) { img.loading = 'eager'; await img.decode().catch(() => {}); } });
  const radius = await locator.evaluate(el => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
  const box = await locator.boundingBox();
  let buffer, clip;
  if (radius) {
    clip = { x: box.x - FRAME, y: box.y - FRAME, width: box.width + 2 * FRAME, height: box.height + 2 * FRAME };
    buffer = await page.screenshot({ clip, animations: 'disabled' });
    await assertPlainEdge(buffer, name).catch(async e => { await writeFile(`${OUT}/${name}.rejected.png`, buffer); throw e; });
  } else {
    buffer = await locator.screenshot({ animations: 'disabled' });
  }
  await writeFile(`${OUT}/${name}.png`, buffer);
  manifest.entries.push({ name, file: `captures/${name}.png`, sha256: sha(buffer), box, radius, clip: clip ?? 'element', text: (await locator.innerText()).trim(), ...meta });
}

/** Every pixel of the outer 2 device px ring must be the same product surface. */
async function assertPlainEdge(buffer, name) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => { const i = (y * w + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
  const ref = at(0, 0);
  for (let ring = 0; ring < 2; ring++) {
    for (let x = 0; x < w; x++) for (const y of [ring, h - 1 - ring]) check(x, y);
    for (let y = 0; y < h; y++) for (const x of [ring, w - 1 - ring]) check(x, y);
  }
  function check(x, y) {
    const p = at(x, y);
    if (p.some((v, i) => Math.abs(v - ref[i]) > 2)) throw new Error(`${name}: edge pixel ${x},${y} ${p} differs from surface ${ref}`);
  }
}

try {
  for (const locale of ['en', 'ru']) {
    for (const width of (process.env.WIDTHS ?? '1280,390').split(',').map(Number)) {
      const mobile = width < 768;
      const prefix = locale === 'ru' ? 'ru/' : '';
      const key = `${locale}-${width}`;
      // ResolutionRow specimens: Ambiguous, Missing and Changed rows of the untouched baseline queue.
      {
        const context = await browser.newContext({ viewport: { width, height: mobile ? 1400 : 1000 }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow' });
        await context.addInitScript(({ KEY, seed }) => { if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(seed)); }, { KEY, seed: fixture });
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        await page.clock.setFixedTime(new Date(CLOCK));
        await page.goto(`${ORIGIN}/${prefix}resolution-center`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        for (const [other, type] of [[44, 'ambiguous'], [27, 'missing'], [34, 'changed']]) {
          const target = page.locator(`[data-slot="resolution-item"][data-row="${other}"] [data-slot="resolution-row"]`);
          await shoot(page, target, `${key}-row-${type}`, { stage: `specimen-${type}`, locale, width, dpr: 2, route: `${prefix}resolution-center`, seed: 'baseline fixture, untouched' });
        }
        await context.close();
      }
      const context = await browser.newContext({
        viewport: { width, height: mobile ? 1400 : 1000 }, deviceScaleFactor: 2,
        isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow',
      });
      const seed = structuredClone(fixture);
      seed.specification.lines.forEach(line => { if (line.row !== ROW) { line.resolved = true; line.saveFailed = false; } });
      await context.addInitScript(({ KEY, seed }) => { if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(seed)); }, { KEY, seed });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      const failures = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
      await page.clock.setFixedTime(new Date(CLOCK));
      await page.goto(`${ORIGIN}/${prefix}resolution-center`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const meta = { locale, width, dpr: 2, route: `${prefix}resolution-center`, errors, failures };

      const item = page.locator(`[data-slot="resolution-item"][data-row="${ROW}"]`);
      await item.waitFor({ state: "attached" });
      // Collapsed, the shell is `display: contents`: the native row is the element.
      await shoot(page, item.locator('[data-slot="resolution-row"]'), `${key}-line-source`, { stage: 'source' });

      const row = item.locator('[data-slot="resolution-row"]');
      await row.getByRole('button').first().click();
      const panel = page.locator(`#decision-panel-${ROW}`);
      await panel.waitFor();
      const apply = panel.getByRole('button').first();
      const applyBefore = { text: (await apply.innerText()).trim(), disabled: await apply.isDisabled() };
      await shoot(page, item, `${key}-line-open`, { stage: 'open', apply: applyBefore });

      await panel.getByRole('radio').first().click();
      const applyAfter = { text: (await apply.innerText()).trim(), disabled: await apply.isDisabled() };
      const checked = await panel.getByRole('radio').first().isChecked();
      await shoot(page, item, `${key}-line-choose`, { stage: 'choose', apply: applyAfter, firstRadioChecked: checked });

      await apply.click();
      await page.waitForTimeout(400);
      // A confirmed line leaves "Need review"; the Resolved tab keeps it with its history.
      const resolvedTab = page.getByRole('tab').nth(2);
      await resolvedTab.click();
      const confirmed = page.locator(`[data-slot="resolution-item"][data-row="${ROW}"]`);
      await confirmed.waitFor({ state: "attached" });
      await shoot(page, confirmed.locator('[data-slot="resolution-row"]'), `${key}-line-confirmed`, { stage: 'confirmed', tab: (await resolvedTab.innerText()).trim() });

      // Same session continues: every line is now resolved, so Cart opens.
      const go = page.getByRole('button', { name: locale === 'ru' ? /корзин/i : /cart/i }).last();
      await go.click();
      await page.waitForURL(/cart/);
      await page.waitForTimeout(500);
      const line = page.locator('[data-slot="cart-line"]').filter({ hasText: 'KX-7608NXI-K2' }).first();
      await line.waitFor();
      await line.scrollIntoViewIfNeeded();
      await shoot(page, line, `${key}-line-cart`, { stage: 'cart', route: page.url().replace(ORIGIN, '') });
      await page.screenshot({ path: `${OUT}/${key}-line-cart-context.png`, fullPage: false });
      console.log(key, { errors, failures, applyBefore, applyAfter, checked });
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(`${OUT}/line-manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}
