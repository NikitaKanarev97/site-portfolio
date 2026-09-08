/** Build Learn once, then ship self-contained static demos with the portfolio.
 * npm run sync:learn -- [path/to/learn]
 * The regular portfolio build never depends on a sibling checkout.
 */
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(process.argv[2] ?? path.join(root, '..', 'learn'));
const destination = path.join(root, 'public', 'prototypes');
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run through npm run sync:learn so the current npm runtime is reused.');

function build(cwd, args, env = {}) {
  const result = spawnSync(process.execPath, [npmCli, 'run', 'build', ...args], {
    cwd, env: { ...process.env, ...env }, stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error(`Build failed: ${cwd}`);
}

build(source, ['--', '--base=/prototypes/learn/']);
build(path.join(source, 'landing', 'app'), [], {
  LANDING_BASE: '/prototypes/learn-landing/',
  VITE_LEARN_PRODUCT_URL: '/prototypes/learn/',
});

async function replaceBuild(name, buildPath) {
  const target = path.resolve(destination, name);
  // Deletion only of the two named generated artifacts within this workspace.
  if (path.dirname(target) !== destination || !['learn', 'learn-landing'].includes(name)) {
    throw new Error(`Unexpected output path: ${target}`);
  }
  await readFile(path.join(buildPath, 'index.html')); // Never delete a good export for a missing one.
  await rm(target, { recursive: true, force: true });
  await cp(buildPath, target, { recursive: true });
  return target;
}

const product = await replaceBuild('learn', path.join(source, 'dist'));
await replaceBuild('learn-landing', path.join(source, 'landing', 'app', 'dist'));

// Materialise product entry points so direct links and refresh work on any
// static host, including Astro preview, without swallowing the site's 404s.
const registry = await readFile(path.join(source, 'src/screens/registry.ts'), 'utf8');
const materials = await readFile(path.join(source, 'src/data/materials.ts'), 'utf8');
const trajectories = await readFile(path.join(source, 'src/data/trajectories.ts'), 'utf8');
const routes = new Set(['/', '/showcase']);
for (const match of registry.matchAll(/route:\s*['"]([^'"]+)['"]/g)) routes.add(match[1]);
for (const match of materials.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)) routes.add(`/material/${match[1]}`);
for (const match of trajectories.matchAll(/\bid:\s*['"]([^'"]+)['"][\s\S]*?units:\s*\[([\s\S]*?)\]/g)) {
  const id = match[1];
  routes.add(`/trajectory/${id}`);
  const count = [...match[2].matchAll(/\b(?:unit|exam)\(/g)].length;
  for (let index = 0; index < count; index++) routes.add(`/player/${id}/${index}`);
}
if (routes.size < 60) throw new Error('Route inventory unexpectedly small; review source extraction before publishing.');
const shell = await readFile(path.join(product, 'index.html'), 'utf8');
for (const route of routes) {
  if (!/^\/[a-z0-9/-]*$/i.test(route)) throw new Error(`Unexpected route: ${route}`);
  const dir = path.join(product, route.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), shell);
}
await writeFile(path.join(destination, 'learn-manifest.json'), JSON.stringify({
  productBase: '/prototypes/learn/', landingBase: '/prototypes/learn-landing/',
  locales: ['en', 'ru'], routes: [...routes].sort(),
}, null, 2) + '\n');
console.log(`Learn exported with ${routes.size} reloadable product routes and both landing languages.`);
