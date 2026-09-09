# Собранные письма

Четыре примера: три по полосам и один разбор — как переписывается письмо, написанное по прежней инструкции. Вакансии в §1–§2 условные, в §3 — реальная из переписки июля 2026. Цифры кейсов настоящие, из `.claude/skills/upwork-triage/references/evidence.md`.

Примеры — **эталон пропорций, а не заготовки для вставки**. Предложение, перенесённое отсюда дословно, нарушает пункт 9 гейта.

---

## §1. Полоса A — продуктовая

**Вакансия.** Логистический стартап, внутренняя панель диспетчера. Бэкенд есть, менять его не будут. Fixed $1500, Intermediate, 20–50 откликов. Письмо — 168 слов.

```
Hi Marta,

Your dispatchers are reading six statuses off a table that was built for the database, not for them - that is the part I would fix first.

Closest thing I have built: https://agent-ops-console.vercel.app - an oversight console for a support team, 19 screens, 3 roles, live and clickable. Paid client, tested and accepted.

For your board I would start with the states rather than the layout: what a dispatcher has to see in the first two seconds, what can wait behind a click, and what the API already returns so we do not design fields nobody can fill. Flows agreed with you before anything is drawn, then the design system, then the screens.

Backend, auth and payments are not mine - I work next to a backend developer rather than pretend otherwise.

Is the status list fixed by the backend, or is that part of what you want changed?

First milestone: the dispatch flow, 5 days, $600. You see the output before committing the rest.

Nikita
```

**Что где.** Зачин называет то, чего в посте нет дословно, но что из него следует — таблица собрана под базу. Ссылка во второй строке. Механика — порядок, а не список. Граница дословная. Один вопрос, и он неудобный: ответ на него меняет объём. Финал — $600 из $1500, это 40%, низ ступени «Базовый».

**Форма.** Fixed $1500 · milestone 1: dispatch flow, 5 дней, $600 · milestone 2: остальные экраны и ДС, $900 · duration 1–2 недели · highlights: Agent Ops Console, B2B Partner Portal, Pawly · вложений нет.

---

## §2. Полоса B — дизайн + сборка

**Вакансия.** Основатель, MVP веб-приложения, API уже есть, нужен человек «who can design and build». Hourly, до 30 ч/нед. Письмо — 178 слов, верх диапазона.

```
Hi Daniel,

You want one person to design it and then actually build it, and most of the replies here will be from people who do one half and hand over a file.

Live right now: https://pawly-fawn.vercel.app/app - 33 React components on a token-based design system, brief to audited prototype in 16 days. And https://agent-ops-console.vercel.app, a B2B oversight console: paid client, 19 screens, three roles.

For a first version I would cut the scope to the one flow that proves the product works, build the design system before the screens so the tenth costs less than the first, and deploy it to a URL you can open on a phone and send around.

Scope boundary up front: design, the design system and the front end on your existing API. Backend, auth and payments are not mine - I work next to a backend developer rather than pretend otherwise.

Is the API returning real data yet, or are we designing against a spec?

Happy to start with one flow as a fixed milestone - $900, 7 days - before anything hourly.

Nikita
```

**Что где.** Зачин называет расклад в его почте, а не мой опыт: он получит сорок откликов от половинок. Две ссылки, обе в блоке доказательств, третьей нет. «Cut the scope» — профессиональное суждение, не услуга. Финал переводит hourly на fixed первый кусок: при нулевой истории клиенту так безопаснее, а мне не нужен трекер на неопределённый объём.

**Форма.** Ставка $30.00/hr · в письме предложен fixed-пилот $900 / 7 дней (карточка 3 Starter) · highlights: Pawly, Agent Ops Console, B2B Partner Portal · вложений нет.

---

## §3. Полоса C — Webflow, и что изменилось против прежнего письма

**Вакансия.** Реальная, июль 2026: дублировать лендинг на живом Webflow-сайте, добавить видео-секцию под хедером. Прежнее письмо — 117 слов, новое — 150.

### Как было написано по прежней инструкции

```
Hi Ohad,
My UX/UI background helps me work carefully with existing Webflow pages: I can duplicate the landing page, keep the design consistent, and add the video section without affecting shared components or global classes.
For your task, I would duplicate the current page, add the video player under the header, and test the new page across desktop and mobile.
Relevant Webflow examples:
https://scrib3-prod.webflow.io
https://synk-battle-prod.webflow.io
https://bloomblex-prod.webflow.io
To keep the live site safe, I would avoid editing shared classes directly and create page-specific classes where needed.
Do you already have the video file/embed link ready?
Should the new page use a separate URL slug?
I can complete this within 24-48 hours, depending on the video setup.
Best,
Nikita
```

