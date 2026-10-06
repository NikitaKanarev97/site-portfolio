/** Re-capture native product edges at an integer origin, without page backdrops.
 * Only portfolio assets are written. Product bundles and content stay read-only.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { browser, serve } from '../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import { captureNativeAlpha } from './lib/native-alpha-capture.mjs';

const dir = 'outputs/media-edge-audit';
await mkdir(`${dir}/originals`, { recursive: true });
const report = [];
const sources = await Promise.all([
  serve('D:/Claude-projects/Agent-ops-console/dist', true),
  serve('D:/Claude-projects/b2b-dssl/dist', true),
  serve('D:/Claude-projects/Veterinary-clinic/dist', true),
]);
const b = await browser();
async function save(page, node, file, options = {}) {
  const original = await readFile(file);
  try { await writeFile(`${dir}/originals/${file.replaceAll('/', '-')}`, original, { flag: 'wx' }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const before = await node.innerText();
  const bounds = await node.boundingBox();
  const bytes = await captureNativeAlpha(page, node, options);
  if (before !== await node.innerText()) throw Error(`Capture changed source content: ${file}`);
  await writeFile(file, await sharp(bytes).webp({ quality: 94, alphaQuality: 100 }).toBuffer());
  const metadata = await sharp(file).metadata();
  report.push({ file, source: page.url(), viewport: page.viewportSize(), bounds,
    width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha,
    cropBorder: !!options.cropBorder, unchangedText: true,
    sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
  console.log(file, metadata.width, metadata.height);
}
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 390]) {
    const page = await b.newPage({ viewport: { width, height: width === 390 ? 844 : 900 },
      deviceScaleFactor: width === 390 ? 3 : 2, reducedMotion: 'reduce' });
    await page.goto(`${sources[0].base}/${lang === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' });
    await page.locator('[data-track="shell:role-switch"]').first().click();
    await page.getByRole('menuitem', { name: /Priya S\./ }).first().click();
    await page.evaluate(path => { history.pushState(null, '', path); dispatchEvent(new PopStateEvent('popstate')); },
      `${lang === 'ru' ? '/ru' : ''}/screens/consequence-preview`);
    await page.locator('[class*="previewGrid"]').waitFor();
    const root = lang === 'ru' ? 'public/media/rebuild/agent-ops/ru' : 'public/media/pilot-agent-ops';
    for (const [i, name] of ['payout', 'message'].entries()) {
      await save(page, page.locator('[class*="previewGrid"] > *').nth(i), `${root}/${name}-${width}.webp`, { cropBorder: true });
    }
    await page.close();
  }
  for (const width of [1440, 390]) {
    const page = await b.newPage({ viewport: { width, height: width === 390 ? 1400 : 1100 },
      deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.goto(`${sources[1].base}/b2b/resolution-center`, { waitUntil: 'networkidle' });
    const search = page.getByPlaceholder('Search source or matched product');
    await search.fill('камера 4мп уличная');
    let row = page.locator('[data-flip]').filter({ hasText: 'Row 38' }).first();
    await row.getByRole('button', { name: 'Choose', exact: true }).click();
    await page.locator('[data-slot="decision-panel"]').waitFor();
    row = page.locator('[data-flip]').filter({ has: page.locator('[role="radiogroup"]') }).first();
    const variant = width === 390 ? 'narrow' : 'wide';
    const root = 'public/media/rebuild/partner-portal';
    await save(page, row, `${root}/line-open-${variant}.webp`);
    await row.getByRole('radio').nth(1).click();
    await row.getByRole('button', { name: 'Apply to line 38', exact: true }).click();
    await page.getByRole('tab', { name: /Resolved/ }).click();
    row = page.locator('[data-flip]').filter({ hasText: 'Row 38' }).first();
    await save(page, row, `${root}/line-confirmed-${variant}.webp`);
    await search.fill('');
    await page.getByRole('tab', { name: /Need review/ }).click();
    for (let i = 0; i < 8; i++) {
      if (await page.getByRole('button', { name: 'Continue to cart', exact: true }).isEnabled()) break;
      await page.locator('[data-slot="resolution-row"] button').first().click();
      const panel = page.locator('[data-slot="decision-panel"]');
      await panel.waitFor();
      if (await panel.getByRole('radio').count()) await panel.getByRole('radio').first().click();
      const quantity = panel.locator('input[inputmode="numeric"]');
      if (await quantity.count()) await quantity.fill('4');
      await panel.getByRole('button', { name: /Apply to line|Confirm replacement/ }).click();
    }
    await page.getByRole('button', { name: 'Continue to cart', exact: true }).click();
    await page.waitForURL(/\/cart/);
    await save(page, page.locator('[data-slot="product-row"]').filter({ hasText: 'source row 38' }).first(), `${root}/line-cart-${variant}.webp`);
    await page.close();
  }
  for (const lang of ['en', 'ru']) {
    const page = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.goto(`${sources[2].base}/${lang === 'ru' ? 'ru/' : ''}app/vet-day-queue`, { waitUntil: 'networkidle' });
    await save(page, page.locator('[class*="_device_"]').first(), `public/media/rebuild/vet-clinic/queue-${lang}.webp`);
    await page.close();
  }
} finally {
  await b.close();
  await Promise.all(sources.map(source => source.close()));
  await writeFile(`${dir}/captures.json`, JSON.stringify(report, null, 2));
}
