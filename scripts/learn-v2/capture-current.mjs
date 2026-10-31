/** Current integrated UI, captured in the browser. No fixed raster crops.
 * Source: public/prototypes/learn-manifest.json (exported from learn/main).
 * Sessions and assessment states are reached through the real mock UI.
 */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { captureNativeAlpha } from '../lib/native-alpha-capture.mjs';
const { chromium } = await import(process.env.PW ?? 'playwright');
const origin = process.env.PRODUCT_ORIGIN ?? 'http://127.0.0.1:4415/prototypes/learn';
const root = 'audit/trassir-learn-case-v2/refresh-2026-10-31';
const source = JSON.parse(await readFile('public/prototypes/learn-manifest.json', 'utf8')).source;
const browser = await chromium.launch();
const referenceOnly = process.env.REFERENCE_ONLY === '1';
const previous = referenceOnly ? JSON.parse(await readFile(`${root}/capture-manifest.json`, 'utf8')) : undefined;
const media = previous?.media ?? {}, sessions = previous?.sessions ?? [];
const KEY = 'learn-prototype-v1';
const errors = [];
const css = name => `[class*="_${name}_"]`;
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}
async function go(page, route, lang) {
  const [path, query = ''] = route.split('?');
  await page.goto(`${origin}/${path.replace(/\/$/, '')}/?${query}${query ? '&' : ''}lang=${lang}`, { waitUntil: 'networkidle' });
  await settle(page);
}
async function login(page, lang, reader = false) {
  await go(page, 'login?returnTo=%2Fmy', lang);
  await page.locator('main input').first().fill(reader ? 'sergey.k@integrator-nw.ru' : 'marina.k@integrator-nw.ru');
  await page.locator('main form').last().evaluate(f => f.requestSubmit());
  await page.waitForFunction(() => document.querySelector('[role="radiogroup"],input[autocomplete="one-time-code"]'));
  if (!(await page.locator('input[autocomplete="one-time-code"]').count())) {
    await page.locator('main form').last().evaluate(f => f.requestSubmit());
  }
  const code = page.locator('input[autocomplete="one-time-code"]');
  await code.waitFor();
  await code.fill('123456');
  await page.locator('main form').last().evaluate(f => f.requestSubmit());
  await page.waitForURL(url => /\/my\/?$/.test(url.pathname));
  await settle(page);
}
async function detail(page, lang, key, selector, note) {
  const target = typeof selector === 'string' ? page.locator(selector).first() : selector;
  assert.equal(await target.count(), 1, `${key}: target`);
  // Full source element plus a 24 CSS px transparent field; native padding,
  // typography, borders, status and all descendant pixels stay untouched.
  const rect = await target.boundingBox();
  const raw = await captureNativeAlpha(page, target, { bleed: 24 });
  const info = await sharp(raw).metadata();
  const path = `${root}/product/${lang}/${key}.png`;
  await mkdir(`${root}/product/${lang}`, { recursive: true });
  await writeFile(path, raw);
  await mkdir(`public/media/case-learn-v2/current/${lang}`, { recursive: true });
  const { data, info: output } = await sharp(raw).webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
  const src = `/media/case-learn-v2/current/${lang}/${key}.webp`;
  await writeFile(`public${src}`, data);
  media[`${lang}/${key}`] = { src, width: info.width, height: info.height, cssWidth: info.width / 2, source: path, productCommit: source.commit, route: page.url(), selector: typeof selector === 'string' ? selector : 'first complete wrong-answer record', sourceBounds: rect, canvasField: 24, bytes: output.size, note };
}
async function region(page, lang, key, selectors, note) {
  const boxes = await Promise.all(selectors.map(async sel => {
    const el = page.locator(sel).first();
    const box = await el.boundingBox();
    assert.ok(box?.width, `${key}: ${sel}`);
    return box;
  }));
  const x = Math.max(0, Math.floor(Math.min(...boxes.map(b => b.x)) - 16));
  const y = Math.max(0, Math.floor(Math.min(...boxes.map(b => b.y)) - 16));
  const right = Math.min(page.viewportSize().width, Math.ceil(Math.max(...boxes.map(b => b.x + b.width)) + 16));
  // Curriculum groups are 16 px apart; stop inside that gap so the next
  // group's top border cannot enter the frame. The portfolio adds 16 px more.
  const bottom = Math.ceil(Math.max(...boxes.map(b => b.y + b.height)) + (key === 'path' ? 8 : 16));
  const clip = { x, y, width: right - x, height: bottom - y };
  // Contiguous page region, bounded between complete semantic blocks.
  // The article body is outside this explicitly selected header/brief/rail
  // detail. Keep its layout space but exclude neighbouring content from the
  // capture, so no partial paragraph can enter the bottom field.
  if (key === 'reference') await page.locator('main article').evaluateAll(es => es.forEach(e => e.style.visibility = 'hidden'));
  const raw = await page.screenshot({ clip, animations: 'disabled' });
  if (key === 'reference') await page.locator('main article').evaluateAll(es => es.forEach(e => e.style.removeProperty('visibility')));
  const path = `${root}/product/${lang}/${key}.png`;
  await mkdir(`${root}/product/${lang}`, { recursive: true });
  await writeFile(path, raw);
  await mkdir(`public/media/case-learn-v2/current/${lang}`, { recursive: true });
  const { data, info } = await sharp(raw).webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
  const src = `/media/case-learn-v2/current/${lang}/${key}.webp`;
  await writeFile(`public${src}`, data);
  media[`${lang}/${key}`] = { src, width: info.width, height: info.height, cssWidth: clip.width, source: path, productCommit: source.commit, route: page.url(), selectors, clip, canvasField: 16, bytes: info.size, note };
}
for (const lang of ['en', 'ru']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow' });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(`${lang}: ${e.message}`));
  await page.clock.setFixedTime(new Date('2026-10-31T16:51:00Z'));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1200 });
    if (!referenceOnly) {
      await go(page, 'home', lang);
      await detail(page, lang, width === 1440 ? 'home-wide' : 'home-mobile', `main > ${css('hero')}`, 'Complete current Home hero with V1.3 teaching diagram; 24 px field.');
    }
    await go(page, 'material/onvif-not-found', lang);
    if (!referenceOnly && width === 390) await detail(page, lang, 'answer-detail', `main ${css('main')} > header`, 'Complete native mobile material header; no cut title, metadata or utilities.');
    await region(page, lang, width === 1440 ? 'reference' : 'reference-mobile', width === 1440
      ? [`main ${css('main')} > header`, `main ${css('brief')}`, `main aside`]
      : [`main ${css('main')} > header`, `main ${css('tocMobile')}`, `main ${css('brief')}`], 'Whole header, brief and navigation with native page gutters.');
  }
  if (referenceOnly) { await context.close(); continue; }
  await page.setViewportSize({ width: 1440, height: 1200 });
  await login(page, lang);
  const seeded = await page.evaluate(KEY => JSON.parse(sessionStorage.getItem(KEY)), KEY);
  assert.equal(seeded.history.length, 9);
  assert.equal(seeded.progress.puskonaladka.doneUnitIds.length, 3);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1200 });
    await go(page, 'my', lang);
    await detail(page, lang, width === 1440 ? 'learner' : 'learner-mobile', 'section[aria-labelledby="scales-title"]', 'Two complete independent progress cards, including their explanatory footer.');
    await go(page, 'trajectory/puskonaladka', lang);
    if (width === 1440) {
      await detail(page, lang, 'path-progress', `aside ${css('action')}`, 'Whole continuation action region: count, current step, complete CTA and reading note, with native padding.');
      await region(page, lang, 'path', [`main header`, '#outcomes-title', '#composition-title', '#curriculum > [role="group"]', 'main aside'], 'Programme promise, complete first curriculum group and whole passport.');
    } else {
      await region(page, lang, 'path-mobile', ['main header', 'main aside'], 'Whole mobile programme header and passport; no sliced next row.');
    }
    await go(page, 'player/puskonaladka/3', lang);
    // A complete current article heading and reading notice. The curriculum
    // and position are documented by the adjacent programme proof.
    await region(page, lang, width === 1440 ? 'player' : 'player-mobile', ['article > header', 'article > :nth-child(2)'], 'Complete article header and existing-read notice, ending before the first body section.');
    await go(page, 'player/puskonaladka/3', lang);
    await detail(page, lang, width === 1440 ? 'completion' : 'completion-mobile', 'section[aria-labelledby="finish-title"]', 'Whole current end-of-unit panel, including next unit and explicit completion action.');
  }
  // Finish the remaining units, then submit two independent real mock attempts
  // from separate copies of this pre-exam session (never paint result scores).
  await page.setViewportSize({ width: 1440, height: 1200 });
  for (let i = 3; i <= 9; i++) {
    await go(page, `player/puskonaladka/${i}`, lang);
    await page.getByRole('button', { name: /Завершить и далее|Complete and continue/ }).click();
    await page.waitForTimeout(80);
  }
  const ready = await page.evaluate(KEY => JSON.parse(sessionStorage.getItem(KEY)), KEY);
  for (const passed of [false, true]) {
    const attemptContext = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow' });
    await attemptContext.addInitScript(({ KEY, ready }) => { if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(ready)); }, { KEY, ready });
    const ap = await attemptContext.newPage();
    ap.on('pageerror', e => errors.push(`${lang}/result: ${e.message}`));
    await ap.clock.setFixedTime(new Date('2026-10-31T16:51:00Z'));
    await go(ap, 'assessment/intro?trajectoryId=puskonaladka', lang);
    await ap.getByRole('button', { name: /Начать зачёт|Start assessment/ }).click();
    for (let i = 0; i < 20; i++) {
      const q = await ap.evaluate(({ KEY, i }) => JSON.parse(sessionStorage.getItem(KEY)).activeExam.questions[i], { KEY, i });
      if (!passed && [11, 18].includes(i)) {
        await ap.getByRole('button', { name: /^(Пропустить|Skip)$/ }).click();
      } else {
        const pick = !passed && [4, 9, 14, 17].includes(i) ? (q.correct + 1) % q.options.length : q.correct;
        await ap.locator('[role="radiogroup"] > *').nth(pick).click();
        if (i < 19) await ap.getByRole('button', { name: /^(Далее|Next)$/ }).click();
      }
    }
    await ap.getByRole('button', { name: /Отправить на проверку|Submit answers/ }).click();
    await ap.getByRole('button', { name: /^(Отправить|Submit)$/ }).click();
    await ap.waitForURL(url => url.pathname.includes('/assessment/result'));
    await settle(ap);
    const resultUrl = ap.url();
    for (const width of [1440, 390]) {
      await ap.setViewportSize({ width, height: 1200 });
      await ap.goto(resultUrl, { waitUntil: 'networkidle' });
      await settle(ap);
      await detail(ap, lang, `${passed ? 'passed-score' : 'failed'}${width === 390 ? '-mobile' : ''}`, `main ${css('lead')}`, 'Complete current verdict and result card, including permitted next action; no coloured status edge.');
      if (!passed) {
        await ap.locator('[data-status="wrong"]').first().click();
        await settle(ap);
        await detail(ap, lang, width === 1440 ? 'review' : 'review-detail', ap.locator('li[data-status="wrong"]').first(), 'One whole wrong-answer record, with complete question, submitted answer and source link.');
      }
    }
    sessions.push({ lang, passed, route: resultUrl, state: await ap.evaluate(KEY => { const s = JSON.parse(sessionStorage.getItem(KEY)); return { completed: s.progress.puskonaladka.doneUnitIds.length, results: s.attempts.puskonaladka.map(a => ({ score: a.correct, passed: a.passed, total: a.answers.length })) }; }, KEY) });
    await attemptContext.close();
  }
  await context.close();
  const readerContext = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const rp = await readerContext.newPage();
  await login(rp, lang, true);
  for (const width of [1440, 390]) {
    await rp.setViewportSize({ width, height: 1200 });
    await go(rp, 'my', lang);
    await detail(rp, lang, width === 1440 ? 'reader' : 'reader-history', 'section[aria-labelledby="scales-title"]', 'Both complete reader progress cards; no programme completion invented.');
  }
  await readerContext.close();
  console.log(`${lang}: current localized source captured`);
}
await browser.close();
assert.deepEqual(errors, []);
await writeFile('src/data/learn-v2-media.json', JSON.stringify(media, null, 2) + '\n');
await writeFile(`${root}/capture-manifest.json`, JSON.stringify({ source, origin, dpr: 2, errors, sessions, media }, null, 2) + '\n');
console.log(`${Object.keys(media).length} complete current frames, EN/RU; product ${source.commit}`);
