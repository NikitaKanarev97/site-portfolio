import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const phase = process.argv[2] ?? 'after';
const base = process.env.BASE_URL ?? 'http://127.0.0.1:5378';
const root = 'audit/vet-portfolio-case-v2/v2.2';
const out = `${root}/${phase}`;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = [], failures = [];
const hash = data => createHash('sha256').update(data).digest('hex');
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 1280, 390, 360]) {
    const name = `${locale}-${width}`;
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow', isMobile: width < 768, hasTouch: width < 768 });
    const entry = { name, locale, width, tests: [], errors: [], failedAssets: [] };
    page.on('pageerror', error => entry.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) entry.failedAssets.push(response.url()); });
    const test = (label, pass) => { entry.tests.push({ label, pass: !!pass }); if (!pass) failures.push(`${name}: ${label}`); };
    await page.goto(base + (locale === 'ru' ? '/ru' : '') + '/work/vet-clinic', { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img').forEach(image => image.loading = 'eager');
      await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode()));
    });
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) {
      await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(30);
    }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350);
    entry.hashes = {};
    for (const [key, locator] of [['hero', '.vet-cover'], ['body', '.vet-sheet'], ['outcome', '#outcome'], ['states', '#states']]) {
      const data = await page.locator(locator).screenshot({ path: `${out}/${name}-${key}.png` });
      entry.hashes[key] = hash(data);
    }
    await page.evaluate(() => scrollTo(0, 0));
    entry.hashes.viewport = hash(await page.screenshot({ path: `${out}/${name}-viewport.png` }));
    entry.hashes.full = hash(await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true }));
    entry.metrics = await page.evaluate(() => {
      const hero = document.querySelector('.vet-cover img');
      const r = hero.getBoundingClientRect();
      const brokenWords = [];
      for (const heading of document.querySelectorAll('.vet-case h1,.vet-case h2,.vet-case h3')) {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        for (let node; (node = walker.nextNode());) for (const word of node.textContent.matchAll(/[\p{L}\p{N}]+/gu)) {
          const range = document.createRange(); range.setStart(node, word.index); range.setEnd(node, word.index + word[0].length);
          if (new Set([...range.getClientRects()].filter(r => r.width).map(r => Math.round(r.top))).size > 1) brokenWords.push(word[0]);
        }
      }
      return {
        overflow: document.documentElement.scrollWidth - innerWidth, brokenWords,
        hero: { src: new URL(hero.currentSrc).pathname, alt: hero.alt, width: r.width, height: r.height, top: r.top, bottom: r.bottom, naturalWidth: hero.naturalWidth, naturalHeight: hero.naturalHeight, objectFit: getComputedStyle(hero).objectFit },
        bodyText: document.querySelector('.vet-sheet').innerText,
        bodyGeometry: (() => {
          const sheet = document.querySelector('.vet-sheet');
          const box = sheet.getBoundingClientRect();
          return [...sheet.querySelectorAll('section,h2,h3,p,img,a')].filter(e => e.getBoundingClientRect().width).map(e => {
            const r = e.getBoundingClientRect();
            return { tag: e.tagName, id: e.id, src: e.currentSrc ? new URL(e.currentSrc).pathname : undefined, href: e.getAttribute('href'), x: r.x - box.x, y: r.y - box.y, width: r.width, height: r.height };
          });
        })(),
        links: [...document.querySelectorAll('.vet-case a')].map(a => a.getAttribute('href')),
        inspection: [...document.querySelectorAll('.vet-shot__full')].filter(a => a.getBoundingClientRect().width).map(a => ({ color: getComputedStyle(a).color, decoration: getComputedStyle(a).textDecorationLine, height: a.getBoundingClientRect().height })),
      };
    });
    test('No horizontal overflow or split heading words', entry.metrics.overflow === 0 && entry.metrics.brokenWords.length === 0);
    const image = entry.metrics.hero;
    test('Natural image geometry, no stretch or object-fit crop', Math.abs(image.width / image.height - image.naturalWidth / image.naturalHeight) < 0.002 && image.objectFit !== 'cover');
    if (phase === 'after') {
      test('Correct genuine responsive hero', image.src.endsWith(width >= 1024 ? 'visit-workspace-desktop.webp' : 'visit-context-mobile.webp'));
      test('Complete desktop crop fits initial viewport at readable scale', width < 1024 || image.bottom <= 900 && image.width >= 980);
      test('Hero does not reuse Critical States private-note evidence', !image.src.includes('private-') && !image.src.includes('audience-'));
    }
    test('Accepted secondary inspection styling retained', entry.metrics.inspection.every(a => a.color !== 'rgb(212, 50, 32)' && a.decoration === 'none' && a.height >= 48));
    const triggers = page.locator('.vet-cover [data-zoom-trigger]:visible');
    entry.zoom = [];
    for (let i = 0; i < await triggers.count(); i++) {
      const trigger = triggers.nth(i);
      const expected = await trigger.evaluate(e => e.dataset.zoomFixed ? e.dataset.zoomSrc : new URL(e.querySelector('img').currentSrc).pathname);
      for (const input of ['pointer', 'keyboard']) {
        if (input === 'pointer') await trigger.click();
        else { await trigger.focus(); await page.keyboard.press('Enter'); }
        await page.locator('[data-media-zoom][open]').waitFor();
        const actual = await page.locator('[data-media-zoom-image]').evaluate(async image => { await image.decode(); return { src: new URL(image.src).pathname, width: image.naturalWidth, height: image.naturalHeight }; });
        test(`Actual ${input} zoom source ${i}`, actual.src === expected);
        if (input === 'keyboard') {
          await page.screenshot({ path: `${out}/${name}-zoom-${i}.png` });
          await page.keyboard.press('Tab');
          test(`Dialog focus containment ${i}`, await page.evaluate(() => !!document.activeElement.closest('[data-media-zoom]')));
          if (i === 1) {
            await page.locator('[data-media-zoom-viewport]').evaluate(e => e.scrollTop = e.scrollHeight);
            await page.screenshot({ path: `${out}/${name}-complete-record-end.png` });
          }
        }
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => !document.querySelector('[data-media-zoom]').open && !document.querySelector('[data-media-zoom-image]').hasAttribute('src'));
        test(`Escape and focus restoration ${i}/${input}`, await trigger.evaluate(e => document.activeElement === e));
        entry.zoom.push({ input, expected, actual });
      }
    }
    const full = page.locator('.vet-cover .vet-shot__full:visible');
    test('Complete original remains independently available', (await full.getAttribute('href')).endsWith(width >= 1024 ? 'visit-full-desktop.webp' : 'visit-full-mobile.webp'));
    await full.focus();
    test('Visible keyboard focus ring', await full.evaluate(e => getComputedStyle(e).outlineStyle !== 'none'));
    await page.screenshot({ path: `${out}/${name}-inspection-focus.png` });
    await page.addScriptTag({ path: require.resolve('axe-core') });
    entry.axe = await page.evaluate(async () => (await window.axe.run('.vet-cover', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact })));
    test('No hero axe WCAG A/AA findings', entry.axe.length === 0);
    test('No runtime errors or failed assets', entry.errors.length === 0 && entry.failedAssets.length === 0);
    if (phase === 'after') {
      const before = JSON.parse(fs.readFileSync(`${root}/before/results.json`)).results.find(r => r.name === name);
      entry.bodyPixelEquality = Object.fromEntries(['body', 'outcome', 'states'].map(k => [k, before.hashes[k] === entry.hashes[k]]));
      const oldGeometry = before.metrics.bodyGeometry;
      test('Body geometry, image sources and links unchanged', oldGeometry.length === entry.metrics.bodyGeometry.length && oldGeometry.every((old, i) => {
        const current = entry.metrics.bodyGeometry[i];
        return ['tag', 'id', 'src', 'href'].every(k => old[k] === current[k]) && ['x', 'y', 'width', 'height'].every(k => Math.abs(old[k] - current[k]) < 0.05);
      }));
      test('Body content unchanged', before.metrics.bodyText === entry.metrics.bodyText);
      if (width < 1024) test('Mobile viewport, hero and full page remain pixel-identical', ['viewport', 'hero', 'full'].every(k => before.hashes[k] === entry.hashes[k]));
    }
    results.push(entry);
    fs.writeFileSync(`${out}/results.json`, JSON.stringify({ base, browser: browser.version(), capturedAt: new Date().toISOString(), viewportHeight: 900, dpr: 1, results, failures }, null, 2) + '\n');
    console.log(name, entry.tests.filter(t => t.pass).length + '/' + entry.tests.length);
    await page.close();
  }
} finally { await browser.close(); }
assert.equal(failures.length, 0, failures.join('\n'));
