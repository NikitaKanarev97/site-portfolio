/**
 * Тексты кейса Agent Ops Console — маршрут /work/agent-ops-console
 *
 * Композиция — ds/screens/case-agent-ops.md. Фактура собрана из проекта
 * d:\Claude-projects\Agent-ops-console: outputs/{case-study,brief,
 * interview_findings,mvp_scope}.md, prd.md, ia/production-list.md,
 * ds/{foundation,components}.md, audit/{agent-qa,screens-parity}-2026-08-27.md,
 * PROJECT-MAP.md и CLAUDE.md.
 *
 * Пять правил, которые этот файл обязан держать:
 *
 * 1. **Ни одной post-launch метрики.** Работа закончилась принятым
 *    прототипом; реализация — на стороне клиента. Сокращение потерь,
 *    изменение deflection, CSAT и времени обработки не заявляются ни как
 *    результат, ни намёком (CASE-12, US-09).
 * 2. **Три класса фактов не смешиваются.** Операционные факты заказчика
 *    (61%, CSAT 4,4, $23 000, 1 770 диалогов, 24 человека, ~40 000 клиентов)
 *    идут фактами. Проектные оценки (25,3 FTE, 4% обязательств, 71 карточка)
 *    обязаны нести «by my estimate». Факты сборки проверяемы по репозиторию.
 * 3. **NDA.** Заказчик, AI-вендор и участники исследования не названы.
 *    Все имена, компании, счета и суммы на кадрах — мок-данные прототипа
 *    (CASE-22, US-19).
 * 4. **Агентский QA — не пользовательская валидация.** Он снимает то, что
 *    снимается без людей, и ни одну гипотезу в validated не переводит.
 *    Живой юзер-тест прототипа — отдельный факт и назван отдельно.
 * 5. Заголовки — утверждения (CASE-14). Прочтение только заголовков и
 *    подписей обязано давать связный пересказ логики.
 *
 * **Объём.** Первая редакция дала 2 727 слов при лимите ~2500 (`CASE-15`) —
 * из них 762 в `CaseDecisions` против бюджета 520. Ужата вся страница, а не
 * один блок: резать только решения значило бы получить четыре тезиса без
 * обоснования рядом с полновесными соседними секциями. Бюджет по блокам —
 * ds/screens/case-agent-ops.md §Бюджет слов.
 *
 * Сквозные строки — в ../site.ts.
 */
import { EMAIL } from '../site';

const YEAR = '2026';
const TEAM =
  'Sole designer — research, requirements, IA, UX/UI, design system, prototype and testing';
const RESEARCH =
  'Interviews with the client and with current and future users; the prototype was tested and reworked';
const DURATION = 'Up to one month, brief to a tested prototype accepted by the client';

const media = '/media/case-agent-ops';

