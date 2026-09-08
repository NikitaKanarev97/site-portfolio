/** Real, locale-specific Learn screenshots. No UI is reconstructed in images.
 * Start the portfolio preview, then npm run frames:learn.
 * Existing acceptance fixtures are used only for the clearly labelled demo states.
 */
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { parseArgs } from 'node:util';

// Omit filters to retain the original both-locales/all-frames behaviour.
// --frames practice,assessment-result; cover/home selects only that crop.
const { values } = parseArgs({ options: {
  locale: { type: 'string' }, frames: { type: 'string' },
} });
const locales = values.locale ? values.locale.split(',') : ['en', 'ru'];
assert(locales.every(lang => ['en', 'ru'].includes(lang)), 'Use --locale en or ru');
const selected = values.frames ? new Set(values.frames.split(',')) : null;
const wanted = file => !selected || selected.has(file);

const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const source = path.resolve(process.env.LEARN_SOURCE ?? '../learn');
const evidence = path.join(source, 'audit/product-polish/evidence/07');
const attempt = '35ca2928-5cf8-4599-9509-49d63c89229d';
const shots = [
  { file: 'home', route: '/home', cover: true },
  { file: 'trajectory', route: '/trajectory/proekt', cover: true },
  { file: 'material', route: '/material/onvif-not-found', cover: true },
  { file: 'my', route: '/my', state: 'state-marina-one.json' },
  { file: 'practice', route: '/practice?trajectoryId=proekt', state: 'state-marina-ready.json', practice: true },
  { file: 'assessment-result', route: `/assessment/result?attemptId=${attempt}`, state: 'state-marina-final.json' },
];
const allShots = [...shots, { file: 'landing', landing: true }];
const frameNames = ['before-catalog', ...allShots.map(s => s.file), ...shots.filter(s => s.cover).map(s => `cover/${s.file}`)];
assert(!selected || [...selected].every(file => frameNames.includes(file)), `Unknown frame; choose ${frameNames.join(', ')}`);
const browser = await chromium.launch({ headless: true });
const report = [];
try {
  for (const lang of [...new Set(locales)]) {
    const dir = path.resolve(`public/media/case-learn${lang === 'ru' ? '-ru' : ''}`);
    await mkdir(path.join(dir, 'cover'), { recursive: true });
    // Preserve the original Russian archive as evidence in both editions.
    if (wanted('before-catalog')) {
      const info = await sharp(path.join(source, 'images/default-pages/3.png')).webp({ quality: 90 }).toFile(path.join(dir, 'before-catalog.webp'));
      report.push({ lang, file: 'before-catalog.webp', source: 'images/default-pages/3.png', width: info.width, height: info.height });
    }
    for (const shot of allShots.filter(s => wanted(s.file) || (s.cover && wanted(`cover/${s.file}`)))) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5,
        reducedMotion: 'reduce', locale: lang === 'ru' ? 'ru-RU' : 'en-GB',
      });
      if (shot.state) {
        const state = JSON.parse(await readFile(path.join(evidence, shot.state), 'utf8'));
        // Localize only this known demonstration company in the capture copy.
        if (lang === 'en') {
          const company = value => value === 'ООО Учебный пример' ? 'Learning Example LLC' : value;
          state.session.company = company(state.session.company);
          if (state.verification) state.verification.company = company(state.verification.company);
          for (const certificate of state.certificates) certificate.company = company(certificate.company);
        }
        // A historical sign-in toast is not part of the saved result scene.
        state.toasts = [];
        await context.addInitScript((state) => {
          sessionStorage.setItem('learn-prototype-v1', JSON.stringify(state));
          sessionStorage.setItem('learn-account-v2:' + encodeURIComponent(state.session.identifier), JSON.stringify(state));
        }, state);
      }
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      const url = new URL(shot.landing ? '/prototypes/learn-landing/' : `/prototypes/learn${shot.route}`, origin);
      url.searchParams.set('lang', lang);
      await page.goto(url.href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      if (shot.practice) {
        await page.getByRole('radio').nth(1).check();
        await page.getByRole('button', { name: lang === 'ru' ? 'Проверить ответ' : 'Check answer', exact: true }).click();
        await page.getByText(lang === 'ru' ? 'Ваш ответ' : 'Your answer', { exact: true }).waitFor();
        await page.getByText(lang === 'ru' ? 'Правильный ответ' : 'Correct answer', { exact: true }).waitFor();
        assert.equal(await page.getByRole('radio').nth(1).getAttribute('aria-checked'), 'true', 'Wrong selection must remain checked');
        assert.equal(await page.getByRole('radio').nth(1).getAttribute('data-state'), 'incorrect');
        assert.equal(await page.locator('[role="radio"][data-state="correct"]').count(), 1);
        assert(await page.locator('a[href*="/material/"]').count(), 'Practice must expose its source');
      }
      const observation = await page.evaluate(() => ({
        lang: document.documentElement.lang, text: document.body.innerText,
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
        state: JSON.parse(sessionStorage.getItem('learn-prototype-v1') || 'null'),
      }));
      assert.equal(observation.lang, lang, 'Document locale');
      assert(!observation.overflow, `${shot.file}: horizontal overflow`);
      assert.equal(observation.brokenImages.length, 0, 'Broken image');
      assert.equal(errors.length, 0, errors.join('\n'));
      if (shot.file === 'my') {
        assert.equal(observation.state.progress.proekt.doneUnitIds.length, 1);
        assert.equal(observation.state.history.length, 2);
      }
      if (shot.practice) {
        assert.equal(observation.state.progress.proekt.doneUnitIds.length, 8, 'Practice must not credit completion');
        assert.equal(observation.state.attempts.proekt?.length ?? 0, 0);
      }
      if (shot.file === 'assessment-result') {
        const result = observation.state.attempts.proekt.find(item => item.id === attempt);
        assert(result?.passed && result.correct === 20 && result.rules.threshold === 16);
        assert.equal(observation.state.certificates.filter(item => item.attemptId === attempt).length, 1);
        await page.getByRole('button', { name: lang === 'ru' ? 'Открыть документ' : 'Open document', exact: true }).waitFor();
      }
      const cyrillic = await page.locator('body').innerText();
      if (lang === 'en' && /[А-Яа-яЁё]/.test(cyrillic)) {
        throw new Error(`Untranslated English capture: ${shot.file}: ${cyrillic.match(/[^\n]*[А-Яа-яЁё][^\n]*/g)?.join(' | ')}`);
      }
      const scene = { lang, url: page.url(), fixture: shot.state ?? null, text: observation.text, errors };
      if (wanted(shot.file)) {
        const full = await page.screenshot({ fullPage: !shot.landing, animations: 'disabled' });
        const info = await sharp(full).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(dir, `${shot.file}.webp`));
        report.push({ ...scene, file: `${shot.file}.webp`, width: info.width, height: info.height });
      }
      if (shot.cover && wanted(`cover/${shot.file}`)) {
        const cover = await page.screenshot({ fullPage: false, animations: 'disabled' });
        await sharp(cover).resize(2000, 1250, { fit: 'cover', position: 'top' }).webp({ quality: 84 }).toFile(path.join(dir, 'cover', `${shot.file}.webp`));
        report.push({ ...scene, file: `cover/${shot.file}.webp`, width: 2000, height: 1250 });
      }
      console.log(`Captured ${lang} ${shot.file}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
  await mkdir('.tmp/learn', { recursive: true });
  await writeFile('.tmp/learn/frame-report.json', JSON.stringify(report, null, 2));
}
console.log(`Captured ${report.length} files. Report: .tmp/learn/frame-report.json`);
