/** Verify an unchanged wave-1 checkout against canonical Git blob hashes. */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(process.argv.find(a => a.startsWith('--root='))?.slice(7) || '.');
const manifest = JSON.parse(readFileSync(resolve(root, 'tasks/portfolio-rebuild/integration/wave-1-base-manifest.json'), 'utf8'));
const failures = [];
for (const file of manifest.files) {
  const path = resolve(root, file.path);
  if (!existsSync(path)) { failures.push({ path: file.path, reason: 'missing' }); continue; }
  const bytes = readFileSync(path);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== file.sha256 || bytes.length !== file.bytes) failures.push({ path: file.path, expected: file.sha256, actual: sha256 });
}
for (const [source, mirror] of [['ds/tokens.css', 'src/styles/tokens.css'], ['ds/motion.js', 'src/scripts/motion.js']]) {
  if (!readFileSync(resolve(root, source)).equals(readFileSync(resolve(root, mirror)))) failures.push({ source, mirror, reason: 'mirror mismatch' });
}
console.log(JSON.stringify({ root, files: manifest.files.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
