/**
 * Partner Portal case V2 — fresh source captures from the accepted product.
 *
 *   (product) npx vite --port 5191 in a clean worktree of b2b-partner-portal @ 6bbe1cd
 *   PW=<playwright/index.mjs> node scripts/b2b-v2/capture-product.mjs [shot ...]
 *
 * Every shot is an element-bounded clip: a union of DOM boxes plus padding,
 * so a crop can only end at a component edge. DPR 2, viewport chosen so the
 * component's native width is close to its display width on the case page.
 * PNGs + manifest land in audit/b2b-case-v2/captures/; WebP is built by
 * build-media.mjs.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { browser, open, settle, unionBox, PRODUCT_COMMIT, ORIGIN } from './shared.mjs';

const OUT = 'audit/b2b-case-v2/captures';
const only = process.argv.slice(2);

/** Mark a resolution row by source row number (text "Row N" / "Строка N"). */
async function markRow(page, row, mark) {
  await page.evaluate(({ row, mark }) => {
    const el = [...document.querySelectorAll('[data-slot="resolution-row"]')]
      .find(item => new RegExp('(?:Row|Строка)\\s*' + row + '\\b').test(item.textContent));
    if (!el) throw new Error('No resolution row ' + row);
    el.setAttribute('data-capture', mark);
  }, { row, mark });
}

/** The cart line that owns a panel is the element right before it. */
async function markCartLine(page, panelSelector, index, mark) {
  await page.evaluate(({ panelSelector, index, mark }) => {
    const panel = document.querySelectorAll(panelSelector)[index];
    if (!panel) throw new Error('No panel ' + panelSelector);
    panel.setAttribute('data-capture', mark + '-panel');
    panel.previousElementSibling.setAttribute('data-capture', mark + '-line');
  }, { panelSelector, index, mark });
}

async function pickCandidate(page, row, nth) {
  await page.locator('[data-capture="row"]').getByRole('button').first().click();
  const panel = page.locator(`#decision-panel-${row}`);
  await panel.waitFor();
  await panel.getByRole('radio').nth(nth).click();
  await settle(page, 250);
  return panel;
}

