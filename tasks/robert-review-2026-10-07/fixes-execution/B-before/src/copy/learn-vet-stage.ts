/** Local scene captions; facts and documentary UI stay in the accepted stories. */
export function learnVetStageCopy(locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  return {
    learn: {
      title: ru ? 'Один материал' : 'One material',
      detail: ru
        ? 'Ответ в справочнике и тот же ресурс в учебной программе.'
        : 'An answer in the reference, the same resource in a learning path.',
    },
    vet: {
      caption: ru
        ? 'Врач сохраняет назначение, регистратура выставляет счёт, владелец получает опубликованную выписку. Тридцать секунд между пациентами — исходное ограничение дизайна.'
        : 'The vet saves prescriptions, reception bills services, and the owner receives the published summary. Thirty seconds between patients was the original design constraint.',
    },
  };
}
