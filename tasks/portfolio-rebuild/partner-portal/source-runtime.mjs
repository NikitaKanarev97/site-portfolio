import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,relative,extname} from 'node:path';
export const source='D:/Claude-projects/b2b-dssl';
export const require=createRequire(source+'/package.json');
export async function browser(){return require('playwright').chromium.launch({executablePath:process.env.PORTAL_CHROME||'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});}
export async function serve(root,spa=false){
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
 const server=createServer((req,res)=>{
  let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(spa)p=p.replace(/^\/b2b\/?/,'/');
  let file=resolve(root,'.'+p);
  if(relative(root,file).startsWith('..')){res.writeHead(403);return res.end();}
  if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,'index.html');
  if(!existsSync(file)&&spa&&!extname(file))file=resolve(root,'index.html');
  if(!existsSync(file)){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(readFileSync(file));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 return {base:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(r=>server.close(r))};
}
