# Project Catalog — карточки услуг под копипаст

> Заведён 2026-09-01. Трек — `PLAYBOOK-upwork-positioning.md`, Чат D.
> Профиль: https://www.upwork.com/freelancers/nikitakanarev
> Раздел каталога: `Find work → Project Catalog → Manage projects → Create project`.
>
> **Этот файл разворачивает §10 `upwork/profile.md`.** Там было решение — «одна
> карточка, UX-аудит, три тира». Здесь оно расширено до **четырёх карточек** и
> доведено до полей формы. Если формулировка в `profile.md` §10 расходится с
> этим файлом — прав этот файл, `profile.md` §10 помечен ссылкой сюда.
>
> Конструкция позиционирования — плейбук §4 — не переоткрывается. Каталог
> продаёт **ту же** услугу, что и профиль, нарезанную на покупаемые куски.
>
> **[факт]** — подтверждено справкой Upwork, снимком аккаунта или репозиторием.
> **[оценка]** — вывод, действует пока не оспорен.
> **[проверить]** — требует данных из формы. Не публиковать не проверив.

---

## 0. Почему каталог сейчас, а не после первого отзыва

Три причины, каждая проверяемая.

**1. Каталог — единственный канал, который не упирается в нулевой JSS.** Карточки
живут в отдельном каталожном поиске и продают **готовый объём работ**, а не
историю исполнителя. Клиент покупает пакет, а не резюме. Это уже зафиксировано
ревизией 3 `profile.md` §10; здесь ничего не меняется.

**2. Каталог не тратит connects.** Заказ приходит без отклика — это прямой ответ
на 🔴-раздел «Экономика connects» (`profile.md` §10): при 15–20 откликах в неделю
докупка connects выходит в $75–105/мес **[оценка]**, а карточка каталога стоит
ноль и работает круглосуточно **[факт]**.

**3. Публикация бесплатна, а очередь модерации длинная.** Карточка проходит
ревью Upwork до публикации: у Top Rated и выше — около двух рабочих дней, у
остальных **процесс может занять несколько недель** **[факт, справка Upwork]**.
Значит очередь надо занимать сейчас, а не после первого отзыва: ждать всё равно
придётся, и ждать лучше параллельно спринту откликов. Одновременно в ревью
допускается до 20 карточек, опубликованных — тоже до 20 **[факт]**.

**Чего каталог не сделает.** Органический трафик к карточке набирается
**4–8 недель**, и первые продажи почти всегда приходят не из поиска, а из двух
мест: клиент, пришедший по отклику, покупает пакет из каталога вместо кастомного
контракта; либо карточку присылают ссылкой сами **[оценка, вторичный источник]**.
Поэтому каталог не заменяет спринт откликов, а снимает с него часть работы:
ссылку на карточку можно вставлять в cover letter вместо описания объёма.

---

## 1. Механика формы — что спрашивают и какие лимиты

Сводка по полям. Всё, что помечено **[проверить]**, снимается при первом открытии
формы: справка Upwork лимиты не публикует, цифры взяты из вторичных источников и
из практики других карточек.

| Поле формы | Лимит / формат | Статус |
|---|---|---|
| `Project title` | **75 знаков, включая обязательный префикс `You will get `** (13 знаков). На свой текст остаётся ~62 | **[оценка]**, вторичный источник |
| `Category` | одна из категорий каталога; определяет набор тиров и попадание в браузинг | **[факт]** |
| `Description` | **1 200 знаков** | **[оценка]** |
| `Tiers` | до трёх: `Starter` / `Standard` / `Advanced`. Давать все три необязательно | **[факт]** |
| `Price` | от $5 до $500 000 за тир | **[факт]** |
| `Delivery time` | срок на тир; участвует в фильтрах покупателя | **[факт]** |
| `Revisions` | число правок на тир | **[факт]** |
| `Add-ons` | предустановленные и свои: ускоренная доставка, лишняя правка, доп. объём | **[факт]** |
| `Work steps` (project steps) | минимум один шаг. Попадают в таймлайн заказа и отмечаются галочками по ходу работы | **[факт]** |
| `FAQ` | опционально, вопрос-ответ, видно **до** покупки | **[факт]** |
| `Project requirements` | что клиент обязан прислать. Типы полей: текст, выбор из вариантов, загрузка файла. Помечаются `mandatory` / `optional` | **[факт]** |
| `Gallery` | до **20 изображений** и **одно видео**. Рекомендованный размер 1000×750 (4:3), минимум 400×300, до 10 МБ, JPG/PNG. Видео ≤ 60 с, потолок 90 с | **[факт]** |
| PDF work samples | принимаются как образец работы | **[факт]** |
| `Concurrent projects` | сколько заказов берёшь одновременно, до 20 | **[факт]** |

**Три вещи, которые форма делает за тебя, и их не надо писать в шаги:** приём
требований от клиента, показ работы на ревью и приёмку. Они встроены в контракт
каталога **[факт]**.

**Часы клиента.** На обязательные требования у клиента **48 часов**, и **срок
доставки начинает течь с момента, когда он их прислал**, а не с оплаты
**[факт]**. Это меняет смысл поля `requirements`: чем оно строже, тем позже
включается таймер. Поэтому во всех четырёх карточках ниже обязательных пунктов
ровно столько, сколько нужно, чтобы начать.

**Что ранжирует карточку** **[оценка, gigradar]**, по убыванию веса: совпадение
заголовка с намерением поиска → повторение тех же слов в тегах и в первых
~160 знаках описания → CTR из показов → конверсия из клика в покупку → язык
отзывов → удовлетворённость покупателя. Отдельно: **неверная категория ставит
потолок видимости, который не пробивается ни заголовком, ни тегами** — и это же
одна из частых причин отказа модерации **[оценка]**.

**Что можно править после публикации.** Описание, состав тиров, медиа и add-ons —
можно; часть правок отправляет карточку на повторное ревью **[факт]**. Видимость
выключается в один клик, есть потолок активных заказов, и заказ можно отменить в
первые 24 часа без удара по JSS **[факт]**.

---

## 2. Набор карточек: четыре, публикуются одной пачкой

Не одна, как было в `profile.md` §10, и не двадцать. Четыре — потому что ровно
столько разных **покупательских намерений** закрывается тем, что уже доказано
кейсами, и потому что ревью всё равно идёт неделями: пачка занимает очередь один
раз.

