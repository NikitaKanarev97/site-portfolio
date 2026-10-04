/** Actual F after exact accepted two-file import. No blanket common exclusions. */
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out='tasks/portfolio-rebuild/agent-ops/retest-focus',origin='http://127.0.0.1:4384';
const previous='a6faac3a3d10eb6601fcc34caa70a915bea5dab3',common='6e8f0e075916dec82a90831c7c2c78a38ea60e20',payload='3d35b7c88b89f36c72eaff315dec4bfc5dc887a5',imported='c950cb20ec9557f6a656dd8ed825c18b40970c88';
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const accepted={'src/scripts/animations.js':'d1468a8e12ca45fbfc941aee94d0c77aa93efec5e889c4eac7929df4976179a4','ds/motion-concept.md':'5201fa92b0074443373e9bf2abd2cb5ae6895599fe6791e89f6453433a7aee71'};
const manifest=JSON.parse(readFileSync('tasks/portfolio-rebuild/integration/film-common-base-manifest.json')).files;
const commonCatalog=execFileSync('git',['cat-file','--batch-check=%(objectname) %(objecttype)'],{input:manifest.map(f=>common+':'+f.path).join('\n')+'\n',encoding:'utf8'}).trim().split('\n').map(l=>l.split(' ')[0]);
// Exact two-file import retains F's old metadata, as the accepted G transfer did.
// Every old manifest path remains checked; only the two accepted delta blobs change.
const expected=manifest.map((f,i)=>accepted[f.path]?commonCatalog[i]:f.gitBlob);
const acceptedTransferRef='7493e45a257866b9824b1290ab82e3d8b3bb448f';
const transferCatalog=execFileSync('git',['cat-file','--batch-check=%(objectname)'],{input:manifest.map(f=>acceptedTransferRef+':'+f.path).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const actual=execFileSync('git',['hash-object','--stdin-paths'],{input:manifest.map(f=>JSON.stringify(f.path)).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const failures=[],frozen=manifest.map((f,i)=>({file:f.path,previous:f.gitBlob,expected:expected[i],commonCatalog:commonCatalog[i],actual:actual[i],acceptedDelta:!!accepted[f.path],pass:actual[i]===expected[i]}));
for(const f of frozen)if(!f.pass||(!f.acceptedDelta&&f.expected!==f.previous))failures.push('Frozen: '+f.file);
const transferCatalogMatches=transferCatalog.every((blob,i)=>blob===expected[i]);if(!transferCatalogMatches)failures.push('Accepted G clean-transfer catalog mismatch');
const shared=Object.entries(accepted).map(([file,expected])=>({file,expected,actual:hash(readFileSync(file)),blob:git('rev-parse',common+':'+file)}));
for(const f of shared)if(f.actual!==f.expected)failures.push('Accepted SHA: '+f.file);
if(frozen.length!==630||frozen.filter(f=>f.acceptedDelta).length!==2)failures.push('630/two delta coverage');
const importPaths=git('diff','--name-only',payload,imported).split('\n').sort();if(importPaths.join(',')!==Object.keys(accepted).sort().join(','))failures.push('Import scope');
const catalogMetadataDifference=frozen.filter(f=>f.commonCatalog!==f.expected).map(f=>f.file);
const expectedMetadata=['PLAN-CHATS.md','tasks/portfolio-rebuild/integration/base.md','tasks/portfolio-rebuild/integration/film-common-report.md','tasks/portfolio-rebuild/integration/handoffs.json'];
if(catalogMetadataDifference.sort().join(',')!==expectedMetadata.sort().join(','))failures.push('Unexpected common catalog divergence');
const mirrors=[['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']].map(([source,mirror])=>({source,mirror,sourceHash:hash(readFileSync(source)),mirrorHash:hash(readFileSync(mirror))}));
for(const m of mirrors)if(m.sourceHash!==m.mirrorHash)failures.push('Mirror: '+m.source);
const payloadFiles=['src/copy/cases/agent-ops-console.ts','src/copy/ru/cases/agent-ops-console.ts','src/pages/preview/agent-ops-rebuild/[locale].astro'];
const caseIdentity=payloadFiles.map(file=>({file,original:hash(execFileSync('git',['show',payload+':'+file])),actual:hash(readFileSync(file))}));for(const f of caseIdentity)if(f.original!==f.actual)failures.push('Case copy/route changed: '+f.file);
const historyFiles=git('ls-tree','-r','--name-only',payload,'tasks/portfolio-rebuild/agent-ops/').split('\n').filter(f=>!['tasks/portfolio-rebuild/agent-ops/report.md','tasks/portfolio-rebuild/agent-ops/common-requests.md','tasks/portfolio-rebuild/agent-ops/media.md','tasks/portfolio-rebuild/agent-ops/evidence.md','tasks/portfolio-rebuild/agent-ops/files.txt'].includes(f));
const historyExpected=execFileSync('git',['cat-file','--batch-check=%(objectname)'],{input:historyFiles.map(f=>payload+':'+f).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const historyActual=execFileSync('git',['hash-object','--stdin-paths'],{input:historyFiles.map(f=>JSON.stringify(f)).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
const historyFailures=historyFiles.filter((file,i)=>historyExpected[i]!==historyActual[i]);failures.push(...historyFailures.map(f=>'History modified: '+f));
const sources=JSON.parse(readFileSync('tasks/portfolio-rebuild/agent-ops/sources.json'));
const product={ref:execFileSync('git',['rev-parse','HEAD'],{cwd:sources.product,encoding:'utf8'}).trim(),status:execFileSync('git',['status','--porcelain'],{cwd:sources.product,encoding:'utf8'}).trim(),files:sources.files.map(f=>({...f,actual:hash(readFileSync(sources.product+'/'+f.file))}))};
if(product.ref!==sources.ref||product.status||product.files.some(f=>f.actual!==f.sha256))failures.push('Product source');
const captures=JSON.parse(readFileSync('tasks/portfolio-rebuild/agent-ops/captures.json')).captures;
const en=JSON.parse(readFileSync('tasks/portfolio-rebuild/agent-ops/audit.json')).media.filter(m=>m.file.startsWith('public/media/pilot-agent-ops/'));
const media=[];
for(const f of [...captures,...en]){const file=f.file,original=f.sha256||f.original,disk=hash(readFileSync(file)),r=await fetch(origin+'/'+file.replace(/^public\//,'')),served=hash(Buffer.from(await r.arrayBuffer()));const row={file,status:r.status,original,disk,served,pass:r.ok&&disk===original&&served===disk};media.push(row);if(!row.pass)failures.push('Media: '+file);}
const routes=[];for(const lang of ['en','ru']){const route=`/preview/agent-ops-rebuild/${lang}/`,r=await fetch(origin+route),html=await r.text();const ids=[...html.matchAll(/id="([^"]+)"[^>]*data-block-type=/g)].map(m=>m[1]);const row={route,status:r.status,noindex:html.includes('noindex'),canonical:/rel="canonical"/.test(html),ids};routes.push(row);if(r.status!==200||!row.noindex||row.canonical||ids.join(',')!=='review-load,human-checkpoint,missing-evidence,accepted-prototype')failures.push('Preview: '+route);}
const sitemap=await(await fetch(origin+'/sitemap.xml')).text();if(sitemap.includes('/preview/agent-ops-rebuild'))failures.push('Preview in sitemap');
const changes=git('diff','--name-only',payload).split('\n').filter(Boolean);const scopeFailures=changes.filter(f=>!accepted[f]&&f!=='ds/screens/case-agent-ops.md'&&!f.startsWith('tasks/portfolio-rebuild/agent-ops/'));failures.push(...scopeFailures.map(f=>'Scope: '+f));
writeFileSync(out+'/audit.json',JSON.stringify({origin,previous,common,payload,imported,acceptedTransferRef,acceptedTransferCatalogMatches:transferCatalogMatches,checkout:process.cwd().replaceAll('\\','/'),branch:git('branch','--show-current'),frozen,shared,catalogMetadataDifference,metadataPolicy:'No G metadata import: these four files retain exact original F base blobs; fresh root handoffs were read separately. All 630 paths checked, no exclusions; all expected blobs also match the approved G clean-transfer catalog.',mirrors,caseIdentity,history:{files:historyFiles.length,failures:historyFailures},product,media,routes,sitemapPreviewExcluded:!sitemap.includes('/preview/agent-ops-rebuild'),changes,failures},null,2)+'\n');
console.log(JSON.stringify({frozen:frozen.length,shared:shared.length,mirrors:mirrors.length,history:historyFiles.length,media:media.length,source:product.files.length,failures:failures.length}));if(failures.length)throw new Error('Actual F retest audit failed');
