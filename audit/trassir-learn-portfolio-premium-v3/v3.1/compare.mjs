/** Additive comparison boards: actual captures, proportional scaling, external labels. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const original = 'audit/trassir-learn-portfolio-premium-v3';
const root = `${original}/v3.1`;
await mkdir(`${root}/comparisons`, { recursive: true });
const browser = await chromium.launch();
const manifest = [];
const uri = async path => `data:image/png;base64,${(await readFile(path)).toString('base64')}`;
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  for (const kind of ['viewport', 'learn-cover', 'capture-fix']) {
    const oldCapture = kind === 'capture-fix';
    const suffix = oldCapture ? 'viewport' : kind;
    const left = `${oldCapture ? `${original}/after` : `${root}/before`}/${locale}-${width}-${suffix}.png`;
    const right = `${root}/after/${locale}-${width}-${suffix}.png`;
    const labels = [oldCapture ? 'BEFORE · V3 / a1ae443 · legacy capture timing' : 'BEFORE · V2.3 / 4b9744d · fully settled', 'AFTER · V3 / unchanged implementation · fully settled'];
    const page = await browser.newPage({ viewport: { width: width === 390 ? 852 : 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>TRASSIR Learn V3.1 · ${locale} ${width} ${kind}</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#e9e9e7;color:#20201d;font:16px/1.5 Arial}h1{font-size:22px;margin:0}p{margin:4px 0 24px}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}figure{margin:0;min-width:0}figcaption{margin-bottom:12px;font-weight:bold}img{width:100%;height:auto;display:block}</style><h1>TRASSIR Learn V3.1 · ${locale.toUpperCase()} · ${width}px · ${kind}</h1><p>Chromium · DPR 1 · normal motion · actual pixels · independent acceptance pending.</p><main><figure><figcaption>${labels[0]}</figcaption><img src="${await uri(left)}"></figure><figure><figcaption>${labels[1]}</figcaption><img src="${await uri(right)}"></figure></main></html>`);
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
    const output = `${root}/comparisons/${locale}-${width}-${kind}.png`;
    await page.screenshot({ path: output, fullPage: true });
    await page.close();
    manifest.push({ locale, width, kind, left, right, labels, output });
  }
  await writeFile(`${root}/comparisons/${locale}-${width}.md`, `# ${locale.toUpperCase()} · ${width}px\n\n[Legacy V3 capture → corrected capture](${locale}-${width}-capture-fix.png) · [Settled V2.3 → V3 viewport](${locale}-${width}-viewport.png) · [Settled full hero](${locale}-${width}-learn-cover.png)\n\n| Evidence | BEFORE · pinned V2.3 / 4b9744d | AFTER · unchanged V3 implementation |\n|---|---|---|\n| Viewport | [Open](../before/${locale}-${width}-viewport.png) | [Open](../after/${locale}-${width}-viewport.png) |\n| Full page | [Open](../before/${locale}-${width}-full.png) | [Open](../after/${locale}-${width}-full.png) |\n| Entire hero | [Open](../before/${locale}-${width}-learn-cover.png) | [Open](../after/${locale}-${width}-learn-cover.png) |\n\nBoth production builds use the corrected capture script, matching viewport/locale/DPR and normal motion. Every image and relevant intro/reveal has settled. The separate capture-fix board preserves the original V3 screenshot, including any animation timing error; it is diagnostic evidence, not a settled baseline. See [V3.1 report](../REPORT.md).\n`);
}
await writeFile(`${root}/comparisons/manifest.json`, JSON.stringify(manifest, null, 2));
await browser.close();
console.log(`${manifest.length} additive comparison boards generated`);
