# Кассеты формулировок

Заготовки, из которых письмо **собирается**, а не сочиняется с нуля: на сборку есть минуты, не полчаса (`market-data.md` §1). Каждая кассета — рыба, в которую подставляются существительные клиента. Кассета, вставленная без подстановки, нарушает пункт 9 гейта и вычёркивается.

Английский во всех формулировках — ASCII, тире обычные. Это та же дисциплина, что в `upwork/profile.md` §1: поля Upwork ругаются на спецсимволы, а разнобой тире в письме выдаёт копипаст из редактора.

---

## §1. Зачины — блок 2 письма

Правило одно: зачин называет **ограничение клиента**, а не мой бэкграунд. Существительное из его поста стоит в первых двенадцати словах. Ниже — по типу ограничения; берётся тот, что подходит вакансии, и переписывается их словами.

**Легаси, который нельзя трогать**
- `The part that makes this hard is not the new screens - it is that the [backend / data model / CRM] underneath is not going to change.`
- `You are redesigning on top of a system that already works and cannot be rewritten, which is a different job from designing from scratch.`

**Команда, которая не растёт**
- `Your [ops / support / dispatch] team is not going to double, so every extra click in this tool is a headcount problem.`
- `If the same three people keep running this after launch, the interface has to be learnable without a training call.`

**Данные, разложенные под базу, а не под человека**
- `Right now the [table / dashboard] shows what the database has, not what a [dispatcher / manager] needs in the first two seconds.`
- `Twelve columns is a database view. What your team needs is a decision view, and those are not the same screen.`

**Нельзя сломать живое**
- `Adding a page to a live Webflow site is mostly a question of what you do not touch: global classes, symbols, and the pages that share them.`
- `The risk here is not building the new section - it is the live site still working the morning after.`

**0 → 1, нужно показать, а не описать**
- `Investors will click, not read, so the thing that has to exist in [month] is a build they can open on a phone.`
- `Before the first screen is drawn, the question is which single flow proves the product works. Everything else is version two.`

**Есть дизайн, нужна сборка (полоса C)**
- `The designs are done, so the whole job is whether the build keeps the spacing, the breakpoints and the interactions the file promises.`

**Догоняющий зачин — если пост опубликован только что**
Допускается один короткий маркер немедленности перед основным предложением: `Just saw this - ` . Данные по площадке дают таким зачинам заметный плюс (`market-data.md` §2), но сам по себе он ничего не доказывает: существительное клиента всё равно обязано стоять следом.

**Зачин-вопрос.** Открывающий вопрос — самый сильный из измеренных приёмов (`market-data.md` §3). Работает, только если вопрос профессиональный и неудобный, а не риторический:
- `Is the status list fixed by the backend, or is that part of what you want changed?`
- `Do you want the ten screens you listed, or the three that carry the workflow and a plan for the rest?`

---

## §2. Строка ссылки — блок 3 письма

Ссылка выбирается по таблице «во что бить» в `.claude/skills/upwork-triage/references/evidence.md`. К ней — 5–12 слов, что она доказывает **применительно к их случаю**.

- `https://agent-ops-console.vercel.app - an oversight console for a support team: 19 screens, 3 roles, live and clickable. Paid client, tested and accepted.`
- `https://b2b-partner-portal-five.vercel.app/ - a distributor portal redesign that shipped in full on a backend that could not change.`
- `https://veterinary-clinic-gules.vercel.app/ - brief to a deployed prototype in two weeks: scheduling, records, invoices, down to tablet.`
- `https://pawly-fawn.vercel.app/app - 33 React components on a token-based design system, brief to audited prototype in 16 days.`
- `https://scrib3-prod.webflow.io/ - designed and built end to end: Client-First, CMS, GSAP, live in production.`

Две приписки, каждая закрывает частое возражение и стоит одной строки:

- Про Webflow-сборки: `I designed this site and built it - this was not a handoff from someone else's file.`
- Про NDA-кейсы: `The client is under NDA, so every screen there runs on fixture data.`

**Чего не делать со ссылками.** Не давать ссылку на профиль Upwork вместо работы. Не давать больше трёх. Не давать ссылку без строки смысла — голый URL читается как рассылка.

---

## §3. Что я сделаю здесь — блок 4 письма

Продаётся **порядок действий**, а не список услуг. Кассеты по полосам.

**A — продуктовая**
- `I would start with the states, not the layout: what a [role] must see first, what can wait behind a click, and what the API already returns so we do not design fields nobody can fill.`
- `IA and flows agreed with you before anything is drawn, then the design system, then the screens - so screen ten costs less than screen one.`
- `First pass would cut [their list] to the two flows that carry the work, with the rest scoped but not built.`

**B — дизайн + сборка**
- `Design system first, then the flow, then the deploy - you get a URL you can open on your phone rather than a file to hand to a developer.`
- `Every state built, not just the happy path: empty, loading, error, and the case where [their edge case] happens.`

