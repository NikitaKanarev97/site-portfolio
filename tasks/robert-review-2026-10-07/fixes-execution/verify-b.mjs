import { registerHooks } from 'node:module';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';

const folder = dirname(fileURLToPath(import.meta.url));
const root = resolve(folder, '../../..');
const loaded = new Set();
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.')) {
      const url = new URL(specifier, context.parentURL);
      for (const suffix of ['', '.ts', '.js', '/index.ts']) {
        const candidate = new URL(url.href + suffix);
        if (existsSync(fileURLToPath(candidate))) return {url:candidate.href, shortCircuit:true};
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts')) {
      loaded.add(fileURLToPath(url));
      const result = ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
        compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},
        reportDiagnostics:true, fileName:fileURLToPath(url),
      });
      const errors = result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error) ?? [];
      if (errors.length) throw new Error(errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));
      return {format:'module',source:result.outputText,shortCircuit:true};
    }
    return nextLoad(url,context);
  },
});
const get = rel => import(pathToFileURL(resolve(root,rel)).href);
const [{cases}, {casesRu}, {about}, {aboutRu}, {learnVetStageCopy}, {assertStoryPair}] = await Promise.all([
  get('src/copy/cases/index.ts'), get('src/copy/ru/cases/index.ts'),
  get('src/copy/about.ts'), get('src/copy/ru/about.ts'), get('src/copy/learn-vet-stage.ts'), get('src/copy/cases/story.ts'),
]);
const results=[];
function check(condition, message) { if (!condition) throw new Error(message); }
function scan(value, path, visit) {
  // Diagram payloads are owned by the coordinator; this pass verifies edited copy.
  if (path.endsWith('.artifact.data')) return;
  if (/\.(?:id|evidenceId|mediaId|motion|group|fontFamily|ref|kind)$/.test(path)) return;
  if (typeof value === 'string') visit(value,path);
  else if (Array.isArray(value)) value.forEach((v,i)=>scan(v,`${path}.${i}`,visit));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key,v])=>scan(v,`${path}.${key}`,visit));
}
for (let i=0;i<cases.length;i++) {
  const en=cases[i].story, ru=casesRu[i].story;
  assertStoryPair(en,ru);
  for (const [lang,story] of [['en',en],['ru',ru]]) {
    const outcome=story.blocks.find(b=>b.type==='outcome').payload;
    check(!outcome.nextEvidence, `${story.cover.title} has nextEvidence`);
    check(outcome.result.label===(lang==='en'?'Result':'Результат'), 'Result label mismatch');
    check(outcome.tradeoff.label===(lang==='en'?'Trade-off':'Компромисс'), 'Trade-off label mismatch');
    check(story.prototype.label===(lang==='en'?'Open product':'Открыть продукт'), 'Product link mismatch');
    scan(story,lang,(value,path)=>{
      check(!/concept(?:ual)?|концепт|pet project|учебный проект|Work project ·|Рабочий проект ·/i.test(value), `Forbidden public copy ${path}: ${value}`);
      check(!/[←→↗↓]/.test(value),`Text arrow ${path}`);
      if (/\.alt(?:Narrow)?$/.test(path)) check(!/\b(?:actual|real|accepted|safe crop|demo|fixture)\b|настоящ|принятый|безопасный фрагмент|демо|фикстур/i.test(value),`Provenance in alt ${path}: ${value}`);
      if (/\.(?:src|srcNarrow|zoomSrc)$/.test(path) && value.startsWith('/')) check(existsSync(resolve(root,'public',value.slice(1))),`Missing media ${value}`);
    });
    const specimens=story.blocks.filter(b=>b.type==='specimen').map(b=>({id:b.id,families:b.payload.specimen.sets.length,states:b.payload.specimen.sets.reduce((n,s)=>n+s.states.length,0)}));
    results.push({title:story.cover.title,lang,blocks:story.blocks.length,specimens});
  }
}
check(!about.evidence.body.join(' ').includes('most of these builds are prototypes'), 'About disclaimer remains');
check(!aboutRu.evidence.body.join(' ').includes('большинство таких сборок'), 'RU About disclaimer remains');
check(aboutRu.chapterLabels.length===3, 'RU About chapter decision changed');
check(learnVetStageCopy('en').learn.detail==='', 'Learn scene repeat remains');
writeFileSync(resolve(folder,'B-local-validation.json'),JSON.stringify({date:'2026-10-07',scope:'Local data import, syntax, pair/labels/public story copy/media assertions only; no build or visual QA',loadedModules:loaded.size,results},null,2));
console.log(`PASS: 10 localized stories; ${loaded.size} modules imported; paired structure, result/link labels, public copy and referenced image existence verified.`);
