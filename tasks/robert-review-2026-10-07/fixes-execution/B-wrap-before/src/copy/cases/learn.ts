/**
 * TRASSIR Learn — a current reinterpretation of a real work project, /work/learn.
 * Composition and evidence map: ds/screens/case-learn.md.
 * Source: D:/Claude-projects/learn, especially outputs/prd.md and
 * audit/product-polish/07-final.md. QA counts describe the documented
 * 7 September acceptance, not human research or the later translation.
 */
import { defineStory, type CaseStory, type ShotItem } from './story';
import { learnContentModel } from '../../data/diagrams/learn/content-model';

const PROTOTYPE = '/prototypes/learn/home?lang=en';
const LANDING = '/prototypes/learn-landing/?lang=en';
const media = '/media/case-learn';

export const learn = {
  slug: 'learn',
  meta: {
    title: 'TRASSIR Learn — a technical answer and a step toward qualification',
    description:
      'A fresh look at a learning-platform redesign I worked on at DSSL / TRASSIR: how I would connect technical answers, structured training and reliable progress today.',
  },
  header: {
    title: 'TRASSIR Learn',
    lead: 'I worked on redesigning this learning platform while at DSSL / TRASSIR. Here I revisit that real project with my current approach: start with the specialist’s task, then connect a useful technical answer to a structured learning path.',
    meta: [
      { term: 'Project', value: 'Work project · revisited for the portfolio' },
      { term: 'Product', value: 'Technical learning platform and landing page' },
      { term: 'Revisited', value: '2026' },
      { term: 'Role', value: 'Product Designer' },
      { term: 'Platform', value: 'Responsive web · English and Russian' },
      { term: 'Version shown', value: 'Current reinterpretation · interactive prototype' },
      { term: 'Prototype', value: 'Interactive product, on demo data', href: PROTOTYPE },
      { term: 'Landing', value: 'The product’s public introduction', href: LANDING },
    ],
    outcome:
      'Outcome. A technical answer can be read before sign-in and reused inside a learning programme. Reading, completed units and assessment results remain separate facts. What it cost: explicit completion, staged access and a smaller qualification promise than a conventional training portal makes.',
    team: [
      { term: 'Current rework', value: 'Product framing, research synthesis, IA, UX/UI, design system and prototype' },
      { term: 'Research for this version', value: 'Secondary research, competitor audits and simulated interviews' },
      { term: 'Prototype checks', value: 'Agent-led browser checks; no human usability study of this version' },
    ],
    rework: {
      label: 'A real project, reconsidered with today’s approach',
      text: 'The original redesign was a real assignment during my time at DSSL / TRASSIR and took several months. Many of these features were part of that work. After leaving the company, I rebuilt the experience to show how I would approach it today. The screens here show that current reinterpretation, not the version delivered then or the platform’s current live interface. Account data and documents in this prototype are demonstrations.',
    },
  },
  cover: {
    screens: [
      `${media}/cover/home.webp`,
      `${media}/cover/trajectory.webp`,
      `${media}/cover/material.webp`,
    ],
    alt: 'TRASSIR Learn home with task-based entry points, with a learning programme and a technical material behind it',
    caption: 'One product, two ways in: find an answer or choose a programme. Screens use demonstration content.',
  },
  context: {
    heading: 'The old entry point offered courses before it understood the task.',
    body: [
      'The archived product opens with a course catalogue: search, topic and brand filters, ratings and rewards. Another original screen asks for company details before unlocking courses. These screens show the starting structure; they do not tell us how well real users completed their work.',
      'For the redesign, the useful distinction was between two situations. An engineer investigating a camera that cannot be discovered needs a sequence of checks. A designer asked to learn the product range needs a route, an estimate of the work and a clear finishing condition. Sending both into the same course list leaves them to reconstruct that route themselves.',
    ],
    comparison: [
      {
        src: `${media}/before-catalog.webp`,
        alt: 'Archived original course catalogue with search, topic and brand filters, course cards, ratings and rewards',
        caption: 'Original platform. The course-led entry point from the archive. The Russian screenshot is preserved unchanged; it is not a record of the redesign delivered during my employment.',
      },
      {
        src: `${media}/home.webp`,
        alt: 'Redesigned TRASSIR Learn home offering technical search and entry points organised around the specialist’s task',
        caption: 'My approach today. Start with the work to be done, then choose an answer or a structured programme.',
      },
    ],
  },
  reframe: {
    heading: 'A useful answer became the smallest unit of the learning system.',
    body: [
      'The central hypothesis was that reference and learning could share content without sharing every rule. A material has its own address, product version and update date. It can answer one question independently and occupy a named place inside a programme. The reader should not have to enrol simply to discover whether it is relevant.',
      'That also changes the meaning of progress. Opening a troubleshooting article is evidence of reading, not evidence that its learning objective has been completed. The two records need to meet in one personal space while remaining independent. Otherwise an innocent page view starts making qualification claims.',
    ],
    statement: 'Give the answer its own address. Let a programme organise those answers without turning every visit into a completed lesson.',
  },
  process: {
    heading: 'I made both routes testable before treating the screens as finished.',
    body: [
      'For this rework, I returned to the original screens and the problem I had worked on in the company. I added secondary research and competitor walkthroughs. The personas and interviews used in this new iteration were synthetic: useful for challenging assumptions, insufficient for claiming demand. They informed two equally important acceptance routes — an engineer finding a technical answer and a designer starting and completing structured training.',
      'The PRD then fixed the access ladder, content model and counting rules before the sitemap, design system and interactive build. The public programme page exposes its purpose, workload, full contents and assessment conditions before sign-in. Both the service and its landing are available in English and Russian; links from this portfolio open the selected language.',
    ],
    prototype: {
      href: PROTOTYPE,
      label: 'Open the learning prototype',
      note: 'The working prototype uses local demonstration data. Open the landing separately from the case header.',
    },
    artifacts: [
      {
        src: `${media}/trajectory.webp`,
        alt: 'Learning programme page showing its purpose, workload, full unit list and the conditions for assessment',
        caption: 'The commitment is inspectable before starting: outcome, workload, contents and assessment conditions.',
      },
    ],
  },
  failure: {
    heading: 'A completed screen still hid its most important action.',
    body: [
      'The final browser acceptance found a primary button whose label inherited a muted text colour. The action existed and the screen was assembled, but the next step was difficult to read. The fix belonged in the shared text rule, followed by checks of sign-in, explicit completion and next-unit navigation at three widths.',
      'This new version still needs subject-matter review of its question bank. Some questions rely on sources outside the selected programme. Those sources are disclosed before assessment, but disclosure cannot establish that the assessment measures competence. The prototype demonstrates my current design approach; it does not establish learning outcomes for either this version or the original work project.',
    ],
  },
  decisions: {
    heading: 'Four decisions keep useful access separate from earned completion.',
    items: [
      {
        decision: 'Open reading comes first; sign-in is requested when it can preserve something.',
        why: 'A person arriving with an ONVIF problem needs the checks, product version and source immediately. An account adds history and continuation. Company verification is a later, separate condition for partner materials and assessment.',
        cost: 'Three access levels need clear explanations and exact return paths. A failed code or a rejected company check must return to the original material or programme after correction.',
        artifact: {
          src: `${media}/material.webp`,
          layout: 'wide',
          alt: 'An openly readable ONVIF troubleshooting material with product version, source information and diagnostic steps',
          caption: 'The technical answer is visible before sign-in. Its version is part of the answer, not a trust badge.',
        },
      },
      {
        decision: 'Reading history and completed programme units are counted separately.',
        why: 'Reading can happen through search, a programme or a repeated visit. Completion requires an explicit action in that programme. Refreshing a page does not finish a unit, and progress in a second programme does not rewrite the first.',
        cost: 'The user makes one more deliberate action. The system carries two records and explains their difference instead of compressing them into an attractive but ambiguous percentage.',
      },
      {
        decision: 'Practice explains an error; assessment records an attempt.',
        why: 'Practice preserves the selected answer, explains the mistake and links to its source. Retrying or skipping does not increase assessment eligibility. The assessment changes to a neutral, focused visual mode with explicit rules and a threshold.',
        cost: 'Practice and assessment cannot be cosmetic variants of one quiz. They need different behaviour, feedback and persistence, and the interface has to make that boundary visible.',
        artifact: {
          src: `${media}/practice.webp`,
          layout: 'wide',
          alt: 'Practice feedback retaining the selected wrong answer, identifying the correct answer and explaining it with a source link',
          caption: 'A mistake stays visible long enough to be understood. Practice does not silently fill the completion record.',
        },
      },
      {
        decision: 'A connection failure must not create a new assessment attempt.',
        why: 'Once submitted, answers remain fixed under the same attempt ID. After a network error, retry uses that attempt and produces one result and one demonstration document. Refresh, browser navigation and later sign-in must preserve their identity.',
        cost: 'Recovery requires more than a retry button: saved answers, an explicit interrupted state and a result that can be reopened. The demo keeps these within the browser tab; it does not provide cross-device synchronisation.',
        artifact: {
          src: `${media}/assessment-result.webp`,
          layout: 'wide',
          alt: 'Assessment result showing the score against its passing threshold and access to the demonstration document',
          caption: 'One attempt, one result, an explicit threshold. The document records a demo outcome, not an official qualification.',
        },
      },
    ],
  },
  system: {
    heading: 'Colour identifies the work; it never rewards the score.',
    body: [
      'Four content colours carry the task from home into the catalogue, material and player. Status colours have a separate meaning. Assessment deliberately switches to neutral, while version and update information stays neutral everywhere. There are no points, streaks or success celebrations substituting for progress.',
      'The landing shares that visual vocabulary but uses its own type scale, spacing and component set. It proves the promise with a material and a programme rather than invented testimonials. Its first useful action opens the product; English and Russian lead to the corresponding product language.',
    ],
    grid: [
      {
        src: `${media}/my.webp`,
        alt: 'Personal learning space with programme continuation and reading history presented as distinct records',
        component: 'Personal learning space',
        states: 'reading history · programme continuation · separate completion records',
      },
      {
        src: `${media}/landing.webp`,
        alt: 'TRASSIR Learn landing page introducing the route into technical learning and offering an open product example',
        component: 'Public landing',
        states: 'programme preview · open material · explained access levels',
      },
    ],
  },
  result: {
    heading: 'The prototype can demonstrate the promise. Learning outcomes remain unmeasured.',
    statements: [
      { term: 'Rebuilt', value: 'Both routes work in the current prototype: find and revisit a technical answer, or inspect a programme, resume it, practise and reach a recoverable assessment result.' },
      { term: 'Sacrificed', value: 'Automatic credit for reading, reward mechanics and an official certification claim. Each would imply more knowledge about the learner than this prototype can establish.' },
      { term: 'Checked', value: 'The documented 7 September acceptance covered 36 states at three widths: 108 combinations, with zero final automated axe violations. Browser scenarios included failed sign-in, company correction and retry after a real network interruption.' },
      { term: 'Next evidence', value: 'Test both routes with real specialists, validate the content and question bank with an expert, then measure answer-finding and programme continuation against a baseline.' },
    ],
    nda: 'These engineering checks apply to the prototype shown here. Screen-reader and physical-device testing remain open; storage lasts within the browser tab, messages and company checks are simulated, and a full offline application is not implemented.',
  },
  outro: {
    heading: 'The interesting question is where an answer becomes learning.',
    lead: 'That boundary shaped the content, access, progress model and recovery behaviour throughout the product.',
  },
};

