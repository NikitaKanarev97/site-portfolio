/**
 * Partner Portal V3 — behaviour checks in real Chromium.
 *   node scripts/b2b-v3/qa-behaviour.mjs <production-origin> <dev-origin>
 *
 * Production build: reduced motion, no-JS, motion intermediate/final frames,
 * MediaZoom keyboard + focus return, anchors, links, locale switch, mobile
 * scroller focus. Dev build (exposes __dsMotionDebug): Astro navigation
 * lifecycle — trigger counts and duplicates after next-case → back → forward.
 * Writes audit/b2b-portfolio-case-premium-v3/logs/behaviour.json and motion PNGs.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const [prod = 'http://127.0.0.1:4411', dev = 'http://127.0.0.1:4412'] = process.argv.slice(2);
const OUT = process.env.OUT ?? 'audit/b2b-portfolio-case-premium-v3';
await mkdir(`${OUT}/logs`, { recursive: true });
await mkdir(`${OUT}/after/motion`, { recursive: true });
const browser = await chromium.launch();
const results = {};
const PATH = '/work/partner-portal/';

const hiddenText = page => page.evaluate(() => [...document.querySelectorAll('.portal-case [data-motion], .portal-case h2, .portal-case p, .portal-case li')]
  .filter(el => el.getClientRects().length && Number(getComputedStyle(el).opacity) < 0.99).length);
async function scrollAll(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate(top => window.scrollTo(0, top), y); await page.waitForTimeout(90); }
  await page.waitForTimeout(1500);
}

// 1. Reduced motion: everything visible immediately, no scroll needed.
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await c.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(prod + PATH, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  results.reducedMotion = { hiddenBeforeScroll: await hiddenText(p), errors };
  await c.close();
}

// 2. No JavaScript: complete static content.
for (const width of [1440, 390]) {
  const c = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false });
  const p = await c.newPage();
  await p.goto(prod + PATH, { waitUntil: 'networkidle' });
  await p.evaluate(() => [...document.images].forEach(i => { i.loading = 'eager'; }));
  await p.waitForTimeout(800);
  results[`noJs${width}`] = {
    hidden: await hiddenText(p),
    sections: await p.evaluate(() => [...document.querySelectorAll('.portal-case section[id]')].map(s => s.id)),
    archiveLinks: await p.locator('.portal-archive__link').evaluateAll(as => as.map(a => a.getAttribute('href'))),
  };
  await p.screenshot({ path: `${OUT}/after/en-${width}-nojs-full.png`, fullPage: true });
  await c.close();
}

// 3. Motion: intermediate and final frames of the diagram and the source line.
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto(prod + PATH, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/after/motion/hero-final.png` });
  for (const id of ['architecture', 'decision']) {
    const target = p.locator(id === 'architecture' ? '.portal-arch' : '.portal-line');
    await target.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(180);
    await p.screenshot({ path: `${OUT}/after/motion/${id}-intermediate.png` });
    await p.waitForTimeout(1600);
    await p.screenshot({ path: `${OUT}/after/motion/${id}-final.png` });
  }
  await c.close();
}

// 4. MediaZoom by keyboard, focus return; anchors; links; scroller focus.
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(prod + PATH + '#decision', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const anchorTop = await p.evaluate(() => Math.round(document.getElementById('decision').getBoundingClientRect().top));
  const link = p.locator('.portal-archive__link').nth(1);
  await link.focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(600);
  const opened = await p.evaluate(() => ({ open: document.querySelector('[data-media-zoom]')?.open, src: document.querySelector('[data-media-zoom-image]')?.getAttribute('src'), caption: document.querySelector('[data-media-zoom-caption]')?.textContent }));
  await p.screenshot({ path: `${OUT}/after/zoom-open-1440.png` });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  const afterClose = await p.evaluate(() => ({ open: document.querySelector('[data-media-zoom]')?.open, focus: document.activeElement?.className }));
  const links = await p.evaluate(() => ({
    cta: [...document.querySelectorAll('.portal-cta')].map(a => ({ href: a.href, target: a.target, rel: a.rel })),
    next: document.querySelector('.case-next a, a.case-next')?.getAttribute('href'),
    locale: [...document.querySelectorAll('a[hreflang], a[lang]')].map(a => a.getAttribute('href')).filter(h => h?.includes('partner-portal')),
    facts: [...document.querySelectorAll('.portal-facts a')].map(a => a.href),
  }));
  results.interaction = { anchorTop, opened, afterClose, links, errors };
  await c.close();
}
{
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto(prod + PATH, { waitUntil: 'networkidle' });
  const scrollers = await p.locator('.portal-family__states[tabindex="0"]').evaluateAll(list => list.map(el => ({ label: el.getAttribute('aria-label'), scrollable: el.scrollWidth > el.clientWidth, overflowX: getComputedStyle(el).overflowX })));
  results.mobileScrollers = { scrollers, docOverflow: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
  await c.close();
}

// 5. Lifecycle on the dev build: next case → back → forward, triggers stable.
try {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(dev + PATH, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const debug = () => p.evaluate(() => window.__dsMotionDebug?.());
  const first = await debug();
  await scrollAll(p);
  const nextHref = await p.evaluate(() => document.querySelector('.case-next a, a.case-next')?.getAttribute('href'));
  await p.locator('.case-next a, a.case-next').first().click();
  await p.waitForURL(url => !url.pathname.includes('partner-portal'));
  await p.waitForTimeout(2000);
  await p.goBack();
  await p.waitForURL(url => url.pathname.includes('partner-portal'));
  await p.waitForTimeout(2500);
  const back = await debug();
  await scrollAll(p);
  const hiddenAfterBack = await hiddenText(p);
  await p.goForward(); await p.waitForTimeout(1500); await p.goBack(); await p.waitForTimeout(2500);
  const twice = await debug();
  results.lifecycle = {
    nextHref,
    first: { triggers: first?.triggers, pins: first?.pins, duplicates: first?.duplicateScenes },
    back: { triggers: back?.triggers, pins: back?.pins, duplicates: back?.duplicateScenes },
    backAgain: { triggers: twice?.triggers, pins: twice?.pins, duplicates: twice?.duplicateScenes },
    hiddenAfterBack, errors,
  };
  await c.close();
} catch (e) { results.lifecycle = { error: e.message }; }

await browser.close();
await writeFile(`${OUT}/logs/behaviour.json`, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 1));
