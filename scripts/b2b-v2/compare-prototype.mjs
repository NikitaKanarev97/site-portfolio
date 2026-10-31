/** Same frozen synthetic fixture, public alias versus accepted product. */
import { mkdir, writeFile } from 'node:fs/promises';
import { browser, open, settle } from './shared.mjs';
const out = 'audit/b2b-case-v21/prototype';
await mkdir(out, { recursive: true });
const checks = [];
for (const route of ['dashboard', 'cart']) for (const version of ['accepted', 'public']) {
  const { context, page } = await open(route, { state: 'resolved', width: 1440, height: 900 });
  if (version === 'public') {
    await page.goto(`https://b2b-partner-portal-five.vercel.app/${route}`);
    await settle(page);
  }
  await page.screenshot({ path: `${out}/${version}-${route}.png` });
  checks.push({ version, route, url: page.url(), text: await page.locator('main').innerText() });
  await context.close();
}
await writeFile(`${out}/comparison.json`, JSON.stringify(checks, null, 2));
await browser.close();
