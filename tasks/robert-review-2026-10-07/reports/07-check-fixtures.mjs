import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const fixture='tasks/robert-review-2026-10-07/reports/07-guard-fixture';
await mkdir(fixture,{recursive:true});
const samples=[
  {name:'rendered labels and entity-encoded metadata',expected:1,html:'<title>Author work</title><meta name="description" content="Con&#99;ept"><img alt="Независимый концепт"><aside hidden>Just a prototype</aside>'},
  {name:'compliant method, technical filename and internal comment',expected:0,html:'<!-- ds/motion-concept.md --><script>const key="concept";</script><p>Specification: ds/motion-concept.md. Research used a simulated interview. This remains a hypothesis to test with owners.</p>'},
];
const records=[];
for(const sample of samples){
  await writeFile(path.join(fixture,'index.html'),sample.html);
  const result=spawnSync(process.execPath,['scripts/check-public-content.mjs','--dist',fixture],{encoding:'utf8'});
  records.push({name:sample.name,expected:sample.expected,exitCode:result.status,stdout:result.stdout,stderr:result.stderr});
  if(result.status!==sample.expected)throw new Error(JSON.stringify(records.at(-1)));
}
await writeFile('tasks/robert-review-2026-10-07/reports/07-guard-tests.json',JSON.stringify(records,null,2));
console.log('PASS: failing content reports file/text; compliant methodology and internal comments pass.');
