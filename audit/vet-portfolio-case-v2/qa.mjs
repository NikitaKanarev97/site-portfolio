import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const base = process.env.BASE_URL ?? 'http://127.0.0.1:5371';
const root = 'audit/vet-portfolio-case-v2';
const phase = process.argv[2] ?? 'final';
const out = `${root}/${phase}`;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = [], failures = [];
const media = Object.values(JSON.parse(fs.readFileSync('src/data/vet-v2-media.json')));
async function read(page) {
  await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode().catch(() => {}))); });
  // Exercise the real scroll-trigger lifecycle before full-page capture.
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(30); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350);
}
async function screenshot(page, path, locator, fullPage = false) {
  if (locator) await locator.screenshot({ path });
  else await page.screenshot({ path, fullPage });
}
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 1280, 768, 390, 360]) {
    const name = `${locale}-${width}`;
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow', isMobile: width < 768, hasTouch: width < 768 });
    const page = await ctx.newPage(), errors = [], failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failedRequests.push({ status: r.status(), url: r.url() }); });
    const prefix = locale === 'ru' ? '/ru' : '';
    const entry = { name, locale, width, tests: [], errors, failedRequests };
    const test = (label, value) => { entry.tests.push({ label, pass: !!value }); if (!value) failures.push(`${name}: ${label}`); };
    await page.goto(base + prefix + '/work/vet-clinic', { waitUntil: 'networkidle' });
    await read(page);
    await screenshot(page, `${out}/${name}-viewport.png`);
    await screenshot(page, `${out}/${name}-full.png`, undefined, true);
    for (const id of ['problem', 'roles', 'clinical', 'handoff', 'states', 'outcome']) {
      await screenshot(page, `${out}/${name}-${id}.png`, page.locator('#' + id));
    }
    entry.metrics = await page.evaluate(() => {
      const root = document.querySelector('.vet-case');
      const visible = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
      const images = [...root.querySelectorAll('img')].filter(visible).map(i => ({ src: new URL(i.currentSrc).pathname, alt: i.alt, width: i.getBoundingClientRect().width, height: i.getBoundingClientRect().height, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, complete: i.complete, fit: getComputedStyle(i).objectFit }));
      const textOverflow = [...root.querySelectorAll('p,h1,h2,h3,dt,dd,a,span')].filter(e => visible(e) && !e.closest('.ds-visually-hidden') && !e.classList.contains('ds-visually-hidden') && e.children.length === 0 && e.textContent.trim()).filter(e => { const r = e.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(e); return [...range.getClientRects()].some(t => t.width > 0 && (t.left < -1 || t.right > innerWidth + 1 || t.right > r.right + 2 && getComputedStyle(e).display !== 'inline')); }).map(e => ({ tag: e.tagName, text: e.textContent, className: e.className }));
      const mainProse = [...root.querySelectorAll('.vet-head__copy > p,.vet-state-copy > p,.vet-outcome__lead > p:not(.vet-label),.vet-outcome__trade > p:last-child,.vet-note,.vet-disclosure')].map(e => e.textContent).join(' ');
      const hero = root.querySelector('.vet-cover img');
      const hiddenHero = (() => { for (let el = hero; el && el !== root; el = el.parentElement) if (getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden') return true; return false; })();
      return { overflow: document.documentElement.scrollWidth - innerWidth, height: document.documentElement.scrollHeight, images, textOverflow, hiddenHero, mainProseWords: mainProse.split(/\s+/).filter(Boolean).length, totalVisibleWords: root.innerText.split(/\s+/).filter(Boolean).length, h1: root.querySelectorAll('h1').length, title: document.title, description: document.querySelector('meta[name="description"]').content, lang: document.documentElement.lang, canonical: document.querySelector('link[rel="canonical"]').href, alternates: [...document.querySelectorAll('link[rel="alternate"]')].map(e => ({ lang: e.hreflang, href: e.href })), og: document.querySelector('meta[property="og:image"]').content, fullLinks: [...root.querySelectorAll('.vet-shot__full')].filter(visible).map(e => e.getAttribute('href')), oldImages: [...root.querySelectorAll('img')].filter(i => /media\/(rebuild\/vet-clinic|case-vet\/)/.test(i.currentSrc)).length };
    });
    test('No document horizontal overflow', entry.metrics.overflow === 0);
    test('No cropped or overflowing prose', entry.metrics.textOverflow.length === 0);
    test('Hero image visible without waiting for a tall-image intersection', !entry.metrics.hiddenHero);
    test('One h1; correct locale and current metadata', entry.metrics.h1 === 1 && entry.metrics.lang === locale && entry.metrics.title.includes('Vet Clinic OS') && !entry.metrics.description.includes('thirty seconds'));
    test('Canonical and alternate locales', entry.metrics.canonical.endsWith(prefix + '/work/vet-clinic/') && entry.metrics.alternates.some(a => a.lang === 'en') && entry.metrics.alternates.some(a => a.lang === 'ru'));
    test('New cache-safe OG asset', entry.metrics.og.includes('work-vet-clinic-v2'));
    const ogResponse = await page.request.get(base + new URL(entry.metrics.og).pathname);
    test('OG image loads', ogResponse.ok());
    test('Old screenshots not rendered', entry.metrics.oldImages === 0);
    for (const i of entry.metrics.images) {
      const source = media.find(m => m.src === i.src);
      test(`Image loads and has alt: ${i.src}`, i.complete && i.naturalWidth > 0 && i.alt.length > 25);
      test(`Natural aspect ratio / native-width ceiling: ${i.src}`, !!source && Math.abs(i.width / i.height - source.width / source.height) < 0.003 && i.width <= source.cssWidth + 1 && i.fit !== 'cover');
    }
    test('Tablet / mobile hero uses a genuine mobile source', width >= 1024 || entry.metrics.images[0].src.endsWith('visit-context-mobile.webp'));
    // Every visible image and every visible complete-screen link opens the shared dialog.
    const triggers = page.locator('.vet-case [data-zoom-trigger]:visible');
    entry.zoom = [];
    for (let i = 0; i < await triggers.count(); i++) {
      const trigger = triggers.nth(i);
      const expected = await trigger.evaluate(e => e.dataset.zoomFixed ? e.dataset.zoomSrc : e.querySelector('img')?.currentSrc || e.dataset.zoomSrc);
      await trigger.focus(); await page.keyboard.press('Enter');
      await page.locator('[data-media-zoom][open]').waitFor();
      await page.locator('[data-media-zoom-image]').evaluate(i => i.decode());
      const actual = await page.locator('[data-media-zoom-image]').getAttribute('src');
      test(`Keyboard zoom source ${i}`, actual.endsWith(expected.replace(base, '')));
      if (i === 0) { await screenshot(page, `${out}/${name}-zoom.png`); await page.keyboard.press('Tab'); test('Focus remains in dialog', await page.evaluate(() => !!document.activeElement?.closest('[data-media-zoom]'))); }
      await page.keyboard.press('Escape');
      test(`Escape closes and restores focus ${i}`, await trigger.evaluate(e => document.activeElement === e) && !(await page.locator('[data-media-zoom]').evaluate(e => e.open)));
      entry.zoom.push({ source: actual, expected });
    }
    const productLinks = page.locator('.vet-case a[href^="https://veterinary-clinic-gules.vercel.app/"]');
    test('Correct product link / locale', await productLinks.count() >= 2 && (await productLinks.first().getAttribute('href')) === 'https://veterinary-clinic-gules.vercel.app/' + (locale === 'ru' ? 'ru/' : ''));
    await productLinks.last().focus();
    test('Keyboard focus ring', await productLinks.last().evaluate(e => getComputedStyle(e).outlineStyle !== 'none'));
    await page.addScriptTag({ path: require.resolve('axe-core') });
    const axe = await page.evaluate(async () => (await window.axe.run('.vet-case', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })));
    entry.axe = axe; test('No scoped axe WCAG A/AA findings', axe.length === 0);
    const next = page.locator('.vet-case [data-case-next]');
    test('Next case href retained', (await next.getAttribute('href')) === prefix + '/work/pawly');
    await next.click(); await page.waitForURL('**/work/pawly');
    await page.locator('#case-pawly').waitFor();
    test('Next-case navigation loads', await page.locator('h1').count() === 1);
    await page.goBack({ waitUntil: 'networkidle' });
    await page.locator('[data-story-version="vet-v2"]').waitFor();
    test('Back navigation restores Vet renderer', await page.locator('[data-story-version="vet-v2"]').count() === 1);
    test('No runtime errors or failed assets', errors.length === 0 && failedRequests.length === 0);
    results.push(entry); fs.writeFileSync(`${out}/results.json`, JSON.stringify({ base, browser: browser.version(), capturedAt: new Date().toISOString(), viewportHeight: 900, dpr: 1, results, failures }, null, 2));
    await ctx.close(); console.log(name, 'complete;', entry.tests.filter(t => t.pass).length, '/', entry.tests.length);
  }
  // Real public product link, without changing its data.
  const publicPage = await browser.newPage();
  for (const path of ['/', '/ru/']) { const r = await publicPage.goto('https://veterinary-clinic-gules.vercel.app' + path, { waitUntil: 'domcontentloaded' }); assert.ok(r.ok()); }
  await publicPage.close();
  // No-JS and live reduced-motion changes: images remain readable and links remain native.
  const extra = [];
  for (const locale of ['en', 'ru']) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage(); await page.goto(base + (locale === 'ru' ? '/ru' : '') + '/work/vet-clinic');
    await page.locator('.vet-cover img').evaluate(i => i.decode());
    const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, image: document.querySelector('.vet-cover img').naturalWidth, href: document.querySelector('.vet-cover a').getAttribute('href'), opacity: getComputedStyle(document.querySelector('.vet-cover')).opacity }));
    assert.equal(result.overflow, 0); assert.ok(result.image > 0 && result.href.startsWith('/media/case-vet-v2/'));
    await page.screenshot({ path: `${out}/${locale}-360-nojs.png` }); extra.push({ locale, mode: 'no-js', ...result }); await ctx.close();
    const motion = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await motion.goto(base + (locale === 'ru' ? '/ru' : '') + '/work/vet-clinic'); await motion.waitForTimeout(1500);
    await motion.emulateMedia({ reducedMotion: 'reduce' }); await motion.waitForTimeout(300);
    const reduced = await motion.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, titleOpacity: getComputedStyle(document.querySelector('h1')).opacity, imageOpacity: getComputedStyle(document.querySelector('.vet-cover__media')).opacity }));
    assert.equal(reduced.overflow, 0); assert.equal(reduced.titleOpacity, '1'); assert.equal(reduced.imageOpacity, '1');
    await motion.screenshot({ path: `${out}/${locale}-1440-live-reduce.png` }); extra.push({ locale, mode: 'live-reduce', ...reduced }); await motion.close();
  }
  fs.writeFileSync(`${out}/extra.json`, JSON.stringify(extra, null, 2));
  // Verify byte-identical public image files and exact source dimensions.
  for (const image of media) assert.equal(createHash('sha256').update(fs.readFileSync('public' + image.src)).digest('hex'), image.sha256);
} finally { await browser.close(); }
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
