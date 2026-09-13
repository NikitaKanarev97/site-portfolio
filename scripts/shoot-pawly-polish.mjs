/** Chat 06. Own local headless browser; real accepted components and synthetic fixture.
 * Run product Vite on 5173, then node scripts/shoot-pawly-polish.mjs.
 * No production data, user browser, retouching or generated UI.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
const product = process.env.PAWLY_REPO ?? 'D:/Claude-projects/PETS-walking';
const require = createRequire(path.join(product, 'package.json'));
const { chromium } = require('playwright');
const { frame, baseURL } = await import(pathToFileURL(path.join(product, 'audit/product-polish/evidence/02-pilot/capture.mjs')));
const evidence = path.join(product, 'audit/product-polish/evidence/06-case');
await fs.mkdir(evidence, { recursive: true });
const seed = JSON.parse(await fs.readFile(path.join(product, 'audit/product-polish/evidence/05-acceptance/entry-baseline.json'), 'utf8')).data;
seed.riskProfile.answered = true;
seed.booking.id = 'pawly-case-06';
const browser = await chromium.launch({ headless: true });
const captureBrowser = { newPage: options => browser.newPage({ ...options, deviceScaleFactor: 1.5 }) };
const records = [];
async function state(page) { return page.evaluate(() => JSON.parse(localStorage.getItem('pawly-wire-data-v4'))); }
async function shoot(page, name, dir, locale) {
  if (name === 'walker-profile') await page.locator('[data-track="walker-confirm"]').waitFor();
  await page.evaluate(async () => { scrollTo(0, 0); await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await page.waitForTimeout(300);
  const png = await page.screenshot();
  await fs.writeFile(path.join(evidence, `${name}-${locale}.png`), png);
  const file = path.join(dir, `${name}.webp`);
  await sharp(png).webp({ quality: 90 }).toFile(file);
  const data = await state(page);
  records.push({ name, locale, viewport: '390x844', deviceScaleFactor: 1.5, file, sha256: createHash('sha256').update(await fs.readFile(file)).digest('hex'), booking: data.booking, earnings: data.earnings });
}
async function record(page, dir, locale) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const client = await page.context().newCDPSession(page);
  const frames = [];
  client.on('Page.screencastFrame', f => { frames.push({ data: f.data, t: f.metadata.timestamp }); client.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: 390, maxHeight: 844, everyNthFrame: 1 });
  await page.waitForTimeout(2200);
  await page.locator('[data-track="photo-send"]').click();
  await page.getByRole('heading', { name: locale === 'ru' ? 'Возврат подтверждён' : 'Return confirmed', exact: true }).waitFor();
  await page.waitForTimeout(2400);
  await page.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}/app/order-details`);
  await page.waitForTimeout(3200);
  await page.evaluate(() => document.querySelector('article')?.scrollTo({ top: 440, behavior: 'smooth' }));
  await page.waitForTimeout(1800);
  await client.send('Page.stopScreencast');
  frames.push({ ...frames.at(-1), t: Date.now() / 1000 });
  const scratch = path.resolve('.tmp', `pawly-06-${locale}`);
  await fs.mkdir(scratch, { recursive: true });
  const list = [];
  for (let i = 0; i < frames.length; i++) {
    const file = path.join(scratch, `f${String(i).padStart(5, '0')}.jpg`).replaceAll('\\', '/');
    await fs.writeFile(file, Buffer.from(frames[i].data, 'base64'));
    list.push(`file '${file}'`, `duration ${Math.max(1 / 120, (frames[i + 1]?.t ?? frames[i].t + 1 / 30) - frames[i].t).toFixed(4)}`);
  }
  const listFile = path.join(scratch, 'frames.txt');
  await fs.writeFile(listFile, list.join('\n'));
  const out = path.join(dir, 'clip-return-proof');
  for (const [ext, codec] of [['mp4', ['-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart']], ['webm', ['-c:v', 'libvpx-vp9', '-crf', '29', '-b:v', '0', '-row-mt', '1']]]) {
    const result = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-r', '30', '-an', '-pix_fmt', 'yuv420p', ...codec, `${out}.${ext}`], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0) throw Error(result.stderr.slice(-2000));
  }
  // Same initial state at the portfolio's 1.5x still-image density.
  await fs.copyFile(path.join(dir, 'handover-photo-review.webp'), `${out}-poster.webp`);
  const data = await state(page);
  if (!data.booking.dropoffComplete || data.earnings.available !== 3895) throw Error(`Unexpected settlement: ${JSON.stringify(data.earnings)}`);
  records.push({ name: 'clip-return-proof', locale, duration: frames.at(-1).t - frames[0].t, frames: frames.length, booking: data.booking, earnings: data.earnings, note: 'Actual local→sending→confirmed→report. CDP timestamps preserved; no artificial loop/reset.' });
}
try {
  for (const locale of ['en', 'ru']) {
    const dir = path.resolve('public/media', `case-pawly${locale === 'ru' ? '-ru' : ''}`);
    await fs.mkdir(dir, { recursive: true });
    const draft = structuredClone(seed);
    Object.assign(draft.booking, { status: 'draft', pickupComplete: false, dropoffComplete: false, walkerAcceptedId: undefined });
    const p = await frame(captureBrowser, { slug: 'walker-list', locale, fixture: draft });
    await shoot(p, 'walker-list', dir, locale);
    await p.locator('[data-track="walker-select-marina"]').click();
    await shoot(p, 'walker-profile', dir, locale);
    await p.close();
    const q = await frame(captureBrowser, { slug: 'owner-home', locale, fixture: seed });
    await shoot(q, 'owner-home', dir, locale);
    await q.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}/app/active-service`);
    await shoot(q, 'active-service', dir, locale);
    await q.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}/app/walker-active-order`);
    await shoot(q, 'walker-active-order', dir, locale);
    await q.locator('[data-track="walker-next-photo"]').click();
    await q.locator('[data-track="photo-select"]').click();
    await shoot(q, 'handover-photo-review', dir, locale);
    await record(q, dir, locale);
    await shoot(q, 'order-details', dir, locale);
    await q.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}/app/walker-earnings`);
    await shoot(q, 'walker-earnings', dir, locale);
    await q.reload();
    if ((await state(q)).earnings.available !== 3895) throw Error('Settlement repeated on reload');
    await q.close();
    // A contact sheet is secondary evidence. Single screens remain separately zoomable.
    const files = ['walker-profile', 'active-service', 'order-details'];
    await sharp({ create: { width: 1266, height: 892, channels: 3, background: '#F7F7F5' } })
      .composite(await Promise.all(files.map(async (n, i) => ({ input: await sharp(path.join(dir, `${n}.webp`)).resize(390, 844).toBuffer(), left: 24 + i * 414, top: 24 }))))
      .webp({ quality: 90 }).toFile(path.join(dir, 'range-evidence-chain.webp'));
    console.log(`${locale}: 8 real frames, return-proof recording, one settlement and reload verified`);
  }
  await fs.writeFile(path.join(evidence, 'media-manifest.json'), JSON.stringify({ date: new Date().toISOString(), fixture: seed, records }, null, 2));
} finally { await browser.close(); }
