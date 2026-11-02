/** Section heights of the case at one width: node scripts/b2b-v3/measure.mjs <origin> <width> [ru] */
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const [origin, width = '1440', locale = 'en'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 }, reducedMotion: 'reduce' });
await p.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/partner-portal/`, { waitUntil: 'networkidle' });
console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.portal-case section, .portal-facts')].map(s => [s.id || s.className.split(' ')[0], Math.round(s.getBoundingClientRect().height)]))));
await b.close();