| # | Карточка | Роль в воронке | Цена входа | Чем доказана |
|---|---|---|---|---|
| 1 | **UX audit** | 🎣 Трипваер. Дешёвая проба исполнителя без обязательств, с зачётом стоимости в редизайн | $150 | Скилл `ux-audit`, 10 эвристик Нильсена; агентские QA-прогоны по Pawly (71 находка) и B2B Partner Portal (35 прогонов, 7 дефектов) |
| 2 | **Dashboard / admin UI design в Figma** | 💰 Ядро. Самая частотная формулировка запроса в нише | $450 | Agent Ops Console, Vet Clinic OS, B2B Partner Portal |
| 3 | **Design + React build на живом URL** | 🎯 Дифференциатор. Ровно то, чего нет у конкурентов полосы | $900 | Четыре кейса, каждый открывается живой сборкой |
| 4 | **Webflow landing: design + build** | ⚡ Оборот. Короткий цикл, покупает первые отзывы | $450 | SCRIB3, SYNK, Bloomlex, Common — четыре сайта в продакшене |

**Почему Webflow остаётся, хотя профиль от него уходил.** Уходил профиль — от
позиции «Webflow-разработчик по чужому макету». Карточка каталога позицию не
задаёт: она продаёт отдельный пакет и не переименовывает исполнителя. При этом
`Figma to Webflow` — самый частотный запрос из всех, куда мы вообще попадаем, и
отказываться от него в канале, который не стоит connects, нечем оправдать. Тонкая
настройка: **этот запрос забирает только тир Starter**, а Standard и Advanced
продают дизайн вместе со сборкой. Клиент входит по знакомому слову и выходит на
нашу услугу.

**Чего в наборе нет и почему.** Консалтинг, стратегия, «дизайн-партнёр на месяц»,
ретейнеры — в каталоге не конвертируются: он устроен под пакет с границей
**[оценка]**. Дизайн-система отдельной карточкой — тоже нет: она входит в тиры
карточек 2 и 3, а как самостоятельная покупка требует зрелости клиента, которой у
входящего трафика каталога нет. Кандидаты в пятую-шестую карточку — после первых
трёх отзывов, список в §12.

---

## 3. Цены: откуда взялись цифры

Лестница `profile.md` §9 не отменяется — каталог кладётся на неё сверху.

| Ступень §9 | Цена §9 | Кто закрывает в каталоге |
|---|---|---|
| Пробный | $150–250 | Карточка 1, тир Starter ($150) |
| Базовый | $400–900 | Карточка 1 Standard/Advanced, карточка 2 Starter/Standard, карточка 4 Starter/Standard |
| Со сборкой | $900–2000 | Карточка 3 Starter/Standard, карточка 2 Advanced |
| Webflow | $500–1500 | Карточка 4 Standard/Advanced |

**Порог $400 из overview на каталог не распространяется** — как и у Saad S.,
чей overview отказывается от проектов дешевле $1 000, а каталог стартует со $100
(`competitive-analysis.md` §3, находка 12). Пол действует на кастомные контракты.
Если клиент спросит про расхождение — ответ стоит в FAQ карточки 1.

**Три правила, по которым расставлены цифры:**

1. **Средний тир должен выигрывать.** Он и конвертирует чаще всего, поэтому
   Standard везде даёт заметно больше объёма за примерно вдвое большие деньги, а
   Advanced стоит вдвое от Standard и добавляет то, что дорого в часах: сборку,
   дизайн-систему, QA-прогон, созвон.
2. **Не демпинговать.** Цена ниже собственного часа притягивает клиентов,
   торгующихся до диспута **[оценка]**. Все тиры пересчитаны в часы по $30/час
   из §2 профиля и сходятся: $950 за 8 экранов ≈ 30 часов, $3 600 за сборку
   ≈ 120 часов, то есть три недели — ровно срок Vet Clinic OS (2 недели) и
   Pawly (16 дней).
3. **Сроки — с запасом.** Стабильно выдержанные 5 дней сильнее регулярно
   сорванных 24 часов: срыв бьёт по рейтингу сразу **[факт]**, а рейтинга у нас
   пока нет вовсе. Все сроки ниже — верхняя оценка, не нижняя.

---

## 4. Карточка 1 — UX audit 🎣

**Роль:** трипваер. Самая дешёвая точка входа, дальше зачёт стоимости в редизайн.

### 4.1 Title — 74 знака с префиксом

```
a UX audit of your SaaS dashboard with fixes ranked by impact
```

Форма подставит `You will get ` сама. Полная строка — `You will get a UX audit of
your SaaS dashboard with fixes ranked by impact`, 74 из 75.

Голова — `UX audit`, то, чем клиент набирает запрос. Середина — `SaaS dashboard`,
наша ниша. Хвост — `ranked by impact`: он отличает нас от полосы «пришлю список
проблем», потому что называет то, что клиент на самом деле покупает — порядок
работ, а не перечень.

**Запасной вариант**, если модерация заругается на длину или формулировку:
`a UX audit of your SaaS dashboard, admin panel or web app` (70).

### 4.2 Category

`Design & Creative → UX/UI Design` **[проверить]** — если в каталоге есть
отдельная ветка `UX Research`/`Usability Testing`, брать **не** её: наш артефакт
— аудит интерфейса, а не исследование пользователей, и неверная ветка ставит
потолок видимости (§1).

### 4.3 Description — 1 144 знака

```
A usability audit of a SaaS product, dashboard or admin panel, run against the 10 Nielsen heuristics by a product designer who also builds front ends - so every fix I propose is one your developers can actually ship.

WHAT YOU GET
- A written report: every finding with a severity, an annotated screenshot and the heuristic it breaks
- Findings ranked by impact against effort, so you know what to fix first and what to leave alone
- A concrete fix for each finding, in words your team can build from - not "improve the UX"
- Advanced tier: your key screens redrawn in Figma, plus a 45-minute call to walk you through it

WHY ME
I design B2B SaaS products and build the front end myself: dashboards, admin panels and internal tools. Every project in my portfolio below opens as a live build you can click, not a slide deck. The audit is written by someone who has shipped the kind of screen you are asking about.

If we go on to the redesign, the audit fee comes off the next stage.

Send me the URL or the Figma file and tell me who uses it and what they are trying to do. If your product does not fit this audit, I will say so before you buy.
```

Первые 160 знаков — индексируемое окно (§1) — доносят `usability audit`,
`SaaS`, `dashboard`, `admin panel`, `Nielsen heuristics` и дифференциатор
`also builds front ends`. Ни одного слова не потрачено на приветствие.

Строка про зачёт стоимости — приём Kiryl H., внесён ревизией 4 `profile.md` §10.
Последний абзац — фильтр: отказ до покупки дешевле возврата после.

### 4.4 Тиры

