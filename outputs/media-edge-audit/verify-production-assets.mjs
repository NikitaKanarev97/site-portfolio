import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin = 'https://kanarev.com';
const files = execFileSync('git', ['show', '--format=', '--name-only', '514cf43', '--', 'public/media'], { encoding: 'utf8' }).trim().split(/\r?\n/);
const results = [];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (let start = 0; start < files.length; start += 6) {
  const batch = await Promise.all(files.slice(start, start + 6).map(async file => {
    const response = await fetch(origin + file.replace(/^public/, ''), { signal: AbortSignal.timeout(20000) });
    const bytes = Buffer.from(await response.arrayBuffer());
    const local = await readFile(file);
    return { file, status: response.status, matches: response.ok && hash(bytes) === hash(local), sha256: hash(bytes) };
  }));
  results.push(...batch);
}
const failures = results.filter(result => !result.matches);
await writeFile('outputs/media-edge-audit/production-assets.json', JSON.stringify({ origin, commit: '514cf43', results, failures }, null, 2));
console.log(JSON.stringify({ origin, assets: results.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
