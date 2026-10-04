/** Verify and build a fresh checkout of the frozen code; never modify product sources. */
import {readFileSync,writeFileSync,createWriteStream} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync,spawn} from 'node:child_process';
const manifestRoot=resolve('tasks/portfolio-rebuild/integration/final');
const out=resolve(process.argv.find(a=>a.startsWith('--out='))?.slice(6)||manifestRoot);
const root=resolve(process.argv.find(a=>a.startsWith('--root='))?.slice(7)||'tmp/portfolio-final-f01');
const manifest=JSON.parse(readFileSync(manifestRoot+'/code-manifest.json'));
const git=(args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:10e6}).trim();
const result={ref:manifest.ref,root,canonicalFiles:manifest.files.length,totalBytes:manifest.totalBytes,normalizedText:[],mismatches:[],commands:[]};
if(git(['rev-parse','HEAD'])!==manifest.ref||git(['status','--porcelain']))throw Error('Checkout is not clean at frozen ref');
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const f of manifest.files){const bytes=readFileSync(resolve(root,f.path));if(hash(bytes)===f.sha256)continue;const text=/\.(md|ts|astro|js|mjs|cjs|json|css|txt|yml|yaml)$/.test(f.path);if(text&&hash(Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n')))===f.sha256)result.normalizedText.push(f.path);else result.mismatches.push(f.path);}
if(result.mismatches.length)throw Error('Canonical mismatch '+result.mismatches);
console.log(JSON.stringify({canonicalFiles:result.canonicalFiles,mismatches:0,normalizedText:result.normalizedText.length}));
for(const [name,command] of [['install','npm ci'],['check','npm run check'],['build','npm run build'],['css','npm run check:css -- /ru/about /work/learn /ru/work/agent-ops-console /ru/work/partner-portal /ru/work/learn /ru/work/vet-clinic /ru/work/pawly']]){
 const log=out+'/clean-'+name+(name==='check'?'-full':'')+'.log';const stream=createWriteStream(log);const start=Date.now();
 const code=await new Promise((ok,fail)=>{const child=spawn('powershell.exe',['-NoProfile','-Command',command],{cwd:root,windowsHide:true});child.stdout.pipe(stream,{end:false});child.stderr.pipe(stream,{end:false});child.on('error',fail);child.on('close',ok)});
 await new Promise(ok=>stream.end(ok));const text=readFileSync(log,'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 if(name==='check'){const i=text.lastIndexOf('Result (');writeFileSync(out+'/clean-check-summary.log',text.slice(i));result.checkSummary=text.slice(i).trim();}
 result.commands.push({name,command,exitCode:code,seconds:+((Date.now()-start)/1000).toFixed(2)});console.log(JSON.stringify(result.commands.at(-1)));
 if(code!==0){writeFileSync(out+'/reproduction.json',JSON.stringify(result,null,2));throw Error(command+' failed; see '+log)}
}
result.status=git(['status','--porcelain']);if(result.status)throw Error('Reproduction dirtied checkout '+result.status);
result.mirrors=[['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']].map(([a,b])=>({source:a,mirror:b,equal:readFileSync(resolve(root,a)).equals(readFileSync(resolve(root,b)))}));if(result.mirrors.some(x=>!x.equal))throw Error('Mirror mismatch');
writeFileSync(out+'/reproduction.json',JSON.stringify(result,null,2));console.log('Fresh frozen checkout reproduced successfully.');
