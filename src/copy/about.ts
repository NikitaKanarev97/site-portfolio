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
 *   - intro.lead и три абзаца intro.body. Вайрфрейм задаёт содержание
 *     каждого абзаца, готовой формулировки не даёт. Написано по фактам
 *     кейса /work/partner-portal — src/copy/cases/partner-portal.ts.
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
import { TODO_NAME } from './site.ts';

export const about = {
  meta: {
    title: `${TODO_NAME} — How I work`,
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
    body: [
      /* 1. Как работаю в чужих ограничениях. */
      'Most of my work happens inside limits I did not set and cannot remove: a system of record the business runs on and nobody is going to replace, a pricing model that lives in contracts rather than in the product, an agreement between two departments that predates the brief. My first move is not to ask for the limit to be lifted. It is to find out what the limit is holding up, because a constraint that has survived that long is usually load-bearing. On the partner portal the legacy system could not be touched, so the question stopped being what the new portal should look like and became what the new surface can own that the old one does not. The answer — the specification line and where it came from — came out of the constraint, not despite it.',
      /* 2. Что делаю с тем, что не получается. */
      'Every case I write has a section about what did not work, and it is not there for modesty. The order in which a project is run is a design decision like any other, and the places where I got that order wrong are the part of a write-up that is hard to fake. On DSSL I finished six screens before checking their structure against comparable products, which is backwards: a structural finding costs a paragraph before the screen exists and a rebuild afterwards. Two of the defects found later I also wrote up wrong the first time, and fixing either first diagnosis would have fixed nothing. You find out how someone works when something breaks either way — the only question is whether you find out before hiring them or after.',
      /* 3. Чем меряю результат, когда цифры закрыты. */
      'Most of what I have shipped is under NDA, and some of it has no baseline to be measured against: the metrics defined for it were a plan for measurement, not a claim of results. So I do not publish numbers I cannot stand behind, and I do not let a plan pass for an outcome. What goes in their place is the compromise, stated in full — what the design achieved, what it cost, who now does more work than before, and what would have to change to remove that cost. A named trade-off can be checked in a conversation: you can ask what I considered instead and why I rejected it. A number without a baseline cannot.',
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
    alt: `${TODO_NAME} — head-and-shoulders portrait against a plain background`,
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
      'What it is good at in my process is volume and first drafts: reading more comparable products than I would get through by hand, restating a requirement several ways until the weak version becomes visible, walking a finished flow and reporting where it breaks. The last one has repeatedly found defects on screens I had already called done — which is the reason it runs at all.',
      'What it does not do is decide. It does not pick the object the system is built around, it does not choose which constraint to accept, and it does not name the trade-off in a case — those are the parts you would be hiring me for. It also does not get to invent evidence: anything it produces about users or the market stays marked as an assumption until something outside it confirms it.',
    ],
  },
};
