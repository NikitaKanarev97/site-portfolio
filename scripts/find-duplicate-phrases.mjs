/**
 * Ищет повторяющиеся ключи в словарях локализации.
 *
 * Зачем: `tsc --noEmit` пропускает повтор ключа в объектном литерале, а
 * `tsc -b`, которым идёт продакшен-сборка, падает на нём. Дубликат появляется
 * незаметно — когда одну и ту же фразу добавляют в двух заходах, — и обрушивает
 * сборку уже после того, как всё остальное проверено.
 *
 * Запуск: node scripts/find-duplicate-phrases.mjs <путь к RussianLocalization.tsx>
 */
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Укажите путь к файлу локализации');

const source = readFileSync(file, 'utf8');
const counts = new Map();

for (const line of source.split('\n')) {
  // Ключи объявляются как 'строка': или слово: в начале записи.
  for (const match of line.matchAll(/(?:^|[{,]\s*)'((?:[^'\\]|\\.)*)'\s*:/g)) {
    counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
  }
}

const duplicates = [...counts].filter(([, count]) => count > 1);
for (const [key, count] of duplicates) console.log(`${count}× ${JSON.stringify(key)}`);
console.log(duplicates.length ? `\nДубликатов: ${duplicates.length}` : 'Дубликатов нет');
process.exitCode = duplicates.length ? 1 : 0;
