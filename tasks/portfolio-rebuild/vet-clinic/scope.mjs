import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex'),failures=[];
const manifest=JSON.parse(await readFile('tasks/portfolio-rebuild/integration/wave-1-base-manifest.json','utf8'));
const owned=new Set(['ds/screens/case-vet.md','src/copy/cases/vet-clinic.ts','src/copy/ru/cases/vet-clinic.ts']);
let unchanged=0;
for(const f of manifest.files){if(owned.has(f.path))continue;const b=await readFile(f.path);if(hash(b)!==f.sha256||b.length!==f.bytes)failures.push({file:f.path,reason:'Frozen base changed'});else unchanged++;}
const mirrors=[];for(const [a,b] of [['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']]){const equal=(await readFile(a)).equals(await readFile(b));mirrors.push({source:a,mirror:b,equal});if(!equal)failures.push({file:a,reason:'Mirror mismatch'});}
const source=JSON.parse(await readFile('tasks/portfolio-rebuild/vet-clinic/source-verification.json','utf8'));
for(const f of [...source.sourceFiles,...source.observedExistingBuild]){if(hash(await readFile(source.sourceRoot+'/'+f.file))!==f.sha256)failures.push({file:f.file,reason:'Read-only source changed since capture'});}
const sourceHead=execFileSync('git',['-C',source.sourceRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceStatus=execFileSync('git',['-C',source.sourceRoot,'status','--porcelain'],{encoding:'utf8'});
if(sourceHead!==source.sourceHead||sourceStatus)failures.push({reason:'Source Git state changed',sourceHead,sourceStatus});
const media=JSON.parse(await readFile('tasks/portfolio-rebuild/vet-clinic/captures.json','utf8'));
for(const f of media)if(hash(await readFile(f.file))!==f.sha256)failures.push({file:f.file,reason:'Media manifest hash mismatch'});
const result={base:'58002c398c3386c9df4b398f324ab07115c979f7',unchangedFrozenFiles:unchanged,ownedBaseExceptions:[...owned],mirrors,sourceHead,sourceStatus,mediaFiles:media.length,failures};
await writeFile('tasks/portfolio-rebuild/vet-clinic/scope.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