**C — Webflow, лендинг**
- `I would duplicate the current page, add the [section] on page-specific classes, and check the result on desktop, tablet and 360 px before anything goes live.`
- `Client-First structure and a CMS your team can edit without me, so the next change does not need a freelancer.`

**D — аудит, точечное**
- `A pass over [N] screens against the flows your users actually run, written up as a list of findings ranked by what it costs you, not by severity labels.`

---

## §4. Снятие риска и границы — блок 5 письма

Две половины: чего не трону и чем защищён клиент.

**Граница по бэкенду — дословно, не переписывать**
`Backend, auth and payments are not mine - I work next to a backend developer rather than pretend otherwise.`

**Чего не трону**
- `Nothing on the existing page changes: new classes stay page-specific, shared symbols and global classes are left alone.`
- `I do not need write access to your repository - I hand over a deployed build and the source, and your developer merges on their terms.`

**Чем защищён клиент**
- `The screen list gets agreed before anything is drawn, which is what keeps revisions from turning into a second project.`
- `First milestone is small on purpose: you see the output before committing the rest.`
- `If it turns out the design needs work before it gets built, that is the same conversation and not a second contract.`

**Зачёт стоимости — только полоса D**
`If we go on to the redesign, the audit fee comes off the next stage.`

---

## §5. Запреты и чем заменять

| Не писать | Почему | Вместо |
|---|---|---|
| `I am passionate about` · `I would love to` · `I hope this message finds you` | Пустые строки, занимают превью | Их ограничение первой строкой |
| `Moreover` · `Furthermore` · `Delve` · `In today's fast-paced` | Формальные признаки генерации | Точка и новое предложение |
| Эмодзи в письме | В дизайн-откликах связаны с падением ответов (`market-data.md` §3) | Ничего. В overview профиля эмодзи допустимы, в письме нет |
| Буллет-списки | −32% в дизайн-категории | Сплошной текст. Буллеты — только если клиент сам перечислил пункты и надо ответить по ним |
| `Figma` · `Behance` · `branding` | Отрицательный лифт: слова-наполнители в этой нише | `a live URL you can click`, `the deployed build`, названия кейсов |
| `Loom` и запись экрана с лицом | −1.7 п.п.: клиент хочет результат, а не процесс | Живая ссылка. Шоурил на Vimeo — 🔴 не снят, см. SKILL.md Шаг 3 |
| `Full-Stack` | Обещание за границей доказуемого | `design, the design system and the front end` |
| `production app with live users` | Такого в матрице доказательств нет | `a working prototype on a live URL` |
| Цифры результатов DSSL | NDA | `the client is under NDA, the prototype linked here runs on fixture data` |
| Прямая речь пользователей Pawly | Интервью не было, ресёрч вторичный | Цифры сборки: 33 компонента, 16 дней, 71 закрытая находка |
| `I have attached my portfolio` | Вложение требует скачивания | Ссылка в теле письма |
| Ссылка на профиль Upwork вместо работы | Профиль клиент и так видит | Прототип |
| Пересказ вакансии в первом абзаце | Клиент её написал | Что из неё следует, но в ней не сказано |
| Тройки однородных членов в каждом абзаце | Ритм машинного текста | Одна тройка на письмо максимум |

---

## §6. Вопросы — блок 6 письма

Максимум два. Каждый — про решение, которое может принять только клиент, и с ответом в одну строку.

**Продуктовые**
- `Is the status list fixed by the backend, or can we change it?`
- `Is the API returning real data yet, or are we designing against a spec?`
- `How many [roles] use this at the same time, and do they see the same screen?`
- `Which of the [N] screens would you not ship without?`

**Сборка и сайт**
- `Do you have the design ready, or should that be part of the scope?`
- `Should this sit on its own slug, or replace the current page?`
- `Is the CMS meant for your team to edit after launch, or is the content static?`

**Про объём и деньги — только один, и только если бюджет не назван**
- `Is the $[X] budget for the first version, or for the whole thing as you described it?`

**Не задавать:** «какой у вас дедлайн», «какой бюджет» при названном бюджете, «расскажите подробнее о проекте», всё, ответ на что есть в посте. Такой вопрос доказывает, что пост не прочитан, — ровно наоборот задаче блока 2.

---

## §7. Финалы — блок 7 письма

Цифра, срок, один шаг. Суммы — по лестнице `upwork/profile.md` §9 и тирам `upwork/project-catalog.md`, не по ощущению.

- `First milestone: [the one flow], [N] days, $[X] - so you can see the output before committing the rest.`
- `[N] working days from access, $[X] fixed.`
- `Two milestones: structure and desktop first at $[X], then responsive, CMS and launch polish at $[Y].`
- `Happy to start with one screen as a fixed milestone, so you can judge the output before the rest.`

**Созвон — только при мутном объёме:** `If it is easier, fifteen minutes on a call and I will come back with a scope and a number the same day.` Для мелкой задачи созвон не предлагается: он добавляет шаг там, где клиент готов начать.

**Подпись — `Nikita`.** Без фамилии, без должности, без ссылки на сайт под именем.
