import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='58002c398c3386c9df4b398f324ab07115c979f7';
const dir='tasks/portfolio-rebuild/pawly';
const manifest=`${dir}/manifest.json`,list=`${dir}/files.txt`;
await writeFile(manifest,'{}\n');
const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const paths=[...new Set([...git(['diff','--name-only',base]),...git(['ls-files','--others','--exclude-standard']),manifest,list])].sort();
await writeFile(list,paths.join('\n')+'\n');
execFileSync(process.execPath,[`${dir}/integrity.mjs`],{stdio:'pipe'});
const files=[];
for(const path of paths.filter(p=>p!==manifest)){const b=await readFile(path);files.push({path,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')});}
await writeFile(manifest,JSON.stringify({base,branch:'codex/pawly-rebuild-e',excludesSelf:true,files},null,2)+'\n');
console.log(`${paths.length} exact paths; ${files.length} SHA256 payload records (manifest excludes itself).`);
