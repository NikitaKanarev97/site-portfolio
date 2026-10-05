/** Re-record EN/RU assessment and landing with native page fields intact. */
import {createRequire} from 'node:module';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {isolateAssessment, isolateLanding, regionFields} from './lib/learn-frame-fields.mjs';
const {chromium} = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4475';
const state = JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-ready.json', 'utf8'));
state.toasts = [];
const report = [];
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  for (const lang of ['en','ru']) for (const variant of ['desktop','mobile']) for (const kind of ['assessment','landing']) {
    const width = variant === 'mobile' ? 390 : kind === 'assessment' ? 1024 : 1440;
    const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
    await page.addInitScript(s => {
      sessionStorage.setItem('learn-prototype-v1', JSON.stringify(s));
      sessionStorage.setItem('learn-account-v2:'+encodeURIComponent(s.session.identifier), JSON.stringify(s));
    }, state);
    const path = kind === 'assessment' ? '/prototypes/learn/assessment/intro?trajectoryId=proekt&' : `/prototypes/learn-landing/${lang === 'en' ? 'en/' : ''}?`;
    await page.goto(`${origin}${path}lang=${lang}`, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    const rules = page.locator('div[class*="_card_"]').filter({has:page.getByText(lang === 'ru' ? 'Попыток осталось' : 'Attempts remaining', {exact:true})}).first();
    const frame = kind === 'assessment' ? await isolateAssessment(page, rules) : await isolateLanding(page);
    const text = await frame.innerText();
    if (kind === 'assessment') {
      assert(text.includes(lang === 'ru' ? 'Повтор через 24 ч' : '24'), 'Complete retry rule');
      assert(!text.includes(lang === 'ru' ? 'Дополнительные темы демобанка' : 'Additional'), 'No following section');
    }
    const fields = await regionFields(frame, kind);
    assert(fields.every(f => f.left >= 16 && f.right >= 16 && f.top >= 24 && f.bottom >= 24), JSON.stringify(fields));
    const file = `public/media/rebuild/learn${lang === 'ru' ? '-ru' : ''}/${kind}-${variant}.webp`;
    const before = await sharp(await readFile(file)).metadata();
    const bytes = await frame.screenshot({animations:'disabled'});
    const info = await sharp(bytes).webp({quality:94}).toFile(file);
    report.push({file, lang, kind, variant, url:page.url(), viewport:{width,height:1000}, dpr:2,
      before:{width:before.width,height:before.height}, width:info.width,height:info.height, fields, text,
      sha256:createHash('sha256').update(await readFile(file)).digest('hex'),
      boundary:'Whole native region at integer origin; source page fields retained; no image/text painting.'});
    await page.screenshot({path:`tmp/learn-fields-${lang}-${kind}-${variant}.png`,clip:await frame.boundingBox(),animations:'disabled'});
    await page.close();
    console.log(`${lang} ${kind} ${variant}: ${info.width}×${info.height}, all native fields retained`);
  }
} finally {await browser.close();}
await mkdir('tasks/portfolio-rebuild/integration', {recursive:true});
await writeFile('tasks/portfolio-rebuild/integration/learn-frame-fields-2026-10-05.json', JSON.stringify(report,null,2));
for (const lang of ['en','ru']) {
  const manifest = lang === 'en' ? 'tasks/portfolio-rebuild/learn/captures.json' : 'tasks/portfolio-rebuild/integration/learn-story-ru-captures.json';
  const entries = JSON.parse(await readFile(manifest,'utf8'));
  for (const capture of report.filter(r => r.lang === lang)) {
    const id = `${capture.kind}-${capture.variant}`;
    const index = entries.findIndex(e => e.id === id);
    const entry = {...(entries[index] ?? {}), ...capture, id, source:capture.url,
      crop:capture.boundary, fixture:'Native page fields; assessment intro / complete landing hero'};
    if (index === -1) entries.push(entry); else entries[index] = entry;
  }
  await writeFile(manifest,JSON.stringify(entries,null,2));
}
