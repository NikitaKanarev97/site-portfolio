/** Local scene captions; facts and documentary UI stay in the accepted stories. */
export function learnVetStageCopy(locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  return {
    learn: {
      title: ru ? 'Ответ об ONVIF в справочнике и программе' : 'The ONVIF answer in the reference and programme',
      detail: ru
        ? ''
        : '',
    },
    vet: {
      caption: ru
        ? 'Врач сохраняет назначение, регистратура выставляет счёт, владелец получает опубликованную выписку. Тридцать секунд между пациентами — исходное ограничение дизайна.'
        : 'The vet saves prescriptions, reception bills services, and the owner receives the published summary. Thirty seconds between patients was the original design constraint.',
    },
  };
}
