import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root = 'D:/Claude-projects/Site-portfolio';
const source = 'D:/Claude-projects/learn';
const manifest = JSON.parse(readFileSync(`${root}/public/prototypes/learn-manifest.json`));
const expected = new Set(['/', '/showcase']);
const parse = file => ts.createSourceFile(file, readFileSync(`${source}/${file}`, 'utf8'), ts.ScriptTarget.Latest, true);
const prop = (node, name) => node.properties.find(p => p.name?.getText() === name)?.initializer;
function visit(node) {
  if (ts.isPropertyAssignment(node) && node.name.getText() === 'route' && ts.isStringLiteral(node.initializer)) expected.add(node.initializer.text);
  ts.forEachChild(node, visit);
}
visit(parse('src/screens/registry.ts'));
function entries(file, name) {
  let result;
  function walk(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText() === name) result = node.initializer.elements;
    ts.forEachChild(node, walk);
  }
  walk(parse(file));
  assert(result, name);
  return result;
}
for (const item of entries('src/data/materials.ts', 'MATERIALS')) expected.add(`/material/${prop(item, 'id').text}`);
for (const item of entries('src/data/trajectories.ts', 'TRAJECTORIES')) {
  const id = prop(item, 'id').text;
  expected.add(`/trajectory/${id}`);
  prop(item, 'units').elements.forEach((_, i) => expected.add(`/player/${id}/${i}`));
}
assert.deepEqual([...expected].sort(), manifest.routes);
for (const route of manifest.routes) {
  const file = `prototypes/learn${route === '/' ? '' : route}/index.html`;
  const saved = readFileSync(`${root}/public/${file}`, 'utf8');
  assert.equal(saved, readFileSync(`${root}/dist/${file}`, 'utf8'));
  const response = await fetch(`http://127.0.0.1:4322/prototypes/learn${route}`);
  assert.equal(response.status, 200, route);
  assert.equal(await response.text(), saved, route);
}
function walk(dir) { return readdirSync(dir).flatMap(name => { const p = path.join(dir, name); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
const files = walk(`${root}/public/prototypes`);
assert.equal(files.filter(p => /fixture|state-.*\.json/i.test(p)).length, 0);
for (const file of files) assert(readFileSync(file).equals(readFileSync(file.replaceAll('\\', '/').replace('/public/', '/dist/'))), file);
const landing = files.filter(p => p.includes('learn-landing') && p.endsWith('.html'));
assert.equal(landing.length, 18); // 16 directory entries plus two host-compatible 404.html aliases.
for (const file of landing) {
  const html = readFileSync(file, 'utf8');
  const locale = file.replaceAll('\\', '/').includes('/en/') ? 'en' : 'ru';
  assert(html.includes(`lang="${locale}"`));
  for (const match of html.matchAll(/(?:src|href)="(\/prototypes\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    let local = `${root}/dist${decodeURI(match[1])}`;
    if (statSync(local).isDirectory()) local = path.join(local, 'index.html');
    assert(statSync(local).isFile(), match[1]);
  }
}
const result = { productRoutes: manifest.routes.length, routeInventory: 'TypeScript AST independently matches export regex inventory', landingHtml: landing.length, savedExportFiles: files.length, publicDistByteEquality: true, allProductHttpBodiesMatchPhysicalFiles: true, fixtures: 0 };
writeFileSync(new URL('static.json', import.meta.url), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
