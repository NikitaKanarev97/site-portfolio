/**
 * Обложки трёх главных кейсов на главной — крупный фрагмент продукта.
 *
 * До 25.09.2026 обложка показывала экран целиком, уменьшенный в карточку:
 * на 1440 текст читался через силу, на 390 не читался вовсе, а край кадра
 * резал подписи. Теперь, как на обложках LinkedIn (`linkedin/covers`), в
 * карточке один момент продукта в натуральную величину: решение по выплате
 * в Agent Ops, выбор плана поставки в DSSL, вход по задаче рядом с
 * программами в Learn. У телефона свой кроп из мобильной вёрстки прототипа.
 *
 * Съёмка — живые прототипы, deviceScaleFactor 3, затем кроп и WebP.
 * Края кропов стоят в промежутках между строками: ни одно слово не режется.
 *
 * Выход: public/media/<folder>[-ru]/cover/home-{desktop,mobile}.webp
 * Запуск: node scripts/shoot-home-covers.mjs [agent|dssl|learn] [en|ru]
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

const SCALE = 3;
const [onlyCase, onlyLocale] = process.argv.slice(2);

const settle = async (page) => {
  await page.addStyleTag({ content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
};

const CASES = {
  agent: {
    folder: 'case-agent-ops',
    colorScheme: 'dark',
    // Очередь согласований принадлежит Shift Lead; роль ставится меню на индексе,
    // маршрут открывается внутри SPA — перезагрузка сбросила бы роль.
    open: async (page, locale) => {
      const pre = locale === 'ru' ? '/ru' : '';
      await page.goto(`https://agent-ops-console.vercel.app${pre}/`, { waitUntil: 'networkidle' });
      await settle(page);
      await page.locator('[data-track="shell:role-switch"]').first().click();
      await page.getByRole('menuitem', { name: /Priya S\./ }).first().click();
      await page.waitForTimeout(200);
      await page.evaluate((to) => { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')); }, `${pre}/screens/action-approvals`);
      await settle(page);
      if (locale === 'ru') { await page.evaluate(() => dispatchEvent(new Event('ru:localize'))); await page.waitForTimeout(400); }
    },
    desktop: { viewport: { width: 1920, height: 1200 }, clip: { en: [804, 164, 1107, 532], ru: [804, 164, 1107, 532] } },
    mobile: { viewport: { width: 390, height: 844 }, clip: { en: [0, 298, 390, 447], ru: [0, 298, 390, 447] } },
  },
  dssl: {
    folder: 'case-dssl',
    colorScheme: 'light',
    open: async (page, locale) => {
      const pre = locale === 'ru' ? '/ru' : '';
      await page.goto(`https://b2b-partner-portal-five.vercel.app${pre}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
      await page.goto(`https://b2b-partner-portal-five.vercel.app${pre}/fulfillment`, { waitUntil: 'networkidle' });
      await settle(page);
    },
    desktop: { viewport: { width: 1440, height: 1080 }, clip: { en: [72, 78, 1360, 528], ru: [72, 78, 1360, 538] } },
    mobile: { viewport: { width: 390, height: 844 }, clip: { en: [0, 600, 390, 465], ru: [0, 600, 390, 465] } },
  },
  learn: {
    folder: 'case-learn',
    colorScheme: 'light',
    open: async (page, locale) => {
      await page.goto(`https://kanarev.com/prototypes/learn/home?lang=${locale}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => sessionStorage.clear());
      await page.reload({ waitUntil: 'networkidle' });
      await settle(page);
    },
    desktop: { viewport: { width: 1440, height: 1000 }, clip: { en: [16, 100, 1408, 766], ru: [16, 100, 1408, 766] } },
    mobile: { viewport: { width: 390, height: 844 }, clip: { en: [0, 118, 390, 507], ru: [0, 118, 390, 507] } },
  },
};

const OUT_WIDTH = { desktop: 2400, mobile: 1000 };

const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
for (const [key, c] of Object.entries(CASES)) {
  if (onlyCase && onlyCase !== key) continue;
  for (const locale of ['en', 'ru']) {
    if (onlyLocale && onlyLocale !== locale) continue;
    for (const form of ['desktop', 'mobile']) {
      const spec = c[form];
      const context = await browser.newContext({
        viewport: spec.viewport, deviceScaleFactor: SCALE, reducedMotion: 'reduce', colorScheme: c.colorScheme,
      });
      await context.route('**/track.js', (r) => r.fulfill({ body: '' }));
      await context.route('**/b2b-api/**', (r) => r.abort());
      const page = await context.newPage();
      await c.open(page, locale);
      const [x, y, width, height] = spec.clip[locale];
      const png = await page.screenshot({ clip: { x, y, width, height }, fullPage: true });
      const dir = `public/media/${c.folder}${locale === 'ru' ? '-ru' : ''}/cover`;
      await mkdir(dir, { recursive: true });
      const file = `${dir}/home-${form}.webp`;
      await sharp(png).resize({ width: OUT_WIDTH[form] }).webp({ quality: 86 }).toFile(file);
      console.log(file, `${width}×${height}`);
      await context.close();
    }
  }
}
await browser.close();
