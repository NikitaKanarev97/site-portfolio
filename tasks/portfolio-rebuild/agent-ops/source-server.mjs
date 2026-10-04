/** Read-only existing production bundle; no product build, install or writes. */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const root = resolve('D:/Claude-projects/Agent-ops-console/dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  if(!existsSync(file)||statSync(file).isDirectory())file=resolve(root,'index.html');
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(readFileSync(file));
}).listen(5391,'127.0.0.1',()=>console.log('Read-only Agent Ops production bundle on 5391'));
