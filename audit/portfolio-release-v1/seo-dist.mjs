// Static SEO and internal-link validation of the built dist/ (release preflight).
// Usage: node audit/portfolio-release-v1/seo-dist.mjs [distDir]
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const ORIGIN = 'https://kanarev.com';
const PUBLIC = ['/', '/ru/', '/about/', '/ru/about/',
  ...['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'].flatMap(s => [`/work/${s}/`, `/ru/work/${s}/`])];

const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const htmlFiles = walk(dist).filter(f => f.endsWith('.html'));
const routeOf = f => '/' + relative(dist, f).split('\\').join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const attr = (html, re) => (html.match(re) ?? [])[1];
const meta = (html, key) => attr(html, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*content="([^"]*)"`)) ?? attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]*(?:name|property)="${key}"`));
const resolves = path => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '' ) return true;
  const f = join(dist, clean);
  return existsSync(f) && statSync(f).isFile() || existsSync(join(f, 'index.html')) || existsSync(f + '.html');
};

const pages = [], problems = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);
  const p = {
    route,
    lang: attr(html, /<html[^>]*\blang="([^"]*)"/),
    title: attr(html, /<title>([^<]*)<\/title>/),
    description: meta(html, 'description'),
    robots: meta(html, 'robots') ?? null,
    canonical: attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/),
    hreflang: [...html.matchAll(/<link[^>]+hreflang="([^"]*)"[^>]+href="([^"]*)"/g)].map(m => [m[1], m[2]]),
    og: { title: meta(html, 'og:title'), description: meta(html, 'og:description'), image: meta(html, 'og:image'), url: meta(html, 'og:url'), locale: meta(html, 'og:locale'), type: meta(html, 'og:type') },
    twitter: { card: meta(html, 'twitter:card'), image: meta(html, 'twitter:image') },
  };
  pages.push(p);
  const isPublic = PUBLIC.includes(route);
  const noindex = /noindex/.test(p.robots ?? '');
  if (isPublic) {
    const want = ORIGIN + route;
    if (noindex) problems.push([route, 'public route is noindex']);
    if (p.canonical !== want) problems.push([route, `canonical ${p.canonical} != ${want}`]);
    if (p.lang !== (route.startsWith('/ru/') ? 'ru' : 'en')) problems.push([route, `lang ${p.lang}`]);
    const hl = Object.fromEntries(p.hreflang);
    const enR = route.replace(/^\/ru\//, '/'), ruR = route.startsWith('/ru/') ? route : '/ru' + route;
    if (hl.en !== ORIGIN + enR || hl.ru !== ORIGIN + ruR || hl['x-default'] !== ORIGIN + enR) problems.push([route, `hreflang ${JSON.stringify(hl)}`]);
    for (const k of ['title', 'description']) if (!p[k]) problems.push([route, `missing ${k}`]);
    for (const [k, v] of Object.entries(p.og)) if (!v) problems.push([route, `missing og:${k}`]);
    if (!p.twitter.card) problems.push([route, 'missing twitter:card']);
    if (p.og.url && p.og.url !== want) problems.push([route, `og:url ${p.og.url}`]);
    if (p.og.image) {
      if (!p.og.image.startsWith(ORIGIN + '/')) problems.push([route, `og:image not absolute canonical ${p.og.image}`]);
      else if (!resolves(p.og.image.slice(ORIGIN.length))) problems.push([route, `og:image file missing ${p.og.image}`]);
    }
    if (/\b(concept|концепт)/i.test([p.title, p.description, p.og.title, p.og.description].join(' '))) problems.push([route, 'status label in metadata']);
  } else if (!noindex && !/^\/(404|500|ru\/404\/)/.test(route.replace(/^\//, '/'))) {
    problems.push([route, 'non-public route is indexable (no robots noindex)']);
  }
  // internal links and assets
  for (const m of html.matchAll(/\b(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
    const u = m[1];
    if (u.startsWith('//')) continue;
    if (!resolves(u)) problems.push([route, `broken internal ${u}`]);
  }
  for (const m of html.matchAll(/\bsrcset="([^"]*)"/g)) for (const part of m[1].split(',')) {
    const u = part.trim().split(/\s+/)[0];
    if (u.startsWith('/') && !u.startsWith('//') && !resolves(u)) problems.push([route, `broken srcset ${u}`]);
  }
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const smUrls = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1]);
const smMissing = PUBLIC.map(r => ORIGIN + r).filter(u => !smUrls.includes(u));
const smExtra = smUrls.filter(u => !PUBLIC.map(r => ORIGIN + r).includes(u));
if (smMissing.length) problems.push(['sitemap.xml', `missing ${smMissing.join(' ')}`]);
if (smExtra.length) problems.push(['sitemap.xml', `non-public entries ${smExtra.join(' ')}`]);
if (!/Sitemap:\s*https:\/\/kanarev\.com\/sitemap\.xml/.test(robots)) problems.push(['robots.txt', 'no canonical Sitemap line']);

const dedup = [...new Map(problems.map(p => [p.join('|'), p])).values()];
const out = { dist, htmlFiles: htmlFiles.length, publicRoutes: PUBLIC.length, robots, sitemapUrls: smUrls, problems: dedup, pages: pages.filter(p => PUBLIC.includes(p.route)), nonPublic: pages.filter(p => !PUBLIC.includes(p.route)).map(p => ({ route: p.route, robots: p.robots, canonical: p.canonical })) };
writeFileSync(process.argv[3] ?? 'audit/portfolio-release-v1/logs/seo-dist.json', JSON.stringify(out, null, 2));
console.log(`html=${htmlFiles.length} public=${PUBLIC.length} sitemap=${smUrls.length} problems=${dedup.length}`);
for (const [r, m] of dedup.slice(0, 60)) console.log(`  ${r}: ${m}`);
process.exitCode = dedup.length ? 1 : 0;
