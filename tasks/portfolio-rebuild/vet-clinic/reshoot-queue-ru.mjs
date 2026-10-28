/* 28.10.2026: one Russian frame, queue-ru.webp, reshot after the dictionary
   shortened «преданестезиологический осмотр» to «осмотр перед наркозом» — the
   long word broke mid-word in the Reason column. Same 1408×939 CSS geometry at
   DPR 2 as the frame it replaces; the previous file is kept beside it. */
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { browser, serve } from '../partner-portal/source-runtime.mjs';
sharp.cache(false);
const file = 'public/media/rebuild/vet-clinic/queue-ru.webp';
const { width, height } = await sharp(await readFile(file)).metadata();
await copyFile(file, 'tasks/portfolio-rebuild/vet-clinic/shots/queue-ru-before-2026-10-28.webp');
const source = await serve('D:/Claude-projects/Veterinary-clinic/dist', true), b = await browser();
try {
  const page = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await page.goto(`${source.base}/ru/app/vet-day-queue`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
  // The app frame itself, as in the original: 1408 CSS px wide inside a 1440 window.
  const raw = await page.locator('[class*="device"]').first().screenshot();
  const meta = await sharp(raw).metadata();
  if (meta.width !== width || meta.height < height) throw Error(`frame ${meta.width}×${meta.height}, expected ${width}×${height}+`);
  await writeFile(process.argv[2] ?? file, await sharp(raw).extract({ left: 0, top: 0, width, height }).webp({ quality: 94 }).toBuffer());
  console.log(await page.evaluate(() => document.documentElement.lang), width, height);
} finally { await b.close(); await source.close(); }