| | **Starter** | **Standard** | **Advanced** |
|---|---|---|---|
| Цена | **$150** | **$400** | **$900** |
| Срок | 3 дня | 5 дней | 7 дней |
| Объём | до 5 экранов или 1 флоу | до 15 экранов или 3 флоу | до 25 экранов или 5 флоу |
| Отчёт по 10 эвристикам | ✓ | ✓ | ✓ |
| Severity у каждой находки | ✓ | ✓ | ✓ |
| Размеченные скриншоты | ✓ | ✓ | ✓ |
| Приоритизация impact × effort | — | ✓ | ✓ |
| Решение текстом на каждую находку | — | ✓ | ✓ |
| Ключевые экраны, перерисованные в Figma | — | — | ✓ (до 3 экранов) |
| Созвон 45 минут | — | — | ✓ |
| Правки | 1 | 1 | 2 |

Правка у аудита — это уточнение отчёта, а не переделка: так и написано в FAQ.

### 4.5 Add-ons

| Add-on | Цена | Зачем |
|---|---|---|
| Extra-fast delivery (срок пополам) | +$75 / +$150 / +$300 | Предустановленный аддон площадки, берут чаще прочих |
| Additional 5 screens | +$120 | Самый частый выход за объём |
| 45-minute walkthrough call | +$90 | Есть в Advanced, продаётся к младшим тирам |
| Key screens redrawn in Figma (up to 3) | +$450 | Мост из Standard в Advanced |
| Accessibility pass (contrast, keyboard, focus order) | +$180 | Отдельная проверка, у нас она отработана в ДС |

### 4.6 Work steps

```
1. Walkthrough. I go through the product as a new user on the flows you named, recording what I see before I know how it is meant to work.
2. Heuristic pass. I go back over every screen against the 10 usability heuristics and write up each finding with a severity and an annotated screenshot.
3. Ranking. I score the findings by impact against effort and put them in the order I would fix them.
4. Report. You get the written report, plus the redrawn screens and the call if your tier includes them.
```

### 4.7 FAQ

```
Q: What exactly do I receive at the end?
A: A written report as a PDF. Every finding has a severity, an annotated screenshot, the heuristic it breaks and - from the Standard tier up - a concrete fix and its position in the fix order. No slide deck, no video essay.

Q: Do you need access to our product?
A: A live URL is best, with a test account if the screens are behind a login. A Figma file works too, and so does a screen recording. If none of that is possible, message me before buying and we will find a way.

Q: How is this different from a free audit or an AI-generated one?
A: I run the flows as a user before I score them, and I only propose fixes I would be able to build myself. That is the difference between "your empty state is weak" and a described empty state your developer can ship on Monday.

Q: Your profile says you do not take projects under $400. Why is this $150?
A: The floor applies to custom contracts, where scoping, calls and revisions live. This audit is a fixed package with a fixed scope, so it costs what it costs.

Q: What if we want you to fix what the audit found?
A: Then the audit fee comes off the next stage. I design the redesign and, if you want it, build the front end - there are separate projects for both on my profile.

Q: Do you sign an NDA?
A: Yes, and most of my work is under one already. Nothing from your product appears in my portfolio without written permission.
```

### 4.8 Project requirements

| Пункт | Тип | Обязательный |
|---|---|---|
| The URL of the product, or the Figma file. If it is behind a login, add test credentials | текст | **да** |
| Who uses this product, and what are they trying to get done? | текст | **да** |
| Which screens or flows should I audit? List them, or say "you choose" and I will pick the ones that carry the most traffic | текст | **да** |
| Are there constraints I should know about - a data model you cannot change, a framework you are locked into, a release date? | текст | нет |
| Anything you already suspect is wrong | текст | нет |
| Brand or design guidelines, if you have them | файл | нет |

Три обязательных — минимум, при котором можно начать. Каждый лишний обязательный
пункт откладывает старт таймера (§1) и повышает шанс, что клиент не пришлёт
вовремя.

### 4.9 Галерея

🔴 **Единственная карточка, у которой медиа ещё нет.** Разбор и план съёмки —
§8.2. До того как кадры готовы, карточка не публикуется: аудит продаётся видом
отчёта, а не описанием отчёта.

### 4.10 Concurrent projects

**3.** Аудит не блокирует руки надолго, и это карточка, по которой ожидается
первый заказ.

---

## 5. Карточка 2 — Dashboard / admin UI design в Figma 💰

**Роль:** ядро. Самая частотная формулировка запроса в нише — «нужен дизайн
дашборда».

### 5.1 Title — 72 знака с префиксом

```
a SaaS dashboard, admin panel or web app UI design in Figma
```

Три существительных подряд — не украшение: `dashboard`, `admin panel` и
`web app` это три разных запроса, которыми клиенты называют одну и ту же работу,
и в каталожном поиске они не синонимизируются. `in Figma` на хвосте забирает
запросы с названием инструмента.

**Запасной вариант** (короче, если форма отдаёт меньше знаков):
`a SaaS dashboard and admin panel UI design in Figma` (64).

### 5.2 Category

`Design & Creative → Web & Mobile Design` **[проверить]**. Если в каталоге есть
отдельная ветка `Dashboard Design` — брать её: браузинг-страница
`upwork.com/services/browse/dashboard-design` существует **[факт]**, значит
категория в дереве тоже есть.

### 5.3 Description — 1 099 знаков

```
UI and UX design for B2B SaaS: dashboards, admin panels, internal tools and web apps. Screens that survive real data - forty-column tables, empty states, permissions, errors - not three pretty frames that fall apart in week two.

WHAT YOU GET
- Hi-fi screens in Figma, designed on realistic data, responsive down to 360 px
- Every state built, not just the happy path: loading, empty, error, permission, long content
- A design system underneath - tokens, components and states - so the tenth screen costs less than the first
- The Figma source file with named components and text styles, yours to keep and hand to any developer
- A clickable prototype you can put in front of users or investors

WHY ME
3+ years in product design, two and a half of them in-house on B2B products, working next to frontend, backend and QA. I build front ends in React myself, so what I hand over is buildable: my handoff is not a file full of open questions.

Tell me what the product does, who is on the other side of the screen and what your API already returns. I will come back with a screen list before you buy.
```

**Исходник Figma отдаётся во всех тирах, а не продаётся аддоном.** В полосе его
принято придерживать; для дизайнера, который продаёт систему, а не картинки, это
работает наоборот — отданный файл с именованными компонентами и есть
доказательство, что система существует.

### 5.4 Тиры

