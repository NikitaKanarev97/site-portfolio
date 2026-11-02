/**
 * Proves the V3 change is scoped: compares a BEFORE build directory with dist/.
 *   node scripts/b2b-v3/build-scope.mjs <before-dist>
 * Every HTML page other than the two Partner Portal routes must be byte-identical;
 * new or changed assets are listed. Writes logs/build-scope.json.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const [before] = process.argv.slice(2);
const after = 'dist';
const walk = dir => readdirSync(dir, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const list = root => new Set(walk(root).map(f => relative(root, f).split(sep).join('/')));
const hash = f => createHash('sha256').update(readFileSync(f)).digest('hex');

const b = list(before);
const a = list(after);
const portal = f => f.includes('work/partner-portal/');
const html = { same: [], changed: [], added: [] };
const assets = { added: [], changed: [] };
for (const f of a) {
  const bucket = f.endsWith('.html') ? html : assets;
  if (!b.has(f)) bucket.added.push(f);
  else if (hash(join(after, f)) !== hash(join(before, f))) bucket.changed.push(f);
  else if (bucket === html) html.same.push(f);
}
const removed = [...b].filter(f => !a.has(f));
const unexpected = html.changed.filter(f => !portal(f)).concat(html.added);
const report = { before, after, htmlSame: html.same.length, htmlChanged: html.changed, unexpectedHtml: unexpected, assetsAdded: assets.added, assetsChanged: assets.changed, removed };
mkdirSync('audit/b2b-portfolio-case-premium-v3/logs', { recursive: true });
writeFileSync('audit/b2b-portfolio-case-premium-v3/logs/build-scope.json', `${JSON.stringify(report, null, 2)}\n`);
console.log({ htmlSame: html.same.length, htmlChanged: html.changed, unexpectedHtml: unexpected, assetsChanged: assets.changed, assetsAdded: assets.added.filter(f => !f.includes('partner-portal/v3/')), v3Media: assets.added.filter(f => f.includes('partner-portal/v3/')).length, removed });

/* Case pages share the [slug] route, and Astro inlines every route component's
   scoped CSS into each of them. For those pages, prove that (1) the markup with
   <style> removed is identical, and (2) the CSS differs only in rules scoped to
   the Portal renderer, which match no element outside .portal-case. */
const PORTAL_SCOPES = [...new Set([...readFileSync(join(after, 'work/partner-portal/index.html'), 'utf8')
  .matchAll(/<div class="portal-case[^"]*" [^>]*data-astro-cid-([a-z0-9]+)/g)].map(m => m[1]))];
const splitCss = html => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const strip = html => html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
const rules = css => new Set(css.split('}').map(r => r.trim()).filter(Boolean));
const portalRule = r => r.includes('portal-') || PORTAL_SCOPES.some(s => r.includes(s));
const shared = html.changed.filter(f => !portal(f)).map(f => {
  const A = readFileSync(join(after, f), 'utf8');
  const B = readFileSync(join(before, f), 'utf8');
  const ra = rules(splitCss(A));
  const rb = rules(splitCss(B));
  const onlyA = [...ra].filter(r => !rb.has(r));
  const onlyB = [...rb].filter(r => !ra.has(r));
  return { page: f, markupIdentical: strip(A) === strip(B), cssOnlyInAfterNonPortal: onlyA.filter(r => !portalRule(r)), cssOnlyInBeforeNonPortal: onlyB.filter(r => !portalRule(r)) };
});
report.sharedRouteCheck = { portalScopes: PORTAL_SCOPES, pages: shared };
writeFileSync('audit/b2b-portfolio-case-premium-v3/logs/build-scope.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.sharedRouteCheck.pages.map(p => ({ page: p.page, markupIdentical: p.markupIdentical, nonPortalCssDiff: p.cssOnlyInAfterNonPortal.length + p.cssOnlyInBeforeNonPortal.length }))));
