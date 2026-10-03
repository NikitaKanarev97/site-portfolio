/**
 * Медиа пилота Agent Ops — /preview/agent-ops-pilot.
 *
 * Временные материалы до этапов 4 и 6 PLAN-CHATS.md: постер обложки вместо
 * ролика и кроп панели доказательств для выносок. Собираются из уже снятых
 * кадров public/media/case-agent-ops, новых съёмок нет.
 *
 *   poster-wide   1920×1080  ≥ 1200 px: очередь на десктопе и её телефонная
 *                            раскладка рядом, одной высоты; нижняя треть
 *                            пустая — под название
 *   poster-mid    1600×1200  768–1199 px, та же пара
 *   poster-tall   1080×1920  < 768 px: только десктоп — телефонная полоса
 *                            в узкой колонке вышла бы шириной 80 px
 *   evidence      панель «Why the agent answered this» из run-detail, по
 *                            границе панели
 *
 * Фон постера — surface-cover-agent (graphite-800, #253332): обложка ставит
 * постер object-fit: contain, и поля совпадают с цветом обложки.
 *
 * Запуск: node scripts/build-pilot-media.mjs
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SRC = 'public/media/case-agent-ops';
const OUT = 'public/media/pilot-agent-ops';
const BG = '#253332';
mkdirSync(OUT, { recursive: true });

/** Экран со скруглением, волосяной кромкой и мягкой тенью. */
async function screen(input, width, height, radius) {
  const img = await sharp(input).resize(width, height, { fit: 'fill' }).toBuffer();
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" ry="${radius}"/></svg>`,
  );
  const edge = Buffer.from(
    `<svg width="${width}" height="${height}"><rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" ry="${radius}" fill="none" stroke="rgba(255,255,255,0.10)"/></svg>`,
  );
  return sharp(img)
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: edge, blend: 'over' },
    ])
    .png()
    .toBuffer();
}

function shadow(width, height, radius, blur) {
  const pad = blur * 3;
  const svg = `<svg width="${width + pad * 2}" height="${height + pad * 2}">
    <defs><filter id="b"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
    <rect x="${pad}" y="${pad + blur * 0.6}" width="${width}" height="${height}" rx="${radius}" fill="rgba(0,0,0,0.45)" filter="url(#b)"/>
  </svg>`;
  return { input: Buffer.from(svg), pad };
}

/** Телефонная раскладка очереди — правая часть кадра диапазона, по краю карточки. */
async function phoneStrip() {
  return sharp(`${SRC}/range-review-queue.webp`)
    .extract({ left: 1643, top: 40, width: 317, height: 950 })
    .toBuffer();
}

async function poster(name, W, H, rowHeight, top, withPhone) {
  const desk = { w: Math.round(rowHeight * 1.6), h: rowHeight };
  const phone = withPhone ? { w: Math.round((rowHeight * 317) / 950), h: rowHeight } : null;
  const gap = Math.round(rowHeight * 0.055);
  const total = desk.w + (phone ? gap + phone.w : 0);
  let x = Math.round((W - total) / 2);
  const layers = [];

  const r = Math.round(rowHeight * 0.016);
  const blur = Math.round(rowHeight * 0.03);
  const s1 = shadow(desk.w, desk.h, r, blur);
  layers.push({ input: s1.input, left: x - s1.pad, top: top - s1.pad });
  layers.push({ input: await screen(`${SRC}/review-queue.webp`, desk.w, desk.h, r), left: x, top });

  if (phone) {
    x += desk.w + gap;
    const pr = Math.round(phone.w * 0.08);
    const s2 = shadow(phone.w, phone.h, pr, blur);
    layers.push({ input: s2.input, left: x - s2.pad, top: top - s2.pad });
    layers.push({ input: await screen(await phoneStrip(), phone.w, phone.h, pr), left: x, top });
  }

  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite(layers)
    .webp({ quality: 90, smartSubsample: true })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${OUT}/${name}.webp ${W}×${H}`);
}

await poster('poster-wide', 1920, 1080, 620, 48, true);
await poster('poster-mid', 1600, 1200, 720, 60, true);
await poster('poster-tall', 1080, 1920, 600, 330, false);

/* Панель доказательств: заголовок и список шагов трассы целиком, без
   пустого низа панели. Координаты — в пикселях файла 2000×1250. */
await sharp(`${SRC}/run-detail.webp`)
  .extract({ left: 1280, top: 164, width: 696, height: 548 })
  .webp({ quality: 92 })
  .toBuffer()
  .then((buf) => {
    // Файл может держать открытым dev-сервер (Windows): пишем, только если изменился.
    const file = `${OUT}/evidence-panel.webp`;
    if (!existsSync(file) || !readFileSync(file).equals(buf)) writeFileSync(file, buf);
  });
console.log(`${OUT}/evidence-panel.webp`);
