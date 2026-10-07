import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const RX = /.{0,50}(concept|концепт|pet[- ]?project|пет-проект|учебн\S* проект|hypothesis|гипотез|not a real|не настоящ|лишь прототип|only a prototype|local demo|демо|demo|демонстрац|demonstration|reconstruction|реконструкц|reinterpretation|переосмысл).{0,50}/gi;
const b = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const out = [];
for (const [site, base] of [['local', 'http://127.0.0.1:4410'], ['old', 'https://kanarev.com']])
  for (const loc of ['', '/ru'])
    for (const path of ['/', '/about/', '/work/agent-ops-console/', '/work/partner-portal/', '/work/learn/', '/work/vet-clinic/', '/work/pawly/']) {
      await p.goto(base + loc + path, { waitUntil: 'networkidle' });
      const txt = await p.evaluate(() => {
        const t = document.body.innerText.replace(/\u00a0/g, ' ');
        const attrs = [...document.querySelectorAll('[alt],[aria-label],[title]')].map(e => (e.getAttribute('alt') || '') + ' ' + (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || '')).join(' | ');
        const meta = [...document.querySelectorAll('meta[content]')].map(m => m.content).join(' | ') + ' | ' + document.title + ' | ' + [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent).join(' ');
        return { t, attrs: attrs.replace(/\u00a0/g, ' '), meta: meta.replace(/\u00a0/g, ' ') };
      });
      for (const [k, v] of Object.entries(txt)) for (const m of v.matchAll(RX)) out.push(`${site}\t${loc + path}\t${k}\t${m[0].replace(/\s+/g, ' ')}`);
    }
await writeFile('D:/Claude-projects/Site-portfolio/tasks/robert-review-2026-10-07/claude-review/results/logs/f45-rendered.tsv', [...new Set(out)].join('\n'));
await b.close();
