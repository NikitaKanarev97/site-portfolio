import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {relative} from 'node:path';
const sha=b=>createHash('sha256').update(b).digest('hex');const c=JSON.parse(readFileSync('tasks/portfolio-rebuild/common/captures.json'));const sourceResults=c.sources.map(s=>({file:s.file,identical:sha(readFileSync(s.file))===s.sha256}));
const frameResults=c.media.map(s=>({file:s.file,identical:sha(readFileSync('public'+s.file))===s.sha256}));
writeFileSync('tasks/portfolio-rebuild/common/source-verification.json',JSON.stringify({sourceResults,frameResults},null,2));console.log({sourceFiles:sourceResults.length,frames:frameResults.length,failures:[...sourceResults,...frameResults].filter(r=>!r.identical)});
