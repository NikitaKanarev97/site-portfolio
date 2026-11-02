/** Home-only story. Current product evidence: learn-v2-media.json. */
export function learnHomeCopy(locale: 'en' | 'ru') {
  const t = (en: string, ru: string) => locale === 'ru' ? ru : en;
  return {
    title: t('An answer now.\nA programme to go further.', 'Ответ сейчас.\nПодготовка ко всей работе.'),
    connection: t('The ONVIF answer is also a programme resource. Reading it does not complete a learning step.', 'Ответ про ONVIF входит и в программу. Чтение статьи не завершает учебный шаг.'),
    connectionMobile: t('The ONVIF guide also belongs to the programme. Progress is tracked separately.', 'Статья про ONVIF входит и в программу. Прогресс программы считается отдельно.'),
    referenceMobile: t('Answer now · ONVIF', 'Быстрый ответ · ONVIF'),
    learningMobile: t('Programme · at your own pace', 'Программа · в своём темпе'),
    reference: t('Reference · ONVIF diagnostics', 'Справочник · диагностика ONVIF'),
    learning: t('Learning · commissioning programme', 'Обучение · программа пусконаладки'),
    referenceAlt: t('ONVIF reference article: technical version, diagnostic summary and links to programmes. On mobile: the complete article header.', 'Статья про ONVIF: версия, диагностическая сводка и ссылки на программы. На телефоне — целая шапка статьи.'),
    learningAlt: t('Separate commissioning programme screen: 3 of 11 units complete, current step 04 and explicit continue action. Reading does not count towards completion.', 'Отдельный экран программы пусконаладки: завершено 3 из 11, текущий шаг 04 и явное продолжение. Чтение не засчитывается как завершение.'),
    link: t('Read the TRASSIR Learn case', 'Читать кейс TRASSIR Learn'),
  };
}