export const agentOpsConsole = {
  slug: 'agent-ops-console',

  meta: {
    title: 'Agent Ops Console — oversight that earns an AI agent more autonomy',
    description:
      'An internal console for a support team supervising an AI agent: a queue ordered by money at risk, financial actions intercepted before they execute, versioned policies and a per-capability autonomy ladder.',
  },

  header: {
    title: 'Agent Ops Console',
    lead: 'An oversight console for a support team whose AI agent closed most contacts on its own — and occasionally promised money nobody had authorised.',
    meta: [
      { term: 'Client', value: 'NDA — B2B SaaS in subscription billing' },
      { term: 'Product', value: 'Internal oversight console for an AI support agent' },
      { term: 'Year', value: YEAR },
      { term: 'Role', value: 'Product Designer' },
      { term: 'Platform', value: 'Web, desktop-first' },
    ],
    /** CASE-02: что решено и какой ценой, в шапке, одним абзацем. */
    outcome:
      'Outcome. Review stopped being a sample of conversations and became full coverage of consequences: every commitment the agent makes — a refund, a credit, a plan change, a promised date — reaches a person, and a repeating cause is fixed once at the source rather than fourteen times. What it cost: a human now stands in the path of every payout the company bought automation to avoid, and the queue is ordered by an estimate of money at risk.',
    team: [
      { term: 'Team', value: TEAM },
      { term: 'Research', value: RESEARCH },
      { term: 'Duration', value: DURATION },
    ],
    /** CASE-04. Вариант flagged, как у трёх опубликованных кейсов. */
    rework: {
      label: 'Under NDA, on invented data',
      text: 'The client, the AI vendor and the people in the research are not named; the industry, the problem and the operating figures are cleared for publication. Everything on the screens is fixture data — the companies, people, invoices and amounts are invented and none belong to the client. The work ended with the prototype tested and accepted; the build was the client’s, so nothing here claims a shipped result.',
    },
  },

  cover: {
    /**
     * Стопка от переднего кадра к дальнему: очередь → разбор диалога →
     * подтверждение денег. Передней идёт очередь — единственный экран, на
     * котором задача кейса читается до текста.
     */
    screens: [
      `${media}/cover/review-queue.webp`,
      `${media}/cover/run-detail.webp`,
      `${media}/cover/action-approvals.webp`,
    ],
    alt: 'Agent Ops Console review queue: total exposure for the day, four repeating-cause clusters above ninety-one single conversations, with the run detail and the approval queue behind it',
    caption:
      'The product before the case explains it: $18,430 of exposure for one day, $0 of it reviewed, four repeating causes above ninety-one single conversations. All data is invented.',
  },

  context: {
    heading:
      'Every operating number said the rollout was working. None of them could see what the agent was promising.',
    body: [
      'The client runs subscription billing for around forty thousand business customers and had put a vendor’s AI agent on the first line of support. By the standard measures the rollout was a success: the agent closed 61% of contacts without a human and CSAT held at 4.4. The vendor dashboard reported both, daily.',
      'In April the agent offered fourteen customers a refund under a promotion that had ended two years earlier. The mistake surfaced about nineteen days later, when those customers asked for the money. The company paid $23,000 — refusing after a written promise carried a larger legal and reputational cost than honouring it.',
      'Nothing in those conversations looked wrong. The wording was polite, the customers were satisfied, and the deflection rate went up. The system counted how many decisions the agent made on its own and had no way to count what those decisions cost. That was the gap the console had to close, for an operations team of 24 people across three time zones that was not going to grow.',
    ],
  },

  reframe: {
    heading: 'Reading every message was arithmetically impossible. Reading every commitment was not.',
    body: [
      'Around 1,770 conversations closed automatically each day. Reading all of them would take roughly 177 hours a day — by my estimate 25.3 full-time reviewers, against a team of 24 who were also handling live escalations. Any design starting from “review more” was already fiction, and the reviewers knew it: thirty conversations get opened a day, and nobody claims they are the right thirty.',
      'So I pulled a different object out of the traffic. A commitment is a statement with a financial or legal consequence — a refund, a service credit, a plan change, a promised date, a claim about what a plan covers. By my estimate those are about 4% of automated conversations: roughly 71 cards a day, about 2.4 hours of review, 0.3 FTE. The impossible requirement became a small one, and everything outside it became a sample ranked by expected cost.',
      'The second move came out of April. Fourteen customers were not fourteen problems; they were one expired knowledge-base article. So the top level of the queue is a cause cluster rather than a conversation, and the output of a review is not a comment but a correction with a reason class and a route — which is what eventually becomes a policy.',
    ],
    statement:
      'Review the consequences, not the sentences — and fix the cause once, not the conversation fourteen times.',
  },

  process: {
    heading: 'I designed what a human has to see before I designed where it would sit.',
    body: [
      'Research ran with the client and with the people who do this work — reviewers today, and the shift leads and policy owners who would inherit the product. Alongside it I audited the QA tool they already used, walked the existing paths for review, refund approval and policy change, and compared products in AI observability, evaluation and human-in-the-loop approval.',
      'Two findings rewrote the brief. The route for one hard conversation ran QA tool → vendor panel → knowledge base → Confluence → Slack and took an hour and a half against a six-minute norm, so the evidence had to arrive inside the verdict card or the product had no reason to exist. And confident prose turned out to be active camouflage: reviewers cannot spot an unsupported claim by reading, and asked for it to be marked — while ruling out the engineering answer, since a confidence score gets the screen dismissed as noise rather than read.',
      'Then the role model — Reviewer, Shift Lead, Policy Owner — the information architecture, the design system, and 18 of 35 scoped artboards assembled into a clickable prototype. Testing it with users added decisions the brief never had: a cluster needs its members visible and removable or reviewers stop trusting clusters at all, a wrong verdict needs a short window to take back before it poisons the reporting, and a reviewer needs to see what happened to their correction, or they quietly stop classifying causes at all.',
    ],
    prototype: {
      href: 'https://agent-ops-console.vercel.app',
      label: 'Open the prototype',
      note: 'The clickable console on invented data — nineteen screens across three roles. There is no backend; a reload starts a fresh shift.',
    },
    artifacts: [
      {
        src: `${media}/screen-index.webp`,
        alt: 'Index of the nineteen prototype screens: review, corrections, approvals, policies, autonomy, quality and the system states',
        caption:
          'Nineteen screens on one mock data layer. Thirty-five artboards were scoped; eighteen were built, because the rest could not be reached in a clickable path.',
      },
      {
        src: `${media}/storybook-matrix.webp`,
        alt: 'Button catalogue across default, secondary, ghost and destructive variants in three sizes and five states',
        caption:
          'One component across variant, size and state. The matrix renders from the same React component the screens import.',
      },
    ],
  },

  failure: {
    heading: 'Three defects were mine, and only one of them was visible on a screen.',
    body: [
      'The verdict chips printed their own shortcuts — Correct 1, Incorrect 2, Correct-but-risky 3 — and the handler had bound 2 to “correct, but risky” and 3 to “incorrect”. The cheatsheet printed a third arrangement. A reviewer who pressed the number written on the chip filed a different verdict on a conversation with money in it, and the screen showed the chip they had selected, so nothing looked wrong. The gap the two had drifted through was a specification that said “keys 1 2 3” without saying which key meant what.',
      'The second was worse and had no interface at all. A 1.4-second visit with a real click delivered zero events to the test collector. The tracker flushed on unload through sendBeacon with a JSON content type; a beacon to another origin needs a preflight it never makes, so the browser dropped it silently. In the dashboard the loss did not look like an error — it looked like data. A live session would have produced confident numbers about nothing: an under-counted funnel, an empty first click, short sessions that never happened.',
      'The third was a misreading of a requirement rather than a bug: seven of nineteen screens answered “access denied”, because a rule about which data a role may see — a region — had been built as a rule about which sections a role may open. It surfaced in the pass against the artboards, which examined 67 findings and closed all 67.',
    ],
  },

  decisions: {
    heading: 'Four decisions, and what each one cost.',
    items: [
      {
        decision:
          'The queue is ordered by money at risk, and a repeating cause sits above every single conversation.',
        why: 'Arrival order tells a reviewer nothing, and a red flag tells them no more — what they need is “someone promised €420 here”, in figures. Reviewers had already built a shadow filter of their own, and it produced a smaller pile rather than an expensive one. Clusters go on top because one review of an expired article protects seventeen conversations at once.',
        cost: 'Sorting by money buries the promises that carry none — a delivery date, a claim about what a plan covers — which reviewers put at roughly half the traffic. Those get a nominal exposure by type: an editorial judgement the product must keep defending, not a measurement.',
        artifact: {
          src: `${media}/cluster-detail.webp`,
          alt: 'Cluster detail: seventeen runs citing one expired article, $4,200 of exposure, and the full table of affected conversations with a remove control on each row',
          caption:
            'Seventeen conversations, one expired article, $4,200. The members stay visible and removable — a cluster nobody can inspect is a cluster nobody trusts.',
        },
      },
      {
        decision:
          'A gap in the trace is a missing record shown in four weights, never a guess about intent.',
        why: 'An empty evidence panel supports two opposite conclusions: the agent consulted nothing and invented the answer, or the vendor never returned that step. The first is the heaviest defect the product can find; the second means move on. Under one blank state a reviewer cannot tell them apart.',
        cost: 'Four visual weights instead of one empty state, each dependent on a vendor trace the product does not own. Where the vendor sends nothing, the console says so — an admission printed exactly where the reviewer wants an answer.',
        artifact: {
          src: `${media}/trace-gap-state.webp`,
          alt: 'Four trace states side by side: no gap, light gap, medium gap and heavy gap, each naming what is missing and what it means',
          caption:
            'Four weights of the same absence. “The agent skipped a lookup” and “the vendor returned no record” are different findings and must not share a state.',
        },
      },
      {
        decision:
          'A financial action is stopped before it executes, and the screen states what leaves the account and what the customer will read.',
        why: 'April cost $23,000 because the promise was in writing by the time anyone found it, so the interception has to sit before the money moves. The approver needs the amount, the policy that applied, the billing answer, the customer’s history and — literally — the sentence the customer is about to receive. Rejecting takes a reason from the same four classes a correction uses, so refusing is also how the product learns.',
        cost: 'A queue with a clock on it. Timers create their own pressure, and overdue items escalate into the shift handoff instead of quietly expiring. And a person now stands in the path of every payout — exactly the automation the client had bought.',
        artifact: {
          src: `${media}/consequence-preview.webp`,
          alt: 'Approval card with the amount, policy, billing answer and customer history, and two panels stating what leaves the account and what the customer will read',
          caption:
            'Both consequences on screen before the button is armed: what leaves the account, and the sentence the customer reads.',
        },
      },
      {
        decision:
          'Autonomy is granted one capability at a time, on accumulated evidence, and withdrawn automatically.',
        why: 'The client did not want another tool for saying no; they wanted the agent to safely do more over time. Splitting autonomy into capabilities — answer from the knowledge base, extend a trial, issue a credit, refund, change a plan — turns each promotion into a question with a numeric answer: runs, correction rate, severity-1 defects, a regression pass. Demotion needs no meeting: a severity-1 defect drops the level.',
        cost: 'Seven ladders whose evidence has to be kept, and a product that will say “not yet” for weeks. A capability with too few runs cannot be promoted however confident the room feels — which is the point, and the part nobody enjoys.',
        artifact: {
          src: `${media}/autonomy.webp`,
          alt: 'Autonomy ladder: seven capabilities from L0 forbidden to L4 on its own, each with its level, its evidence and whether it is ready to promote',
          caption:
            'Seven capabilities, five levels, and the evidence behind each current position. The banner on top is an automatic demotion, not a proposal.',
        },
      },
    ],
  },

  system: {
    heading: 'Forty-two components, built around the states where the risk actually lives.',
    body: [
      'The system carries 88 primitive and 70 semantic tokens, 17 text styles and 42 components with 331 declared variants. Nothing in the semantic layer is a pinned value: every token is an alias, defined separately in each of two modes. Dark is the working mode — a console for a shift, not a report — and light is mandatory rather than decorative, because the auditor role prints.',
      'Storybook renders every declared combination from the same React component the screens import, so the catalogue cannot quietly become a second implementation.',
      'The matrices below are the product under pressure rather than at rest: money that has to read as a figure and not as a colour, a metric that shows nothing rather than a stale number, an empty queue that separates “cleared” from “could not load”, a verdict that can be taken back, and a rollout step that is allowed to fail.',
    ],
    grid: [
      {
        src: `${media}/system-amount-figure.webp`,
        alt: 'Amount figure at three severities and three sizes, the sum always in figures beside a severity bar',
        component: 'AmountFigure',
        states: 'high · med · low × lg · 2xl · 4xl',
      },
      {
        src: `${media}/system-verdict-bar.webp`,
        alt: 'Verdict bar in four modes: verdict, correct-but-risky with a note, ask shift lead, and the undo window',
        component: 'VerdictBar',
        states: 'verdict · risky · ask shift lead · undo',
      },
      {
        src: `${media}/system-metric-row.webp`,
        alt: 'Metric row with a money value, a count value, and both no-data states naming the staleness',
        component: 'MetricRow',
        states: 'value · no data × money · count',
      },
      {
        src: `${media}/system-empty-state.webp`,
        alt: 'Empty state for a cleared queue, for nothing crossing the threshold, and for a queue that could not be loaded',
        component: 'EmptyState',
        states: 'resolved · nothing to review · no data',
      },
      {
        src: `${media}/system-autonomy-ladder.webp`,
        alt: 'Autonomy ladder row in its current, ready-to-promote and locked states',
        component: 'AutonomyLadder',
        states: 'current · ready to promote · locked',
      },
      {
        src: `${media}/system-trail-step.webp`,
        alt: 'Trail step horizontal and vertical, in done, current, pending and failed states',
        component: 'TrailStep',
        states: 'done · current · pending · failed × horizontal · vertical',
      },
    ],
  },

  result: {
    heading: 'What got solved, and what this case cannot claim.',
    statements: [
      {
        term: 'Solved',
        value:
          'The reviewable object changed from a message to a commitment, which turns an impossible requirement — read 1,770 conversations — into a small one: every refund, credit, plan change and promised date reaches a person, the rest is sampled by expected cost. Repeating causes are reviewed once, corrections carry a reason class and a visible route, financial actions are intercepted before they execute, and a policy is a versioned object with an author, a diff and an approval chain.',
      },
      {
        term: 'Built',
        value:
          'Thirty-five artboards scoped, eighteen built, and a clickable prototype of nineteen screens on twenty routes across three roles. Forty-two components and 331 variants sit on 88 primitive and 70 semantic tokens in two modes, with the same semantic names in Figma, the specifications, React and Storybook.',
      },
      {
        term: 'Verified',
        value:
          'The parity pass examined 67 findings against the artboards and closed all 67. A synthetic agent run failed 6 checks of 42 before the fixes and 0 of 41 after, with no regressions; it found the verdict-key defect and the telemetry loss. The prototype was then tested with users, reworked on the findings and accepted by the client.',
      },
      {
        term: 'What changed in how I work',
        value:
          'I stopped trusting a measurement layer I had not tried to break. The most expensive defect I shipped was invisible in the interface and looked like a result in the dashboard — and research that quietly under-reports is worse than no research, because it gets believed.',
      },
    ],
    nda: 'Every company, person, invoice and amount on the screens is invented. The build was the client’s, so this case claims no post-launch outcome — no reduction in losses, no change in deflection, CSAT or handling time. The 25.3 FTE and the 4% commitment rate are my estimates from the client’s figures, not measurements, and the synthetic agent run measures the prototype, not the design.',
  },

  outro: {
    heading: 'Oversight is only worth building if it ends in more autonomy, not less.',
    lead: 'Every screen above either shows a person what the agent did on their behalf, stops something expensive before it leaves, or accumulates the evidence for letting the agent do it alone.',
    cta: 'Get in touch',
    href: `mailto:${EMAIL}`,
  },
};
