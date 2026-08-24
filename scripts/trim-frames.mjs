/**
 * Обрезка кадров по содержимому — вторая половина «одной обработки».
 *
 * Кадры фрагментов ДС сняты со Storybook окном, а не по элементу, и половина
 * каждого — пустой фон справа. Замер 2026-08-25: у `system-price-block`,
 * `system-empty-state` и `system-fulfillment-plan` содержимое занимает 49%
 * кадра, у `system-availability` — 66%. В рамке страницы такой кадр читается
 * как ошибка вёрстки: подпись обещает матрицу состояний, а показывается
 * матрица и столько же пустоты рядом.
 *
 * Обрезка ничего не меняет в снимке — она снимает поле, которого в интерфейсе
 * нет. Это ровно та граница, которую проводит правка `CASE-20`: кадр не
 * трогается, не наклоняется и не обрабатывается «под стиль».
 *
 * Скрипт идемпотентен: у обрезанного кадра поле уже равно норме, второй
 * прогон вернёт тот же файл. Запускать можно поверх результата.
 *
 * Запуск: node scripts/trim-frames.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

/** Та же норма поля, что у кадров-фрагментов в scripts/shoot-case-frames.mjs. */
const TRIM_MARGIN = 24;
const WEBP_QUALITY = 82;
/** Ниже этой доли заполнения кадр считается неверно снятым. */
const FILL_THRESHOLD = 0.9;

const MEDIA_DIR = path.resolve('public/media/case-dssl');

/**
 * Кадры фрагментов ДС: шесть ячеек CaseSystemGrid и матрица вариантов.
 * Кадры экранов сюда не входят — у них поле не пустое, а часть интерфейса.
 */
const FRAMES = [
  'system-product-row.webp',
  'system-price-block.webp',
  'system-availability.webp',
  'system-resolution-row.webp',
  'system-fulfillment-plan.webp',
  'system-empty-state.webp',
  'storybook-matrix.webp',
];

async function fillRatio(file) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const { info } = await image.trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
  return { width, height, ratio: (info.width * info.height) / (width * height) };
}

async function run() {
  for (const name of FRAMES) {
    const file = path.join(MEDIA_DIR, name);
    const before = await fillRatio(file);

    if (before.ratio >= FILL_THRESHOLD) {
      console.log(`${name}: ${Math.round(before.ratio * 100)}% — поля нет, кадр не трогаем`);
      continue;
    }

    const source = await readFile(file);
    const trimmed = await sharp(source)
      .trim({ threshold: 8 })
      .extend({
        top: TRIM_MARGIN,
        bottom: TRIM_MARGIN,
        left: TRIM_MARGIN,
        right: TRIM_MARGIN,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    await sharp(trimmed).toFile(file);
    const { width, height } = await sharp(file).metadata();
    console.log(
      `${name}: ${Math.round(before.ratio * 100)}% → обрезан, ` +
        `${before.width}×${before.height} → ${width}×${height}`,
    );
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