| | **Starter** | **Standard** | **Advanced** |
|---|---|---|---|
| Цена | **$450** | **$950** | **$1 900** |
| Срок | 4 дня | 8 дней | 14 дней |
| Экранов | до 3 | до 8 | до 16 |
| Hi-fi макеты на реалистичных данных | ✓ | ✓ | ✓ |
| Все состояния: loading, empty, error, permissions | ✓ | ✓ | ✓ |
| Исходник Figma с компонентами и текстовыми стилями | ✓ | ✓ | ✓ |
| Адаптив до 360 px | — | ✓ | ✓ |
| Дизайн-система: токены и компоненты | — | ✓ | ✓ |
| Кликабельный прототип | — | ✓ | ✓ |
| Документация ДС: правила применения и матрицы вариантов | — | — | ✓ |
| Созвон-передача 45 минут | — | — | ✓ |
| Правки | 2 | 3 | 4 |

### 5.5 Add-ons

| Add-on | Цена | Зачем |
|---|---|---|
| Extra-fast delivery | +$225 / +$475 / +$950 | Предустановленный аддон площадки |
| Additional screen | +$120 | Самый частый выход за объём |
| Mobile layouts for the delivered screens | +$350 | Спрашивают почти всегда |
| Design system documentation | +$400 | Мост из Standard в Advanced |
| Front-end build of the delivered screens | цена по объёму | Ссылка на карточку 3 — так каталог продаёт вверх |

### 5.6 Work steps

```
1. Framing. I read your brief and pin down the constraints: what the system already does, what cannot change, who is on the other side of the screen. You get a screen list to approve before I draw anything.
2. Structure. I lay out the information architecture and the key flows, so we agree on what goes where before pixels are involved.
3. Design system first. Tokens, components and their states come before screens - that is why the tenth screen costs less than the first.
4. Screens. Hi-fi designs on realistic data, every state built, responsive where your tier includes it.
5. Handover. The Figma source file with named components and text styles, plus the prototype and the walkthrough call if your tier includes them.
```

### 5.7 FAQ

```
Q: What do I get at the end - and can my developer build from it?
A: The Figma source file, with named components, text styles and every state drawn. That is the point of it: I build front ends myself, so I know what a developer needs and what makes them come back with questions.

Q: What counts as one screen?
A: One distinct view. A table and the detail drawer that opens from it are two. The same screen in loading, empty and error states is one - states are included, not counted.

Q: I do not have a brief, just a problem. Is that a fit?
A: Yes, and it is the better starting point. Tell me what your users are trying to get done and what your system already returns. I will come back with a screen list, and that list becomes the scope.

Q: Can you work inside our existing design system?
A: Yes. Send the Figma library and I will design on your components and extend them where something is missing, rather than inventing a second visual language next to yours.

Q: Do you also build the front end?
A: Yes - that is a separate project on my profile: design plus a React front end deployed to a live URL. If you know from the start that you want both, buy that one instead of this.

Q: What about backend, auth or payments?
A: Not mine. I design the product and build the front end, integrating with an API you already have, alongside your backend developer.
```

### 5.8 Project requirements

| Пункт | Тип | Обязательный |
|---|---|---|
| What does the product do, and who uses it? | текст | **да** |
| Which screens do you need? List them, or describe the job the user has to get done and I will propose the list | текст | **да** |
| Is there an existing product, design or design system I should work from? Add the link or the file | текст + файл | **да** |
| What does your API already return, or what data will these screens show? | текст | нет |
| Brand assets: logo, colours, fonts | файл | нет |
| Which devices matter? (desktop only / desktop + tablet / desktop + mobile) | выбор | нет |

### 5.9 Галерея — 12 кадров, одиннадцать готовы

Из готовых пакетов `upwork/projects/*`. Порядок задаёт первый экран карточки:
сначала то, что клиент покупает, потом доказательства.

| # | Файл | Что показывает |
|---|---|---|
| 1 | обложка 4:3, собрать (см. §8.1) | Три экрана дашборда коллажем — обложка карточки |
| 2–4 | `agent-ops-console/01–03.png` | Консоль надзора: ключевой экран, разбор, состояние |
| 5–7 | `vet-clinic-os/02–04.png` | Операционная система клиники: другой продукт, тот же уровень |
| 8–9 | `b2b-partner-portal/01–02.png` | Пара before/after — единственный кейс, где «до» очищено к публикации |
| 10 | `agent-ops-console/13.png` | Матрица вариантов кнопки: 4 варианта × 3 размера × 5 состояний, 60 ячеек |
| 11 | `pawly/09.png` | Матрица компонента в Storybook |
| 12 | `vet-clinic-os/01.png` | Один день клиники на 1440, 768 и 390 px |

🔴 **Ограничение по кадрам B2B Partner Portal держится**: публикуются только
`01.png` и `02.png`, остальные девять кадров старого портала не идут никуда —
там живые артикулы, склады и суммы (`upwork/projects/b2b-partner-portal/README.md`).

### 5.10 Concurrent projects

**2.**

---

## 6. Карточка 3 — Design + React build на живом URL 🎯

**Роль:** дифференциатор. Ровно та услуга, которой нет ни у одного конкурента
полосы из `competitive-analysis.md`, и ровно то, что обещает overview.

### 6.1 Title — 71 знак с префиксом

```
a SaaS dashboard designed and built in React on a live URL
```

`designed and built` — вся конструкция позиционирования в двух словах.
`on a live URL` отвечает на вопрос «что я получу» раньше, чем клиент откроет
карточку.

**Запасной вариант:** `a SaaS dashboard designed and coded in React, live on a URL` (72).

### 6.2 Category

`Web, Mobile & Software Dev → Web Development` **[проверить]**, если каталог
пускает туда дизайнерский профиль. Иначе — та же ветка, что у карточки 2.
Категорию выбирать по **тому, что покупают** (работающая сборка), а не по тому,
кем себя называет исполнитель.

### 6.3 Description — 1 111 знаков

```
One person designs the product and builds the front end, so nothing is lost in the handoff. You get a working app on a live URL, open it on any device - not a Figma file and a hope.

WHAT YOU GET
- Product design: information architecture, user flows, hi-fi screens on realistic data
- A design system - tokens, components, states - documented and reusable
- A front end built in React and deployed to a live URL, responsive down to 360 px
- Every state built: loading, empty, error, permissions, long content
- Advanced tier: a component catalogue in Storybook and a QA pass on the running build, with findings written down, fixed and re-checked

WHAT I DO NOT DO
Backend, authentication and payments. I build the front end and integrate with an API you already have, working alongside your backend developer.

WHY ME
Every project in my portfolio below is a live build you can click, designed and coded by me: an AI oversight console, a distributor's partner portal, a clinic operations system.

Tell me what the product does and what your API returns. I will come back with a scope and with what I would cut.
```

