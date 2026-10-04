// Run the established CSS checker against this frozen build, preserving dist.
const fs=require('node:fs');
const Module=require('node:module');
const file=require('node:path').resolve('scripts/check-scoped-css.cjs');
const code=fs.readFileSync(file,'utf8').replaceAll("'dist", "'dist-h6");
const checker=new Module(file,module);checker.filename=file;
checker.paths=Module._nodeModulePaths(require('node:path').dirname(file));
checker._compile(code,file);
