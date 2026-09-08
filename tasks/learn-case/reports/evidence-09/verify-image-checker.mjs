import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { verifyImages } from '../../../../scripts/lib/verify-images.mjs';
const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await page.goto('http://127.0.0.1:4322/');
  await page.route('**/acceptance-missing.webp', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.setContent('<dialog><img src="" alt=""></dialog><div style="height:20000px"></div><img loading="lazy" src="/media/case-learn/home.webp"><img loading="lazy" src="/acceptance-missing.webp">');
  const failures = await verifyImages(page);
  assert.equal(failures.length, 1);
  assert(failures[0].endsWith('/acceptance-missing.webp'));
  assert(await page.locator('img[src="/media/case-learn/home.webp"]').evaluate(img => img.naturalWidth > 0));
  const report = { status: 'pass', lazyOffscreenDecoded: true, emptyZoomIgnored: true, real404Detected: failures };
  await writeFile('tasks/learn-case/reports/evidence-09/image-checker.json', JSON.stringify(report, null, 2));
  console.log(report);
} finally { await browser.close(); }
