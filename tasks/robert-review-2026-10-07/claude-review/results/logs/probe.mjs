import { createRequire } from 'node:module';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const [url, w, js] = [process.argv[2], +process.argv[3], process.argv[4]];
const b = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(js), null, 1));
await b.close();