/** Full rebuild preview; the public legacy composition remains independently routed. */
export function makeLearnStory(lang: 'en' | 'ru'): CaseStory {
  const t = (en: string, ru: string) => lang === 'en' ? en : ru;
  const base = `/media/rebuild/learn${lang === 'ru' ? '-ru' : ''}/`;
  const shot = (id: string, en: string, ru: string, nativeWidth?: number): ShotItem => ({
    src: `${base}${id}-desktop.webp`, srcNarrow: `${base}${id}-mobile.webp`,
    alt: t(en, ru), device: 'panel', ...(nativeWidth ? { nativeWidth } : {}),
  });
  const cards = [
    ['setup', 'Setup', 'Пусконаладка'], ['project', 'Project', 'Проектирование'],
    ['handover', 'Handover', 'Сдача объекта'], ['explore', 'Explore', 'Обзор линейки'],
  ];
  return defineStory({
    theme: 'learn', plate: 'light',
    cover: {
      title: 'TRASSIR Learn',
      outcome: t('A technical answer becomes part of a learning path.', 'Технический ответ становится частью учебного пути.'),
      media: { variant: 'proof', eyebrow: t('Technical learning', 'Техническое обучение'),
        shot: shot('cover', 'One material beside its programme passport', 'Материал рядом с паспортом его программы'),
      },
    },
    facts: [
      { term: t('Role', 'Роль'), value: t('Product Designer', 'Продуктовый дизайнер') },
      { term: t('Original work', 'Исходная работа'), value: t('DSSL / TRASSIR · several months', 'DSSL / TRASSIR · несколько месяцев') },
      { term: t('Scope', 'Объём'), value: t('Content model, UX/UI, system, prototype', 'Модель контента, UX/UI, система, прототип') },
      { term: t('Product', 'Продукт'), value: t('Open product', 'Открыть продукт'), href: `/prototypes/learn/home?lang=${lang}` },
      { term: t('Landing', 'Лендинг'), value: t('Open website', 'Открыть сайт'), href: `/prototypes/learn-landing/?lang=${lang}` },
    ],
    blocks: [
      { id: 'audit-direction', type: 'comparison', evidenceId: 'learn-audit', mediaId: 'archive-catalog', motion: 'reveal',
        payload: {
          thesis: { label: t('Design direction', 'Решение после аудита'), thesis: t('Start with the specialist’s task', 'Сначала — задача специалиста'),
            body: t('The archive leads with courses, ratings and rewards. Returning to my work at DSSL / TRASSIR, I reframed entry around a question or programme, with the answer open before sign-in. The screens use invented account and document data.', 'В архивном каталоге сначала идут курсы, рейтинги и награды. Я вернулся к своей работе в DSSL / TRASSIR и сделал входом рабочий вопрос или программу: ответ можно прочитать до авторизации. Данные аккаунтов и документов на экранах вымышлены.') },
          issue: { src: '/media/rebuild/learn/archive-catalog.webp', alt: t('Archived Russian course catalogue with ratings and reward points', 'Архивный каталог курсов с рейтингом и баллами'),
            marks: [{ x: 20, y: 17, text: t('Courses define the entry', 'Каталог начинается с курсов') }, { x: 25, y: 90, text: t('Points accompany the material', 'Баллы сопровождают материал') }],
            caption: t('The archived catalogue: courses and points come first.', 'Архивный каталог: впереди курсы и баллы.') },
        } },
      { id: 'shared-material', type: 'artifact', evidenceId: 'learn-model', mediaId: 'learn-content-model', motion: 'draw',
        payload: { thesis: { label: t('Content model', 'Модель контента'), thesis: t('A shared material connects reference and programme', 'Справочник и программа используют общий материал'),
          body: t('The material owns its content and version; programmes reference it. Reading history, explicit completion and assessment attempts remain separate records.', 'Материал хранит содержание и версию. Программа ссылается на него без копии. История чтения, явное завершение и попытка зачёта остаются отдельными записями.') },
          artifact: { data: learnContentModel, source: { kind: 'editorial', ref: 'Learn PRD §4.2/5.3, current MaterialPage and Player' }, caption: t('Materials, programmes and their reading and completion records.', 'Связи материалов, программ и записей чтения и завершения.') } } },
      { id: 'one-material', type: 'steps', evidenceId: 'learn-completion', mediaId: 'material-contexts', motion: 'static',
        payload: { composition: 'routes', label: t('The same ONVIF material', 'Тот же материал об ONVIF'), items: [
          { label: t('Reference', 'Справочник'), thesis: t('Answer the question now', 'Ответить на вопрос сейчас'), layout: 'wide',
            body: t('The answer has its own address, version and date. A learning path sits alongside.', 'У ответа есть ссылка, версия и дата обновления. Рядом можно выбрать программу, в которую он входит.'),
            shot: shot('answer', 'Open ONVIF answer with version, date and learning path rail', 'Открытый ответ об ONVIF, версия, дата и связанные программы'), caption: t('The answer, readable before sign-in.', 'Ответ читается до входа в аккаунт.') },
          { label: t('Programme', 'Программа'), thesis: t('Keep the sequence around the answer', 'Сохранить порядок вокруг ответа'), layout: 'wide',
            body: t('Inside the programme, the same material gains a curriculum and a current position. Its content stays intact.', 'Внутри программы тот же материал получает оглавление и текущую позицию. Содержание сохраняется целиком.'),
            shot: shot('programme', 'The same ONVIF answer in the programme, position 3 of 11', 'Тот же ответ в программе, позиция 3 из 11'), caption: t('Programme view · the same material ID.', 'Программа · тот же ID материала.') },
          { label: t('Completion', 'Завершение'), thesis: t('Completion needs an explicit action', 'Завершение нужно подтвердить'), layout: 'wide',
            body: t('Complete and continue records an explicit decision. Simply opening or scrolling through the material does not earn completion.', '«Завершить и продолжить» фиксирует явное решение. Открытие материала и прокрутка сами по себе не засчитывают завершение.'),
            shot: shot('completion', 'End of the same ONVIF material with the explicit completion button', 'Конец того же материала с явной кнопкой завершения'), caption: t('Completion is a deliberate action at the end.', 'Завершение — осознанное действие в конце материала.') },
        ] } },
      { id: 'content-language', type: 'specimen', evidenceId: 'learn-themes', mediaId: 'learn-content-theme', motion: 'reveal',
        payload: { thesis: { label: t('Content language', 'Язык контента'), thesis: t('Colour follows the task', 'Цвет следует за задачей'),
          body: t('Cards identify four tasks: setup, project, handover and product exploration. The material header shows its version and update date; the programme position is shown as 3 of 11.', 'Карточки различают пусконаладку, проектирование, сдачу объекта и обзор линейки. Над материалом указаны версия и дата обновления, а в программе — текущая позиция: 3 из 11.') },
          specimen: { title: t('Learn · task modes and records', 'Learn · режимы задач и записи'), fontFamily: 'Learn Onest, sans-serif',
            type: [], colors: [],
            groups: [{ id: 'tasks', title: t('Task modes', 'Режимы задач') }, { id: 'records', title: t('Neutral context', 'Нейтральный контекст') }],
            sets: [
              { id: 'task-cards', title: t('Task cards', 'Карточки задач'), group: 'tasks', states: cards.map(([id,en,ru]) => ({ id, label: t(en,ru), mediaId: `theme-${id}`, shot: shot(`theme-${id}`, `${en} task card`, `Карточка задачи: ${ru}`,316) })) },
              { id: 'trust-header', title: t('TrustHeader', 'Шапка материала'), group: 'records', states: [{ id: 'version-date', label: t('Version · date · reading time', 'Версия · дата · время чтения'), mediaId: 'trust', shot: shot('trust','Neutral version, update date and reading time','Нейтральные версия, дата обновления и время чтения',288) }] },
              { id: 'progress-meter', title: t('ProgressMeter', 'Индикатор позиции'), group: 'records', states: [{ id: 'position', label: t('Position 3/11', 'Позиция 3/11'), mediaId: 'progress', shot: shot('progress','Current programme position 3 of 11','Текущая позиция в программе: 3 из 11',288) }] },
            ],
            caption: t('Task colours stay separate from result states.', 'Цвет задачи отделён от состояния результата.'),
          } } },
      { id: 'neutral-assessment', type: 'shot', evidenceId: 'learn-trust', mediaId: 'assessment', motion: 'reveal',
        payload: { thesis: { label: t('Assessment', 'Зачёт'), thesis: t('An attempt has its own rules', 'У попытки свои правила'),
          body: t('Assessment switches to neutral. Time, remaining attempts and the passing threshold are explicit.', 'Для зачёта используется нейтральная палитра. До начала видны время, число оставшихся попыток и проходной порог.') },
          shot: { layout: 'desktop', items: [shot('assessment','Neutral assessment introduction and complete rules','Нейтральное введение в зачёт и полные правила')], caption: t('Before the attempt: time, attempts and pass mark.', 'До попытки: время, попытки и порог.') } } },
      { id: 'public-promise', type: 'shot', evidenceId: 'learn-landing', mediaId: 'landing', motion: 'reveal',
        payload: { thesis: { label: t('Landing', 'Лендинг'), thesis: t('Show the answer before asking for trust', 'Показать ответ до просьбы о доверии'),
          body: t('The landing shows an ONVIF answer and the programme contents before the reader opens the product.', 'На лендинге можно посмотреть ответ об ONVIF и состав программы перед переходом в продукт.') },
          shot: { layout: 'desktop', items: [shot('landing','Learn landing with an ONVIF material and programme preview','Лендинг Learn с материалом об ONVIF и составом программы')], caption: t('The public introduction uses its own editorial scale.', 'Публичное представление использует собственный редакционный масштаб.') } } },
      { id: 'honest-result', type: 'outcome', evidenceId: 'learn-validation', motion: 'static',
        payload: { result: { label: t('Result', 'Результат'), thesis: t('Both routes work', 'Справочник и программа связаны') },
          evidence: { label: t('Evidence', 'Подтверждение'), text: t('The product includes finding an open technical answer and following a programme through explicit completion and assessment. Reading history, completed units and assessment attempts are recorded separately.', 'Собраны поиск открытого технического ответа и прохождение программы с явным завершением и отдельным зачётом. История чтения, завершённые единицы и попытки зачёта учитываются отдельно.') },
          tradeoff: { label: t('Trade-off', 'Компромисс'), text: t('Explicit completion adds an action after reading each unit.', 'После чтения каждой единицы нужно отдельно подтвердить завершение.') },
        } },
    ],
    prototype: { label: t('Open product', 'Открыть продукт'), href: `/prototypes/learn/home?lang=${lang}` },
  });
}

export const learnStory = makeLearnStory('en');
