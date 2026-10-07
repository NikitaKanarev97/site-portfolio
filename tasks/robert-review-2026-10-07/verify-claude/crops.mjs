// Кропы сцен для визуальной приёмки M11, M12, M19–M21, M26, M27, M36, M39–M42, M46.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const out = join(dirname(fileURLToPath(import.meta.url)), 'crops');
mkdirSync(out, { recursive: true });
const base = 'http://127.0.0.1:4425';
const jobs = [
  // [name, url, width, selector, index]
  ['agent-cover', '/work/agent-ops-console/', 1440, '.case-opening', 0],
  ['partner-cover', '/work/partner-portal/', 1440, '.case-opening', 0],
  ['learn-cover', '/work/learn/', 1440, '.case-opening', 0],
  ['vet-cover', '/work/vet-clinic/', 1440, '.case-opening', 0],
  ['pawly-cover', '/work/pawly/', 1440, '.case-opening', 0],
  ['vet-cover-360', '/work/vet-clinic/', 360, '.case-opening', 0],
  ['learn-cover-360', '/work/learn/', 360, '.case-opening', 0],
  ['agent-stop', '/work/agent-ops-console/', 1440, '.case-steps__stop-symbol', 0, 'li'],
  ['agent-callout', '/work/agent-ops-console/', 1440, '[class*="case-callout"]', 0, 'section'],
  ['partner-callout', '/work/partner-portal/', 1440, '[class*="case-callout"]', 0, 'section'],
  ['learn-callout', '/work/learn/', 1440, '[class*="case-callout"]', 0, 'section'],
  ['partner-specimen', '/work/partner-portal/', 1440, '[class*="case-specimen"]', 0, 'section'],
  ['pawly-specimen', '/work/pawly/', 1440, '[class*="case-specimen"]', 0, 'section'],
  ['learn-routes', '/work/learn/', 1440, '[class*="case-routes"]', 0, 'section'],
  ['pawly-steps', '/work/pawly/', 1440, '#return-boundary', 0],
  ['vet-steps', '/work/vet-clinic/', 1440, '.case-steps', 0, 'section'],
  ['partner-steps', '/work/partner-portal/', 1440, '.case-steps', 0, 'section'],
  ['vet-next', '/work/vet-clinic/', 1440, '[class*="case-next"]', 0],
  ['partner-facts', '/work/partner-portal/', 1440, '.meta-list--facts', 0, 'section,div.ds-container'],
  ['vet-facts', '/work/vet-clinic/', 1440, '.meta-list--facts', 0, 'div.ds-container'],
  ['about-chapters', '/about/', 1440, 'main', 0],
  ['ru404-360', '/ru/404', 360, 'main', 0],
  ['vet-diagram', '/work/vet-clinic/', 1440, '[class*="dg-responsive"]', 0, 'section'],
];
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
for (const [name, url, w, sel, idx, up] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
  await page.waitForTimeout(400);
  let loc = page.locator(sel).nth(idx);
  if (up) { const h = await loc.evaluateHandle((el, up) => el.closest(up) || el, up); loc = h.asElement(); }
  try {
    await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    await loc.screenshot({ path: join(out, name + '.jpg'), type: 'jpeg', quality: 70 });
    console.log('ok', name);
  } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
  await ctx.close();
}
await browser.close();
