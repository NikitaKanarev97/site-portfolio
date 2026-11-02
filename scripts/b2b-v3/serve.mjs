/**
 * Minimal static server for a built `dist/` copy, so BEFORE and AFTER builds
 * can be served side by side under identical conditions.
 *   node scripts/b2b-v3/serve.mjs <dir> <port> [spa-fallback.html]
 * The optional fallback serves a single-page app (the product build) on any
 * unknown path, as its host does.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const [dir = 'dist', port = '4410', spa] = process.argv.slice(2);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(dir, url));
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    if (spa && !extname(file)) file = join(dir, spa);
    else { file = join(dir, '404.html'); res.statusCode = 404; }
  }
  try {
    const body = await readFile(file);
    res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
    res.end(body);
  } catch { res.statusCode = 404; res.end('not found'); }
}).listen(Number(port), '127.0.0.1', () => console.log(`serving ${dir} on ${port}`));
