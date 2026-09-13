/**
 * Пары «до / после доводки» кейса Vet Clinic OS — обе локали.
 *
 * Прогон доводки — `Veterinary-clinic/audit/product-polish/` (`VET-PP-2026-09-12`,
 * чаты 01–07). Набор задач тот же, что у пакета приёмки
 * `evidence/07-final/case/` (`runs/case.mjs`), но кадры пересняты этой нормой:
 * в пакете приёмки на обеих половинах стоит оболочка вьюера («← All screens»,
 * панель демо-данных), а остальные кадры кейса сняты без неё. Пара на странице
 * не должна отличаться от соседей тем, что к продукту не относится.
 *
 * «До» — боевой Vercel `veterinary-clinic-gules.vercel.app`, сборка
 * `main@0413e29`, с которой начался прогон. Совпадение проверено чатом 07 по
 * строкам бандла со сборкой `origin/main`; перед съёмкой 13.09.2026 бандл
 * по-прежнему `assets/index-G0YIfvHV.js`. **После выпуска доводки на Vercel
 * «до» оттуда больше не снять** — нужен worktree `0413e29` на своём порту
 * (`BASELINE_ORIGIN`). Скрипт проверяет имя бандла и падает, если оно другое.
 *
 * «После» — `vite preview` из `dist` коммита приёмки (`c2a65cc`; после него
 * в продукте менялись только документы).
 *
 * Норма — одна для обеих половин: свежий контекст, `localStorage` пуст (seed
 * по умолчанию), `prefers-reduced-motion: reduce`, плотность 2, не `fullPage`.
 *
 *   queue   /app/vet-day-queue, 1440×900. Первый экран дня.
 *   shift   /app/shift-impact, 1440×1400 — экран целиком: без нижней части
 *           не видно «Not affected» с Рексом у другого врача, ради которого
 *           перенос и переделан (VET-015). Высота — замер «после» (1 400),
 *           «до» короче и получает поле фона снизу, а не растяжение.
 *   owner   /app/owner-home, 390×844 после одной публикации выписки.
 *           Телефон ставится на квадратную подложку `--surface-media` с
 *           волосяной обводкой — той же, что у композита диапазона: портрет
 *           390 px в половине колонки страницы был бы втрое выше соседних
 *           пар. Берётся верх экрана, 560 css px: паспорт/шапка, статус,
 *           «что делать сегодня» — у обеих половин.
 *
 * У «до» адреса без `?patient=`: параметра в той сборке не было, пациент по
 * умолчанию тот же — Марсик.
 *
 * Запуск:
 *   1. Veterinary-clinic — npm run build && npx vite preview --port 5200
 *   2. здесь — node scripts/shoot-vet-pairs.mjs
 *      (MEDIA_ROOT — staging-каталог; по умолчанию public/media)
 *
 * Скрипт каталог не стирает: пишет только свои файлы.
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const AFTER = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5200';
const BEFORE = process.env.BASELINE_ORIGIN ?? 'https://veterinary-clinic-gules.vercel.app';
const BASELINE_BUNDLE = 'assets/index-G0YIfvHV.js';
const PLAYWRIGHT_REPO = process.env.PLAYWRIGHT_REPO ?? 'd:/Claude-projects/b2b-dssl';
const MEDIA_ROOT = process.env.MEDIA_ROOT ?? 'public/media';

const DEVICE_SCALE_FACTOR = 2;
const OUTPUT_MAX = 2000;
const WEBP_QUALITY = 82;

/** Подложка и обводка — значения токенов, те же, что у `shoot-range-frames.mjs`. */
const SURFACE_MEDIA = '#EFEFEC';
const BORDER_DEFAULT = '#E1E1DC';

const PAIRS = [
  { name: 'queue', route: '/app/vet-day-queue', viewport: { width: 1440, height: 900 } },
  { name: 'shift', route: '/app/shift-impact', viewport: { width: 1440, height: 1400 } },
  {
    name: 'owner',
    route: '/app/owner-home',
    query: '?patient=marsik',
    viewport: { width: 390, height: 844 },
    publish: true,
    phone: { crop: 560, canvas: 640 },
  },
];

