// Local production preview for package 02. ?nojs blocks scripts with CSP
// without changing generated HTML, CSS or portfolio source files.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:4402');
    let file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    if (url.searchParams.has('nojs')) res.setHeader('Content-Security-Policy', "script-src 'none'");
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4402, '127.0.0.1', () => console.log('Package 02 preview: http://127.0.0.1:4402/ (add ?nojs to block scripts)'));
