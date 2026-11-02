/**
 * Settled first viewport for BEFORE/AFTER, identical timing (3.5 s after
 * networkidle, intro finished): node scripts/b2b-v3/first-view.mjs <origin> <phase>
 */
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const [origin, phase] = process.argv.slice(2);
const b = await chromium.launch();
for (const locale of ['en', 'ru']) for (const width of [1440, 390, 360]) {
  const mobile = width < 768;
  const c = await b.newContext({ viewport: { width, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
  const p = await c.newPage();
  await p.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/partner-portal/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `audit/b2b-portfolio-case-premium-v3/${phase}/${locale}-${width}-first-view.png` });
  await c.close();
}
await b.close();
