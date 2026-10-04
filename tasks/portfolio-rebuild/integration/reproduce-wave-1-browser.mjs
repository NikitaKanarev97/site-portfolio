/** Narrow launch proof for an already verified, unchanged wave-1 Git checkout. */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4364';
const out = process.argv.find(a => a.startsWith('--output='))?.slice(9) || 'tasks/portfolio-rebuild/integration/wave-1/clean-browser.json';
const req = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const browser = await req('playwright').chromium.launch({ executablePath: process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const profiles = [], captures = [], failures = [];
const check = (value, where, detail) => { if (!value) failures.push({ where, detail }); };
async function ready(page) {
  await page.waitForFunction(() => new URL(document.querySelector('link[rel="canonical"]').href).pathname === location.pathname);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__dsMotionBooted === true);
  await page.evaluate(() => window.__qaNativeTransitionFinished);
  await page.waitForTimeout(650);
}
async function move(page) {
  const track = page.locator('.case-next__track').last();
  const before = await track.evaluate(e => getComputedStyle(e).transform);
  await page.waitForTimeout(400);
  return before !== await track.evaluate(e => getComputedStyle(e).transform);
}
try {
  for (const slug of ['partner-portal', 'learn']) for (const lang of ['en', 'ru']) for (const js of [true, false]) {
    const route = `${lang === 'ru' ? '/ru' : ''}/work/${slug}/`;
    const context = await browser.newContext({ viewport: { width: js ? 1440 : 360, height: 900 }, javaScriptEnabled: js });
    await context.addInitScript(() => {
      const start = document.startViewTransition;
      if (start) document.startViewTransition = function (...args) {
        const transition = start.apply(this, args);
        window.__qaNativeTransitionFinished = transition.finished;
        return transition;
      };
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    if (js) await ready(page);
    await page.locator('.case-story img').evaluateAll(es => es.forEach(e => e.loading = 'eager'));
    await page.waitForFunction(() => [...document.querySelectorAll('.case-story img')].every(e => e.complete && e.naturalWidth));
    const row = await page.evaluate(() => ({ lang: document.documentElement.lang, blocks: document.querySelectorAll('[data-block-type]').length,
      states: document.querySelectorAll('[data-specimen-state]').length, overflow: document.documentElement.scrollWidth - innerWidth,
      canonical: document.querySelector('link[rel="canonical"]')?.href, next: document.querySelector('.case-next__link')?.getAttribute('href') }));
    Object.assign(row, { route, js, status: response.status() });
    check(row.status === 200 && row.lang === lang && row.blocks === 7 && row.states === (slug === 'learn' ? 6 : 13) && row.overflow === 0 && row.canonical === 'https://kanarev.com' + route, route, row);
    if (js && ((slug === 'partner-portal' && lang === 'en') || (slug === 'learn' && lang === 'ru'))) {
      for (const width of [390, 1440]) { await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(650); }
      await page.locator('.case-next__link').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      row.movingAfterResize = await move(page); check(row.movingAfterResize, route, 'Next after resize');
      await page.locator('.case-next__link').click(); await page.waitForURL(url => url.pathname.replace(/\/$/, '') === row.next.replace(/\/$/, '')); await ready(page);
      row.destination = new URL(page.url()).pathname;
      await page.goBack({ waitUntil: 'networkidle' }); await ready(page);
      check(new URL(page.url()).pathname === route, route, 'Back path');
      await page.locator('.case-next__link').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      row.movingAfterBack = await move(page); check(row.movingAfterBack, route, 'Next after Back');
      const alternate = lang === 'en' ? '/ru' + route : route.slice(3);
      await page.locator(`.navbar__desktop a[href="${alternate}"]`).click(); await page.waitForURL(url => url.pathname === alternate); await ready(page);
      row.localeDestination = new URL(page.url()).pathname;
      check(await page.locator('[data-story-version="blocks-v1"]').count() === 1, route, 'Locale story');
    }
    row.errors = errors; check(!errors.length, route, errors); profiles.push(row); await context.close();
  }
  const source = JSON.parse(readFileSync('tasks/portfolio-rebuild/common/captures.json', 'utf8'));
  for (const capture of source.media) {
    const response = await fetch(base + capture.file), bytes = Buffer.from(await response.arrayBuffer());
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const matches = response.status === 200 && sha256 === capture.sha256;
    captures.push({ file: capture.file, matches }); check(matches, capture.file, 'Corrected native alpha capture');
  }
} catch (error) {
  failures.push({ where: 'browser launch proof', detail: error.message });
} finally {
  await browser.close();
  writeFileSync(out, JSON.stringify({ base, profiles, captures, failures }, null, 2) + '\n');
}
console.log(JSON.stringify({ profiles: profiles.length, captures: captures.length, failures: failures.length }));
if (failures.length) process.exitCode = 1;
