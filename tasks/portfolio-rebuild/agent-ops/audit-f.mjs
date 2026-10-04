/** Scope, source immutability and exact bytes served by actual F preview. */
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out='tasks/portfolio-rebuild/agent-ops',base='a6faac3a3d10eb6601fcc34caa70a915bea5dab3';
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const manifest=JSON.parse(readFileSync('tasks/portfolio-rebuild/integration/film-common-base-manifest.json')).files;
const ownedExisting=['ds/screens/case-agent-ops.md','src/copy/cases/agent-ops-console.ts','src/copy/ru/cases/agent-ops-console.ts'];
const frozen=manifest.filter(f=>!ownedExisting.includes(f.path));
const blobs=execFileSync('git',['hash-object','--stdin-paths'],{input:frozen.map(f=>JSON.stringify(f.path)).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const frozenFailures=frozen.filter((f,i)=>f.gitBlob!==blobs[i]).map(f=>f.path);
const sources=JSON.parse(readFileSync(out+'/sources.json'));
const sourceFailures=sources.files.filter(f=>hash(readFileSync(sources.product+'/'+f.file))!==f.sha256).map(f=>f.file);
const productStatus=execFileSync('git',['status','--porcelain'],{cwd:sources.product,encoding:'utf8'}).trim();
const productRef=execFileSync('git',['rev-parse','HEAD'],{cwd:sources.product,encoding:'utf8'}).trim();
const captures=JSON.parse(readFileSync(out+'/captures.json')).captures,media=[];
for(const f of captures){
 const disk=hash(readFileSync(f.file)),response=await fetch('http://127.0.0.1:4384/'+f.file.replace(/^public\//,''));
 const served=hash(Buffer.from(await response.arrayBuffer()));media.push({file:f.file,status:response.status,disk,served,capture:f.sha256,pass:response.ok&&disk===served&&disk===f.sha256});
}
const enPaths=[...new Set([...readFileSync('src/copy/cases/agent-ops-console.ts','utf8').matchAll(/\$\{pilot\}\/([^'`]+)/g)].map(m=>'public/media/pilot-agent-ops/'+m[1]))];
for(const file of enPaths){
 const disk=hash(readFileSync(file)),original=hash(execFileSync('git',['show',base+':'+file]));
 const response=await fetch('http://127.0.0.1:4384/'+file.replace(/^public\//,'')),served=hash(Buffer.from(await response.arrayBuffer()));media.push({file,status:response.status,disk,original,served,pass:response.ok&&disk===original&&disk===served});
}
const routes=[];
for(const lang of ['en','ru']){
 const route=`/preview/agent-ops-rebuild/${lang}/`,r=await fetch('http://127.0.0.1:4384'+route),html=await r.text();
 const blocks=[...html.matchAll(/id="([^"]+)"[^>]*data-block-type="([^"]+)"[^>]*data-evidence-id="([^"]+)"/g)].map(m=>({id:m[1],type:m[2],evidenceId:m[3]}));
 routes.push({route,status:r.status,bytes:Buffer.byteLength(html),noindex:html.includes('noindex'),canonical:/rel="canonical"/.test(html),blocks});
}
const sitemap=await(await fetch('http://127.0.0.1:4384/sitemap.xml')).text();
const changed=git('diff','--name-only',base).split('\n').filter(Boolean),scopeFailures=changed.filter(f=>!ownedExisting.includes(f)&&!f.startsWith('tasks/portfolio-rebuild/agent-ops/')&&!f.startsWith('public/media/rebuild/agent-ops/')&&!f.startsWith('src/pages/preview/agent-ops-rebuild/'));
const failures=[...frozenFailures,...sourceFailures,...scopeFailures,...media.filter(m=>!m.pass).map(m=>m.file)];
if(productRef!==sources.ref||productStatus||sitemap.includes('/preview/agent-ops-rebuild')||routes.some(r=>r.status!==200||!r.noindex||r.canonical||r.blocks.map(b=>b.id).join(',')!=='review-load,human-checkpoint,missing-evidence,accepted-prototype'))failures.push('Product/version/preview isolation/ordered blocks failure');
const result={base,checkout:process.cwd().replaceAll('\\','/'),branch:git('branch','--show-current'),frozen:{files:frozen.length,canonicalGitBlobs:true,failures:frozenFailures},product:{ref:productRef,status:productStatus,files:sources.files.length,failures:sourceFailures},changed,scopeFailures,media,routes,sitemapPreviewExcluded:!sitemap.includes('/preview/agent-ops-rebuild'),failures};
writeFileSync(out+'/audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({frozenFiles:frozen.length,sourceFiles:sources.files.length,media:media.length,failures:failures.length}));
if(failures.length)throw new Error('F audit failed');
