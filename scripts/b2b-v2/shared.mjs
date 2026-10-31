/**
 * Shared session for Partner Portal V2 captures: the accepted product build
 * (b2b-partner-portal @ 6bbe1cd) served by Vite, the dashboard-v3 baseline
 * fixture, frozen clock, reduced motion. Same seed the product audits used.
 */
import { readFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');

export const PRODUCT_COMMIT = process.env.PRODUCT_COMMIT ?? '6bbe1cd71a656414efcc90a98c61d1012c55be92';
export const ORIGIN = process.env.PRODUCT_ORIGIN ?? 'http://127.0.0.1:5191/b2b';
const PRODUCT_ROOT = process.env.PRODUCT_ROOT ?? 'D:/Claude-projects/b2b-accepted';
const KEY = 'b2b-dssl.state.v1';
const CLOCK = '2026-10-30T09:00:00.000Z';

export const fixture = JSON.parse(await readFile(`${PRODUCT_ROOT}/audit/dashboard-v3/baseline-state.json`, 'utf8'));
export const browser = await chromium.launch();

/** state: 'baseline' (7 open lines) | 'resolved' (every line confirmed, as fulfillment audits). */
export async function open(route, { locale = 'en', width = 1280, height = 860, state = 'baseline', dpr = 2 } = {}) {
  const mobile = width < 768;
  const context = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: dpr, hasTouch: mobile, isMobile: mobile,
    reducedMotion: 'reduce', timezoneId: 'Europe/Moscow',
  });
  await context.routeWebSocket(/127\.0\.0\.1/, socket => socket.close());
  const active = structuredClone(fixture);
  if (state === 'resolved') active.specification.lines.forEach(line => { line.resolved = true; line.saveFailed = false; });
  await context.addInitScript(({ KEY, seed }) => { if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(seed)); }, { KEY, seed: active });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  await page.clock.setFixedTime(new Date(CLOCK));
  await page.goto(`${ORIGIN}/${locale === 'ru' ? 'ru/' : ''}${route.replace(/^\//, '')}`);
  await page.locator('main').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
  return { context, page };
}

export async function settle(page, ms = 350) {
  // Lazy images off-screen never fire load; eager them, and cap the wait.
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    const pending = [...document.images].filter(img => !img.complete)
      .map(img => new Promise(r => { img.addEventListener('load', r); img.addEventListener('error', r); }));
    await Promise.race([Promise.all(pending), new Promise(r => setTimeout(r, 4000))]);
  });
  await page.waitForTimeout(ms);
}

/** Union of element boxes in document coordinates, expanded by pad (CSS px). */
export async function unionBox(page, selectors, pad = 0) {
  const boxes = await page.evaluate(sels => sels.map(sel => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : null;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
  }), selectors);
  if (boxes.some(b => !b)) throw new Error('Missing selector: ' + selectors[boxes.findIndex(b => !b)]);
  const x = Math.min(...boxes.map(b => b.x)) - (pad.left ?? pad);
  const y = Math.min(...boxes.map(b => b.y)) - (pad.top ?? pad);
  const right = Math.max(...boxes.map(b => b.x + b.w)) + (pad.right ?? pad);
  const bottom = Math.max(...boxes.map(b => b.y + b.h)) + (pad.bottom ?? pad);
  return { x: Math.max(0, x), y: Math.max(0, y), width: right - Math.max(0, x), height: bottom - Math.max(0, y) };
}
