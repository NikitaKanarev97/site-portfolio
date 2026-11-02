/**
 * Partner Portal V3.1 — Fulfillment recapture and selected-plan geometry probe.
 *   PW=<playwright entry> PRODUCT_COMMIT=<sha> PRODUCT_ORIGIN=<origin>/b2b PRODUCT_ROOT=<tree> \
 *   node scripts/b2b-v31/capture-fulfillment.mjs
 *
 * Same session, seed and clip as scripts/b2b-v2/capture-product.mjs
 * (`fulfillment-1280`, `fulfillment-390`), so the new frames differ from the
 * c899933 ones only by the product fix. Then, per width, the selected row is
 * measured (border widths and colours, box-shadow, outline), reselected with
 * the pointer and focused from the keyboard, and shot as an element at DPR 2
 * and DPR 4 (the 200 % corner-join check). No injected CSS, no DOM edits.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { browser, open, unionBox, PRODUCT_COMMIT, ORIGIN } from '../b2b-v2/shared.mjs';

const OUT = 'audit/b2b-portfolio-case-premium-v3/v3.1/captures';
const shots = {
  'fulfillment-1280': async locale => {
    const { context, page } = await open('fulfillment', { locale, width: 1280, height: 900, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['[data-slot="page-header"]', 'section.fulfillment-comparison'], { left: 20, right: 20, top: 20, bottom: 18 }), note: 'page header + stepper + plan comparison' };
  },
  'fulfillment-390': async locale => {
    const { context, page } = await open('fulfillment', { locale, width: 390, height: 2400, state: 'resolved' });
    return { context, page, clip: await unionBox(page, ['section.fulfillment-comparison'], { left: 16, right: 16, top: 16, bottom: 16 }), note: 'plan comparison stack' };
  },
};

const geometry = el => {
  const cs = getComputedStyle(el);
  const side = s => ({ width: cs[`border${s}Width`], color: cs[`border${s}Color`] });
  return {
    state: el.dataset.state,
    top: side('Top'), right: side('Right'), bottom: side('Bottom'), left: side('Left'),
    boxShadow: cs.boxShadow, outline: `${cs.outlineStyle} ${cs.outlineWidth}`, background: cs.backgroundColor,
    pseudo: ['::before', '::after'].map(p => getComputedStyle(el, p).content),
  };
};

const manifest = { product: PRODUCT_COMMIT, captures: {}, probes: [] };
await mkdir(`${OUT}/en`, { recursive: true });
await mkdir(`${OUT}/ru`, { recursive: true });
await mkdir(`${OUT}/states`, { recursive: true });
try {
  for (const locale of ['en', 'ru']) {
    for (const [name, shoot] of Object.entries(shots)) {
      const { context, page, clip, note } = await shoot(locale);
      const rounded = Object.fromEntries(Object.entries(clip).map(([k, v]) => [k, Math.round(v)]));
      const file = `${OUT}/${locale}/${name}.png`;
      await page.screenshot({ path: file, clip: rounded, fullPage: true, animations: 'disabled' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      manifest.captures[`${locale}/${name}`] = { file, route: page.url().replace(ORIGIN, ''), commit: PRODUCT_COMMIT, viewport: page.viewportSize(), dpr: 2, clip: rounded, note, overflow };
      console.log(locale, name, JSON.stringify(rounded), 'overflow', overflow);
      await context.close();
    }
    for (const width of [1440, 1280, 390, 360]) {
      for (const dpr of [2, 4]) {
        const { context, page } = await open('fulfillment', { locale, width, height: width < 768 ? 2400 : 1100, state: 'resolved', dpr });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        const rows = page.locator('[data-slot="fulfillment-plan"][data-layout="comparison"]');
        const selected = page.locator('[data-slot="fulfillment-plan"][data-state="selected"]');
        const initial = await selected.evaluate(geometry);
        const key = `${locale}-${width}${dpr === 4 ? '@4x' : ''}`;
        await selected.screenshot({ path: `${OUT}/states/${key}-selected.png`, animations: 'disabled' });
        // Pointer: choose the first plan by its label, then back to the original.
        const originalId = await selected.getAttribute('data-plan-id');
        await rows.first().locator('.plan-comparison-choice > label').click();
        await page.waitForTimeout(250);
        const afterPointer = await rows.first().evaluate(geometry);
        await selected.screenshot({ path: `${OUT}/states/${key}-pointer-selected.png`, animations: 'disabled' });
        await page.locator(`[data-plan-id="${originalId}"] .plan-comparison-choice > label`).click();
        await page.waitForTimeout(250);
        // Keyboard: focus moves into the radio group and arrows change the plan.
        await page.locator(`#plan-${originalId}`).focus();
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(250);
        const focused = page.locator('[data-slot="fulfillment-plan"]:has(:focus-visible)');
        const keyboard = (await focused.count()) ? await focused.evaluate(geometry) : null;
        if (dpr === 2) await focused.screenshot({ path: `${OUT}/states/${key}-keyboard-focus.png`, animations: 'disabled' }).catch(() => {});
        manifest.probes.push({ key, locale, width, dpr, initial, afterPointer, keyboard, errors });
        console.log(key, initial.state, 'L', initial.left.width, 'T', initial.top.width, initial.top.color, 'shadow', initial.boxShadow, '| pointer outline', afterPointer.outline, '| keyboard', keyboard?.outline, keyboard?.state);
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await writeFile(`${OUT}/fulfillment-manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}
