/** CONTENT-RULES.md regression guard.
 * node scripts/check-public-content.mjs [--dist path] [--source-only]
 * Checks copy literals, CV data, public HTML/SVG/JSON/JS and every built HTML.
 * Raster text and PDF layout require the separate media review recorded in 07-result.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const distIndex = args.indexOf('--dist');
if (distIndex !== -1 && !args[distIndex + 1]) throw new Error('--dist requires a directory');
const dist = path.resolve(root, distIndex === -1 ? 'dist' : args[distIndex + 1]);
const sourceOnly = args.includes('--source-only');
const forbidden = [
  /\bdemonstration\s+example\b/giu,
  /демонстрационн[\p{L}]*\s+пример[\p{L}]*/giu,
  /(?:commercial\s+redesign\s*·\s*reconstruction\s+shown|коммерческий\s+редизайн\s*·\s*показана\s+реконструкция)/giu,
  /(?:work\s+project\s*·\s*current\s+reinterpretation|рабочий\s+проект\s*·\s*нынешнее\s+переосмысление)/giu,
  /(?:work\s+project\s*·\s*reinterpreted(?:\s+in\s+\d{4})?|рабочий\s+проект\s*·\s*переосмысление(?:\s+\d{4})?)/giu,
  /\bindependent\s+reconstruction\b/giu,
  /(?:working\s+prototype\s*·\s*\d{4}|рабочий\s+прототип\s*·\s*\d{4})/giu,
  /\bdemonstration\s+(?:handover\s+photo|photograph)\b/giu,
  /демонстрационн[\p{L}]*\s+(?:фото\s+передачи|фотографи[\p{L}]*)/giu,
  /\bconcept(?:s|ual(?:\s+projects?)?)?\b/giu,
  /концепт[\p{L}-]*/giu,
  /\b(?:pet|student|training|practice)[ -]projects?\b/giu,
  /(?:учебн[\p{L}]*|пет)[ -]проект[\p{L}]*/giu,
  /\b(?:only|just|merely)\s+(?:a\s+)?prototype\b/giu,
  /(?:лишь|только)\s+прототип[\p{L}]*/giu,
  /\bnot\s+(?:a\s+)?(?:real\s+project|live\s+service)\b/giu,
  /не\s+(?:настоящ[\p{L}]*\s+проект[\p{L}]*|действующ[\p{L}]*\s+сервис[\p{L}]*)/giu,
  /(?:portfolio[ -](?:version|prototype)|портфолио[ -]верси[\p{L}]*)/giu,
  /^\s*(?:a\s+)?(?:trust\s+)?hypothesis\s+(?:to\s+test|that\s+still\s+needs\s+testing)\s*$/giu,
  /(?:проверяемая\s+гипотеза\s+доверия|гипотеза,?\s+которую\s+ещ[её]\s+нужно\s+проверить)/giu,
];
const operationalKeys = new Set(['id', 'evidenceId', 'mediaId', 'slug', 'href', 'src', 'srcNarrow', 'video', 'ref']);
const findings = [];
const counts = { copy: 0, cv: 0, public: 0, builtHtml: 0 };

function decode(text) {
  return text.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
    .replace(/&(nbsp|amp|quot|apos|lt|gt);/g, (_, entity) => ({nbsp:' ',amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'})[entity]);
}
function inspect(file, text, offset = 0, source = text) {
  // The exact technical filename is allowed by CONTENT-RULES.md, including
  // the visible /kit documentation. Do not exclude the page or other labels.
  const normalized = decode(text).replace(/\b(?:ds\/)?motion-concept\.md\b/g, '[motion specification]').replace(/\s+/g, ' ');
  for (const rule of forbidden) {
    rule.lastIndex = 0;
    for (const match of normalized.matchAll(rule)) {
      findings.push({file:path.relative(root,file).replaceAll('\\','/'),line:source.slice(0,offset).split('\n').length,
        match:match[0],text:normalized.slice(Math.max(0,match.index-55),match.index+match[0].length+90)});
    }
  }
}
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(file));
    else result.push(file);
  }
  return result;
}
function scriptLiterals(file, source) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const parent = node.parent;
      const key = ts.isPropertyAssignment(parent) ? parent.name.getText(ast).replace(/^['"]|['"]$/g,'') : '';
      // A property name, identifier or asset path is not project presentation.
      // Its values still reach the built HTML scan if rendered to the visitor.
      if (!(ts.isPropertyAssignment(parent) && parent.name === node) && !operationalKeys.has(key)) inspect(file,node.text,node.getStart(ast),source);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
function html(file, source) {
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, '');
  for (const match of withoutComments.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/application\/ld\+json/i.test(match[1])) inspect(file,match[2],match.index,source);
  }
  const document = withoutComments.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  for (const match of document.matchAll(/\b(alt|aria-label|aria-description|title|content|placeholder|value)\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    inspect(file,match[3] ?? match[4],match.index,source);
  }
  // Inspect all text, including hidden dialogs and inline SVG <title>/<desc>.
  inspect(file,document.replace(/<[^>]*>/g, ' '));
}
for (const file of await files(path.join(root,'src/copy'))) {
  if (!file.endsWith('.ts')) continue;
  counts.copy++; scriptLiterals(file,await readFile(file,'utf8'));
}
for (const name of ['resume-data.json','resume-data-ru.json']) {
  const file = path.join(root,'cv',name); counts.cv++;
  inspect(file,await readFile(file,'utf8'));
}
// These builders emit public editorial text; unrelated tool scripts are internal.
for (const name of ['build-linkedin-assets.mjs']) {
  const file = path.join(root,'scripts',name); counts.copy++;
  scriptLiterals(file,await readFile(file,'utf8'));
}
for (const file of await files(path.join(root,'public'))) {
  if (!/\.(html|svg|json|js)$/i.test(file)) continue;
  counts.public++;
  const source = await readFile(file,'utf8');
  if (/\.(html|svg)$/i.test(file)) html(file,source);
  else if (file.endsWith('.js')) scriptLiterals(file,source);
  else inspect(file,source);
}
if (!sourceOnly) {
  if (!(await stat(dist).catch(()=>null))?.isDirectory()) throw new Error(`Missing build: ${dist}. Run npm run build first, or use --source-only for an explicitly partial check.`);
  for (const file of await files(dist)) {
    if (!file.endsWith('.html')) continue;
    counts.builtHtml++; html(file,await readFile(file,'utf8'));
  }
  if (!counts.builtHtml) throw new Error('Build contains no HTML; refusing an empty PASS.');
}
const unique = [...new Map(findings.map(f=>[JSON.stringify(f),f])).values()];
for (const item of unique) console.error(`${item.file}:${item.line}: ${item.match}\n  ${item.text}`);
console.log(JSON.stringify({result:unique.length?'FAIL':'PASS',counts,findings:unique.length,build:sourceOnly?'not checked':path.relative(root,dist)},null,2));
process.exitCode = unique.length ? 1 : 0;
