import {readFile,writeFile,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const tmp='tasks/portfolio-rebuild/art-direction/h-art-04/check-css-runtime.cjs';
// Same repository algorithm; only the isolated build-directory name differs.
await writeFile(tmp,(await readFile('scripts/check-scoped-css.cjs','utf8')).replace(/\bdist\b/g,'dist-h4'));
try {const r=spawnSync(process.execPath,[tmp],{encoding:'utf8'});process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status;} finally {await unlink(tmp);}
