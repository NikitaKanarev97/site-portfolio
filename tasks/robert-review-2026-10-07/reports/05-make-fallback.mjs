// Browser fixture: exact built markup/styles/assets with scripts unavailable.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('./05-build/dist/', import.meta.url);
const routes = {
  'home-en': 'index.html',
  'home-ru': 'ru/index.html',
  'learn-en': 'work/learn/index.html',
  'learn-ru': 'ru/work/learn/index.html',
  'vet-en': 'work/vet-clinic/index.html',
  'vet-ru': 'ru/work/vet-clinic/index.html',
};
const manifest = [];
for (const [name, source] of Object.entries(routes)) {
  const html = await readFile(new URL(source, root), 'utf8');
  const fallback = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const directory = new URL(`qa-no-js/${name}/`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), fallback);
  manifest.push({source, route:`/qa-no-js/${name}/`, scripts:(fallback.match(/<script\b/gi) ?? []).length});
}
await writeFile(new URL('./05-fallback-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest));
