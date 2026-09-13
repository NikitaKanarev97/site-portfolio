/**
 * Сквозной путь кейса Vet Clinic OS — чат 08 прогона доводки (13.09.2026).
 *
 * главная → карточка кейса → кейс → «Open the prototype» (новая вкладка) →
 * индекс прототипа → очередь → Start visit у Марсика → смена веса → сохранение
 * → F5 → Back; плюс прямой вход на кейс, F5, переключатель языка, зум кадра,
 * ролик и мобильная ширина. Обе локали, в **одном** контексте браузера и в
 * порядке RU → EN → RU: так проверяется, что язык прототипа задаёт только
 * адрес, по которому пришёл читатель, а не прошлый визит (схема Learn и
 * B2B Partner Portal: английский кейс — английский прототип, русский —
 * русский).
 *
 * Прототип внешний (Vercel). `PROTOTYPE_TARGET`:
 *   local (по умолчанию) — запросы к veterinary-clinic-gules.vercel.app
 *     отдаются из `vite preview` коммита приёмки на 5200: путь проверяется на
 *     той версии, которая уйдёт в выпуск;
 *   live — боевой Vercel без подмены; `LIVE_ACTION=1` добавляет полезное
 *     действие (только после выпуска доводки).
 *
 * Запуск: npm run build && npx astro preview --port 4322 --host 127.0.0.1;
 * в Veterinary-clinic — npx vite preview --port 5200; здесь —
 * node scripts/verify-vet-case-journey.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const PLAYWRIGHT_REPO = process.env.PLAYWRIGHT_REPO ?? 'd:/Claude-projects/b2b-dssl';
const require = createRequire(path.join(PLAYWRIGHT_REPO, 'package.json'));
const { chromium } = require('playwright');

const ORIGIN = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const LIVE = 'https://veterinary-clinic-gules.vercel.app';
const LOCAL = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5200';
const TARGET = process.env.PROTOTYPE_TARGET ?? 'local';

const COPY = {
  en: {
    home: '/', case: '/work/vet-clinic', switchTo: '/ru/work/vet-clinic', prototype: `${LIVE}/`,
    openLabel: 'Open the prototype', index: 'Product screens', start: /Start with Today.s visits/,
    queue: "Today's visits", startVisit: 'Start visit', save: 'Save quick trace', saved: 'Saved at 09:12', unsaved: 'Unsaved changes',
  },
  ru: {
    home: '/ru/', case: '/ru/work/vet-clinic', switchTo: '/work/vet-clinic', prototype: `${LIVE}/ru`,
    openLabel: 'Открыть прототип', index: 'Экраны продукта', start: 'Начать с сегодняшних визитов',
    queue: 'Сегодняшние визиты', startVisit: 'Начать приём', save: 'Сохранить короткий след', saved: 'Сохранено в 09:12', unsaved: 'Есть несохранённые правки',
  },
};

const results = [];
const check = (id, ok, detail = '') => {
  results.push({ id, ok, detail });
  console.log(`${ok ? 'ok' : 'XX'} ${id}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
if (TARGET === 'local') {
  await context.route(`${LIVE}/**`, async (route) => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: `${LOCAL}${url.pathname}${url.search}` });
    await route.fulfill({ response });
  });
}
const errors = [];
context.on('page', (p) => p.on('pageerror', (e) => errors.push(`${p.url()}: ${e.message}`)));

async function journey(locale, round) {
  const c = COPY[locale];
  const tag = `${locale}${round}`;
  const page = await context.newPage();

  // 1. Главная → карточка
  await page.goto(`${ORIGIN}${c.home}`, { waitUntil: 'networkidle' });
  // На главной Vet стоит в свёрнутом блоке «другие кейсы» (`details.more-cases`,
  // порядок кейсов — решение владельца, эта задача его не меняет): читатель
  // раскрывает блок и нажимает карточку.
  const more = page.locator('details.more-cases');
  if (await more.count()) {
    await more.locator('summary').scrollIntoViewIfNeeded();
    await more.locator('summary').click();
    await page.waitForTimeout(400);
  }
  const card = page.locator(`a[href="${c.case}"]`).locator('visible=true').first();
  check(`${tag} home card`, await card.count() === 1, c.case);
  await card.click();
  await page.waitForURL(`**${c.case}**`);
  await page.waitForLoadState('networkidle');
  const lang = await page.evaluate(() => document.documentElement.lang);
  check(`${tag} case lang`, lang === locale, lang);

  // 2. Ссылки на прототип и переключатель языка
  const protoHrefs = await page.$$eval('a[href*="veterinary-clinic-gules"]', (as) => as.map((a) => [a.href, a.target]));
  check(`${tag} prototype hrefs`, protoHrefs.length === 2 && protoHrefs.every(([h, t]) => h === c.prototype && t === '_blank'), JSON.stringify(protoHrefs));
  // Переключатель языка в шапке — ссылки с подписями EN / RU (BaseLayout).
  const switchHref = await page.$$eval('a', (as) => as.filter((a) => /^(EN|RU)$/.test(a.textContent.trim())).map((a) => a.getAttribute('href')));
  check(`${tag} language switch`, switchHref.some((h) => h && h.replace(/\/$/, '') === c.switchTo), JSON.stringify(switchHref));

  // 3. Новая вкладка → индекс прототипа в своей локали
  const link = page.getByRole('link', { name: new RegExp(c.openLabel) }).last();
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
  await popup.waitForLoadState('networkidle');
  await popup.waitForTimeout(700);
  check(`${tag} popup url`, popup.url().replace(/\/$/, '') === c.prototype.replace(/\/$/, ''), popup.url());
  check(`${tag} popup lang`, await popup.evaluate(() => document.documentElement.lang) === locale);
  check(`${tag} popup index`, await popup.getByRole('heading', { name: c.index }).count() > 0);

  // 4. Полезное действие: очередь → Марсик → вес → сохранить → F5 → Back
  // На боевом прототипе действие включается `LIVE_ACTION=1` — после выпуска
  // доводки; до выпуска там сборка с другими подписями.
  if (TARGET === 'local' || process.env.LIVE_ACTION === '1') {
    await popup.evaluate(() => localStorage.clear());
    await popup.reload({ waitUntil: 'networkidle' });
    await popup.getByRole('link', { name: c.start }).first().click();
    await popup.waitForURL('**/app/vet-day-queue');
    check(`${tag} queue`, await popup.getByRole('heading', { name: c.queue }).count() > 0, popup.url());
    // Марсик — вторая строка «в клинике» (Тим, Марсик, Байкал); кнопка берётся
    // по атрибуту трекинга, а не по подписи, а правильного пациента
    // подтверждает адрес (VET-014).
    await popup.locator('[data-track="clinic-visit-start"]').nth(1).click();
    await popup.waitForURL('**/app/visit-quick-trace?patient=marsik');
    check(`${tag} start visit marsik`, popup.url().includes(`${locale === 'ru' ? '/ru' : ''}/app/visit-quick-trace?patient=marsik`), popup.url());
    await popup.getByRole('button', { name: '5.2', exact: true }).first().click();
    const body = () => popup.evaluate(() => document.body.innerText);
    check(`${tag} dose recalculated`, /1\.05/.test(await body()) && (await body()).includes(c.unsaved));
    await popup.getByRole('button', { name: c.save }).click();
    await popup.waitForTimeout(500);
    check(`${tag} saved`, (await body()).includes(c.saved));
    await popup.reload({ waitUntil: 'networkidle' });
    await popup.waitForTimeout(600);
    check(`${tag} F5 keeps trace`, (await body()).includes(c.saved) && /5\.2/.test(await popup.locator('input').first().inputValue()));
    await popup.goBack({ waitUntil: 'networkidle' });
    await popup.waitForTimeout(500);
    check(`${tag} Back to queue`, popup.url().endsWith(`${locale === 'ru' ? '/ru' : ''}/app/vet-day-queue`), popup.url());
  }
  await popup.close();

  // 5. Кейс: прямой вход, F5, зум, ролик
  await page.goto(`${ORIGIN}${c.case}`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  check(`${tag} case F5`, await page.evaluate(() => document.documentElement.lang) === locale);
  const trigger = page.locator('[data-zoom-trigger]').nth(3);
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.waitForTimeout(500);
  const zoomSrc = await page.evaluate(() => { const d = document.querySelector('dialog[open]'); return d?.querySelector('img')?.getAttribute('src') ?? null; });
  check(`${tag} zoom opens`, Boolean(zoomSrc) && zoomSrc.includes(locale === 'ru' ? '/media/case-vet-ru/' : '/media/case-vet/'), zoomSrc);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(`${tag} zoom closes`, await page.evaluate(() => !document.querySelector('dialog[open]')));
  const video = await page.$eval('video', (v) => [...v.querySelectorAll('source')].map((s) => s.getAttribute('src'))).catch(() => []);
  check(`${tag} clip sources`, video.length === 2 && video.every((s) => s.includes('clip-dose-from-weight')), JSON.stringify(video));
  await page.goBack({ waitUntil: 'networkidle' }).catch(() => {});

  // 6. Мобильная ширина
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${ORIGIN}${c.case}`, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`${tag} 390 no overflow`, overflow <= 0, String(overflow));
  await page.close();
}

await journey('ru', 1);
await journey('en', 2);
await journey('ru', 3);

check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length} checks, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
