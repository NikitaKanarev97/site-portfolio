import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';
const { chromium } = await import(process.env.PW ?? 'playwright');
const [origin = 'http://127.0.0.1:4490', phase = 'after'] = process.argv.slice(2);
const out = `audit/agent-ops-v2/${phase}`;
const originals = `.tmp/agent-ops-v2-page-originals/${phase}`;
await mkdir(out, { recursive: true }); await mkdir(originals, { recursive: true });
const browser = await chromium.launch();
const only = process.env.REVIEW_ONLY?.split(',');
const checks = only ? JSON.parse(await readFile(`${out}/checks.json`, 'utf8')).checks.filter(check => !only.includes(`${check.locale}-${check.width}-${check.surface}`)) : [];
async function capture(page, name, locator) {
  const path = `${originals}/${name}.png`;
  const data = locator ? await locator.screenshot({ path }) : await page.screenshot({ path, fullPage: name.endsWith('-full') });
  const metadata = await sharp(data).metadata();
  // WebP's dimension limit is 16,383px; preserve full-height mobile pages as PNG.
  if (metadata.height > 16383 || metadata.width > 16383) await copyFile(path, `${out}/${name}.png`);
  else await sharp(data).webp({ lossless: true, effort: 2 }).toFile(`${out}/${name}.webp`);
}
async function read(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
    await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(180);
  }
  await page.evaluate(async () => {
    const images = [...document.images].filter(i => i.getAttribute('src'));
    images.forEach(i => { i.loading = 'eager'; });
    await Promise.race([Promise.all(images.map(i => i.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 15000))]);
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(700);
}
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
    const prefix = locale === 'ru' ? '/ru' : '', name = `${locale}-${width}`;
    for (const surface of ['home', 'case']) {
      if (only && !only.includes(`${name}-${surface}`)) continue;
      if (phase === 'before-extra' && surface === 'case') continue;
      await page.goto(origin + prefix + (surface === 'home' ? '/' : '/work/agent-ops-console'), { waitUntil: 'networkidle' });
      await read(page);
      await capture(page, `${name}-${surface}-viewport`);
      await capture(page, `${name}-${surface}-full`);
      if (surface === 'home' && phase !== 'before-extra') {
        const card = page.locator('#work-agent-ops-console');
        await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
        await capture(page, `${name}-home`, card);
      }
      checks.push({ locale, width, surface, errors: [...errors], failed: [...failed], ...(await page.evaluate(() => ({
        path: location.pathname, title: document.title, lang: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth - innerWidth,
        height: document.documentElement.scrollHeight,
        broken: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || !i.naturalWidth)).map(i => i.currentSrc),
        hiddenHeadings: [...document.querySelectorAll('.agent-case h1,.agent-case h2')].filter(e => getComputedStyle(e).opacity === '0').map(e => e.textContent),
        sections: [...document.querySelectorAll('.agent-section')].map(e => e.id),
        wordCount: document.querySelector('.agent-case')?.innerText.split(/\s+/).filter(Boolean).length,
        otherCards: [...document.querySelectorAll('.featured-case:not(#work-agent-ops-console)')].map(el => ({ id: el.id, text: el.innerText, images: [...el.querySelectorAll('img')].map(i => new URL(i.currentSrc).pathname) })),
        frames: [...document.querySelectorAll('.agent-plate,.agent-cover__media,.agent-home')].map(el => {
          const image = el.querySelector('img'), style = getComputedStyle(el), rect = el.getBoundingClientRect();
          return { key: el.querySelector('[data-agent-shot]')?.getAttribute('data-agent-shot'), padding: style.padding,
            width: rect.width, imageWidth: image?.getBoundingClientRect().width, source: image?.currentSrc,
            upscaled: image ? image.clientWidth > image.naturalWidth / 2 + 1 : false,
            contained: image ? image.getBoundingClientRect().left >= rect.left && image.getBoundingClientRect().right <= rect.right : true };
        }),
      }))) });
    }
    await context.close(); console.log(`${name} complete`);
  }
  await writeFile(`${out}/checks.json`, JSON.stringify({ origin, phase, checks }, null, 2) + '\n');
} finally { await browser.close(); }
