import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const sha=b=>createHash('sha256').update(b).digest('hex');const task='tasks/portfolio-rebuild/learn/';
const sources=JSON.parse(await readFile(task+'source-verification.json','utf8'));const sourceMatches=[];
for(const item of sources.sourceFiles){const current=sha(await readFile('D:/Claude-projects/learn/'+item.file));sourceMatches.push({file:item.file,unchanged:current===item.sha256});}
const mirrors=[];for(const [a,b] of [['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']]){const left=await readFile(a),right=await readFile(b);mirrors.push({a,b,equal:left.equals(right),sha256:sha(left)});}
const changed=execFileSync('git',['diff','--name-only','936724beff3bb9a01c69381659dc808782cc7950'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=p=>['src/copy/cases/learn.ts','src/copy/ru/cases/learn.ts','ds/screens/case-learn.md'].includes(p)||['src/data/diagrams/learn/','public/media/rebuild/learn/','src/pages/preview/learn-rebuild/','tasks/portfolio-rebuild/learn/'].some(prefix=>p.startsWith(prefix));
const report={base:'936724beff3bb9a01c69381659dc808782cc7950',branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),changed,ownership:changed.every(allowed),sourceMatches,mirrors};
await writeFile(task+'integrity.json',JSON.stringify(report,null,2));if(!report.ownership||sourceMatches.some(v=>!v.unchanged)||mirrors.some(v=>!v.equal))throw Error('Integrity check failed');console.log({ownership:report.ownership,sourceFiles:sourceMatches.length,mirrors:mirrors.every(v=>v.equal)});
