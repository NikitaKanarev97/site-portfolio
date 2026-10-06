import type { CaseTheme } from './cases/story';

/** Editorial labels derive from the accepted stories; they are not new outcome claims. */
export function caseArt(theme: CaseTheme, locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const copy = {
    agent: { label: ru ? 'Человеческая проверка' : 'Human review', detail: ru ? 'Обещание → решение → выплата' : 'Promise → decision → payout' },
    portal: { label: ru ? 'Исходная строка' : 'Source row', detail: ru ? '«камера 4мп уличная» · 8 шт.' : '“камера 4мп уличная” · 8 units' },
    learn: { label: ru ? 'Один материал' : 'One material', detail: ru ? 'Справочник ↔ Учебная программа' : 'Reference ↔ Learning path' },
    vet: { label: ru ? 'Один визит · три представления' : 'One visit · three views', detail: ru ? 'Тридцать секунд между пациентами — ограничение, с которого начался дизайн.' : 'Thirty seconds between patients: the constraint the design started from.' },
    pawly: { label: ru ? 'Дома — когда подтверждено' : 'Home, when confirmed', detail: ru ? 'Фото при передаче, датированный отчёт при возвращении' : 'A photo at pickup, a dated report at return' },
  };
  return copy[theme];
}
