/** Explicit thematic local snapshot; never stages the rest of the dirty checkout. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const out = 'tasks/portfolio-rebuild/integration';
const git = args => execFileSync('git', args, { encoding: 'utf8', windowsHide: true }).trim();
if (!process.argv.includes('--create')) throw new Error('Use --create only after owner acceptance of A.');
if (git(['branch', '--show-current']) !== 'codex/portfolio-integration-g') throw new Error('Unexpected branch');
if (git(['diff', '--cached', '--name-only'])) throw new Error('Preserve the existing index; stage is not empty.');
const parent = git(['rev-parse', 'HEAD']);
if (parent !== '62304d8e555193a26926b673a56ba13f631ecd7e') throw new Error('Base parent changed; audit before capture.');
const original = JSON.parse(readFileSync('tasks/portfolio-rebuild/common/base/manifest.json'));
if (JSON.parse(readFileSync(out + '/corners-verification.json')).failures.length) throw new Error('G-01 verification has open failures.');
const extra = ['tasks/portfolio-rebuild/common/base/manifest.json', 'tasks/portfolio-rebuild/common/base/files.txt',
  out + '/a-acceptance.md', out + '/common-requests.md', out + '/snapshot-base.mjs',
  out + '/verify-base.mjs', out + '/verify-corners.mjs', out + '/corners-verification.json',
  ...['availability', 'upload', 'resolution'].flatMap(set => [1440, 390].map(width => `${out}/shots/corners-${set}-${width}.png`))];
const selected = [...new Set([...original.files.map(f => f.path), ...extra])].sort();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = selected.map(path => ({ path, beforeSha256: sha(readFileSync(path)) }));
// Follow the repository's * text=auto eol=lf rule. Never normalize binary captures.
const normalized = [];
for (const path of selected.filter(path => /\.(md|ts|js|mjs|cjs|astro|css|json|txt|html|log|svg)$/.test(path))) {
  const bytes = readFileSync(path), text = bytes.toString('utf8');
  if (text.includes('\0') || !Buffer.from(text).equals(bytes)) continue;
  const lf = text.replaceAll('\r\n', '\n').replace(/\n{3,}$/, '\n');
  if (lf !== text) { writeFileSync(path, lf); normalized.push(path); }
}
const manifest = { version: 'common-a-accepted-g01-2026-10-04', parent,
  acceptance: out + '/a-acceptance.md', originalOverlayManifest: 'tasks/portfolio-rebuild/common/base/manifest.json',
  normalized, provenance, files: selected.map(path => { const bytes = readFileSync(path); return { path, bytes: bytes.length, sha256: sha(bytes) }; }) };
writeFileSync(out + '/base-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(out + '/base-files.txt', [...selected, out + '/base-manifest.json', out + '/base-files.txt'].join('\n') + '\n');
git(['add', '--pathspec-from-file=' + out + '/base-files.txt']);
const staged = git(['diff', '--cached', '--name-only']).split(/\r?\n/);
const allowed = new Set([...selected, out + '/base-manifest.json', out + '/base-files.txt']);
if (staged.some(path => !allowed.has(path))) throw new Error('Unexpected staged file; commit has not been created.');
git(['commit', '-m', 'feat(portfolio): accepted Common A base with native specimen outlines']);
const ref = git(['rev-parse', 'HEAD']);
git(['branch', 'codex/portfolio-common-a-2026-10-04', ref]);
console.log(JSON.stringify({ ref, parent, branch: 'codex/portfolio-common-a-2026-10-04', files: selected.length, changedFiles: staged.length, normalized: normalized.length }, null, 2));
