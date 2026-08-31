/**
 * Тексты страницы About — Site-portfolio, маршрут /about
 *
 * Слой контента, отделённый от композиции. Источник структуры —
 * ia/wireframes/about.md; блок авторизации — ia/authorization-copy.md.
 *
 * Что здесь ФАКТ и не переписывается в отрыве от источника:
 *   - весь текст authorization: дословно из ia/authorization-copy.md
 *     §About (AboutAuthorization), решение владельца №1 от 24.08.2026.
 *     Порядок фактов внутри абзаца зафиксирован: гражданство → локация и
 *     часовой пояс → релокация → удалённая работа → форма контракта →
 *     часы пересечения. Подача — одна траектория, не перечисление через
 *     «или». Механики оплаты в блоке нет и не появляется, пока открыт
 *     вопрос №10 ia/open-questions.md (где регистрируется ИП).
 *   - строка UTC+5 обязана совпадать со строкой Footer в site.ts.
 *
 * Что здесь ЧЕРНОВИК и ждёт владельца:
 *   - intro.lead, intro.principle и три абзаца evidence.body. Вайрфрейм
 *     задаёт содержание каждого абзаца, готовой формулировки не даёт.
 *     Написано по фактам кейса /work/partner-portal —
 *     src/copy/cases/partner-portal.ts.
 *   - весь блок ai. В артефактах зафиксирован ровно один факт
 *     (outputs/brief.md §60: ИИ на всех этапах ~40-шагового playbook,
 *     несколько моделей и инструментов). Решение владельца от 24.08.2026:
 *     подача обобщённая — перечисление этапов от интервью до деплоя, без
 *     чисел конкретного прогона. Числа вернутся вместе с блоком CaseAI
 *     внутри кейса, где их можно показать, а не пересказать.
 *
 * Подписи к портрету нет: решение владельца от 24.08.2026. Вайрфрейм
 * допускал короткую фактическую подпись, но факта под неё в артефактах
 * не оказалось, а подпись ради подписи — заполнитель.
 *
 * Чего здесь НЕТ намеренно: AboutExperience — годы практики и тип опыта.
 * Решение владельца №3 (SCR-05) не принято, поэтому блок в v1 не
 * рисуется, а не рисуется пустым (ia/wireframes/about.md,
 * ia/open-questions.md §3).
 *
 * v1.0 выходит на английском. Сквозные строки — в site.ts.
 */
import { NAME } from './site.ts';

export const about = {
  meta: {
    title: `${NAME} — How I work`,
    description:
      'How I work inside constraints I did not set, what I do with the parts that did not work, and where AI sits in the process. Work authorization in full.',
  },

  intro: {
    /**
     * Не «About me». Страница отвечает на вопрос «как ты думаешь и на каких
     * условиях тебя можно нанять», а не «кто ты» (ia/wireframes/about.md).
     */
    heading: 'How I work',
    lead:
      'I reformulate the task before I design it. Most of the briefs I’ve worked from described a solution someone had already chosen — the useful work started when we went back to what the actual problem was.',
    /* Как работаю в чужих ограничениях. */
    principle:
      'Most of my work happens inside limits I did not set: a system of record the business runs on, a pricing model that lives in contracts rather than in the product, an agreement between departments that predates the brief. I start by finding out what the limit is holding up, because a constraint that has survived that long is usually load-bearing. On the partner portal the legacy system could not be touched, so the question changed from what the new portal should look like to what the new surface could own that the old one did not. The answer — the specification line and where it came from — came out of the constraint.',
  },

  evidence: {
    heading: 'What I can stand behind',
    body: [
      /* Что делаю с тем, что не получается. */
      'Every case I write has a section about what did not work, and it is not there for modesty. The order in which a project is run is a design decision, and the places where I got that order wrong are hard to fake. On DSSL I finished six screens before checking their structure against comparable products. A structural finding costs a paragraph before the screen exists and a rebuild afterwards. Two defects found later were also diagnosed incorrectly the first time; fixing either diagnosis would have fixed nothing.',
      /* Чем меряю результат, когда цифры закрыты. */
      'Most of what I have shipped is under NDA, and some of it has no baseline to measure against: its metrics were a plan for measurement, not a claim of results. I do not publish numbers I cannot stand behind or let a plan pass for an outcome. I publish the compromise instead — what the design achieved, what it cost, who now does more work, and what would have to change to remove that cost. A named trade-off can be checked in conversation; a number without a baseline cannot.',
      /* Чем заканчивается работа: доведение до работающей сборки. */
      'The same standard applies to what I hand over. I carry design decisions through to a working build — tokens, components in code, a deployed URL, a QA pass against the running screen — because a decision that stops at a handoff file has not been tested yet. The boundary is the one I would give you in conversation: the front end and integration with an existing API, and most of these builds are prototypes on synthetic data rather than production systems under load.',
    ],
  },

  /**
   * Портрет. Одна фотография, не галерея: он подтверждает, что за текстом
   * человек, а не несёт смысл. Без mockup-рамок и обработки под «стиль» —
   * тот же принцип, что для скриншотов в кейсе (CASE-20).
   *
   * Подписи нет — решение владельца от 24.08.2026. Слот caption у
   * MediaFrame остаётся пустым, figcaption в DOM не появляется.
   */
  portrait: {
    src: '/media/about/portrait.webp',
    alt: `${NAME} — head-and-shoulders portrait against a plain background`,
  },

  /**
   * Строка ContactBlock для этого маршрута. Сквозное умолчание в site.ts
   * говорит «if the case above answered your question» — на /about кейса
   * выше нет. IA-06 требует одинакового блока на всех маршрутах, а не
   * одинакового предложения: состав, порядок и вид не меняются, меняется
   * одна строка. Проп PageShell, не новая сущность.
   */
  contactLead:
    'If this is the kind of thinking you want on your team — or if the answer above still leaves a question.',

  /**
   * Дословно из ia/authorization-copy.md §About. Не переписывать в отрыве
   * от файла: формулировки подобраны под конкретные риски, и правка любой
   * из них меняет обещание.
   */
  authorization: {
    heading: 'Work authorization',
    body:
      'Russian citizen, currently based in Kazakhstan (UTC+5). I’m open to relocation — visa sponsorship required. Until then I’m available for remote work, and I’m flexible about the contracting arrangement: happy to work through whatever setup your company uses. My afternoons overlap with the European morning — four to five hours of shared working time, more if the team is flexible.',
  },

  /**
   * Заголовок-утверждение, блок фактический, а не декларативный: названные
   * этапы проверяемы, «использую ИИ как инструмент» — заполнитель.
   * Без позиции «за» или «против» (ia/wireframes/about.md §AboutAI).
   */
  ai: {
    heading: 'Where AI sits in how I work',
    body: [
      'I use AI at every stage of a project rather than at one step of it — from the first interview and the brief, through research, personas and scenarios, the PRD, the information architecture and the design system, into code, testing and deploy. Several models and tools, picked per step, not one assistant for everything.',
      'In my process, it earns its place through volume and first drafts: reading more comparable products than I can cover by hand, restating a requirement until the weak version becomes visible, walking a finished flow and reporting where it breaks. That last pass has repeatedly found defects on screens I had already called done.',
      'The boundary is judgment and evidence. AI can surface options and failure points; it does not choose the object the system is built around, decide which constraint to accept, or turn an assumption into a user finding. Those decisions — and the trade-off I publish — remain mine.',
    ],
  },
};
