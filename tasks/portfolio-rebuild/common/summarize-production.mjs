import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');const r=JSON.parse(readFileSync('tasks/portfolio-rebuild/common/source-verification.json'));
const source='D:/Claude-projects/b2b-dssl/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';r.font={source,file:'public/media/rebuild/common/portal/inter-latin.woff2',sha256:hash(source),identical:hash(source)===hash('public/media/rebuild/common/portal/inter-latin.woff2')};
writeFileSync('tasks/portfolio-rebuild/common/source-verification.json',JSON.stringify(r,null,2));if(!r.font.identical)throw new Error('Source font mismatch');
const p=JSON.parse(readFileSync('tasks/portfolio-rebuild/common/production-probe.json'));console.log(JSON.stringify(p.results.map(v=>({slug:v.slug,width:v.width,cpu:v.cpu,lcp:v.startup.lcp.ms,cls:v.startup.cls,p95:v.frameP95,over34:v.framesOver34ms})),null,2));
