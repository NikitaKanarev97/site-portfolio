/** Browser-rendered evidence boards; unedited native captures, proportional scale. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const root = 'audit/trassir-learn-portfolio-premium-v3';
await mkdir(`${root}/comparisons`, { recursive: true });
const browser = await chromium.launch();
const uri = async p => `data:image/${p.endsWith('.jpg') ? 'jpeg' : 'png'};base64,${(await readFile(p)).toString('base64')}`;
const boards = [];
async function board(name, left, right, labels, mobile = false) {
  const page = await browser.newPage({ viewport: { width: mobile ? 852 : 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>${name}</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#e9e9e7;color:#20201d;font:16px/1.5 Arial}header{margin-bottom:24px}h1{font-size:22px;margin:0}p{margin:4px 0}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}figure{margin:0;min-width:0}figcaption{margin-bottom:12px;font-weight:bold}img{width:100%;height:auto;display:block}</style><header><h1>TRASSIR Learn V3 · ${name}</h1><p>Actual source captures · proportional scale · no UI pixels altered. Final visual acceptance is independent.</p></header><main><figure><figcaption>${labels[0]}</figcaption><img src="${await uri(left)}"></figure><figure><figcaption>${labels[1]}</figcaption><img src="${await uri(right)}"></figure></main></html>`);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
  await page.screenshot({ path: `${root}/comparisons/${name}.png`, fullPage: true });
  await page.close();
  boards.push({ name, left, right, labels });
}
for (const locale of ['en','ru']) for (const width of [1440,390]) {
  await board(`${locale}-${width}-viewport`, `${root}/before/${locale}-${width}-viewport.png`, `${root}/after/${locale}-${width}-viewport.png`, ['BEFORE · pinned V2.3 / 4b9744d', 'AFTER · V3'], width === 390);
  await writeFile(`${root}/comparisons/${locale}-${width}.md`, `# ${locale.toUpperCase()} · ${width}px\n\n[Matched viewport board](${locale}-${width}-viewport.png)\n\n| | BEFORE | AFTER |\n|---|---|---|\n| Viewport | [Open](../before/${locale}-${width}-viewport.png) | [Open](../after/${locale}-${width}-viewport.png) |\n| Full page | [Open](../before/${locale}-${width}-full.png) | [Open](../after/${locale}-${width}-full.png) |\n\nSame browser, DPR 1, viewport, locale, normal motion and capture script against two production builds. Product fixtures are identical reused source images.\n`);
}
const refs = {
  R1: 'research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg',
  R2: 'research/portfolio-benchmark/case-blueprint/img/ku-pair.jpg',
  R3: 'research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png',
  R4: 'research/portfolio-rebuild-2026-10-03/references/ha-screen-map.png',
  R5: 'research/portfolio-benchmark/case-blueprint/img/ha-components.jpg',
  R6: 'research/portfolio-benchmark/case-blueprint/img/dn-impact.jpg',
  R7: 'research/portfolio-benchmark/case-blueprint/img/ku-bag.jpg',
};
for (const [name,id,r,b] of [
  ['hero','learn-cover','R2','learn-cover'],
  ['problem','problem','R1','problem'],
  ['architecture','shared-material','R3','shared-material'],
  ['architecture-hierarchy','shared-material','R4','shared-material'],
  ['reference','reference-path','R2','shared-material'],
  ['programme','guided-path','R7','guided-path'],
  ['progress','workspace','R5','workspace'],
  ['assessment','assessment','R5','assessment'],
  ['outcome','outcome','R6','outcome'],
]) {
  await board(`reference-${name}`, refs[r], `${root}/after/en-1440-${id}.png`, [`${r} · exact inspected reference`, `AFTER · ${name} / EN 1440`]);
  if (name === 'architecture-hierarchy') continue;
  for (const width of [1440,390]) await board(`before-after-${name}-${width}`, `${root}/before/en-${width}-${b}.png`, `${root}/after/en-${width}-${id}.png`, [`BEFORE · ${b} / EN ${width}`, `AFTER · ${id} / EN ${width}`], width === 390);
}
await writeFile(`${root}/comparisons/manifest.json`, JSON.stringify(boards, null, 2));
await browser.close();
console.log(`${boards.length} real-image comparison boards generated`);
