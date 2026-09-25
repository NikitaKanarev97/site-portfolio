/**
 * Исходники для обложек главных кейсов: экраны прототипов целиком, 3x.
 * Обложку из них собирает scripts/build-home-covers.mjs — экран фоном,
 * ключевые элементы крупно поверх. Выход: tmp/cover-sources/<key>-<locale>.png
 *
 * Запуск: node scripts/shoot-cover-sources.mjs [key]
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

const OUT = 'tmp/cover-sources';
const only = process.argv[2];

const settle = async (page, locale) => {
  await page.addStyleTag({ content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  if (locale === 'ru') { await page.evaluate(() => dispatchEvent(new Event('ru:localize'))); await page.waitForTimeout(400); }
};

// Agent Ops: роль ставится меню на индексе, маршрут — внутри SPA.
const agent = (route, person) => async (page, locale) => {
  const pre = locale === 'ru' ? '/ru' : '';
  await page.goto(`https://agent-ops-console.vercel.app${pre}/`, { waitUntil: 'networkidle' });
  await settle(page, locale);
  await page.locator('[data-track="shell:role-switch"]').first().click();
  await page.getByRole('menuitem', { name: new RegExp(person) }).first().click();
  await page.waitForTimeout(200);
  await page.evaluate((to) => { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')); }, `${pre}${route}`);
  await settle(page, locale);
};
const dssl = (route) => async (page, locale) => {
  const pre = locale === 'ru' ? '/ru' : '';
  await page.goto(`https://b2b-partner-portal-five.vercel.app${pre}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
  await page.goto(`https://b2b-partner-portal-five.vercel.app${pre}${route}`, { waitUntil: 'networkidle' });
  await settle(page, 'en');
};
const learn = (route) => async (page, locale) => {
  await page.goto(`https://kanarev.com/prototypes/learn${route}?lang=${locale}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await settle(page, 'en');
};

const SOURCES = {
  'agent-queue': { viewport: { width: 1920, height: 1200 }, dark: true, open: agent('/screens/review-queue', 'Martin K\\.') },
  'agent-approvals': { viewport: { width: 1920, height: 1200 }, dark: true, open: agent('/screens/action-approvals', 'Priya S\\.') },
  'dssl-fulfillment': { viewport: { width: 1440, height: 1080 }, open: dssl('/fulfillment') },
  'dssl-resolution': { viewport: { width: 1440, height: 1080 }, open: dssl('/resolution-center') },
  'learn-home': { viewport: { width: 1440, height: 1000 }, open: learn('/home') },
  'learn-trajectory': { viewport: { width: 1440, height: 1000 }, open: learn('/trajectory/proekt') },
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
for (const [key, s] of Object.entries(SOURCES)) {
  if (only && !key.startsWith(only)) continue;
  for (const locale of ['en', 'ru']) {
    const context = await browser.newContext({
      viewport: s.viewport, deviceScaleFactor: 3, reducedMotion: 'reduce', colorScheme: s.dark ? 'dark' : 'light',
    });
    await context.route('**/track.js', (r) => r.fulfill({ body: '' }));
    await context.route('**/b2b-api/**', (r) => r.abort());
    const page = await context.newPage();
    await s.open(page, locale);
    await page.screenshot({ path: `${OUT}/${key}-${locale}.png` });
    console.log(`${OUT}/${key}-${locale}.png`);
    await context.close();
  }
}
await browser.close();
