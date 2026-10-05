/** Regression: client navigation must not move fixed case scenes offscreen.
 * node scripts/verify-case-navigation.mjs [origin]; NAV_BROWSER=webkit
 * NAV_EXECUTABLE optionally selects an already installed browser binary.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

let playwright;
try { playwright = await import('playwright'); }
catch { playwright = createRequire(new URL('../../Agent-ops-console/package.json', import.meta.url))('playwright'); }
const origin = process.argv[2] || 'http://127.0.0.1:4321';
const engine = process.env.NAV_BROWSER || 'chromium';
const browser = await playwright[engine].launch(process.env.NAV_EXECUTABLE
  ? { executablePath: process.env.NAV_EXECUTABLE } : {});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [], samples = [];
page.on('pageerror', error => errors.push(error.message));
const stageSelector = '[data-motion="focus-stage"]';

async function settled() {
  await page.waitForFunction(() => {
    const body = getComputedStyle(document.body);
    return body.transform === 'none' && body.willChange === 'auto' && body.opacity === '1';
  });
  await page.waitForTimeout(1500);
}

async function frames(label) {
  const geometry = await page.locator(stageSelector).evaluate(stage => {
    const spacer = stage.parentElement;
    if (!stage.classList.contains('is-focused') || !spacer.classList.contains('pin-spacer')) {
      throw new Error('Focus stage is not enhanced');
    }
    return { start: spacer.getBoundingClientRect().top + scrollY - 24,
      distance: parseFloat(getComputedStyle(spacer).paddingBottom) };
  });
  assert(geometry.distance > 0, `${label}: pin must reserve scrolling distance`);
  const points = [0.04, 0.32, 0.65, 0.96, 0.65, 0.32, 0.04];
  const expected = ['overview', 'workspace', 'promise', 'decision', 'promise', 'workspace', 'overview'];
  for (const [index, progress] of points.entries()) {
    // A reader gesture releases the resize/preference reading-position anchor.
    await page.mouse.wheel(0, 1);
    await page.waitForTimeout(50);
    await page.evaluate(y => scrollTo(0, y), geometry.start + geometry.distance * progress);
    await page.waitForTimeout(400);
    const sample = await page.locator(stageSelector).evaluate(stage => {
      const rect = stage.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const visible = [...stage.querySelectorAll('[data-focus-state]')].filter(step => {
        const css = getComputedStyle(step);
        return css.visibility !== 'hidden' && Number(css.opacity) > 0;
      });
      const ancestors = [];
      for (let el = stage; el; el = el.parentElement) {
        const css = getComputedStyle(el);
        ancestors.push({ tag: el.tagName, class: el.className, opacity: css.opacity,
          visibility: css.visibility, transform: css.transform, z: css.zIndex });
      }
      return { top: rect.top, bottom: rect.bottom, painted: stage.contains(hit), hit: hit?.outerHTML.slice(0, 160), ancestors,
        scenes: visible.map(step => step.dataset.scene),
        bodyTransform: getComputedStyle(document.body).transform,
        overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    samples.push({ label, progress, ...sample });
    if (!sample.painted || sample.scenes[0] !== expected[index]) {
      await mkdir('tmp/case-navigation', { recursive: true });
      await page.screenshot({ path: `tmp/case-navigation/${engine}-failure.png` });
    }
    assert.equal(sample.bodyTransform, 'none', `${label}: body retains navigation transform`);
    assert(Math.abs(sample.top - 24) < 2 && sample.bottom <= 900, `${label}: pin left the viewport`);
    assert(sample.painted, `${label}: stage is not painted at its viewport position`);
    assert.deepEqual(sample.scenes, [expected[index]], `${label}: wrong or blank frame`);
    assert(!sample.overflow, `${label}: horizontal overflow`);
  }
}

try {
  for (const locale of ['ru/', '']) {
    const home = `${origin}/${locale}`;
    const casePath = `/${locale}work/agent-ops-console`;
    await page.goto(home, { waitUntil: 'networkidle' });
    await settled();
    await page.evaluate(() => { window.__navigationProbe = true; });
    await page.locator(`a[href^="${casePath}"]`).first().click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === casePath);
    await settled();
    assert(await page.evaluate(() => window.__navigationProbe), 'Expected client navigation, not a reload');
    await frames(`${locale || 'en/'}client`);

    await page.reload({ waitUntil: 'networkidle' });
    await settled();
    await frames(`${locale || 'en/'}reload`);

    await page.goBack({ waitUntil: 'networkidle' });
    await settled();
    await page.goForward({ waitUntil: 'networkidle' });
    await settled();
    await frames(`${locale || 'en/'}history`);

    await page.setViewportSize({ width: 390, height: 844 });
    await settled();
    assert.equal(await page.locator(stageSelector).evaluate(el => el.classList.contains('is-focused')), false);
    await page.setViewportSize({ width: 1440, height: 900 });
    await settled();
    await frames(`${locale || 'en/'}resize`);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settled();
    assert.equal(await page.locator(stageSelector).evaluate(el => el.classList.contains('is-focused')), false);
    await page.goto(home, { waitUntil: 'networkidle' });
    await page.locator(`a[href^="${casePath}"]`).first().click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === casePath);
    await settled();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await settled();
    await frames(`${locale || 'en/'}motion-restored`);
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
} finally {
  await mkdir('tmp/case-navigation', { recursive: true });
  await writeFile(`tmp/case-navigation/${engine}.json`, JSON.stringify({ origin, engine, samples, errors }, null, 2));
  await browser.close();
}
console.log(`PASS: ${engine}, ${samples.length} visible frames across client navigation, reload, history, resize and motion preferences (EN/RU).`);
