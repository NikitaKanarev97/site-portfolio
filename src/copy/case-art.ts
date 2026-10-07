import type { CaseTheme } from './cases/story';

/** Editorial labels derive from the accepted stories; they are not new outcome claims. */
export function caseArt(theme: CaseTheme, locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const copy = {
    agent: { label: ru ? 'Человеческая проверка' : 'Human review', detail: ru ? 'Обещание → решение → выплата' : 'Promise → decision → payout' },
    portal: { label: ru ? 'Подбор по исходной строке' : 'Match the source row', detail: ru ? '«камера 4мп уличная», 8 шт.' : '“4 MP outdoor camera”, 8 units' },
    learn: { label: ru ? 'Один материал' : 'One material', detail: ru ? 'Справочник и учебная программа' : 'Reference and learning path' },
    vet: { label: ru ? 'Один визит · три представления' : 'One visit · three views', detail: ru ? 'Тридцать секунд между пациентами — ограничение, с которого начался дизайн.' : 'Thirty seconds between patients: the constraint the design started from.' },
    pawly: { label: ru ? 'Дома — когда подтверждено' : 'Home, when confirmed', detail: ru ? 'Фото подтверждает передачу питомца, датированный отчёт — возвращение.' : 'The photo confirms the handover; the dated report records the return.' },
  };
  return copy[theme];
}
