/**
 * Stage 1.2 — короткий smoke EN/RU на 1440 и 390 и повторная съёмка главной.
 *
 * Отличие от съёмки 1.1: перед снимком страница проматывается до низа и
 * скрипт ждёт, пока каждая <img> догрузится (complete && naturalWidth > 0).
 * В 1.1 полностраничный снимок делался без прокрутки, и ленивые обложки
 * Webflow-сборок (loading="lazy") ниже первого экрана попадали в кадр
 * незагруженными — отсюда пустая карточка Bloomlex на home-en-1440-full.png.
 *
 * Запуск (после `npx astro build`, при поднятом `npx astro preview --port 4392`):
 *   node tasks/review-2026-11/stage-1.2/capture.mjs [base]
 * Playwright берётся из соседнего репозитория прототипа: PLAYWRIGHT_REPO,
 * по умолчанию ../b2b-dssl.
 */
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4392';
const OUT = 'tasks/review-2026-11/stage-1.2/evidence';
const PAGES = ['/', '/about', '/work/partner-portal', '/work/learn', '/work/vet-clinic', '/work/pawly'];
const WIDTHS = [1440, 390];
const SHOOT = new Set(['/']);

const loadAll = async (page) => {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => [...document.images]
    .filter((i) => i.getAttribute('src'))
    .every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
const results = [];
for (const locale of ['en', 'ru']) {
  for (const p of PAGES) {
    for (const w of WIDTHS) {
      const url = BASE + (locale === 'ru' ? '/ru' : '') + (p === '/' ? '/' : p);
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const consoleErrors = [];
      const failed = [];
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      page.on('requestfailed', (r) => { if (r.url().startsWith(BASE)) failed.push(r.url()); });
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      await loadAll(page);
      // Видимая картинка обязана быть загружена. Скрытая (закрытый <dialog>,
      // display:none на этой ширине) ленивой не запрашивается браузером —
      // её проверяем прямым запросом: файл должен отдаваться с 200.
      const info = await page.evaluate(async () => {
        const visible = (i) => !i.closest('dialog:not([open])') && i.getClientRects().length > 0;
        const withSrc = [...document.images].filter((i) => i.getAttribute('src'));
        const hidden = withSrc.filter((i) => !visible(i));
        return {
        broken: withSrc.filter((i) => visible(i) && !(i.complete && i.naturalWidth > 0))
          .map((i) => i.getAttribute('src')),
        hiddenUrls: hidden.map((i) => i.currentSrc || i.src),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        agentOps: /agent\s*ops/i.test(document.body.innerText),
        devPreviews: [...document.querySelectorAll('.dev__preview img')]
          .map((i) => ({ src: i.getAttribute('src')?.split('/').pop(), w: i.naturalWidth })),
        };
      });
      info.hiddenChecked = info.hiddenUrls.length;
      info.hiddenBad = [];
      for (const u of info.hiddenUrls) {
        const r = await page.request.get(u);
        if (!r.ok()) info.hiddenBad.push(`${u} ${r.status()}`);
      }
      delete info.hiddenUrls;
      const row = { url, w, status: res?.status(), consoleErrors, failed, ...info };
      if (!row.devPreviews.length) delete row.devPreviews;
      results.push(row);
      if (SHOOT.has(p)) {
        await page.screenshot({ path: `${OUT}/home-${locale}-${w}-full.png`, fullPage: true });
        if (w === 1440) {
          await page.locator('.dev__preview').first().locator('xpath=ancestor::section[1]')
            .screenshot({ path: `${OUT}/builds-${locale}-1440.png` });
        }
      }
      console.log(w, url, row.status, `console=${consoleErrors.length} failed=${failed.length} broken=${info.broken.length} hidden=${info.hiddenChecked}/bad=${info.hiddenBad.length} overflow=${info.overflow} agentOps=${info.agentOps}`);
      await ctx.close();
    }
  }
}
await browser.close();
await writeFile(`${OUT}/smoke-results.json`, JSON.stringify(results, null, 1) + '\n');
