import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const base = 'http://127.0.0.1:4411';
const out = new URL('../evidence/followup/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [];
const errors = [];
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 360]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 360 ? 780 : 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(base + (locale === 'ru' ? '/ru/' : '/'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const measure = () => page.evaluate(() => {
      function textBox(el) {
        const range = document.createRange(); range.selectNodeContents(el);
        const r = range.getBoundingClientRect(); return { top: r.top, height: r.height, center: r.top + r.height / 2 };
      }
      const button = document.querySelector('[data-copy-trigger]');
      const hint = document.querySelector('[data-copy-hint]');
      const label = document.querySelector('.hero__actions .ds-link__label');
      const b = textBox(button), h = textBox(hint);
      return { button: b, hint: h, centerDelta: Math.abs(b.center - h.center), hintText: hint.textContent, state: button.dataset.state,
        underline: getComputedStyle(label).textDecorationLine, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    const initial = await measure();
    const button = page.locator('[data-copy-trigger]');
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'copied');
    const copied = await measure();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    await page.locator('.hero__actions').screenshot({ path: new URL(`states-${locale}-${width}-copied.png`, out).pathname.slice(1), animations: 'disabled' });
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'default');
    const reset = await measure();
    await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: async () => { throw new Error('QA clipboard failure'); } }));
    await button.click();
    await page.waitForFunction(() => !document.querySelector('[data-copy-failure]').hidden);
    const failure = await page.locator('[data-copy-failure]').innerText();
    await page.locator('.hero__actions').screenshot({ path: new URL(`states-${locale}-${width}-failure.png`, out).pathname.slice(1), animations: 'disabled' });
    const portal = await page.locator('.work-stage--portal .work-stage__detail').innerText();
    if (initial.underline !== 'none' || (width === 1440 && (initial.centerDelta > 2 || copied.centerDelta > 2)) || initial.overflow > 0 || /·|demonstration|демонстрац/i.test(portal) || clipboard !== await button.getAttribute('data-email')) throw new Error(`Home verification failed: ${locale}/${width} ${JSON.stringify({initial,copied,portal,clipboard})}`);
    results.push({ locale, width, initial, copied, reset, clipboard, failure, portal });
    await ctx.close();
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({ viewport: { width, height: width === 360 ? 780 : 900 }, reducedMotion });
      const p = await context.newPage();
      p.on('pageerror', e => errors.push(String(e)));
      await p.goto(`${base}${locale === 'ru' ? '/ru' : ''}/work/agent-ops-console/`, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(1800);
      const gate = p.locator('.case-opening__gate');
      await gate.scrollIntoViewIfNeeded();
      const info = await gate.evaluate(el => ({ label: el.innerText, circle: !!el.querySelector('svg circle'), path: !!el.querySelector('svg path'), oldBars: !!el.querySelector('.case-opening__gate-line'), width: parseFloat(getComputedStyle(el.querySelector('svg')).width), visible: el.getBoundingClientRect().height > 0, overflow: document.documentElement.scrollWidth - innerWidth }));
      const lead = await p.locator('[data-cover-lead]').evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const text = range.getBoundingClientRect(); const box = el.getBoundingClientRect(); return { textRight: text.right, boxRight: box.right }; });
      if (lead.textRight > lead.boxRight + 1) throw new Error(`Clipped cover lead ${locale}/${width}: ${JSON.stringify(lead)}`);
      if (!info.circle || !info.path || info.oldBars || !info.visible || info.width !== (width === 360 ? 32 : 48) || info.overflow > 0) throw new Error(`Gate verification failed ${JSON.stringify(info)}`);
      await p.locator('.case-opening').screenshot({ path: new URL(`cover-${locale}-${width}-${reducedMotion}.png`, out).pathname.slice(1), animations: 'disabled' });
      results.push({ locale, width, reducedMotion, gate: info });
      await context.close();
    }
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log(`PASS: ${results.length} home/state and cover scenarios; no browser errors`);
} finally {
  await writeFile(new URL('followup-states.json', import.meta.url), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
