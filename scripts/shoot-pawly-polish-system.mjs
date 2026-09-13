/** Capture the accepted Storybook 04 build, without rebuilding unchanged stories. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/PETS-walking/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const records = [];
try {
  for (const locale of ['en', 'ru']) {
    for (const [name,id] of [['info-note','infonote'],['empty-state','emptystate'],['bottom-sheet','bottomsheet'],['photo-proof','photoproof'],['timeline-row','timelinerow'],['icon-button','iconbutton']]) {
      const p = await browser.newPage({ viewport: { width: 900, height: 900 }, reducedMotion: 'reduce' });
      // Canonical matrices include deliberate EN/RU examples. Do not run the old
      // Storybook word-by-word RU decorator over already bilingual examples.
      await p.goto(`http://127.0.0.1:6008/iframe.html?id=components-${id}--all-variants&viewMode=story`);
      await p.locator('#storybook-root > *').first().waitFor();
      await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
      await p.waitForTimeout(400);
      const root = p.locator('#storybook-root');
      const text = await root.innerText();
      if (/Couldn't find story|No Preview/.test(text)) throw Error(text);
      if (id === 'photoproof' && !text.includes('local · not sent')) throw Error('Stale PhotoProof catalogue');
      if (id === 'infonote' && !text.includes('Product Polish')) throw Error('Stale InfoNote catalogue');
      const file = `public/media/case-pawly${locale === 'ru' ? '-ru' : ''}/system-${name}.webp`;
      await sharp(await root.screenshot()).trim({ threshold: 8 }).extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' }).webp({ quality: 88 }).toFile(file);
      records.push({ locale, id, file, text });
      await p.close();
    }
  }
  await fs.writeFile('D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case/system-media.json', JSON.stringify(records, null, 2));
  console.log('12 catalogue captures from accepted Storybook build');
} finally { await browser.close(); }