const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  [class*="viewerBack"], [class*="protoToggle"], [class*="protoPanel"], [class*="protoDock"] { display: none !important; }
  [class*="viewer"] { padding-block-start: 0 !important; }
`;

const require = createRequire(path.join(PLAYWRIGHT_REPO, 'package.json'));
const { chromium } = require('playwright');

async function assertBaseline() {
  if (process.env.BASELINE_ORIGIN) return;
  const html = await (await fetch(`${BEFORE}/`)).text();
  if (!html.includes(BASELINE_BUNDLE)) {
    throw new Error(`«до» больше не main@0413e29: в ${BEFORE} нет ${BASELINE_BUNDLE}. Нужен worktree 0413e29 и BASELINE_ORIGIN.`);
  }
}

/** Телефон на квадратной подложке: верх экрана, волосяная обводка, поле вокруг. */
async function onCanvas(buffer, { crop, canvas }) {
  const { width } = await sharp(buffer).metadata();
  const phone = await sharp(buffer)
    .extract({ left: 0, top: 0, width, height: crop * DEVICE_SCALE_FACTOR })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: BORDER_DEFAULT })
    .png()
    .toBuffer({ resolveWithObject: true });
  const size = canvas * DEVICE_SCALE_FACTOR;
  return sharp({ create: { width: size, height: size, channels: 4, background: SURFACE_MEDIA } })
    .composite([{
      input: phone.data,
      left: Math.round((size - phone.info.width) / 2),
      top: Math.round((size - phone.info.height) / 2),
    }])
    .png()
    .toBuffer();
}

async function shoot() {
  await assertBaseline();
  const browser = await chromium.launch();

  for (const locale of ['en', 'ru']) {
    const prefix = locale === 'ru' ? '/ru' : '';
    const dir = path.resolve(MEDIA_ROOT, `case-vet${locale === 'ru' ? '-ru' : ''}`);
    await mkdir(dir, { recursive: true });

    for (const pair of PAIRS) {
      for (const [side, origin] of [['before', BEFORE], ['after', AFTER]]) {
        const context = await browser.newContext({
          viewport: pair.viewport,
          deviceScaleFactor: DEVICE_SCALE_FACTOR,
          reducedMotion: 'reduce',
          colorScheme: 'light',
        });
        await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
        await context.route('**/vet-api/**', (route) => route.abort());
        const page = await context.newPage();
        const query = side === 'after' ? (pair.query ?? '') : '';

        if (pair.publish) {
          const previewQuery = side === 'after' ? '?patient=marsik' : '';
          await page.goto(`${origin}${prefix}/app/discharge-preview${previewQuery}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(900);
          const button = side === 'after'
            ? page.locator('[data-track="discharge-publish"]')
            : page.getByRole('button', { name: /^(Publish|Опубликовать)/ }).first();
          await button.click();
          await page.waitForTimeout(1400);
        }

        await page.goto(`${origin}${prefix}${pair.route}${query}`, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: HIDE_CHROME });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(900);
        await page.evaluate(() => window.scrollTo(0, 0));
        if (locale === 'ru') {
          const lang = await page.evaluate(() => document.documentElement.lang);
          if (lang !== 'ru') throw new Error(`русская локаль не активна: ${side} ${pair.route}`);
        }

        let buffer = await page.screenshot({ type: 'png' });
        if (pair.phone) buffer = await onCanvas(buffer, pair.phone);

        const out = path.join(dir, `polish-${side}-${pair.name}.webp`);
        await sharp(buffer)
          .resize({ width: OUTPUT_MAX, height: OUTPUT_MAX, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(out);
        const { width, height } = await sharp(out).metadata();
        console.log(`  → ${path.relative(process.cwd(), out)} (${width}×${height})`);
        await context.close();
      }
    }
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
