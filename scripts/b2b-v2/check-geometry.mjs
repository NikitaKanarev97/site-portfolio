/** Targeted regression: image letterboxing, corner masks, inset padding and real plan edges. */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { browser, open, settle } from './shared.mjs';
const origin = process.argv[2] ?? 'http://127.0.0.1:4393';
const out = 'audit/b2b-case-v21/geometry';
await mkdir(`${out}/after`, { recursive: true });
const checks = [];
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  for (const route of ['home', 'case']) {
    await page.goto(origin + (locale === 'ru' ? '/ru' : '') + (route === 'home' ? '/' : '/work/partner-portal'), { waitUntil: 'networkidle' });
    await settle(page);
    await page.evaluate(async () => { await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode().catch(() => {}))); });
    const selectors = route === 'home' ? [['home', '#work-partner-portal']] : [['commerce', '#commercial-review'], ['fulfillment', '#fulfillment'], ...(width === 1440 ? [['detail', '.portal-cover__detail']] : [])];
    for (const [name, selector] of selectors) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.locator(selector).screenshot({ path: `${out}/after/${locale}-${width}-${name}.png` });
    }
    checks.push({ locale, width, route, ...await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      images: [...document.querySelectorAll('.portal-shot img')].filter(i => i.getBoundingClientRect().width).map(i => {
        const r = i.getBoundingClientRect(), frame = i.closest('.portal-shot__frame'), f = frame.getBoundingClientRect(), s = getComputedStyle(frame);
        return { src: new URL(i.currentSrc).pathname, ratioError: Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight), variant: i.closest('figure').className, leftField: r.left - f.left, rightField: f.right - r.right, radius: s.borderRadius, overflow: s.overflow, broken: !i.naturalWidth };
      }),
    })) });
  }
  await page.close();
}
// A screenshot pixel check catches a later sibling painting over the lower edge.
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const { page, context } = await open('fulfillment', { locale, width, height: 2400, state: 'resolved' });
  for (let index = 0; index < 3; index++) {
    const row = page.locator('[data-slot="fulfillment-plan"]').nth(index);
    await row.getByRole('radio').click();
    await page.mouse.move(0, 0);
    await settle(page, 100);
    const border = await row.evaluate(el => getComputedStyle(el).borderTopColor.match(/\d+/g).slice(0, 3).map(Number));
    const { data, info } = await sharp(await row.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixel = (x, y) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
    const edges = { top: pixel(Math.floor(info.width / 2), 1), bottom: pixel(Math.floor(info.width / 2), info.height - 2), left: pixel(1, Math.floor(info.height / 2)), right: pixel(info.width - 2, Math.floor(info.height / 2)) };
    checks.push({ locale, width, plan: index, border, edges, allEdgesVisible: Object.values(edges).every(rgb => rgb.every((n, i) => Math.abs(n - border[i]) <= 12)) });
  }
  await context.close();
}
await browser.close();
await writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
const failures = checks.filter(c => c.overflow || c.allEdgesVisible === false || c.images?.some(i => i.broken || i.ratioError > .005 || (i.variant.includes('--native') && (i.radius !== '0px' || i.overflow !== 'visible' || i.leftField > .1 || i.rightField > .1)) || ((i.variant.includes('--detail') || i.variant.includes('--panel')) && (i.leftField < 15 || i.rightField < 15))));
console.log(JSON.stringify({ states: checks.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
