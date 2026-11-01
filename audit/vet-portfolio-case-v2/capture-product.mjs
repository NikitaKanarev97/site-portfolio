import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const product = process.env.PRODUCT_REPO ?? 'D:/Claude-projects/Veterinary-clinic';
const base = process.env.PRODUCT_URL ?? 'http://127.0.0.1:5370';
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: product }).toString().trim();
if (execFileSync('git', ['diff', '--', 'src', 'public', 'assets'], { cwd: product }).length) throw Error('Product source has uncommitted edits');
const root = 'audit/vet-portfolio-case-v2';
const storageKey = 'vet-clinic-wire-data-v6';
const browser = await chromium.launch();
const media = {}, errors = [];
fs.mkdirSync(`${root}/product-captures`, { recursive: true });
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(750);
  await page.waitForFunction(() => [...document.querySelectorAll('[data-motion-screen]')].every(e => getComputedStyle(e).opacity === '1' && getComputedStyle(e).transform === 'none'));
}
for (const locale of ['en', 'ru']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce', locale: locale === 'ru' ? 'ru-RU' : 'en-GB', timezoneId: 'Europe/Moscow' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message));
  const route = screen => `${base}/${locale === 'ru' ? 'ru/' : ''}app/${screen}?patient=marsik`;
  await page.goto(route('visit-record')); await settle(page);
  const initial = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), storageKey);
  fs.writeFileSync(`${root}/product-captures/initial-${locale}.json`, JSON.stringify(initial, null, 2));
  // Publish through the actual UI once, then reuse this same snapshot across widths.
  await page.goto(route('discharge-preview')); await settle(page);
  await page.locator('[data-track="discharge-publish"]').click();
  await page.waitForFunction(() => document.querySelector('[data-track="discharge-publish"]')?.disabled && document.querySelector('[data-track="discharge-publish"]')?.getAttribute('aria-busy') !== 'true');
  await page.waitForTimeout(800);
  const published = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), storageKey);
  fs.writeFileSync(`${root}/product-captures/published-${locale}.json`, JSON.stringify(published, null, 2));
  const load = async (screen, fixture = initial) => {
    await page.evaluate(({ key, fixture }) => localStorage.setItem(key, JSON.stringify(fixture)), { key: storageKey, fixture });
    await page.goto(route(screen)); await settle(page); await page.evaluate(() => scrollTo(0, 0));
  };
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const device = width === 1440 ? 'desktop' : 'mobile';
    const snap = async (key, screen, selector, where, state, rectOverride) => {
      await page.evaluate(() => scrollTo(0, 0));
      const box = rectOverride ?? await page.locator(selector).first().boundingBox();
      if (!box) throw Error(`No bounding box: ${selector}`);
      // Integer outward bounds preserve entire native controls and text.
      const clip = { x: Math.floor(box.x), y: Math.floor(box.y), width: Math.ceil(box.x + box.width) - Math.floor(box.x), height: Math.ceil(box.y + box.height) - Math.floor(box.y) };
      const name = `${locale}/${key}-${device}`;
      const raw = `${root}/product-captures/${locale}-${key}-${device}.png`;
      const complete = raw.replace('.png', '-complete.png');
      await page.screenshot({ path: complete, fullPage: true });
      const whole = await sharp(complete).metadata();
      const extract = { left: clip.x * 2, top: clip.y * 2, width: Math.min(clip.width * 2, whole.width - clip.x * 2), height: Math.min(clip.height * 2, whole.height - clip.y * 2) };
      await sharp(complete).extract(extract).png().toFile(raw);
      const dst = `public/media/case-vet-v2/${name}.webp`;
      fs.mkdirSync(`public/media/case-vet-v2/${locale}`, { recursive: true });
      const info = await sharp(raw).webp({ lossless: true, effort: 4 }).toFile(dst);
      media[name] = { src: '/' + dst.slice(7), width: info.width, height: info.height, cssWidth: clip.width, cssHeight: clip.height, sourceRepository: 'NikitaKanarev97/veterinary-clinic', sourcePath: `src/screens/${screen}/`, sourceCommit: commit, captureSource: raw, route: route(screen).replace(base, ''), locale, state, viewport: { width, height: 900, dpr: 2 }, clip, selector, appearsIn: where, sha256: createHash('sha256').update(fs.readFileSync(dst)).digest('hex') };
    };
    await load('visit-record');
    await snap('visit-full', 'visit-record', '[data-visit-record]', 'Hero / complete inspection', 'Initial saved clinical record; unpublished');
    if (width === 390) {
      const a = await page.locator('[data-visit-record]').boundingBox();
      const b = await page.locator('[aria-labelledby="record-trace-title"]').boundingBox();
      await snap('visit-context', 'visit-record', '[data-visit-record]', 'Mobile hero / Home', 'Saved context and complete Quick Trace; detail ends before the section navigation', { ...a, height: b.y + b.height + 16 - a.y });
    }
    await snap('private', 'visit-record', '#record-private', 'Critical states / clinical-only note', 'Saved private note; complete native section');
    await load('dose-calculator');
    await snap('dose-full', 'dose-calculator', '[data-dose-calculator]', 'Clinical workflow / complete inspection', 'Normal seeded single-dose calculation; not recorded');
    await snap('dose-review', 'dose-calculator', '#dose-result', 'Mobile clinical workflow', 'Complete answer, arithmetic, rounding, limitation and record action');
    await load('invoice-draft');
    await snap('invoice-full', 'invoice-draft', '[data-invoice-workspace]', 'Reception / complete inspection', 'Two selected services; unpaid; 1500 RUB');
    await snap('invoice-document', 'invoice-draft', '[data-invoice-document]', 'Reception', 'Services, total and manual payment-status action; full invoice at inspection');
    await load('discharge-preview');
    await snap('discharge-full', 'discharge-preview', '[data-discharge-preview]', 'Publication / complete inspection', 'Ready to publish; initial saved plan');
    await snap('discharge-document', 'discharge-preview', '[data-discharge-document]', 'Mobile publication', 'Complete owner document preview; not yet published');
    await load('owner-home', published);
    await snap('owner-full', 'owner-home', '[data-owner-home]', 'Owner output / responsive comparison', 'Published version 1 from the same initial saved record');
    if (width === 1440) {
      await snap('owner-overview', 'owner-home', '[data-owner-home] > article', 'Responsive comparison / desktop', 'Complete desktop care article and contact rail; global app header excluded');
    } else {
      const start = await page.locator('[data-owner-home]').boundingBox();
      const end = await page.locator('[aria-labelledby="owner-prescription"]').boundingBox();
      await snap('owner-overview', 'owner-home', '[data-owner-home]', 'Responsive comparison / mobile', 'Complete mobile context, plan and prescription detail; remainder available in full inspection', { ...start, height: end.y + end.height + 16 - start.y });
    }
    if (width === 1440) {
      const blocked = structuredClone(published); blocked.visits.marsik.plan = '';
      await load('discharge-preview', blocked);
      const status = await page.locator('[data-publication-status]').boundingBox();
      const panel = await page.locator('#discharge-publishing').boundingBox();
      await snap('blocked', 'discharge-preview', '#discharge-publishing', 'Critical states / blocked publication', 'Existing audit model state: saved plan empty; existing owner publication retained', { x: panel.x, y: status.y, width: panel.width, height: panel.y + panel.height - status.y });
      await snap('blocked-full', 'discharge-preview', '[data-discharge-preview]', 'Critical state complete inspection', 'Empty draft plan; existing published version 1 retained');
    } else {
      const blocked = structuredClone(published); blocked.visits.marsik.plan = '';
      await load('discharge-preview', blocked);
      await snap('blocked', 'discharge-preview', '#discharge-publishing', 'Critical states / blocked publication', 'Existing audit model state: empty draft plan; publication disabled; owner retains version 1');
      await snap('blocked-full', 'discharge-preview', '[data-discharge-preview]', 'Critical state complete inspection', 'Empty draft plan; existing published version 1 retained');
    }
    const missing = structuredClone(published); missing.visits.marsik.published.content.concentration = '';
    await load('owner-home', missing);
    await snap('missing', 'owner-home', '[aria-labelledby="owner-prescription"]', 'Critical states / unavailable dose', 'Existing audit model state: concentration absent in published prescription; dose unavailable');
    await snap('missing-full', 'owner-home', '[data-owner-home]', 'Critical state complete inspection', 'Published prescription concentration absent; clinic confirmation required');
    console.log(locale, device, 'captured');
  }
  await ctx.close();
}
await browser.close();
if (errors.length) throw Error(JSON.stringify(errors));
fs.writeFileSync('src/data/vet-v2-media.json', JSON.stringify(media, null, 2) + '\n');
fs.writeFileSync(`${root}/product-captures/manifest.json`, JSON.stringify({ sourceCommit: commit, browser: browser.version(), capturedAt: new Date().toISOString(), base, errors, policy: 'Native browser screenshots. No CSS injection, retouching, compositing, recolouring, hidden warnings or translated overlays. Honest bounds remove only external ScreenViewer chrome; component crops are complete. Same default fixtures and real publication snapshot; blocked/missing states reproduce existing audit model fixtures. DPR 2 lossless WebP, no resizing.', media }, null, 2));