Блок `WHAT I DO NOT DO` стоит **до** блока `WHY ME` намеренно: в карточке со
средним чеком $1 900 неподходящий клиент дороже, чем недокупивший подходящий.
Формулировка — дословно граница из overview.

### 6.4 Тиры

| | **Starter** | **Standard** | **Advanced** |
|---|---|---|---|
| Цена | **$900** | **$1 900** | **$3 600** |
| Срок | 7 дней | 14 дней | 21 день |
| Объём | 1 флоу, до 3 экранов | до 8 экранов | до 16 экранов |
| Дизайн: IA, флоу, hi-fi макеты | ✓ | ✓ | ✓ |
| Front end на React, задеплоенный на живой URL | ✓ | ✓ | ✓ |
| Все состояния собраны, не только happy path | ✓ | ✓ | ✓ |
| Дизайн-система: токены, компоненты, состояния | — | ✓ | ✓ |
| Адаптив до 360 px | — | ✓ | ✓ |
| Каталог компонентов в Storybook | — | — | ✓ |
| QA-прогон по работающей сборке с письменными находками | — | — | ✓ |
| Созвон-передача 45 минут | — | — | ✓ |
| Правки | 1 | 2 | 3 |

**Почему правок мало.** В сборке правка стоит не как в макете, и «безлимит» здесь
— прямая дорога в срыв срока и в диспут. Вместо безлимита работает шаг 2 в
`work steps`: список экранов утверждается до того, как что-то нарисовано.

### 6.5 Add-ons

| Add-on | Цена | Зачем |
|---|---|---|
| Extra-fast delivery | +$450 / +$950 / +$1 800 | Предустановленный аддон площадки |
| Additional screen, designed and built | +$260 | Основной выход за объём |
| Storybook component catalogue | +$450 | Мост из Standard в Advanced |
| QA pass on the running build | +$400 | То же |
| Deploy to your own hosting or repository | +$150 | Часто спрашивают; по умолчанию деплой мой |
| Two extra weeks of bug fixes after handover | +$300 | Снимает главный страх покупателя сборки |

### 6.6 Work steps

```
1. Framing. I read the brief, pin down the constraints and what your API already returns, and come back with a screen list and what I would cut. Nothing gets drawn before you approve that list.
2. Structure. Information architecture and the user flows, agreed with you.
3. Design system first. Tokens, components and states, so the build and the design stay one thing rather than two.
4. Screens. Hi-fi designs on realistic data, every state included.
5. Build. I develop the front end in React and deploy it to a live URL you can open on any device.
6. QA and handover. On the Advanced tier I run a QA pass on the running build, write the findings down, fix them and re-check. You get the repository, the Figma file and a walkthrough call.
```

### 6.7 FAQ

```
Q: What is "a live URL" exactly?
A: A deployed front end you open in a browser, on your phone or on a client's laptop, with no setup. Every project in my portfolio is one - open any of them and you are looking at the deliverable of this project.

Q: Will it be connected to our real data?
A: If you have an API, yes - I integrate with it. If you do not, the build runs on realistic fixture data, which is enough to test with users, show investors and hand to a backend developer as a specification.

Q: Do we get the code?
A: Yes. The repository is yours, in React, with the design tokens and components your team can keep building on. There is nothing locked to me in it.

Q: Can you work in our existing repository?
A: Tell me the stack and the setup before you buy and I will say yes or no straight. I will not promise it inside a fixed package sight unseen.

Q: What if we only need the design?
A: Then buy the Figma design project on my profile instead - it is the same work without the build, and it costs less.

Q: Why is this cheaper than hiring a designer and a developer?
A: Because there is no handoff between them. The design decisions and the code are made by the same person, so nothing is redrawn twice and nothing is lost in translation.
```

### 6.8 Project requirements

| Пункт | Тип | Обязательный |
|---|---|---|
| What does the product do, and who uses it? | текст | **да** |
| Which flow or screens should this cover? | текст | **да** |
| Do you have an API? Add the docs, or say "no API yet" | текст + файл | **да** |
| Existing designs, brand assets or a design system, if any | файл | нет |
| Where should the build be deployed - my hosting or yours? | выбор | нет |
| Is there a date this has to be in front of someone? | текст | нет |

### 6.9 Галерея — 14 кадров, двенадцать готовы

| # | Файл | Что показывает |
|---|---|---|
| 1 | обложка 4:3, собрать (§8.1) | Экран продукта + плашка «Designed and built» |
| 2–5 | `agent-ops-console/01–04.png` | Кейс, доведённый до сборки и принятый клиентом |
| 6–8 | `vet-clinic-os/02–04.png` | 0→1 за две недели |
| 9–10 | `b2b-partner-portal/01–02.png` | before / after |
| 11 | `pawly/09.png` и `vet-clinic-os/08.png` | Каталог компонентов в Storybook — то, что даёт Advanced |
| 12 | `vet-clinic-os/01.png` | Один продукт на трёх ширинах |
| 13 | кадр дашборда QA-прогона, собрать (§8.2) | QA-проход: находки, раунды, закрытые дефекты |

### 6.10 Concurrent projects

**1.** Сборка занимает руки целиком, а сорванный срок при нулевой истории стоит
дороже второго заказа.

---

## 7. Карточка 4 — Webflow landing: design + build ⚡

**Роль:** оборот. Короткий цикл, доказательная база в продакшене, покупает первые
отзывы.

### 7.1 Title — 70 знаков с префиксом

```
a Webflow landing page design and build with CMS and GSAP
```

`design and build` держит нашу позицию, `CMS` и `GSAP` забирают два самых
частотных уточняющих запроса.

**Запасной вариант:** `a Webflow landing page: design, build, CMS and launch` (66).

### 7.2 Category

`Design & Creative → Web Design` либо `Web Development → Webflow`, смотря что
отдаёт дерево **[проверить]**. Если каталог даёт `Webflow` отдельной веткой —
брать её: точная категория весит больше, чем красивая.

### 7.3 Description — 1 057 знаков

