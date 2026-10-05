/** Complete native profile capture: sticky footer must not paint over reviews. */
import {createRequire} from 'node:module';
import {readFile, writeFile, copyFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const product = 'D:/Claude-projects/PETS-walking';
const {chromium} = createRequire(`${product}/package.json`)('playwright');
const {frame} = await import(`file:///${product}/audit/product-polish/evidence/02-pilot/capture.mjs`);
const seed = JSON.parse(await readFile(`${product}/audit/product-polish/evidence/05-acceptance/entry-baseline.json`, 'utf8')).data;
seed.riskProfile.answered = true;
Object.assign(seed.booking, {id:'pawly-case-06', status:'draft', pickupComplete:false, dropoffComplete:false, walkerAcceptedId:undefined});
const report = [];
const browser = await chromium.launch({executablePath:process.env.HARMONY_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  for (const locale of ['en', 'ru']) {
    const captureBrowser = {newPage: options => browser.newPage({...options, deviceScaleFactor:1.5})};
    const page = await frame(captureBrowser, {slug:'walker-profile', locale, fixture:seed});
    await page.locator('[data-track="walker-confirm"]').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });
    // A documentary still has no scrolling. Restore normal flow so every
    // review line and the complete native action appear together in the shot.
    const footer = page.locator('article > footer');
    await footer.evaluate(node => {node.style.position = 'static'; node.style.borderTop = '0';});
    const fields = await footer.evaluate(node => {
      const previous = node.previousElementSibling.getBoundingClientRect();
      const box = node.getBoundingClientRect();
      return {reviewsBottom:previous.bottom, footerTop:box.top, borderTop:getComputedStyle(node).borderTopWidth};
    });
    assert(fields.footerTop >= fields.reviewsBottom, 'Footer covers the reviews');
    assert.equal(fields.borderTop, '0px');
    const article = page.locator('article').first();
    const text = await article.innerText();
    assert(text.includes(locale === 'ru' ? 'Отзывы публикуются' : 'Reviews are published'), 'Complete review explanation');
    const file = `public/media/case-pawly${locale === 'ru' ? '-ru' : ''}/walker-profile.webp`;
    const info = await sharp(await article.screenshot({animations:'disabled'})).webp({quality:94}).toFile(file);
    const active = `public/media/rebuild/pawly/${locale}/walker-profile.webp`;
    await copyFile(file, active);
    report.push({locale, file, active, source:page.url(), viewport:{width:390,height:844}, dpr:1.5, width:info.width, height:info.height,
      fields, text, sha256:createHash('sha256').update(await readFile(file)).digest('hex'),
      boundary:'Complete native article in document flow; footer does not overlap reviews; no pixel editing.'});
    await page.close();
  }
} finally {await browser.close();}
const manifest = 'tasks/portfolio-rebuild/pawly/captures.json';
const entries = JSON.parse(await readFile(manifest, 'utf8'));
for (const capture of report) {
  const record = entries.records.find(entry => entry.id === `${capture.locale}-walker-profile`);
  Object.assign(record, {sha256:capture.sha256, reused:false, width:capture.width, height:capture.height, boundary:capture.boundary});
}
await writeFile(manifest, JSON.stringify(entries, null, 2));
await mkdir('tasks/portfolio-rebuild/integration', {recursive:true});
await writeFile('tasks/portfolio-rebuild/integration/pawly-profile-fields.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map(({locale,width,height,fields}) => ({locale,width,height,fields}))));
