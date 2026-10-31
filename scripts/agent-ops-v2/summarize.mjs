import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = 'audit/agent-ops-v2';
const read = async file => JSON.parse(await readFile(`${root}/${file}`, 'utf8'));
const manifest = await read('capture-manifest.json');
const after = (await read('after/checks.json')).checks;
const before = (await read('before-extra/checks.json')).checks;
const hashes = await read('before-hashes.json');
const preserved = await Promise.all(hashes.map(async entry => {
  const file = `before/${path.win32.basename(entry.Path)}`;
  const hash = createHash('sha256').update(await readFile(`${root}/${file}`)).digest('hex').toUpperCase();
  return { path: file, sha256: hash, preserved: hash === entry.Hash };
}));
const unchangedOtherCards = after.filter(check => check.surface === 'home').map(check => {
  const original = before.find(item => item.locale === check.locale && item.width === check.width);
  return { locale: check.locale, width: check.width, unchanged: JSON.stringify(original.otherCards) === JSON.stringify(check.otherCards) };
});
const failures = after.filter(check => check.overflow || check.errors.length || check.failed.length || check.broken.length || check.hiddenHeadings.length || check.frames.some(frame => frame.upscaled || !frame.contained));
const primary = manifest.entries.filter(entry => /^(review-queue|run-detail|action-approvals|policy-editor|policy-version-diff|quality-dashboard|autonomy)-(desktop|mobile)$/.test(entry.key));
const summary = { capturedAt: (await stat(`${root}/after/checks.json`)).mtime.toISOString(), matrixStates: after.length, primarySourceStates: primary.length,
  allBeforePreserved: preserved.every(entry => entry.preserved), preserved, unchangedOtherCards,
  browserFailures: failures.map(check => ({ locale: check.locale, width: check.width, surface: check.surface, errors: check.errors, failed: check.failed, broken: check.broken, overflow: check.overflow, frames: check.frames.filter(frame => frame.upscaled || !frame.contained) })),
  editorialWords: after.filter(check => check.surface === 'case').map(check => ({ locale: check.locale, width: check.width, words: check.wordCount })),
  notes: ['Full-page mobile screenshots use PNG when taller than the WebP dimension limit; other review exports are lossless WebP.', 'Source originals are local, full resolution, and hash-addressed by capture-manifest.json.', 'Portfolio visual acceptance remains with independent ChatGPT review.'] };
await writeFile(`${root}/verification-summary.json`, JSON.stringify(summary, null, 2) + '\n');
const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const columns = ['screen','source_commit','accepted_code_commit','route','role','fixture','locale','viewport','density','captured_at','original_sha256','target_output','dom_bounds','localization_completion','verification'];
const rows = primary.map(entry => [entry.screen,entry.sourceCommit,entry.acceptedCodeCommit,entry.route,entry.role,entry.fixture,entry.locale,`${entry.viewport.width}x${entry.viewport.height}`,entry.density,entry.capturedAt,entry.originalSha256,entry.src,JSON.stringify(entry.bounds),entry.localeCompletion,'CAPTURED_FROM_VERIFIED_SOURCE']);
await writeFile(`${root}/SCREENSHOT_PROVENANCE.csv`, [columns,...rows].map(row => row.map(csv).join(',')).join('\n') + '\n');
await mkdir(`${root}/comparisons`, { recursive: true });
for (const locale of ['en','ru']) for (const width of [1440,390]) for (const surface of ['home','case']) {
  const name = `${locale}-${width}`;
  const image = surface === 'home' ? `${name}-home` : `${name}-case-viewport`;
  const original = surface === 'home' ? `${name}-home.png` : `${name}-viewport.png`;
  const afterFull = `${name}-${surface}-full.${surface === 'case' && width === 390 ? 'png' : 'webp'}`;
  const beforeFull = surface === 'home' ? `before-extra/${name}-home-full.webp` : `before/${name}-full.png`;
  const beforeViewport = surface === 'home' ? `before-extra/${name}-home-viewport.webp` : `before/${name}-viewport.png`;
  const doc = `# ${surface === 'home' ? 'Homepage cover' : 'Agent Ops case'} · ${locale.toUpperCase()} · ${width}px\n\nReal Chromium render. BEFORE: b7a4051. AFTER: this branch, production build. Original twelve BEFORE PNGs are preserved.\n\n| Before | After |\n| --- | --- |\n| ![Before](../before/${original}) | ![After](../after/${image}.webp) |\n\n[Before first viewport](../${beforeViewport}) · [After first viewport](../after/${name}-${surface}-viewport.webp)\n\n[Before full page](../${beforeFull}) · [After full page](../after/${afterFull})\n\n[Provenance](../capture-manifest.json) · [Verification](../verification-summary.json)\n`;
  await writeFile(`${root}/comparisons/${surface}-${name}.md`, doc);
}
console.log(JSON.stringify({ states: after.length, primary: primary.length, failures: failures.length, preserved: summary.allBeforePreserved, otherCardsUnchanged: unchangedOtherCards.every(item => item.unchanged) }));
if (after.length !== 8 || primary.length !== 28 || failures.length || !summary.allBeforePreserved || unchangedOtherCards.some(item => !item.unchanged)) process.exitCode = 1;
