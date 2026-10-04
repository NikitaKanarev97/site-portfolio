/** Read-only accepted static files; no build/watch/write in the product. */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const mode = process.argv[2] || 'catalogue';
const port = Number(process.argv[3] || 4371);
const root = resolve('D:/Claude-projects/PETS-walking', mode === 'catalogue' ? '.tmp/pawly-walker-storybook' : 'dist');
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.woff':'font/woff','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async (req,res) => {
  try {
    let file = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    try { if ((await stat(file)).isDirectory()) file = resolve(file,'index.html'); } catch { if (mode !== 'catalogue' && !extname(file)) file = resolve(root,'index.html'); }
    res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`${mode}: http://127.0.0.1:${port} read-only ${root}`));
