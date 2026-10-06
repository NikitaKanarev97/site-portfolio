/** Capture the native article; omit the old viewer's device border. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { browser, serve } from '../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import { captureNativeAlpha } from './lib/native-alpha-capture.mjs';

const dir = 'outputs/media-edge-audit';
await mkdir(`${dir}/originals`, { recursive: true });
const manifest = JSON.parse(await readFile('D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case/media-manifest.json', 'utf8'));
const source = await serve('D:/Claude-projects/PETS-walking/dist', true);
const b = await browser(), records = [];
try {
  for (const locale of ['en', 'ru']) {
    const fixture = structuredClone(manifest.fixture);
    fixture.booking.status = 'draft';
    fixture.booking.pickupComplete = false;
    const page = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
    await page.addInitScript(data => localStorage.setItem('pawly-wire-data-v4', JSON.stringify(data)), fixture);
    await page.goto(`${source.base}/${locale === 'ru' ? 'ru/' : ''}app/address-input`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const article = page.locator('[class*="device"] > article');
    const text = await article.innerText();
    if (!text.includes(locale === 'ru' ? 'Продолжить' : 'Continue')) throw Error('Missing complete address action');
    const file = `public/media/rebuild/pawly/${locale}/address-input.webp`;
    try { await writeFile(`${dir}/originals/${file.replaceAll('/', '-')}`, await readFile(file), { flag: 'wx' }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    const raw = await captureNativeAlpha(page, article);
    if (await article.innerText() !== text) throw Error('Capture changed product content');
    const bytes = await sharp(raw).webp({ quality: 94, alphaQuality: 100 }).toBuffer();
    await writeFile(file, bytes);
    const size = await sharp(bytes).metadata();
    records.push({ file, locale, source: page.url(), width: size.width, height: size.height, text, unchangedText: true,
      sha256: createHash('sha256').update(bytes).digest('hex') });
    console.log(file, size.width, size.height);
    await page.close();
  }
} finally { await b.close(); await source.close(); await writeFile(`${dir}/pawly-edges.json`, JSON.stringify(records, null, 2)); }
