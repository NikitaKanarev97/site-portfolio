/** Editorial export rules for the two Learn demos hosted by the portfolio.
 * Keep the sibling application untouched; update dictionary keys and uses together.
 * Completion-document and simulated-operation notices remain factual UI content.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function normalizeLearnPublicCopy(directory) {
  const replacements = [
    ['TRASSIR Learn — учебный концепт', 'TRASSIR Learn — обучение и рабочие материалы'],
    ['<span>Портфолио-версия · не действующий сервис DSSL / TRASSIR</span>', ''],
    ['<span>Portfolio version · not the live DSSL / TRASSIR service</span>', ''],
    ['Портфолио-версия рабочего проекта. ', ''],
    ['A portfolio version of a work project. ', ''],
    ['Портфолио-версия рабочего проекта', 'Сведения о документе'],
    ['Portfolio version of a work project', 'Document details'],
    ['TRASSIR Learn · портфолио-версия', 'TRASSIR Learn'],
    ['TRASSIR Learn · portfolio prototype', 'TRASSIR Learn'],
    ['демонстрационный документ портфолио-версии', 'демонстрационный документ'],
    ['sample document from the portfolio prototype', 'sample completion document'],
  ];
  let changed = 0;
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (/\.(html|js)$/.test(entry.name)) {
        const original = await readFile(file, 'utf8');
        let text = original;
        for (const [before, after] of replacements) text = text.replaceAll(before, after);
        if (text !== original) { await writeFile(file, text); changed++; }
      }
    }
  }
  await visit(directory);
  return changed;
}
