/* Russian twin of the state captures in capture.mjs, 28.10.2026: same stories,
   selectors and widths, through the catalog's own `globals=locale:ru`. Written
   into `states/ru/`, so the English specimen keeps its frames. */
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { serve } from '../partner-portal/source-runtime.mjs';
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/PETS-walking/package.json');
const { chromium } = require('playwright');
const out = 'public/media/rebuild/pawly/states/ru';
await mkdir(out, { recursive: true });
const hash = b => createHash('sha256').update(b).digest('hex');
const catalog = await serve('D:/Claude-projects/PETS-walking/storybook-static');
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const states = [
  ['photo-pending', 'photoproof', 'pending', 'figure[data-proof-status]'],
  ['photo-local', 'photoproof', 'local', 'figure[data-proof-status]'],
  ['photo-confirmed', 'photoproof', 'compact', 'figure[data-proof-status]'],
  ['timeline-done', 'timelinerow', 'done', '[data-state]'],
  ['timeline-current', 'timelinerow', 'current', '[data-state]'],
];
const records = [];
try {
  for (const [id, family, state, selector] of states) for (const width of [343, 288]) {
    const page = await browser.newPage({ viewport: { width: 500, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const url = `${catalog.base}/iframe.html?id=components-${family}--${state}&viewMode=story&globals=locale:ru`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const node = page.locator(`#storybook-root ${selector}`).first();
    await node.waitFor();
    await page.evaluate(w => { document.body.style.background = 'transparent'; const d = document.querySelector('#storybook-root > div'); if (d) d.style.width = w + 'px'; }, width);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    await page.waitForTimeout(400);
    const box = await node.boundingBox();
    const png = await page.screenshot({ clip: { x: box.x - 2, y: box.y - 2, width: box.width + 4, height: box.height + 4 }, omitBackground: true });
    const bytes = await sharp(png).webp({ quality: 95 }).toBuffer();
    await writeFile(`${out}/${id}-${width}.webp`, bytes);
    const text = await node.innerText();
    records.push({ id: `${id}-${width}`, file: `${out}/${id}-${width}.webp`, story: `components-${family}--${state}`, locale: 'ru', width: box.width + 4, height: box.height + 4, text, sha256: hash(bytes) });
    console.log(id, width, JSON.stringify(text));
    await page.close();
  }
  await writeFile('tasks/portfolio-rebuild/pawly/captures-states-ru.json', JSON.stringify({ date: '2026-10-28', records }, null, 2));
} finally { await browser.close(); await catalog.close(); }
