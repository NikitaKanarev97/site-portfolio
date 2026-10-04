import type { CaseTheme } from './cases/story';

/** Editorial labels derive from the accepted stories; they are not new outcome claims. */
export function caseArt(theme: CaseTheme, locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const copy = {
    agent: { label: ru ? 'Человеческая проверка' : 'Human review', detail: ru ? 'Обещание → решение → выплата' : 'Promise → decision → payout' },
    portal: { label: ru ? 'Исходная строка' : 'Source row', detail: ru ? '«камера 4мп уличная» · 8 шт.' : '“камера 4мп уличная” · 8 units' },
    learn: { label: ru ? 'Один материал' : 'One material', detail: ru ? 'Справочник ↔ Учебная программа' : 'Reference ↔ Learning path' },
    vet: { label: ru ? 'Один визит · три представления' : 'One visit · three views', detail: ru ? '30 секунд между пациентами — исходное ограничение задачи, не измеренная скорость UI.' : '30 seconds between patients is the original task constraint, not measured UI speed.' },
    pawly: { label: ru ? 'Дома — когда подтверждено' : 'Home, when confirmed', detail: ru ? 'Фотография и отчёт демонстрационного сценария' : 'Photo and report from the demonstration scenario' },
  };
  return copy[theme];
}
