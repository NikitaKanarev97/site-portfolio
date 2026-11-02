import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const base = process.env.BASE_URL ?? 'http://127.0.0.1:5378';
const out = 'audit/vet-portfolio-case-v2/v2.1/after';
const results = [];
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 1280, 768, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow', isMobile: width < 768, hasTouch: width < 768 });
    const name = `${locale}-${width}`;
    await page.goto(base + (locale === 'ru' ? '/ru' : '') + '/work/vet-clinic', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const full = page.locator('.vet-cover .vet-shot__full:visible');
    const href = await full.getAttribute('href');
    assert.ok(href.endsWith(width >= 1024 ? 'visit-full-desktop.webp' : 'visit-full-mobile.webp'));
    await full.focus(); await page.keyboard.press('Enter');
    await page.locator('[data-media-zoom][open]').waitFor();
    const geometry = await page.locator('[data-media-zoom-image]').evaluate(async image => {
      await image.decode(); return { src: new URL(image.src).pathname, width: image.naturalWidth, height: image.naturalHeight };
    });
    assert.equal(geometry.src, href);
    await page.screenshot({ path: `${out}/${name}-complete-record-zoom.png` });
    await page.locator('[data-media-zoom-viewport]').evaluate(e => e.scrollTop = e.scrollHeight);
    await page.screenshot({ path: `${out}/${name}-complete-record-zoom-end.png` });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('[data-media-zoom]').open && !document.querySelector('[data-media-zoom-image]').hasAttribute('src'));
    assert.ok(await full.evaluate(e => document.activeElement === e));
    const clinical = page.locator('.vet-clinical .vet-shot__full:visible');
    await clinical.scrollIntoViewIfNeeded();
    await clinical.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
    const focus = await clinical.evaluate(e => ({ focused: document.activeElement === e, outline: getComputedStyle(e).outlineStyle, height: e.getBoundingClientRect().height }));
    assert.ok(focus.focused && focus.outline !== 'none' && focus.height >= 48);
    await page.screenshot({ path: `${out}/${name}-inspection-focus.png` });
    results.push({ name, href, geometry, focus });
    await page.close();
  }
} finally { await browser.close(); }
fs.writeFileSync(`${out}/interaction-evidence.json`, JSON.stringify(results, null, 2) + '\n');
console.log('10 full-record inspections and 10 keyboard focus captures verified.');
