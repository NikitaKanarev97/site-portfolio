import { readFileSync, writeFileSync } from 'node:fs';
const cases = ['agent-ops-console','partner-portal','learn','vet-clinic','pawly','about'];
const out = []; const grams = new Map();
for (const loc of ['en','ru']) for (const c of cases) {
  const raw = readFileSync(`logs/text/${c}-${loc}.md`,'utf8').split('\n');
  const start = raw.findIndex(l => l === '') + 1;
  let end = raw.findIndex(l => /^## (Let.s talk|Давайте|Обсудим|Напишите|Поговорим|Связ)/i.test(l)); if (end < 0) end = raw.length;
  const body = raw.slice(start, end);
  const w = s => (s.match(/[\p{L}\p{N}]+/gu) || []).length;
  const prose = body.filter(l => !l.startsWith('[alt]') && !l.startsWith('[link]') && !l.startsWith('[cap]') && !l.startsWith('#'));
  const heads = body.filter(l => l.startsWith('#')), caps = body.filter(l => l.startsWith('[cap]')), alts = body.filter(l => l.startsWith('[alt]'));
  const sum = a => a.reduce((n, l) => n + w(l.replace(/^\[\w+\] |^#+ /, '')), 0);
  out.push(`${c}-${loc}: prose=${sum(prose)} heads=${sum(heads)} caps=${sum(caps)} (${caps.length} lines) alt=${sum(alts)} total_visible=${sum(prose)+sum(heads)+sum(caps)}`);
  if (loc === 'en') for (const l of [...prose, ...heads]) {
    const t = l.replace(/^#+ /,'').toLowerCase().match(/[a-z']+/g) || [];
    for (let n = 4; n <= 4; n++) for (let i = 0; i + n <= t.length; i++) { const g = t.slice(i, i+n).join(' '); if (!grams.has(g)) grams.set(g, new Set()); grams.get(g).add(c); }
  }
}
out.push('\n## 4-grams shared by 2+ pages (EN)');
for (const [g, s] of [...grams].filter(([, s]) => s.size > 1).sort((a,b)=>b[1].size-a[1].size)) out.push(`${s.size} ${g} [${[...s].join(',')}]`);
writeFileSync('logs/copy-stats.txt', out.join('\n')); console.log(out.slice(0, 60).join('\n'));
