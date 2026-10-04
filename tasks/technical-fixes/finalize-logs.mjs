import {readdir,readFile,writeFile} from 'node:fs/promises';
const dir='tasks/technical-fixes';
for(const name of await readdir(dir))if(name.endsWith('.log')){
 const text=await readFile(`${dir}/${name}`,'utf8');
 const compact=name==='check.log'?`npm run check (hint bodies omitted)\n${text.slice(text.lastIndexOf('Result ('))}`:text;
 await writeFile(`${dir}/${name}`,compact.split(/\r?\n/).map(line=>line.trimEnd()).join('\n').trimEnd()+'\n');
}
