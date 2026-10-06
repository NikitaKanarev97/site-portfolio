/**
 * Re-capture the two Agent Ops cover panels (payout, message) in EN and RU
 * with `text-wrap: pretty` on the panel text.
 *
 * The prototype sets "the conversation they are waiting / in" with one word
 * on the last line, and the cover is the first frame a reader sees on Home
 * and on the case. Only line breaks change: content, type, colour and size
 * stay the prototype's own, and the capture path is the canonical one from
 * repair-media-edges.mjs (dist build, integer origin, native alpha, border
 * cropped).
 *
 * Run: node scripts/reshoot-agent-cover-panels.mjs (06.10.2026)
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { browser, serve } from '../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import { captureNativeAlpha } from './lib/native-alpha-capture.mjs';

const source = await serve('D:/Claude-projects/Agent-ops-console/dist', true);
const b = await browser();
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 390]) {
    const page = await b.newPage({ viewport: { width, height: width === 390 ? 844 : 900 },
      deviceScaleFactor: width === 390 ? 3 : 2, reducedMotion: 'reduce' });
    await page.goto(`${source.base}/${lang === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' });
    await page.locator('[data-track="shell:role-switch"]').first().click();
    await page.getByRole('menuitem', { name: /Priya S\./ }).first().click();
    await page.evaluate(path => { history.pushState(null, '', path); dispatchEvent(new PopStateEvent('popstate')); },
      `${lang === 'ru' ? '/ru' : ''}/screens/consequence-preview`);
    await page.locator('[class*="previewGrid"]').waitFor();
    await page.addStyleTag({ content: '[class*="previewGrid"] * { text-wrap: pretty; }' });
    const root = lang === 'ru' ? 'public/media/rebuild/agent-ops/ru' : 'public/media/pilot-agent-ops';
    for (const [i, name] of ['payout', 'message'].entries()) {
      const node = page.locator('[class*="previewGrid"] > *').nth(i);
      const before = await node.innerText();
      const bytes = await captureNativeAlpha(page, node, { cropBorder: true });
      if (before !== await node.innerText()) throw Error(`Capture changed source content: ${name}`);
      const file = `${root}/${name}-${width}.webp`;
      await writeFile(file, await sharp(bytes).webp({ quality: 94, alphaQuality: 100 }).toBuffer());
      const meta = await sharp(file).metadata();
      console.log(file, meta.width, meta.height);
    }
    await page.close();
  }
} finally {
  await b.close();
  await source.close();
}
