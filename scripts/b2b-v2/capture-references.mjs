/**
 * Reference library for the Partner Portal case V2 (private, audit only).
 * PW=<path to playwright/index.mjs> node scripts/b2b-v2/capture-references.mjs
 * PRIVATE_REFERENCE_DIR must point outside this public repository.
 */
import { mkdir } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
const { chromium } = await import(process.env.PW ?? 'playwright');

const out = process.env.PRIVATE_REFERENCE_DIR;
if (!out) throw new Error('Set PRIVATE_REFERENCE_DIR outside this public repository.');
const rel = relative(process.cwd(), resolve(out));
if (!rel.startsWith('..') && !isAbsolute(rel)) throw new Error('Research screenshots must stay outside the public repository.');
await mkdir(out, { recursive: true });
const refs = [
  ['linear-hero', 'https://linear.app/', [0, 900]],
  ['stripe-billing', 'https://stripe.com/billing', [0, 1100, 2200]],
  ['ramp-procurement', 'https://ramp.com/procurement', [0, 1000, 2000]],
  ['attio-hero', 'https://attio.com/', [0, 1000]],
  ['mercury-hero', 'https://mercury.com/', [0, 1000]],
];
const browser = await chromium.launch();
for (const [name, url, offsets] of refs) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);
    for (const y of offsets) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${out}/${name}-${y}.png` });
    }
    console.log('ok', name, await page.title());
  } catch (error) {
    console.log('fail', name, error.message.slice(0, 120));
  }
  await page.close();
}
await browser.close();
