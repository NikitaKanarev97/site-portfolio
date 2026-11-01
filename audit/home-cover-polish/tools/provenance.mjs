import { execFileSync } from 'node:child_process';
import { readFile,readdir,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root='audit/home-cover-polish';
const base='43eb0b29372c50af616c71deed3139017adaf705';
async function files(directory){const result=[];for(const e of await readdir(directory,{withFileTypes:true})){const p=`${directory}/${e.name}`;result.push(...(e.isDirectory()?await files(p):[p]));}return result;}
const paths=execFileSync('git',['diff','--name-only',base,'--','src','ds'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
paths.push(...await files('public/media/home-cover-polish'),...await files(`${root}/tools`));
const hashes={};for(const p of paths)hashes[p]=createHash('sha256').update(await readFile(p)).digest('hex');
const evidenceHashes={};for(const p of [...await files(`${root}/screenshots`),...await files(`${root}/sources`)])evidenceHashes[p]=createHash('sha256').update(await readFile(p)).digest('hex');
await writeFile(`${root}/logs/provenance.json`,JSON.stringify({base,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),worktree:process.cwd(),state:'Delivery artifact; containing Git commit identifies the exact version. Independent visual acceptance pending.',browser:JSON.parse(await readFile(`${root}/logs/after.json`,'utf8')).browser,sourceHashes:hashes,evidenceHashes},null,2)+'\n');
await writeFile(`${root}/logs/source-diff.patch`,execFileSync('git',['diff',base,'--','src','ds'],{encoding:'utf8'}));
console.log(`Provenance: ${paths.length} source/recipe hashes; ${Object.keys(evidenceHashes).length} original evidence hashes.`);
