/** V2.1: native DeltaRow and complete owning cart line, with their real context. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { browser, open, settle, unionBox, PRODUCT_COMMIT } from './shared.mjs';
const root = 'audit/b2b-case-v21/captures';
const mediaPath = 'src/data/partner-portal-v2-media.json';
const media = JSON.parse(await readFile(mediaPath, 'utf8'));
const manifest = {};
for (const locale of ['en', 'ru']) for (const width of [1280, 390]) {
  const { context, page } = await open('cart/change-review', { locale, width, height: 2600, state: 'resolved' });
  await mkdir(`${root}/${locale}`, { recursive: true });
  async function save(key, selectors, padding, note) {
    const clip = await unionBox(page, selectors, padding);
    const file = `${root}/${locale}/${key}.png`;
    await page.screenshot({ path: file, clip, fullPage: true, animations: 'disabled' });
    const dst = `public/media/rebuild/partner-portal/v2/${locale}/${key}.webp`;
    const info = await sharp(file).webp({ lossless: true, effort: 6 }).toFile(dst);
    const entry = { src: '/' + dst.slice(7), width: Math.round(info.width / 2), height: Math.round(info.height / 2), bytes: info.size, source: file, commit: PRODUCT_COMMIT, route: page.url(), clip };
    media[`${locale}/${key}`] = entry;
    manifest[`${locale}/${key}`] = { ...entry, note };
  }
  if (width === 390) {
    await save('change-detail-390', ['[data-slot="cart-line-change"] [data-slot="delta-row"]'], 0, 'Complete native DeltaRow, no parent status edge or adjacent fragments');
  }
  await page.goto(page.url().replace('/cart/change-review', '/cart'));
  await settle(page);
  // Capture the complete owning line (not siblings cropped out of a sheet).
  // Add a uniform field sampled from its native canvas; no UI pixels change.
  const owner = page.locator('[data-slot="cart-line"][data-issue="unpriced"]').first();
  const file = `${root}/${locale}/commerce-sheet-${width}.png`;
  await owner.screenshot({ path: file, animations: 'disabled' });
  const background = await owner.locator('[data-slot="cart-line-unpriced"]').evaluate(el => getComputedStyle(el).backgroundColor);
  const dst = `public/media/rebuild/partner-portal/v2/${locale}/commerce-sheet-${width}.webp`;
  const info = await sharp(file).extend({ top: 40, bottom: 40, left: 40, right: 40, background }).webp({ lossless: true, effort: 6 }).toFile(dst);
  const key = `${locale}/commerce-sheet-${width}`;
  media[key] = { src: '/' + dst.slice(7), width: Math.round(info.width / 2), height: Math.round(info.height / 2), bytes: info.size, source: file, commit: PRODUCT_COMMIT, route: page.url() };
  manifest[key] = { ...media[key], note: 'Full owning cart-line, no altered UI; uniform 20 CSS px native canvas field added around the complete module', padding: 20, nativeCanvas: background };
  await context.close();
}
await writeFile(mediaPath, JSON.stringify(media, null, 2) + '\n');
await writeFile(`${root}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
await browser.close();
