/** V2 editorial copy. Source: audit/trassir-learn-case-v2/STORYBOARD.md.
 * The prepared frames are RU evidence from separate reviewed product branches.
 */
export interface LearnShotCopy { desktop: string; mobile?: string; alt: string; label?: string; caption?: string }
export function makeLearnCase(locale: 'en' | 'ru') {
  const t = (en: string, ru: string) => locale === 'ru' ? ru : en;
  const shot = (desktop: string, mobile: string | undefined, en: string, ru: string, labelEn?: string, labelRu?: string): LearnShotCopy =>
    ({ desktop, mobile, alt: t(en, ru), label: labelEn ? t(labelEn, labelRu!) : undefined });
  return {
    meta: {
      title: t('TRASSIR Learn — one knowledge system, two ways to learn', 'TRASSIR Learn — одна база знаний, два пути к результату'),
      description: t('Product design for technical answers and structured preparation: shared resources, deliberate progress and clear assessment outcomes. A project revisited after my work at DSSL / TRASSIR.', 'Продуктовый дизайн справочника и последовательного обучения: общие материалы, явный прогресс и понятный итог зачёта. Новая работа над проектом после DSSL / TRASSIR.'),
    },
    eyebrow: t('Product design · B2B learning platform', 'Продуктовый дизайн · B2B-платформа обучения'),
    title: 'TRASSIR Learn',
    promise: t('One knowledge system.\nTwo ways to learn.', 'Одна база знаний.\nДва пути к результату.'),
    lead: t('Find a technical answer in the moment, or complete a structured learning path. The same resources support both — with different rules for progress.', 'Быстро найти технический ответ или пройти последовательную программу подготовки. Материалы общие, но правила прогресса — разные.'),
    preview: t('Explore the reference library', 'Открыть справочник'),
    previewHref: `https://kanarev.com/prototypes/learn/home?lang=${locale}`,
    previewNote: t('Live product entry · opens in English', 'Главная продукта · откроется на русском'),
    imageNote: t('Original Russian interface captures · selected states from separate design iterations. Select an image to inspect it.', 'Исходные кадры интерфейса · выбранные состояния отдельных итераций дизайна. Нажмите на кадр, чтобы рассмотреть его.'),
    origin: t('I worked on the platform redesign at DSSL / TRASSIR. After leaving, I revisited the architecture, UX/UI, design system and responsive prototype. These screens show that later work; account data is illustrative.', 'Я работал над редизайном платформы в DSSL / TRASSIR. После ухода заново проработал архитектуру, UX/UI, дизайн-систему и адаптивный прототип. Здесь показана эта новая работа; данные аккаунтов — примеры.'),
    facts: [
      { term: t('Role', 'Роль'), value: t('Product / UX/UI Designer', 'Продуктовый / UX/UI-дизайнер') },
      { term: t('Scope', 'Объём'), value: t('Architecture, design system, prototype', 'Архитектура, дизайн-система, прототип') },
      { term: t('Platform', 'Платформа'), value: t('Responsive web · EN / RU', 'Адаптивный веб · EN / RU') },
    ],
    navLabel: t('In this case', 'В этом кейсе'),
    nav: [t('The task', 'Задача'), t('Shared material', 'Общий материал'), t('Learning path', 'Учебный путь'), t('Assessment', 'Зачёт')],
    hero: {
      home: shot('home-wide', 'home-mobile', 'Task-led Home: commissioning, system design, handover and new hardware', 'Главная по рабочей задаче: пусконаладка, проектирование, сдача объекта и новая линейка'),
      answer: shot('answer-detail', undefined, 'ONVIF answer with version information and diagnostic entry points', 'Ответ по ONVIF: версия материала и входы в диагностику', 'An answer now', 'Ответ сейчас'),
      path: shot('path-progress', undefined, 'Programme: 3 of 11 units complete, with a deliberate action to continue from step 4', 'Программа: завершено 3 из 11 единиц, продолжить можно с шага 4', 'A path forward', 'Последовательный путь'),
    },
    problem: {
      label: t('01 / The task', '01 / Задача'),
      title: t('A catalogue shows courses. It doesn’t show the next step.', 'Каталог показывает курсы, но не подсказывает следующий шаг.'),
      body: t('The archived platform put courses, filters and rewards first. Diagnosing a missing ONVIF camera and preparing for a full installation handover need different journeys. A course list leaves the specialist to assemble the route.', 'В исходной версии на первом плане были курсы, фильтры и награды. Но разобраться с камерой по ONVIF и подготовиться к сдаче объекта — разные задачи. Общий список оставляет специалисту работу по сборке маршрута.'),
      archive: t('Archived course-led entry', 'Архивный вход через каталог'),
      archiveAlt: t('Unchanged archived Russian course catalogue with filters, course cards and reward points', 'Неизменённый архивный каталог: фильтры, карточки курсов и баллы'),
      caption: t('A structural comparison: archived catalogue → task-led Home above. No performance experiment is implied.', 'Сравнение структуры: архивный каталог → главная по задаче выше. Эффект на конверсию здесь не измерялся.'),
    },
    paths: {
      label: t('02 / Two ways in', '02 / Два сценария'),
      title: t('Start from a question.\nOr start from a programme.', 'Начать с вопроса.\nИли с программы.'),
      reference: { label: t('Reference', 'Справочник'), title: t('Solve the task at hand', 'Решить текущую задачу'), text: t('Read a specific answer before sign-in. Version, context and diagnostic steps belong to the resource.', 'Прочитать конкретный ответ до входа. Версия, контекст и порядок проверок принадлежат материалу.') },
      learning: { label: t('Learning', 'Обучение'), title: t('Prepare for the whole job', 'Подготовиться ко всей работе'), text: t('Choose a named programme with a visible workload. Sign in when you need to save your place.', 'Выбрать программу с известным объёмом. Войти, когда нужно сохранить место и продолжить обучение.') },
    },
    shared: {
      label: t('03 / Architecture', '03 / Архитектура'),
      title: t('An answer stays useful outside its course.', 'Материал полезен и вне учебной программы.'),
      body: t('Each resource has its own URL, technical context and version. A programme references it as a counted step without owning a duplicate. The two examples below show how the context changes around the content.', 'У материала есть свой адрес, технический контекст и версия. Программа включает его как шаг, но не дублирует содержимое. Два примера ниже показывают, как меняется контекст вокруг материала.'),
      rule: t('Opening ≠ completing.', 'Прочитано ≠ завершено.'),
      reference: shot('reference', 'reference-mobile', 'Reference example: ONVIF troubleshooting with version and linked programmes', 'Справочник: диагностика ONVIF с версией и связанными программами', 'Reference · ONVIF troubleshooting', 'Справочник · диагностика ONVIF'),
      player: shot('player', 'player-mobile', 'Player example: archive-depth resource with curriculum, current step and separate completion count', 'Плеер: материал о глубине архива, состав программы, текущий шаг и отдельный счётчик завершения', 'Learning · archive-depth resource', 'Обучение · материал о глубине архива'),
      diagram: t('Explore the shared content model', 'Посмотреть модель общего контента'),
    },
    guided: {
      label: t('04 / Guided preparation', '04 / Последовательное обучение'),
      title: t('A visible promise.\nA deliberate next step.', 'Видны цель программы\nи следующий шаг.'),
      body: t('The programme exposes its outcome, workload, syllabus and assessment rules before enrolment. In the Player, completion needs an explicit action. Previously opened reference materials never silently advance the programme.', 'До начала обучения доступны результат, объём, состав и правила зачёта. В плеере шаг засчитывается только после явного завершения. Ранее прочитанный материал не становится автоматически пройденным уроком.'),
      path: shot('path', 'path-mobile', 'Programme purpose and curriculum detail; on mobile, current progress and continue action', 'Цель программы и фрагмент состава; на телефоне — текущий прогресс и продолжение'),
      pathCaption: t('11 units, with a named outcome and a visible sequence. The current position and completed count stay distinct.', '11 единиц, известный результат и видимая последовательность. Текущая позиция и число завершённых шагов различаются.'),
      actionTitle: t('The learner decides when to finish.', 'Учащийся сам завершает шаг.'),
      actionBody: t('“Complete and continue” records completion in this programme. Reading and scrolling do not. This interaction detail is preserved from the earlier working build.', '«Завершить и продолжить» фиксирует завершение в этой программе. Чтение и прокрутка — нет. Деталь взаимодействия сохранена из предыдущей рабочей сборки.'),
      actionAlt: t('End of the ONVIF resource with the explicit Complete and continue action', 'Конец материала ONVIF с явным действием «Завершить и продолжить»'),
    },
    workspace: {
      label: t('05 / Personal workspace', '05 / Личное пространство'),
      title: t('Reading and completion are two different records.', 'Чтение и завершение — два разных показателя.'),
      body: t('Reference history can grow without creating course credit. Completed units stay tied to a specific programme. My Learning keeps both facts visible and one useful next action in focus.', 'История пополняется при чтении, но не выдаёт за это учебные зачёты. Завершённые шаги принадлежат конкретной программе. Личный кабинет показывает обе шкалы и оставляет одно понятное следующее действие.'),
      learner: shot('learner', 'learner-mobile', 'Learner account: continue archive-depth unit; 9 resources read and 3 of 11 programme units completed', 'Аккаунт учащейся: продолжить материал о глубине архива; прочитано 9 материалов и завершено 3 из 11 единиц', 'A learner · 9 read / 3 of 11 complete', 'Учащаяся · 9 прочитано / 3 из 11 завершено'),
      reader: shot('reader', 'reader-history', 'Reader account: 3 resources read; no programme completion is awarded', 'Аккаунт читателя: прочитано 3 материала, завершение программы не начисляется', 'A reader · 3 read / no programme credit', 'Читатель · 3 прочитано / без зачёта программы'),
      readerDetail: shot('reader-programme', undefined, 'Programme count appears only after starting a programme; only explicit completion contributes', 'Счётчик появляется после начала программы и учитывает только явно завершённые единицы'),
    },
    assessment: {
      label: t('06 / Assessment and recovery', '06 / Зачёт и возвращение'),
      title: t('A result explains what happened. And what comes next.', 'Результат объясняет, что произошло и что делать дальше.'),
      body: t('The saved score is compared with a fixed threshold. An unsuccessful attempt keeps the retry rules, read-only review and source materials in reach. Passing opens a training document. Reopening a result changes neither the score nor progress.', 'Сохранённый балл сравнивается с объявленным порогом. При непройденной попытке доступны правила повтора, разбор и исходные материалы. После прохождения открывается учебный документ. Повторное открытие результата ничего не перезаписывает.'),
      failed: shot('failed', 'failed-mobile', 'Unsuccessful assessment: 14 of 20 answers against a threshold of 16, with remaining attempt and cooldown', 'Зачёт не пройден: 14 из 20 при пороге 16, оставшаяся попытка и пауза до повтора', 'Unsuccessful · recovery stays available', 'Не пройден · подготовка остаётся доступной'),
      passed: shot('passed-score', 'passed-score-mobile', 'Passed assessment score panel: 20 of 20 against the same threshold of 16', 'Блок успешного результата: 20 из 20 при том же пороге 16', 'Passed · the same threshold', 'Пройден · тот же порог'),
      scoreNote: t('Example assessment states, not learning-impact metrics. The passing frame shows the score region.', 'Примеры состояний зачёта, а не метрики обучения. Успешный результат показан фрагментом с баллом.'),
      review: shot('review', 'review-detail', 'Read-only wrong-answer review preserves the submitted answer and links to its source material', 'Разбор ошибки сохраняет отправленный ответ и ведёт к исходному материалу'),
      reviewTitle: t('Return to the source.', 'Вернуться к источнику.'),
      reviewBody: t('The error stays visible. Each answer links back to the material needed for preparation; review never rewrites the submitted attempt.', 'Ошибка остаётся видимой. Ответ ведёт к материалу для подготовки; разбор не переписывает отправленную попытку.'),
    },
    outcome: {
      label: t('07 / What changed', '07 / Что изменилось'),
      title: t('One content system.\nClear boundaries.', 'Единая система.\nПонятные границы.'),
      body: t('Task-based discovery, independent resources, deliberate progression and recoverable assessment outcomes form one connected experience.', 'Поиск по задаче, самостоятельное чтение, явный прогресс и возвращение после зачёта складываются в единый опыт.'),
      tradeLabel: t('The trade-off', 'Компромисс'),
      trade: t('Completion takes a deliberate click. The system maintains separate reading and learning records instead of one ambiguous percentage.', 'После чтения нужен явный клик. Система ведёт чтение и обучение отдельно вместо одного неоднозначного процента.'),
      nextLabel: t('The next check', 'Следующая проверка'),
      next: t('Validate both journeys with real specialists and review the materials and question bank with a subject-matter expert. Browser QA establishes route and state behaviour; learning effectiveness remains to be measured.', 'Пройти оба маршрута с реальными специалистами и проверить материалы и банк вопросов с экспертом. Браузерная QA проверяет маршруты и состояния; эффективность обучения ещё предстоит измерить.'),
      cta: t('Explore the reference library', 'Открыть справочник'),
      landing: t('Visit the product landing', 'Посмотреть лендинг'),
      landingHref: `https://kanarev.com/prototypes/learn-landing/${locale === 'en' ? 'en/' : ''}`,
      note: t('Live reference entry and product introduction. The case documents selected design iterations.', 'Вход в действующий справочник и знакомство с продуктом. Кейс показывает выбранные итерации дизайна.'),
    },
  };
}
export type LearnCaseCopy = ReturnType<typeof makeLearnCase>;
export const learnCaseEn = makeLearnCase('en');
