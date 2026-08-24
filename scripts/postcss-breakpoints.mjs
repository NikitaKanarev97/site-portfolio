/**
 * Раздача брейкпоинтов в scoped-стили — Site-portfolio
 *
 * Зачем плагин вообще нужен. postcss обрабатывает каждый CSS-файл и каждый
 * scoped-блок `<style>` внутри `.astro` отдельно, объявлений из соседнего
 * файла не видит. `@custom-media --bp-md …` объявлен один раз в
 * `ds/tokens.css`, поэтому без раздачи `@media (--bp-md)` в компоненте
 * останется неразвёрнутым.
 *
 * Почему не @csstools/postcss-global-data. Он прикладывает к каждому блоку
 * файл целиком. `tokens.css` держит не только объявления, но и ступени
 * типографики в `@media`, и Astro скоупит их хешем компонента: правило
 * `.ds-heading-4xl[data-astro-cid-…]` не совпадает ни с чем и остаётся
 * мёртвым. **Проверено сборкой 2026-08-24:** `npm run check:css` показал
 * 138 мёртвых правил против 10 до правки, вес CSS вырос вчетверо.
 *
 * Поэтому раздаются ровно строки `@custom-media` и ничего больше.
 * Источник значений остаётся один — `ds/tokens.css` через своё зеркало.
 * Файл читается на каждом блоке, а не один раз при старте: иначе правка
 * брейкпоинта в dev потребовала бы перезапуска сервера.
 *
 * Ставится в astro.config.mjs строго перед postcss-custom-media.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Зеркало, а не ds/: в бандле исходников ds/ нет (та же причина, что в src/lib/tokens.ts). */
const SOURCE = 'src/styles/tokens.css';

export default function breakpoints() {
  return {
    postcssPlugin: 'ds-breakpoints',
    Once(root, { postcss, result }) {
      const file = path.resolve(SOURCE);
      const declarations = fs.readFileSync(file, 'utf8').match(/^@custom-media\s[^;]+;/gm);

      if (!declarations) {
        throw new Error(`В ${SOURCE} нет ни одного @custom-media — брейкпоинты не раздать`);
      }

      // Свои же объявления вторым слоем не нужны.
      if (result.opts.from === file) return;

      root.prepend(postcss.parse(declarations.join('\n'), { from: file }).nodes);
    },
  };
}

breakpoints.postcss = true;
