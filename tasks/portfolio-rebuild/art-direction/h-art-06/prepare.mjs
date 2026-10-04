import {readFile, writeFile, mkdir} from 'node:fs/promises';
const base='tasks/portfolio-rebuild/art-direction', dir=base+'/h-art-06';
await mkdir(dir+'/before',{recursive:true});
for(const name of ['capture.mjs','record.mjs','sheets.mjs']) {
  let code=await readFile(base+'/h-art-05/'+name,'utf8');
  code=code.replaceAll('h-art-05','h-art-06').replaceAll('4398','4399').replaceAll('Current H5 technical-corrected H4 art','Current H6 comparative families and atomic media');
  code=code.replaceAll("'297ddd3e1a8ccdea56a8a33e4d25865f03771e07'", "process.env.H6_SOURCE_REF || 'working-tree'");
  if(name==='record.mjs')code=code.replace('.work-stage,.case-plate,.case-steps,.case-artifact,.case-next','.work-stage,.case-plate,.case-steps,.case-artifact,.case-next,[data-specimen-set],[data-specimen-part="foundation"]')
    .replace("e.id||e.className", "e.id||e.dataset.specimenSet||e.dataset.specimenPart||e.className");
  await writeFile(dir+'/'+name,code.trimEnd()+'\n');
}
const handoff=JSON.parse(await readFile(base+'/handoff.json','utf8'));
Object.assign(handoff,{iteration:'H-art-06',status:'in_progress',sourceRef:'working-tree on 297ddd3',codeRef:'working-tree on 297ddd3',selfAssessment:'Главный вопрос ещё проверяется; H5 независимый changes_requested, работа продолжается.',independentAcceptance:'H5 changes_requested; H6 pending',buildDirectory:'dist-h6',previews:{en:'http://127.0.0.1:4399/',ru:'http://127.0.0.1:4399/ru/',review:'http://127.0.0.1:4396/art-review-h6.html'},requiredControllerAction:'H6 is in progress. Preserve ACTIVE; review only after current ready_for_visual_review handoff.'});
await writeFile(base+'/handoff.json',JSON.stringify(handoff,null,2)+'\n');
await writeFile(base+'/handoff.md','# H6 · работа продолжается\n\nНезависимый H5 вернул H-ART-04/05. Текущий проход исправляет сравнительные системные листы и целое появление материала. Статус in_progress; основной вопрос ещё проверяется. H5 handoff сохранён в h-art-06/h5-handoff.md. Контроллер сохраняет ACTIVE до новой художественной проверки.\n');
