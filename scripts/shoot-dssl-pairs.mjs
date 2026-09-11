/**
 * Пары «до / после доводки» кейса B2B Partner Portal — обе локали.
 *
 * «До» — прототип на коммите `8a5b3d4`, с которого начался прогон доводки
 * (`b2b-dssl/audit/product-polish/`), поднятый отдельным worktree на своём
 * порту. «После» — текущее рабочее дерево. Кадры `evidence/01-baseline/`
 * прогона сюда не берутся и не трогаются: они сняты 1× и другим харнессом,
 * а пара обязана быть сопоставимой по всему, кроме продукта (ось `E2`).
 *
 * Норма пары — одна для обеих половин: вьюпорт `1440×900`, плотность 2,
 * свежий контекст на каждый кадр, `prefers-reduced-motion: reduce`, та же
 * локаль и те же мок-данные. Не `fullPage`: пара встаёт в ряд
 * `process.artifacts` двумя равными кадрами, и половины разной высоты
 * читались бы ошибкой вёрстки. 1440 — ширина, на которой прогон судил
 * продукт (`SCREENS.md`); 900 — первый экран, в котором видны и шапка
 * очереди (где были четыре плитки счётчиков), и нижняя панель следующего
 * шага (`D027`), которой до доводки не было.
 *
 *   resolution   Пара страницы: `/resolution-center`. Идёт в каталог кейса.
 *   search       Материалы (Upwork): поиск артикула, которого нет в каталоге.
 *                До — тот же набор на любой запрос (`PP-028`), после — ответ
 *                на запрос.
 *   locale       Материалы: `/ru/service-unavailable` — худшая точка русской
 *                локали до доводки, 0 % перевода (`S4`). Только `ru`.
 *
 * Плюс `SINGLES` — одиночные кадры пакета Upwork нормой кадров кейса (ниже).
 *
 * Запуск:
 *   1. b2b-dssl — `npm run dev -- --port 5199`
 *   2. worktree `8a5b3d4` — `node node_modules/vite/bin/vite.js
 *      --config vite.baseline.config.ts --host 127.0.0.1 --port 5198`
 *   3. здесь — node scripts/shoot-dssl-pairs.mjs
 *
 * Скрипт каталог не стирает: пишет только свои файлы.
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const AFTER = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b';
const BEFORE = process.env.BASELINE_ORIGIN ?? 'http://127.0.0.1:5198/b2b';
const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/b2b-dssl';
const MATERIALS = path.join(PROTOTYPE_REPO, 'audit/product-polish/evidence/09-case/pairs');

const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;
const OUTPUT_WIDTH = 2000;
const WEBP_QUALITY = 82;

/** Артикул, которого в каталоге нет ни в одной форме записи. */
const MISSING_SKU = 'ZX-0000-NONE';

const PAIRS = [
  {
    name: 'resolution',
    route: '/resolution-center',
    locales: ['en', 'ru'],
    out: (locale, side) => path.resolve(`public/media/case-dssl${locale === 'ru' ? '-ru' : ''}/polish-${side}-resolution.webp`),
  },
  {
    name: 'search',
    route: `/search?q=${MISSING_SKU}`,
    locales: ['en', 'ru'],
    out: (locale, side) => path.join(MATERIALS, `search-missing-sku__${locale}__${side}.webp`),
  },
  {
    name: 'locale',
    route: '/service-unavailable',
    locales: ['ru'],
    out: (locale, side) => path.join(MATERIALS, `service-unavailable__${locale}__${side}.webp`),
  },
];

/**
 * Одиночные кадры пакета Upwork, которых нет на странице кейса. Норма — кадров
 * кейса (`shoot-dssl-frames.mjs`): 1760×1100 @1.5 → 2000×1250, текущий продукт,
 * только `en` (карточка англоязычная). Прежний `xls-parse-result.webp` стёрт
 * пересъёмкой 11.09.2026, а блок 6 карточки на нём стоит: результат разбора —
 * «48 прочитано, 41 точных, 7 на разбор, 0 потеряно» — и есть тезис блока 5.
 */
const SINGLES = [
  { route: '/xls-import/parse-result', out: path.resolve('public/media/case-dssl/xls-parse-result.webp') },
];

const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
const { chromium } = require('playwright');

/* `/b2b/` для корня, `/b2b/ru` без косой черты — как в `shoot-dssl-frames.mjs`. */
function url(origin, locale, route) {
  const prefix = locale === 'ru' ? '/ru' : '';
  return `${origin}${prefix}${route}`;
}

async function shoot() {
  const browser = await chromium.launch();

  for (const pair of PAIRS) {
    for (const locale of pair.locales) {
      for (const [side, origin] of [['before', BEFORE], ['after', AFTER]]) {
        const context = await browser.newContext({
          viewport: VIEWPORT,
          deviceScaleFactor: DEVICE_SCALE_FACTOR,
          reducedMotion: 'reduce',
          colorScheme: 'light',
        });
        await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
        await context.route('**/b2b-api/**', (route) => route.abort());
        const page = await context.newPage();
        await page.goto(url(origin, locale, pair.route), { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: HIDE_CHROME });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(700);

        const lang = await page.evaluate(() => document.documentElement.lang);
        if ((locale === 'ru') !== (lang === 'ru')) {
          throw new Error(`${pair.name} · ${side}: локаль ${lang}, ожидалась ${locale}`);
        }

        const out = pair.out(locale, side);
        await mkdir(path.dirname(out), { recursive: true });
        await sharp(await page.screenshot({ type: 'png' }))
          .resize({ width: OUTPUT_WIDTH })
          .webp({ quality: WEBP_QUALITY })
          .toFile(out);
        const { width, height } = await sharp(out).metadata();
        console.log(`${pair.name} · ${locale} · ${side} → ${out} (${width}×${height})`);
        await context.close();
      }
    }
  }

  for (const single of SINGLES) {
    const context = await browser.newContext({
      viewport: { width: 1760, height: 1100 },
      deviceScaleFactor: 1.5,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
    await context.route('**/b2b-api/**', (route) => route.abort());
    const page = await context.newPage();
    await page.goto(url(AFTER, 'en', single.route), { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_CHROME });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    await sharp(await page.screenshot({ type: 'png' }))
      .resize(2000, 1250, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(single.out);
    console.log(`single · en → ${single.out}`);
    await context.close();
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
