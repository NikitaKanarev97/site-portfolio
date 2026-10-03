/** Read-only, byte-for-byte verification of the accepted G base, independent of product repos. */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
const root = resolve(process.argv.find(v => v.startsWith('--root='))?.slice(7) || '.');
const manifest = JSON.parse(readFileSync(join(root, 'tasks/portfolio-rebuild/integration/base-manifest.json')));
const failures = [];
for (const file of manifest.files) {
  try { const bytes = readFileSync(join(root, file.path)); if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) failures.push(file.path); }
  catch { failures.push(file.path); }
}
console.log(JSON.stringify({ root, version: manifest.version, files: manifest.files.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
