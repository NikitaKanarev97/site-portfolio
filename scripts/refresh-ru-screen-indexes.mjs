/** Refreshes the four Russian case-index screenshots from their live source apps. */
import { createRequire } from 'node:module';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

const root = process.cwd();
const targets = [
  {
    id: 'dssl',
    url: 'http://127.0.0.1:5199/b2b/ru',
    viewport: { width: 1440, height: 900 },
    selector: '#root > div > div',
  },
  {
    id: 'vet',
    url: 'http://127.0.0.1:5200/ru/',
    viewport: { width: 1440, height: 900 },
    selector: 'main',
  },
  {
    id: 'pawly',
    url: 'http://127.0.0.1:5201/ru/app',
    viewport: { width: 1440, height: 900 },
    fullPage: true,
    css: `
      html { scrollbar-width: none; }
      *::-webkit-scrollbar { width: 0; height: 0; }
      [class*="gallery"] { padding: 32px !important; }
      [class*="header"] { margin-bottom: 32px !important; }
      [class*="grid"] { width: min(100%, 1680px) !important; grid-template-columns: repeat(6, minmax(0, 1fr)) !important; gap: 12px !important; }
      [class*="preview"] { --preview-scale: 0.56 !important; }
    `,
  },
  {
    id: 'agent-ops',
    url: 'http://127.0.0.1:5302/ru/',
    viewport: { width: 1000, height: 1025 },
    fullPage: true,
  },
];

const browser = await chromium.launch({ headless: true });
for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    deviceScaleFactor: 1.5,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(target.url, { waitUntil: 'networkidle' });
  if (target.css) await page.addStyleTag({ content: target.css });
  await page.evaluate(() => document.fonts.ready);
  if (target.id === 'pawly') {
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(window.innerHeight * 0.8, 400)) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.waitForTimeout(1400);
  const raw = target.selector
    ? await page.locator(target.selector).first().screenshot({ type: 'png' })
    : await page.screenshot({ type: 'png', fullPage: target.fullPage });

  const en = path.join(root, 'public', 'media', `case-${target.id}`, 'screen-index.webp');
  const ru = path.join(root, 'public', 'media', `case-${target.id}-ru`, 'screen-index.webp');
  const geometry = await sharp(en).metadata();
  await sharp(raw)
    .resize({
      width: geometry.width,
      height: geometry.height,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .webp({ quality: 82 })
    .toFile(ru);
  console.log(`${target.id}: ${geometry.width}×${geometry.height}`);
  await context.close();
}
await browser.close();
