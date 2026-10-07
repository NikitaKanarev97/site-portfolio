// Полностраничные кадры (не для просмотра — источник кропов) + обзорные листы.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const sharp = require('d:/Claude-projects/Site-portfolio/node_modules/sharp');
const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, '..', 'evidence', 'raw'); const EV = join(HERE, '..', 'evidence');
mkdirSync(RAW, { recursive: true });
const BASE = 'http://127.0.0.1:' + (process.argv[2] || '4421');
const pages = [['about', '/about/'], ['agent-ops-console', '/work/agent-ops-console/'], ['partner-portal', '/work/partner-portal/'], ['learn', '/work/learn/'], ['vet-clinic', '/work/vet-clinic/'], ['pawly', '/work/pawly/'], ['home', '/'], ['404', '/404']];
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
for (const [w, h] of [[1440, 900], [360, 780]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const loc of ['en', 'ru']) for (const [name, p] of pages) {
    const key = `${name}-${loc}-${w}`;
    if (only && !only.includes(key)) continue;
    if (loc === 'ru' && w === 360 && !process.env.ONLY) continue; // RU 360 только по запросу
    await page.goto(BASE + (loc === 'ru' ? '/ru' + p : p), { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(3000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(RAW, key + '.png'), fullPage: true });
    console.log('shot', key);
  }
  await ctx.close();
}
await browser.close();

// обзорные листы: EN 1440 → ширина 480, режем на колонки по 2300 px
const COLH = 2300, CW = 480, GAP = 20;
const cols = [];
for (const name of ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly', 'about', 'home']) {
  const buf = await sharp(join(RAW, `${name}-en-1440.png`)).resize({ width: CW }).png().toBuffer();
  const { height } = await sharp(buf).metadata();
  for (let y = 0, i = 0; y < height; y += COLH, i++) cols.push({ name: `${name}#${i + 1}`, buf: await sharp(buf).extract({ left: 0, top: y, width: CW, height: Math.min(COLH, height - y) }).toBuffer(), h: Math.min(COLH, height - y) });
}
const sheets = [];
for (let s = 0; s * 3 < cols.length; s++) {
  const part = cols.slice(s * 3, s * 3 + 3);
  const H = Math.max(...part.map(c => c.h)) + 40;
  const comp = part.flatMap((c, i) => [{ input: c.buf, left: i * (CW + GAP), top: 40 },
    { input: Buffer.from(`<svg width="${CW}" height="36"><text x="4" y="26" font-size="22" font-family="Arial" fill="#c00">${c.name}</text></svg>`), left: i * (CW + GAP), top: 0 }]);
  const f = join(EV, `overview-${s + 1}.png`);
  await sharp({ create: { width: 3 * CW + 2 * GAP, height: H, channels: 3, background: '#888' } }).composite(comp).png().toFile(f);
  sheets.push(`${f}: ${part.map(c => c.name).join(', ')}`);
}
writeFileSync(join(EV, 'overview-index.txt'), sheets.join('\n'));
console.log(sheets.join('\n'));
