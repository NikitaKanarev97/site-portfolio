/**
 * Обложки второстепенных кейсов (Vet, Pawly) и первый кадр Pawly, 25.09.2026.
 *
 * Vet: превью строки на главной — один фрагмент очереди врача (заголовок,
 * незакрытые записи, пациенты в клинике) вместо двух уменьшенных экранов.
 * Кроп из принятого кадра cover/vet-day-queue.webp; края — в промежутках
 * между колонками и строками, ни одно слово не режется.
 *
 * Pawly: продукт мобильный, и экран показывается телефоном целиком — строка
 * статуса, кадр, полоса «домой»; ничего не срезано. Прежде экран стоял белой
 * карточкой без строки статуса и выглядел вырезкой, а не приложением.
 * Одна прогулка тремя экранами: владелец видит, у кого собака и когда её
 * ждать; исполнитель проверяет фото перед отправкой; отчёт подтверждает
 * возвращение. Экраны — принятые кадры кейса (1.5x), не перерисованы.
 * Тень запечена в прозрачный PNG: CSS-тень легла бы прямоугольником.
 *
 * Запуск: node scripts/build-secondary-covers.mjs
 */
import { createRequire } from 'node:module';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

// Vet ------------------------------------------------------------------------
const VET_BOX = { left: 355, top: 110, width: 835, height: 655 };
for (const locale of ['en', 'ru']) {
  const root = `public/media/case-vet${locale === 'ru' ? '-ru' : ''}/cover`;
  const meta = await sharp(`${root}/vet-day-queue.webp`).metadata();
  if (meta.width !== 2000 || meta.height !== 1250) throw new Error(`${root}: source size changed, recheck VET_BOX`);
  await sharp(`${root}/vet-day-queue.webp`).extract(VET_BOX).webp({ quality: 90 }).toFile(`${root}/queue-moment.webp`);
  console.log(`${root}/queue-moment.webp`);
}

// Pawly ----------------------------------------------------------------------
const SCREEN = { width: 390, height: 844 }; // кадры кейса — 585×1266 при 1.5x
const SCALE = 1.5;
const PAD = 48; // поле под тень
const GAP = 56;
const SETS = {
  'story': ['owner-home', 'handover-photo-review', 'order-details'],
  'story-phone': ['handover-photo-review'],
};

const phone = (src) => `
  <div class="phone">
    <div class="sb"><span>9:41</span><i><b></b><b></b><b></b><u></u></i></div>
    <img src="${src}">
    <div class="hb"></div>
  </div>`;

const page = (srcs) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  html, body { background: transparent; }
  .row { display: flex; gap: ${GAP}px; padding: ${PAD}px; width: max-content; }
  .phone { width: ${SCREEN.width}px; background: #fff; border-radius: 44px; overflow: hidden;
    box-shadow: 0 0 0 1px rgba(40, 32, 24, .10), 0 22px 44px -12px rgba(40, 32, 24, .28), 0 6px 14px -6px rgba(40, 32, 24, .16); }
  .phone img { display: block; width: 100%; height: ${SCREEN.height}px; }
  .sb { height: 47px; padding: 14px 30px 0 34px; display: flex; justify-content: space-between; align-items: center;
    font: 600 16px/1 system-ui, sans-serif; color: #111; position: relative; }
  .sb::before { content: ''; position: absolute; left: 50%; top: 11px; width: 122px; height: 34px; margin-left: -61px; border-radius: 20px; background: #000; }
  .sb i { display: flex; gap: 4px; align-items: flex-end; }
  .sb b { width: 4px; background: #111; border-radius: 1px; }
  .sb b:nth-child(1) { height: 6px; } .sb b:nth-child(2) { height: 9px; } .sb b:nth-child(3) { height: 12px; }
  .sb u { width: 25px; height: 12px; margin-left: 6px; border: 2px solid #111; border-radius: 4px; opacity: .9; }
  .hb { height: 34px; display: flex; align-items: center; justify-content: center; }
  .hb::after { content: ''; width: 134px; height: 5px; border-radius: 3px; background: #111; }
</style></head><body><div class="row">${srcs.map(phone).join('')}</div></body></html>`;

const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: SCALE });
const tab = await context.newPage();
for (const locale of ['en', 'ru']) {
  const root = path.resolve(`public/media/case-pawly${locale === 'ru' ? '-ru' : ''}`);
  await mkdir(`${root}/cover`, { recursive: true });
  for (const [name, screens] of Object.entries(SETS)) {
    // setContent открывает about:blank, file:// оттуда не читается — кадры идут data-URL.
    const srcs = await Promise.all(screens.map(async (s) => `data:image/webp;base64,${(await readFile(`${root}/${s}.webp`)).toString('base64')}`));
    await tab.setContent(page(srcs), { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    const png = await tab.locator('.row').screenshot({ omitBackground: true });
    const file = `${root}/cover/${name}.webp`;
    await sharp(png).webp({ quality: 90, alphaQuality: 100 }).toFile(file);
    const { width, height } = await sharp(file).metadata();
    console.log(path.relative(process.cwd(), file), `${width}×${height}`);
  }
}
await browser.close();
