/** Learn-only V3 narrative. V2 remains the source for the unchanged Home entry.
 * Product truth: learn e9ac4b0, PROJECT-CONTEXT, store, trajectories and result.
 */
import { makeLearnCase } from './learn-v2';

export function makeLearnPremium(locale: 'en' | 'ru') {
  const b = makeLearnCase(locale);
  const t = (en: string, ru: string) => locale === 'ru' ? ru : en;
  return {
    ...b,
    lead: t('I redesigned technical learning around an answer needed now and a programme worth completing. Reading a page never becomes programme credit.', 'Я пересобрал техническое обучение вокруг двух задач: найти ответ сейчас и пройти программу до конца. Просмотр страницы не становится зачётом.'),
    origin: t('2026 rework of my DSSL / TRASSIR assignment. I designed the architecture, UX/UI, design system and interactive implementation. The screens show this later work.', 'Переработка моей рабочей задачи в DSSL / TRASSIR, 2026. Я спроектировал архитектуру, UX/UI, дизайн-систему и интерактивную реализацию. Здесь показана эта новая работа.'),
    role: t('Product / UX/UI Designer', 'Продуктовый / UX/UI-дизайнер'),
    nav: [t('The problem', 'Задача'), t('Content model', 'Модель контента'), t('Two journeys', 'Два сценария'), t('Progress', 'Прогресс'), t('Assessment', 'Зачёт')],
    problem: {
      ...b.problem,
      title: t('A catalogue tells you what exists. Not what to do next.', 'Каталог показывает, что есть. Но не подсказывает следующий шаг.'),
      body: t('The original platform led with courses, filters and rewards. I made the working situation the entry point: a specific fault needs a different route from preparation for an entire installation.', 'Исходная платформа начиналась с курсов, фильтров и наград. Я сделал точкой входа рабочую ситуацию: неисправность и подготовка ко всему монтажу требуют разных маршрутов.'),
      archive: t('Original platform · Russian-language archive', 'Исходная платформа · архив на русском'),
      caption: t('Original catalogue and my approach today: an architectural comparison, without measured performance claims.', 'Исходный каталог и мой подход сегодня: сравнение структуры, без измеренного эффекта.'),
      jobs: [
        { label: t('An answer now', 'Ответ сейчас'), title: t('The ONVIF camera is missing.', 'Камера не находится по ONVIF.'), text: t('Go straight to a diagnostic sequence.', 'Сразу перейти к последовательности проверок.') },
        { label: t('Preparation for the job', 'Подготовка к работе'), title: t('I need to commission a site.', 'Нужно запустить объект.'), text: t('See the workload, sequence and assessment first.', 'Заранее увидеть объём, порядок и правила зачёта.') },
      ],
    },
    shared: {
      ...b.shared,
      label: t('02 / System decision', '02 / Системное решение'),
      title: t('One material. Two contexts. Separate records.', 'Один материал. Два контекста. Разные записи.'),
      body: t('I placed the material outside the programme hierarchy: one address, version and update date. Programmes reference its ID. Reading history, deliberate completion and saved assessment attempts each keep their own meaning.', 'Я вынес материал из иерархии программы: один адрес, версия и дата обновления. Программы ссылаются на его ID. История чтения, явное завершение и сохранённые попытки зачёта фиксируют разные факты.'),
      rule: t('Reading is not completion.', 'Прочитано — не значит завершено.'),
      diagram: t('Content model · editorial map of the current implementation', 'Модель контента · схема текущей реализации'),
      consequence: t('A resource can belong to several programmes without acquiring several copies. Opening it updates history for a signed-in reader; only a deliberate action advances the programme.', 'Материал может входить в несколько программ без копирования. У вошедшего читателя открытие пополняет историю; программу продвигает только явное действие.'),
    },
    reference: {
      label: t('03 / Reference journey', '03 / Справочный сценарий'),
      title: t('An answer before a commitment.', 'Нужен ответ? Начать с него.'),
      body: t('An open resource is readable before sign-in. Version and date establish context; the diagnostic outline gets the specialist to the relevant check. Programme links offer a next step without imposing it.', 'Открытый материал доступен до входа. Версия и дата задают контекст, а оглавление ведёт к нужной проверке. Ссылки на программы предлагают продолжение, не навязывая его.'),
      shot: { ...b.shared.reference, caption: t('ONVIF example: complete header, diagnostic summary and linked programmes.', 'Пример ONVIF: целая шапка, краткая диагностика и связанные программы.') },
    },
    guided: {
      ...b.guided,
      label: t('04 / Programme journey', '04 / Учебный сценарий'),
      title: t('Know the commitment. Then take the next step.', 'Понять объём. Затем сделать следующий шаг.'),
      body: t('The programme states its outcome, workload and assessment before enrolment. Eleven ordered units include the final assessment. The current position stays separate from the completed count.', 'Программа показывает результат, объём и правила до начала обучения. В 11 последовательных единиц входит финальный зачёт. Текущая позиция отделена от числа завершённых шагов.'),
      pathCaption: t('Programme contract: 2 h 11 min, 10 resources and an assessment; 3 of 11 completed.', 'Условия программы: 2 ч 11 мин, 10 материалов и зачёт; завершено 3 из 11.'),
      actionTitle: t('A click with a clear meaning.', 'Действие с ясным смыслом.'),
      actionBody: t('“Complete and continue” records this unit, then opens the next. Scrolling does neither. This archive-retention example is a different material from the ONVIF answer above.', '«Завершить и далее» засчитывает единицу и открывает следующую. Прокрутка этого не делает. Здесь показан материал о глубине архива — другой, чем ответ про ONVIF выше.'),
      access: t('Public answers stay open. Sign-in saves progress; restricted materials and assessment require a verified company. Access gates return to the requested context.', 'Открытые ответы доступны всем. Вход сохраняет прогресс; закрытые материалы и зачёт требуют подтверждения компании. После гейта пользователь возвращается в нужный контекст.'),
    },
    workspace: {
      ...b.workspace,
      title: t('Reading and completion. Two distinct records.', 'Чтение и обучение. Две шкалы.'),
      body: t('My Learning separates what was opened from what was completed in a specific programme. These real interface examples use illustrative account data.', '«Моё обучение» отделяет просмотренное от завершённого в конкретной программе. Это реальные состояния интерфейса с демонстрационными данными аккаунтов.'),
      counterTitle: t('A reader is not automatically a learner.', 'Чтение не записывает на программу.'),
      counterBody: t('Three resources read, no programme started. History is useful on its own; it creates no completion credit.', 'Прочитаны три материала, программа не начата. История полезна сама по себе и не начисляет завершённых шагов.'),
      reader: { ...b.workspace.reader, desktop: 'reader-history', mobile: undefined },
    },
    assessment: {
      ...b.assessment,
      review: { ...b.assessment.review, desktop: 'review-detail' },
      title: t('An unsuccessful result still leads somewhere useful.', 'Непройденный зачёт оставляет понятный путь дальше.'),
      body: t('The result preserves the submitted attempt. A score below 16 of 20 leads back to practice and sources, while completed programme units remain saved.', 'Результат сохраняет отправленную попытку. Балл ниже 16 из 20 ведёт к тренировке и источникам, а завершённые единицы программы сохраняются.'),
      rules: t('20 questions · 30 minutes · 16 correct to pass · 2 attempts · 24-hour pause after an attempt. A retry also requires completed materials and a verified company; exhausted attempts stay exhausted.', '20 вопросов · 30 минут · порог 16 верных · 2 попытки · пауза 24 часа после попытки. Для повтора также нужны завершённые материалы и подтверждённая компания; исчерпанные попытки не восстанавливаются.'),
      scoreNote: t('Independent example states, not a time-lapse of one attempt or learning-impact metrics.', 'Независимые примеры состояний, а не последовательность одной попытки или метрики обучения.'),
      passTitle: t('The same rule. A different outcome.', 'То же правило. Другой исход.'),
      passBody: t('20 of 20 clears the same threshold of 16. The saved result opens its associated training document, which is not an official DSSL qualification.', '20 из 20 преодолевает тот же порог 16. Сохранённый результат открывает связанный учебный документ, который не является официальной квалификацией DSSL.'),
    },
    outcome: {
      ...b.outcome,
      title: t('One system. Honest boundaries.', 'Единая система. Понятные границы.'),
      body: t('From a catalogue-first brief to task-led entry, reusable materials and explicit learning records. I connected the architecture, interface system and interactive implementation.', 'От каталога курсов — к входу по задаче, общим материалам и явному прогрессу. Я связал архитектуру, систему интерфейса и интерактивную реализацию.'),
      proof: [
        { label: t('Designed', 'Спроектировано'), text: t('Task-led entry, versioned answers and a programme contract.', 'Вход по задаче, версии материалов и явные условия программы.') },
        { label: t('Implemented', 'Реализовано'), text: t('Separate reading, completion and assessment records in a responsive EN/RU interface.', 'Раздельные записи чтения, завершения и зачёта в адаптивном EN/RU-интерфейсе.') },
        { label: t('Checked', 'Проверено'), text: t('Browser routes, states, localization and responsive behaviour. Learning impact remains unmeasured.', 'Маршруты, состояния, локализация и адаптивность в браузере. Эффект на обучение не измерен.') },
      ],
      note: t('Demo data persists in the browser session; there is no backend or cross-device sync.', 'Демоданные сохраняются в сессии браузера; серверного хранения и синхронизации устройств нет.'),
    },
  };
}
export type LearnPremiumCopy = ReturnType<typeof makeLearnPremium>;
export const learnCaseEn = makeLearnPremium('en');
export const learnCaseRu = makeLearnPremium('ru');