Механика тут вся правильная — риск назван, вопросы по делу, срок есть. Ломается оно в трёх местах, и все три видны сразу:

1. **Первая строка про себя.** `My UX/UI background helps me...` — то же самое стояло в письме следующему клиенту и в письме после него. В превью списка видны две первые строки; клиент увидел ровно то, что видел у остальных.
2. **Ссылки на четвёртой строке пачкой**, без единого слова, что каждая доказывает. До них дочитывают, только если сработало превью, а превью занято бэкграундом.
3. **Финал без денег.** `Within 24-48 hours` — это срок, но не предложение. Клиент дальше сам должен придумать сумму.

### Как пишется сейчас

```
Hi Ohad,

Adding a page to a live Webflow site is mostly a question of what you do not touch: global classes, symbols, and the pages that share them.

https://scrib3-prod.webflow.io/ - designed and built end to end, Client-First, GSAP, live in production. I designed this site and built it, it was not a handoff from someone else's file.

For your page I would duplicate the current landing, put the video block under the header on page-specific classes, and check the result on desktop, tablet and 360 px before anything goes live. Nothing on the existing page changes.

Two things worth confirming: do you have the embed link ready, and should the new page sit on its own slug?

Five working days from access, $450 fixed, one payment. If it turns out the design needs work before it gets built, that is the same conversation and not a second contract.

Nikita
```

**Что изменилось по счёту.** Первая строка перестала быть про меня. Ссылка переехала во вторую строку и получила смысл. Ссылок стало одна вместо трёх: задача одностраничная, три Webflow-ссылки на неё — перебор, который читается как рассылка. Появилась цифра. Ушли `Best,` и перечисление. Вопросов осталось два, и они слиты в одну строку, чтобы не выглядеть анкетой.

**Про цену.** $450 за дубль страницы — это тир Starter карточки 4 (`upwork/project-catalog.md`), и он же выше пола $400. Прежний профиль на $15/ч закрыл бы ту же работу за $120. Это и есть разница позиционирования, а не наглость: клиент платит за то, что живой сайт не сломается.

**Форма.** Fixed $450 · один платёж по проекту (объём меньше $500 и недели) · duration меньше недели · highlights: SCRIB3, SYNK, Bloomlex · вложений нет.

---

## §4. Ответы на screening questions

Клиент читает их **раньше** письма. Ответ самостоятельный, 40–80 слов, со своей ссылкой, не дублирует абзацы письма.

**`Describe your recent experience with similar projects`**

```
Three recent ones. An oversight console for a support team - 19 screens, three roles, a design system underneath, taken from research to a prototype the client tested and accepted: https://agent-ops-console.vercel.app. A distributor portal redesign that shipped on a backend that could not be changed. And a scheduling and records system for a veterinary clinic, brief to deployed prototype in two weeks. All three are live URLs you can click through rather than case study slides.
```

**`Include a link to your GitHub profile and/or website`**

```
Site: https://kanarev.com - built by me in Astro, with the three product cases written up in full.

The work itself is easier to judge running: https://agent-ops-console.vercel.app and https://pawly-fawn.vercel.app/app are deployed prototypes, every state built. The client projects are under NDA, so those two run on fixture data - the code and the design system are mine either way.
```

Пустого ответа и `N/A` не бывает: вопрос — единственное место в форме, где клиент попросил что-то лично, и молчание там видно.

**`What is your experience with [конкретный инструмент]?`** — отвечать прямо и коротко, включая «не работал». Честное «not yet, here is the closest thing» бьёт натянутое «yes, extensively»: второе проверяется на первом же созвоне.

**`Why are you a good fit for this project?`** — не пересказывать письмо. Взять один аспект, которого в письме нет: близость домена, скорость, опыт работы рядом с бэкенд-разработчиком, конкретный сложный экран, который уже делался.

---

## §5. LinkedIn и почта

Та же архитектура, вдвое короче, без цены. Цель — разрешение прислать разбор, а не контракт.

```
Hi Ohad,

Saw you are running the site on Webflow. The thing I usually get called for is the part after the design: keeping a live site intact while pages get added - page-specific classes, no edits to shared symbols, checked down to 360 px.

One I designed and built end to end: https://scrib3-prod.webflow.io/

Would it be useful if I sent a short note on how I would approach the page you are adding?
```

Правила канала: одна ссылка · ни суммы, ни срока · финал — вопрос-разрешение · подпись именем или без подписи вовсе, если платформа её и так показывает.

🔴 Профиль LinkedIn сейчас собран под найм, не под клиентов (`linkedin/after-state.md`): пришедший по такому сообщению откроет профиль соискателя. Пока это так — канал второй, а не первый.
