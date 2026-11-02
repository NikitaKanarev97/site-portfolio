import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const base = 'a1ae443b2162e3415ee1e6297b41026ddaa70780';
const root = 'audit/trassir-learn-portfolio-premium-v3';
const git = args => execFileSync('git', args, { encoding: 'utf8' }).trim();
const protectedChanges = git(['diff', '--name-only', base, '--', 'src', 'public', 'ds', 'research']);
assert.equal(protectedChanges, '', 'No application, copy, source media, DS or reference changes');
const originalFiles = git(['ls-tree', '-r', '--name-only', base, '--', root]).split('\n');
const changedOriginalFiles = git(['diff', '--name-only', base, '--', ...originalFiles]).split('\n').filter(Boolean);
assert.deepEqual(changedOriginalFiles, [`${root}/capture.mjs`]);
const assets = JSON.parse(await readFile(`${root}/asset-manifest.json`, 'utf8'));
const hashes = [];
for (const asset of assets) {
  const actual = createHash('sha256').update(await readFile(`public${asset.src}`)).digest('hex');
  assert.equal(actual, asset.sha256, asset.src);
  hashes.push({ source: asset.src, sha256: actual });
}
for (const phase of ['before', 'after']) {
  const checks = JSON.parse(await readFile(`${root}/v3.1/${phase}/checks.json`, 'utf8'));
  assert.equal(checks.length, 4);
  for (const c of checks) {
    assert.equal(c.missing.length + c.errors.length + c.failed.length + c.consoleErrors.length, 0);
    assert.equal(c.scrollWidth, c.viewport.width);
    assert.ok(c.lifecycle.intro.every(e => e.opacity === '1' && e.willChange === 'auto'));
  }
}
const browser = JSON.parse(await readFile(`${root}/v3.1/logs/browser.json`, 'utf8'));
assert.equal(browser.complete, true);
assert.equal(browser.results.length, 8);
const responsive = JSON.parse(await readFile(`${root}/v3.1/after/responsive-checks.json`, 'utf8'));
assert.equal(responsive.length, 4);
assert.ok(responsive.every(c => c.scrollWidth === c.viewport.width && !c.missing.length && !c.errors.length && !c.consoleErrors.length && !c.failed.length));
const result = { base, originalPackFiles: originalFiles.length, changedOriginalFiles, protectedChanges: [], unchangedSourceHashes: hashes,
  correctedCaptureCases: 12, browserCases: browser.results.length, lifecycleCases: browser.lifecycle.length, status: 'PASS' };
await writeFile(`${root}/v3.1/logs/integrity.json`, JSON.stringify(result, null, 2));
console.log(`${originalFiles.length - 1} existing pack files preserved; ${hashes.length} source hashes unchanged; 12 captures and 8 browser cases PASS`);