```
A marketing site or landing page in Webflow, designed and built by the same person. Client-First class structure, a CMS your team can actually edit, GSAP animation where it earns its place, and the SEO basics done properly.

WHAT YOU GET
- Starter: your existing Figma design built in Webflow, accurate and responsive down to 360 px
- Standard: designed from your brief and then built, with a CMS collection
- Advanced: up to 4 pages, a CMS blog, GSAP motion, on-page SEO and 14 days of bug fixes after launch
- Clean, reusable classes and components, so your next change does not need me
- Launch on your domain with redirects, favicons, Open Graph and analytics in place

WHY ME
I design and build. The four Webflow sites in my portfolio below are mine end to end, not handoffs from someone else's file. I also design B2B SaaS products, which is why my pages are structured around what the visitor has to decide, not around the sections a template happens to have.

Send me the brief or the Figma file. I will come back with a section list and a timeline.
```

### 7.4 Тиры

| | **Starter** | **Standard** | **Advanced** |
|---|---|---|---|
| Цена | **$450** | **$900** | **$1 600** |
| Срок | 5 дней | 8 дней | 12 дней |
| Что это | сборка **твоего** макета | дизайн + сборка | дизайн + сборка, многостраничник |
| Объём | 1 страница, до 5 секций | 1 страница, до 8 секций | до 4 страниц |
| Client-First, переиспользуемые классы | ✓ | ✓ | ✓ |
| Адаптив до 360 px | ✓ | ✓ | ✓ |
| Дизайн страницы по брифу | — | ✓ | ✓ |
| CMS-коллекция | — | ✓ | ✓ (блог) |
| Анимация на GSAP | базовые ховеры | ✓ | ✓ |
| On-page SEO: заголовки, метатеги, Open Graph, alt | — | ✓ | ✓ |
| Запуск на твоём домене: редиректы, фавиконы, аналитика | — | — | ✓ |
| 14 дней багфиксов после запуска | — | — | ✓ |
| Правки | 2 | 3 | 4 |

**Starter — это и есть `Figma to Webflow`**, тот самый частотный запрос. Он
оставлен ровно одной ступенью и не выведен в заголовок: клиент входит по нему,
а сравнение тиров показывает, что дизайн стоит вдвое меньше, чем он думал.

### 7.5 Add-ons

| Add-on | Цена | Зачем |
|---|---|---|
| Extra-fast delivery | +$225 / +$450 / +$800 | Предустановленный аддон площадки |
| Additional page | +$250 | Основной выход за объём |
| Additional CMS collection | +$200 | Второй по частоте |
| GSAP scroll animation for one section | +$150 | Продаётся к Starter |
| Migration of existing content | +$180 | Часто оказывается сюрпризом на середине |
| 30 more days of bug fixes | +$200 | — |

### 7.6 Work steps

```
1. Section list. I read the brief and come back with the sections the page needs and what each one has to make the visitor decide. You approve it before anything is designed.
2. Design. The page is designed from that list - or, on the Starter tier, this step is your file and we go straight to the build.
3. Build. Webflow with a Client-First class structure and reusable components, responsive down to 360 px, with the CMS set up where your tier includes it.
4. Motion and SEO. GSAP animation where it earns its place, then headings, meta tags, Open Graph images and alt text.
5. Launch. Publish to your domain with redirects, favicons and analytics in place, and hand you a short walkthrough of how to edit the CMS yourself.
```

### 7.7 FAQ

```
Q: I already have a Figma design. Can you just build it?
A: Yes - that is the Starter tier. Send the file and tell me whether the design is final; if it is missing states, breakpoints or empty content, I will tell you what I would add before you buy.

Q: Will my team be able to edit it without a developer?
A: That is what the CMS and the Client-First class structure are for. Content changes are yours; I hand over a walkthrough of how to make them.

Q: Do you do Webflow hosting and my domain?
A: I set up the site and publish it to your Webflow account, and on the Advanced tier I connect your domain with redirects, favicons and analytics. The hosting plan is bought in your own account, so the site stays yours.

Q: How much animation is included?
A: Enough to give the page rhythm, not enough to make it slow: entrance and scroll animations built with GSAP, and hover states everywhere they help. If you want something bigger, buy the add-on and tell me what you have in mind.

Q: What about a web app or a dashboard - can you build that in Webflow?
A: No, and I would not. That is a product, not a site - there are separate projects on my profile for designing and building those.

Q: Can I see sites you have built?
A: Four of them are in my portfolio below, all live in production, all designed and built by me rather than handed to me as someone else's file.
```

### 7.8 Project requirements

| Пункт | Тип | Обязательный |
|---|---|---|
| What is the page for, and what should the visitor do on it? | текст | **да** |
| Do you have a design already? Add the Figma link, or say "design it for me" | текст | **да** |
| Copy: send what you have, or say which sections still need text | текст + файл | **да** |
| Brand assets: logo, colours, fonts | файл | нет |
| Reference sites you like, and what you like about them | текст | нет |
| Domain and Webflow account details, if the launch is included | текст | нет |

**Копирайтинг не входит ни в один тир** — и это сказано в требованиях, а не
только в FAQ: там его читают до покупки.

### 7.9 Галерея — 11 кадров, десять готовы

| # | Файл | Что показывает |
|---|---|---|
| 1 | обложка 4:3, собрать (§8.1) | Три сайта коллажем |
| 2–4 | `scrib3/01–03.png` | Анимированный сайт с GSAP |
| 5–6 | `synk/01–02.png` | Второй продакшен-сайт |
| 7–8 | `bloomlex/01–02.png` | Третий |
| 9–10 | `common/01–02.png` | Четвёртый |
| 11 | любой `*/06.png` мобильный кадр | Адаптив |

Все четыре пакета уже собраны в одинаковой геометрии (2000×1125 + мобильный
кадр) скриптом `scripts/build-webflow-card.mjs` — набор читается как набор.

### 7.10 Concurrent projects

**2.**

---

## 8. Медиа: что есть, чего нет, что собрать

### 8.1 Обложки — единственная общая доработка

Каталог рекомендует **4:3** (1000×750), а собранные обложки пакетов портфолио —
**5:4** (2000×1600), и это было осознанное решение: плитка в сетке Portfolio
отдаёт 1.25 (`upwork/projects/agent-ops-console/README.md` §4). **Для каталога
пропорция другая**, и обложка, нарисованная в 5:4, потеряет бока.

