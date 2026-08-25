/**
 * Мёртвые скоупленные правила — Site-portfolio
 *
 * Astro ставит data-astro-cid-<хеш> только на элементы собственного шаблона
 * файла. Корень компонента несёт хеш СВОЕГО файла, поэтому правило страницы
 * `.мой-класс { … }` компилируется в `.мой-класс[data-astro-cid-страницы]`
 * и не совпадает ни с чем. Ошибки нет, предупреждения нет — правило просто
 * не применяется, и отступ молча пропадает.
 *
 * Скрипт сверяет каждый скоупленный селектор собранного CSS с атрибутами
 * элементов собранного HTML и печатает те классы, что не совпали ни с чем,
 * хотя на странице присутствуют.
 *
 * Лечение — писать через родителя из шаблона страницы:
 *   .секция > :global(.мой-класс) { … }
 *
 * Запуск: npm run build && npm run check:css
 * Правило и его история — ds/components.md §Реализация,
 * ds/screens/about.md §«Найдено при сборке».
 */
const fs = require('fs');
const pages = {
  '/': 'dist/index.html',
  '/about': 'dist/about/index.html',
  '/work/partner-portal': 'dist/work/partner-portal/index.html',
  '/work/vet-clinic': 'dist/work/vet-clinic/index.html',
  '/ru/': 'dist/ru/index.html',
  '/404': 'dist/404.html',
  '/500': 'dist/500.html',
};
const cssFiles = fs.readdirSync('dist/_astro').filter(f => f.endsWith('.css'));
const css = cssFiles.map(f => fs.readFileSync('dist/_astro/' + f, 'utf8')).join('\n');

for (const [route, file] of Object.entries(pages)) {
  const html = fs.readFileSync(file, 'utf8');
  const source = css + '\n' + html;
  const seen = new Set();
  const dead = [];
  for (const m of source.matchAll(/\.([A-Za-z0-9_-]+)\[data-astro-cid-([a-z0-9]+)\]/g)) {
    const cls = m[1], cid = m[2];
    const key = cls + '|' + cid;
    if (seen.has(key)) continue;
    seen.add(key);
    // все теги страницы
    let found = false, present = false;
    for (const tag of html.matchAll(/<[a-z][^>]*>/g)) {
      const t = tag[0];
      const cm = t.match(/class="([^"]*)"/);
      if (!cm) continue;
      const classes = cm[1].split(/\s+/);
      if (!classes.includes(cls)) continue;
      present = true;
      if (t.includes('data-astro-cid-' + cid)) { found = true; break; }
    }
    if (present && !found) dead.push(cls);
  }
  console.log(route + ': мёртвых правил ' + dead.length + (dead.length ? ' → ' + dead.join(', ') : ''));
}