const shots = {
  /* Cover: the whole working surface. Seven open lines + readiness bar. */
  'workspace-1280': async locale => {
    // Viewport fitted to the queue: every open row ends above the sticky bar
    // (RU rows wrap taller, so a fixed 900 slid row 46 under it).
    const { context, page } = await open('resolution-center', { locale, width: 1280, height: 900 });
    const table = await unionBox(page, ['[data-slot="table-viewport"]'], 0);
    const bar = await unionBox(page, ['#review-readiness-bar'], 0);
    const height = Math.round(table.y + table.height + 20 + bar.height);
    await page.setViewportSize({ width: 1280, height });
    await settle(page, 300);
    return { context, page, clip: { x: 0, y: 0, width: 1280, height }, note: 'full viewport fitted to the queue, app chrome, sticky readiness bar' };
  },
  'workspace-390': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 390, height: 844 });
    return { context, page, clip: { x: 0, y: 0, width: 390, height: 844 }, note: 'full mobile viewport' };
  },
  /* Mobile cover: the same screen from the top bar through the row-19 card. */
  'workspace-top-390': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 390, height: 1400 });
    await markRow(page, 19, 'row');
    const row = await unionBox(page, ['[data-capture="row"]'], 0);
    return { context, page, clip: { x: 0, y: 0, width: 390, height: Math.round(row.y + row.height) }, note: 'top bar, title, progress, filters, complete row 19 card; ends before the next card' };
  },
  /* Commercial change: the row-19 line and its change panel, one object. */
  'change-390': async locale => {
    const { context, page } = await open('cart/change-review', { locale, width: 390, height: 3200, state: 'resolved' });
    await markCartLine(page, '[data-slot="cart-line-change"]', 0, 'change');
    return { context, page, clip: await unionBox(page, ['[data-capture="change-line"]', '[data-capture="change-panel"]'], 0), note: 'row 19 line + change panel' };
  },
  /* After: the dashboard ends with the Start card, before Recent orders. */
  'dashboard-1280': async locale => {
    const { context, page } = await open('dashboard', { locale, width: 1280, height: 900 });
    const entry = await unionBox(page, ['section.dashboard-entry'], 0);
    return { context, page, clip: { x: 216, y: 0, width: 1064, height: Math.round(entry.y + entry.height + 24) }, note: 'main column + top bar; ends 24px under Start a specification, above Recent orders' };
  },
  'dashboard-390': async locale => {
    const { context, page } = await open('dashboard', { locale, width: 390, height: 844 });
    return { context, page, clip: await unionBox(page, ['section.dashboard-current'], 16), note: 'Current purchase card' };
  },
  /* One human decision: row 19 opened, the first candidate chosen. */
  'decision-1280': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 1280, height: 1100 });
    await markRow(page, 19, 'row');
    await pickCandidate(page, 19, 0);
    return { context, page, clip: await unionBox(page, ['[data-slot="resolution-table-head"]', '[data-capture="row"]', '#decision-panel-19'], 0), note: 'table head + row 19 + decision panel, candidate selected' };
  },
  'decision-390': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 390, height: 2000 });
    await markRow(page, 19, 'row');
    await pickCandidate(page, 19, 0);
    return { context, page, clip: await unionBox(page, ['[data-capture="row"]', '#decision-panel-19'], 0), note: 'row 19 card + decision panel' };
  },
  /* Row 38 (three 4 MP cameras) — inspected for the selection-fill defect. */
  'decision38-1280': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 1280, height: 1300 });
    await markRow(page, 38, 'row');
    await pickCandidate(page, 38, 1);
    return { context, page, clip: await unionBox(page, ['[data-capture="row"]', '#decision-panel-38'], 0), note: 'row 38 + three candidates, second selected (inspection)' };
  },
  /* After Apply: the confirmed row keeps its source. */
  'confirmed-1280': async locale => {
    // Tall enough for the whole Resolved list, so the sticky bar sits at the end.
    const { context, page } = await open('resolution-center', { locale, width: 1280, height: 4200 });
    await markRow(page, 19, 'row');
    const panel = await pickCandidate(page, 19, 0);
    await panel.locator('[data-track="resolution-apply"]').click();
    await settle(page, 600);
    await page.locator('[role="tab"]').nth(2).click().catch(() => {});
    await settle(page, 400);
    await markRow(page, 19, 'done');
    return { context, page, clip: await unionBox(page, ['[data-capture="done"]'], 0), note: 'Resolved tab, confirmed row 19 alone' };
  },
  'confirmed-390': async locale => {
    const { context, page } = await open('resolution-center', { locale, width: 390, height: 9000 });
    await markRow(page, 19, 'row');
    const panel = await pickCandidate(page, 19, 0);
    await panel.locator('[data-track="resolution-apply"]').click();
    await settle(page, 600);
    await page.locator('[role="tab"]').nth(2).click().catch(() => {});
    await settle(page, 400);
    await markRow(page, 19, 'done');
    return { context, page, clip: await unionBox(page, ['[data-capture="done"]'], { left: 16, right: 16, top: 12, bottom: 12 }), note: 'Resolved tab, confirmed row 19 card' };
  },
  'unpriced-390': async locale => {
    const { context, page } = await open('cart', { locale, width: 390, height: 3200, state: 'resolved' });
    await markCartLine(page, '[data-slot="cart-line-unpriced"]', 0, 'unpriced');
    return { context, page, clip: await unionBox(page, ['[data-capture="unpriced-line"]', '[data-capture="unpriced-panel"]'], 0), note: 'first unpriced line + its panel' };
  },
  /* Verification: product hero, ends before Full specifications. */
  'product-1280': async locale => {
    const { context, page } = await open('catalog/product?sku=KX-2CB4046F2-I', { locale, width: 1280, height: 900 });
    const hero = await unionBox(page, ['section.product-hero'], 0);
    return { context, page, clip: { x: 216, y: 0, width: 1064, height: Math.round(hero.y + hero.height + 28) }, note: 'main column + top bar; ends 28px under the product hero cards' };
  },
  'product-390': async locale => {
    const { context, page } = await open('catalog/product?sku=KX-2CB4046F2-I', { locale, width: 390, height: 844 });
    return { context, page, clip: { x: 0, y: 0, width: 390, height: 844 }, note: 'mobile fold' };
  },
  /* Commercial review: the summary bar and one unpriced line. */
  'cartbar-1280': async locale => {
    const { context, page } = await open('cart', { locale, width: 1280, height: 860, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['#cart-summary-bar > .cart-bar__inner'], 0), note: 'complete decision-bar content; page separator excluded at its owning parent boundary; site frame supplies padding' };
  },
  'unpriced-1280': async locale => {
    const { context, page } = await open('cart', { locale, width: 1280, height: 1400, state: 'resolved' });
    await markCartLine(page, '[data-slot="cart-line-unpriced"]', 0, 'unpriced');
    return { context, page, clip: await unionBox(page, ['[data-capture="unpriced-line"]', '[data-capture="unpriced-panel"]'], 0), note: 'first unpriced line + its panel' };
  },
  'cartbar-390': async locale => {
    const { context, page } = await open('cart', { locale, width: 390, height: 844, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['#cart-summary-bar > .cart-bar__inner'], 0), note: 'complete mobile decision-bar content; site frame supplies padding' };
  },
  /* Supply decision: title, stepper and the three-plan comparison. */
  'fulfillment-1280': async locale => {
    const { context, page } = await open('fulfillment', { locale, width: 1280, height: 900, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['[data-slot="page-header"]', 'section.fulfillment-comparison'], { left: 20, right: 20, top: 20, bottom: 18 }), note: 'page header + stepper + plan comparison' };
  },
  'fulfillment-390': async locale => {
    const { context, page } = await open('fulfillment', { locale, width: 390, height: 2400, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['section.fulfillment-comparison'], { left: 16, right: 16, top: 16, bottom: 16 }), note: 'plan comparison stack' };
  },
};

const manifestPath = `${OUT}/manifest.json`;
let manifest = {};
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch {}
for (const locale of ['en', 'ru']) {
  await mkdir(`${OUT}/${locale}`, { recursive: true });
  for (const [name, shoot] of Object.entries(shots)) {
    if (only.length && !only.includes(name)) continue;
    const { context, page, clip, note } = await shoot(locale);
    const rounded = Object.fromEntries(Object.entries(clip).map(([k, v]) => [k, Math.round(v)]));
    const file = `${OUT}/${locale}/${name}.png`;
    // Clip is in document coordinates; viewports are tall enough that fullPage
    // never re-lays out the sticky bars inside a clip.
    await page.screenshot({ path: file, clip: rounded, fullPage: true, animations: 'disabled' });
    const viewport = page.viewportSize();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    manifest[`${locale}/${name}`] = { file, route: page.url().replace(ORIGIN, ''), commit: PRODUCT_COMMIT, viewport, dpr: 2, clip: rounded, note, overflow };
    console.log(locale, name, JSON.stringify(rounded), 'overflow', overflow);
    await context.close();
  }
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
await browser.close();