Геометрия обложки живёт одной константой — `COVER = { w: 2000, h: 1600 }` в
[scripts/lib/upwork-cover.mjs:54](scripts/lib/upwork-cover.mjs#L54), общей для
`build-upwork-card.mjs` и `build-webflow-card.mjs`. Задача: параметризовать `COVER`
и добавить режим `--catalog`, отдающий 2000×1500. Работа механическая, всё
остальное — коллаж, градиент, плашка формата — уже написано и не трогается.

Кадры галереи в 4:3 приводить **не нужно**: рекомендация относится к превью,
а минимум для картинки — 400×300, под него проходит всё, что лежит в пакетах.

### 8.2 🔴 Карточка 1: медиа не существует

У аудита нет ни одного кадра, и это **единственное, что блокирует публикацию
всей пачки**. Аудит — товар, который продаётся видом отчёта; описание отчёта не
продаёт ничего.

Что собрать, пять кадров и один PDF:

| # | Кадр | Из чего |
|---|---|---|
| 1 | Обложка: разворот отчёта + плашка «UX audit» | По §8.1 |
| 2 | Размеченный скриншот: находка, маркер, severity, эвристика | Экран из `agent-ops-console` или `vet-clinic-os` с наложенной разметкой |
| 3 | Таблица находок: severity, эвристика, экран | Формат отчёта скилла `ux-audit`; фактура — `audit/audit_report.md` |
| 4 | Приоритизация impact × effort | Тот же отчёт, матрица |
| 5 | Пара «было / стало» одного экрана | `b2b-partner-portal/01–02.png` — единственная очищенная к публикации пара |
| PDF | Образец отчёта на 3 страницы | Из `audit/audit_report.md`, вычищенный: это аудит **нашего собственного** сайта, значит ничей NDA не задет |

**Почему образцом идёт аудит своего сайта, а не клиентского.** Аудит клиентского
продукта опубликовать нельзя ни в каком виде. Аудит собственного — можно целиком,
и он честнее любого демо: показывает, что находки пишутся себе так же, как
чужим.

### 8.3 Видео

Одно на карточку, ≤ 60 секунд **[факт]**. **Не сейчас** — решением по видео из
`profile.md` §5 ревизии 5 оно снято с рассмотрения, и для каталога решение то же:
20 кадров закрывают карточку, а видео стоит вечер. Вернуться после первых
отзывов, начиная с карточки 3, где видео сильнее всего: живая сборка в движении —
это ровно то, чего нет у конкурентов.

---

## 9. Модерация: за что отклоняют

Ревью проверяет карточку на полноту и профессиональность **[факт]**. Что реально
режет, в порядке вероятности **[оценка]**:

| Риск | Как закрыт в этих карточках |
|---|---|
| **Неверная категория** — называют первой причиной отказа | Категория выбирается по тому, **что покупают**, а не как называется исполнитель. Три из четырёх помечены **[проверить]**: сверить с деревом формы |
| **Контакты до контракта** — почта, телефон, мессенджер, приглашение уйти с площадки | В текстах нет ни одного контакта. Проверено: в описаниях не осталось и почты |
| **🔴 Внешние ссылки в описании** | Прямых URL в описаниях каталога **нет намеренно**, хотя в карточках портфолио они стоят и работают. Формулировка везде одна: `my portfolio below` — она отправляет туда же, но модерацию не дразнит. **[проверить]**: если форма ссылки пропускает, вернуть живые URL в описания карточек 3 и 4 — это наш сильнейший аргумент |
| **Чужие логотипы и брендинг без прав** | На кадрах брендинг клиентов не публикуется. Ограничение по B2B Partner Portal (§5.9) держится: два кадра, остальные девять — никуда |
| **Обещание того, чего в тирах нет** | Границы стоят в описании (`WHAT I DO NOT DO`), в тирах и в FAQ — три раза, одними словами |
| **Опечатки, слабые картинки, нерелевантные визуалы** | Кадры идут из собранных пакетов, прошедших отбор для портфолио |
| **Дублирующиеся карточки** | Четыре карточки не пересекаются: аудит, макеты, сборка, сайт. Пересечение карточек 2 и 3 снято словами в FAQ обеих — каждая отправляет в другую |

**Если карточку отклонили** — правится названная причина и подаётся снова;
повторная подача не наказывается. Правки уже опубликованной карточки могут
отправить её на ревью повторно **[факт]**, поэтому текст доводится **до** первой
подачи, а не после.

---

## 10. Экономика

**Комиссия.** С 1 мая 2025 плоские 10% заменены переменной ставкой **0–15% за
контракт**, которая фиксируется на весь срок контракта **[факт]**. По заказам
каталога чаще всего называется ~10% **[оценка]**, но цифра видна в форме до
подтверждения — **[проверить]** на первом заказе.

**Connects.** Заказ из каталога не стоит connects **[факт]**. При плане 15–20
откликов в неделю и докупке $75–105/мес (`profile.md` §10) один заказ из каталога
в месяц окупает весь бюджет connects.

**Что каталог не окупает — время.** Четыре карточки под ключ — это тексты (готовы
здесь), медиа карточки 1 (не собрано, §8.2), обложки 4:3 (§8.1) и заполнение
формы. Оценка: **6–9 часов** на всё, из них 4–6 — медиа аудита. Это меньше, чем
стоит один вечер на видео-интро, которое отложено.

---

## 11. Порядок действий

| # | Что | Время | Блокирует ли публикацию |
|---|---|---|---|
| 1 | Открыть форму и снять шесть **[проверить]** из §12 — лимиты и дерево категорий | 20 мин | Да: от лимитов зависят заголовки |
| 2 | Собрать медиа карточки 1 — пять кадров и PDF (§8.2) | 4–6 ч | Да, для карточки 1 |
| 3 | Добавить в `upwork-cover.mjs` режим 4:3 и пересобрать четыре обложки (§8.1) | 1 ч | Нет: можно опубликовать с кадром вместо обложки и заменить потом |
| 4 | Завести карточки 2, 3, 4 — тексты готовы, кадры лежат | 40 мин на карточку | — |
| 5 | Завести карточку 1, когда готов пункт 2 | 40 мин | — |
| 6 | Подать все четыре одной пачкой | 5 мин | — |
| 7 | Вставить ссылки на карточки в шаблоны cover letter (`profile.md` §8) | 15 мин | Нет |

**Порядок 4 → 5, а не 5 → 4** сознательно: карточки 2–4 готовы к подаче сегодня,
а очередь ревью идёт неделями. Ждать медиа аудита всей пачкой — терять недели на
трёх карточках из четырёх.

**После публикации, что делать с картой:**

- **Первые три отзыва — целенаправленно.** Клиента, пришедшего по отклику и
  просящего объём, который совпадает с тиром, проводить **через каталог**, а не
  кастомным контрактом. Деньги те же, отзыв в каталоге — нет.
- **Не трогать 30 дней после публикации.** Ранжирование набирается 4–8 недель;
  правки в первые недели сбивают и его, и собственную оценку результата.
- **Через 30 дней — одна метрика на карточку:** показы, клики, продажи. Если
  клики есть, а продаж нет — правится **описание и первый кадр**. Если нет
  кликов — правится **заголовок и категория**. Менять одно за раз, как в A/B по
  title (`profile.md` §1).

---

## 12. Открытые вопросы

### 🔴 Снять из формы до подачи

| # | Вопрос | Почему нельзя оставить как есть |
|---|---|---|
| 1 | Лимит `Project title` — 75 знаков с префиксом или без | Все четыре заголовка сидят в 70–74. Если префикс не считается — есть запас на ключевое слово; если лимит меньше — брать запасные варианты, они выписаны у каждой карточки |
| 2 | Лимит `Description` — 1 200 или меньше | Все четыре описания в 1 057–1 144. Поле портфолио уже один раз отдало 600 вместо ожидаемых 1 000 (`profile.md` §5) — этот случай может повториться, и тогда описания режутся по блокам `WHAT YOU GET` |
| 3 | Дерево категорий: есть ли ветки `Dashboard Design` и `Webflow` | Категория ставит потолок видимости (§1). Три карточки из четырёх помечены **[проверить]** |
| 4 | Пропускает ли модерация внешние ссылки в описании | Живой URL — наш сильнейший аргумент, и он сейчас сознательно не использован (§9) |
| 5 | Набор `service options` внутри выбранной категории | Upwork подставляет типовые для категории пункты тиров. Наши таблицы тиров могут не совпасть с ними один в один — тогда своё формулируется в описаниях тиров |
| 6 | Реальная комиссия по заказу каталога | 0–15% вместо прежних плоских 10% (§10). На цены это не влияет, на ожидания — да |

### ❗ Находка, выходящая за рамки каталога

**Верификация личности, возможно, не бесплатна и не даёт бейдж при нулевой
истории** **[проверить]**. `profile.md` §0 ставит её задачей №1 с обоснованием
«бесплатно, 10 минут, единственный бейдж, доступный при нулевой истории».
Справка Upwork при сверке 01.09 говорит другое: проактивная верификация до
запроса площадки стоит **35 connects**, а **бейдж не появляется в профиле до
первого принятого контракта**. Если это подтвердится, задача №1 в `profile.md`
теряет обоснование и уезжает вниз списка — вместе с 35 connects, которые при
дефиците connects (§10) не мелочь. Проверяется одним открытием раздела
верификации в аккаунте.

### Кандидаты в карточки 5–6 — после первых трёх отзывов

- **Design system starter** — токены, базовые компоненты, Storybook. Продаётся
  клиенту, у которого уже есть продукт и три разных синих.
- **Interactive prototype from your Figma** — кликабельный прототип на
  реалистичных данных под тест с пользователями или показ инвестору. Самая
  короткая работа из всех, что мы умеем, и у неё отдельный запрос.
- **Agent QA run on your build** — синтетический прогон сценария по живому
  прототипу с дашбордом находок (скилл `agent-qa`). Услуга, которой в каталоге
  почти нет; но продавать её без единого отзыва рано — клиент не понимает, что
  покупает.

---

## 13. Чего этот документ сознательно не делает

- **Не переоткрывает позиционирование.** Каталог нарезает на пакеты ту же услугу,
  что описана в overview. Ни одного нового обещания в четырёх карточках нет:
  сверено с матрицей доказательств плейбука §3.
- **Не обещает работу в чужом репозитории.** В FAQ карточки 3 стоит честное
  «скажи стек до покупки, отвечу прямо» вместо «да». 🔴 Доказательств нет, и
  фиксированный пакет — худшее место, чтобы их добывать.
- **Не заменяет спринт откликов.** Каталог набирает трафик 4–8 недель; отклики
  дают контакт завтра. Гейт G4 плейбука (60 откликов) от каталога не зависит.
- **Не считает спрос.** Сколько запросов в месяц висит в каталожном поиске по
  нашим четырём заголовкам — не измерено; это данные из залогиненного аккаунта,
  и они относятся к Чату B.

---

## Источники

Сверка 2026-09-01. Справка Upwork отдаёт 403 на прямое чтение, поэтому её
положения взяты из выдачи поиска по её же страницам и помечены **[факт]** только
там, где формулировка воспроизводится дословно.

- [How to create a project in Project Catalog — Upwork Help](https://support.upwork.com/hc/en-us/articles/360057397533-How-to-create-a-project-in-Project-Catalog)
- [How to build your best project in Project Catalog — Upwork Help](https://support.upwork.com/hc/en-us/articles/360058122033-How-to-build-your-best-project-in-Project-Catalog)
- [How to get started with Project Catalog as a freelancer — Upwork Help](https://support.upwork.com/hc/en-us/articles/360058234233-How-to-get-started-with-Project-Catalog-as-a-freelancer)
- [How we review your Project Catalog project — Upwork Help](https://support.upwork.com/hc/en-us/articles/4408644453395-How-we-review-your-Project-Catalog-project)
- [How to set and manage project requirements — Upwork Help](https://support.upwork.com/hc/en-us/articles/4407894806547-How-to-set-and-manage-project-requirements)
- [How to add images and video to your Project Catalog project — Upwork Help](https://support.upwork.com/hc/en-us/articles/1500011309082-How-to-add-images-and-video-to-your-Project-Catalog-project)
- [What is Project Catalog on Upwork? — Upwork Help](https://support.upwork.com/hc/en-us/articles/10408677826963-What-is-Project-Catalog-on-Upwork)
- [Verify your identity as a freelancer — Upwork Help](https://support.upwork.com/hc/en-us/articles/360001176427-Verify-your-identity-as-a-freelancer)
- [Upwork Project Catalog SEO — gigradar.io](https://gigradar.io/blog/upwork-project-catalog-seo)
- [Upwork Project Catalog for Agencies — gigradar.io](https://gigradar.io/blog/upwork-project-catalog-for-agencies)
- [Upwork Project Catalog guide — aiproposer.com](https://aiproposer.com/guides/upwork-strategy/upwork-project-catalog-guide)
- [How to Use Upwork Project Catalog — giguphq.com](https://giguphq.com/blog/upwork-project-catalog)
- [How to successfully create an Upwork Project Catalog — geek-freelancer.com](https://geek-freelancer.com/how-to-successfully-create-an-upwork-project-catalog/)
- [Upwork Freelancer Service Fee 2026 — freelancercalculator.com](https://freelancercalculator.com/upwork-service-fee-2026-official-guide/)
- [Upwork Fees 2026 — gigradar.io](https://gigradar.io/blog/upwork-fees)
- [Dashboard Design services — каталожный браузинг Upwork](https://www.upwork.com/services/browse/dashboard-design)
