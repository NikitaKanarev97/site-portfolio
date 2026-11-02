import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:320,height:900}});
for(const l of ['','/ru']){await p.goto('http://127.0.0.1:5382'+l+'/work/vet-clinic');console.log(l,await p.evaluate(()=>[...document.querySelectorAll('.vet-case *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.right>innerWidth+.5||r.left<-.5)}).map(e=>({tag:e.tagName,c:e.className,text:e.innerText?.slice(0,90),r:e.getBoundingClientRect().toJSON()})).slice(0,15)));}
await b.close();
