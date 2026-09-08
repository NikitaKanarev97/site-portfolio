import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const pairs = [
  ['Самостоятельный учебный концепт', 'Портфолио-версия рабочего проекта'],
  ['An independent learning concept.', 'A portfolio version of a work project.'],
  ['Independent learning concept', 'Portfolio version of a work project'],
  ['TRASSIR Learn · учебный концепт', 'TRASSIR Learn · портфолио-версия'],
  ['TRASSIR Learn · learning concept', 'TRASSIR Learn · portfolio prototype'],
  ['учебный документ самостоятельного концепта', 'демонстрационный документ портфолио-версии'],
  ['sample document from an independent concept', 'sample document from the portfolio prototype'],
  ['Это учебная модель самостоятельного концепта.', 'Здесь показана работа зачёта в нынешнем прототипе.'],
  ['This is a learning model in an independent concept.', 'This demonstrates assessment in the current prototype.'],
  ['Результат самостоятельного концепта, без официальной действительности.', 'Демонстрационный результат нынешнего прототипа, без официальной действительности.'],
  ['An outcome of this independent concept with no official validity.', 'A demonstration outcome from the current prototype with no official validity.'],
  ['В этом концепте проверка учебная:', 'В этом прототипе проверка демонстрационная:'],
  ['Проверка в концепте демонстрационная.', 'Проверка в прототипе демонстрационная.'],
  ['in this concept', 'in this prototype'],
  ['In this concept', 'In this prototype'],
  ['Именной документ концепта', 'Именной демонстрационный документ'],
  ['Named concept document', 'Named demonstration document'],
  ['документ концепта', 'демонстрационный документ'],
  ['concept document', 'demo document'],
  ['Независимый дизайн-концепт · 2026', 'Рабочий проект, переосмысленный в 2026'],
  ['Independent design concept · 2026', 'A work project revisited in 2026'],
  ['Не официальный сервис DSSL / TRASSIR', 'Портфолио-версия · не действующий сервис DSSL / TRASSIR'],
  ['Not an official DSSL / TRASSIR service', 'Portfolio version · not the live DSSL / TRASSIR service'],
  ['Независимый дизайн-концепт.', 'Нынешняя переработка реального рабочего проекта.'],
  ['Independent design concept.', 'A current reinterpretation of a real work project.'],
  ['Учебный материал для дизайн-концепта.', 'Пример материала в нынешнем прототипе платформы.'],
  ['A learning guide created for a design concept.', 'A sample guide in the current platform prototype.'],
  ['Дизайн-концепт', 'Образец в прототипе'],
  ['Design concept', 'Prototype sample'],
  ['Тема в составе концепта программы.', 'Тема в составе программы прототипа.'],
  ['A topic in the concept curriculum.', 'A topic in the prototype curriculum.'],
  ['Так устроена сертификация в концепте.', 'Так показана сертификация в нынешнем прототипе.'],
  ['This is the certification model in the concept.', 'This demonstrates certification in the current prototype.'],
  ['В концепте аккаунт сохраняет', 'В прототипе аккаунт сохраняет'],
  ['In the concept, an account keeps', 'In the prototype, an account keeps'],
  ['ИТОГОВАЯ ПРОВЕРКА / КОНЦЕПТ', 'ИТОГОВАЯ ПРОВЕРКА / ПРОТОТИП'],
  ['FINAL ASSESSMENT / CONCEPT', 'FINAL ASSESSMENT / PROTOTYPE'],
];
async function walk(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await walk(file));
    else if (/\.(tsx?|json|html)$/.test(file)) result.push(file);
  }
  return result;
}
const files = [...await walk('../learn/src'), ...await walk('../learn/landing/app/src'), '../learn/index.html', '../learn/landing/app/index.html'];
const changed = [];
for (const file of files) {
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const [from, to] of pairs) after = after.replaceAll(from, to);
  if (after !== before) { await writeFile(file, after); changed.push(file); }
}
await writeFile('tasks/learn-case/reports/evidence-07/reposition-files.json', JSON.stringify(changed, null, 2));
console.log(`Updated ${changed.length} source/copy files; no generated exports or historical audit files edited.`);
