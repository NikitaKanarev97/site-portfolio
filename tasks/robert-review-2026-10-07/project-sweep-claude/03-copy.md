# 03 — текст (без картинок)

Выгрузки: `logs/text/<route>-<loc>.md`. Счёт: `scripts/copy.mjs` → `logs/copy-stats.txt`. Открыто картинок: 0.

## Объём (EN, редакционный текст без alt и UI в растре; капшны и метки считаются отдельно)

| Кейс | Проза | Подписи и метки | Видимо всего | Бюджет 250–450 |
|---|---|---|---|---|
| agent-ops | 188 | 149 (41 строка) | 345 | в бюджете |
| partner-portal | 368 | 248 (68) | **644** | +194 сверх |
| learn | 297 | 224 (61) | **542** | +92 сверх |
| vet-clinic | 251 | 156 (32) | 441 | на верхней границе |
| pawly | 181 | 219 (54) | 434 | в бюджете, но подписей больше, чем прозы |
| about | 635 | 16 | 668 | (бюджет только для кейсов) |

Вывод: перегруз идёт не за счёт прозы, а за счёт подписей и меток. В Pawly и Agent Ops подписи по объёму сопоставимы с прозой. Это T2 в цифрах.

`scripts/find-duplicate-phrases.mjs` для этой задачи не годится: он ищет повторы ключей в файле локализации. Вместо него — свой поиск 4-грамм между страницами: совпадений 0, то есть буквальных повторов нет. Повторяются **конструкции** (ниже).

## X3 — ИИ-звучание

| ID | Цитата | Где | Почему так читается | Направление |
|---|---|---|---|---|
| X3-1 | «Between a promise and a payout: a person.» / «Между обещанием и выплатой — человек.» | agent-ops, лид обложки | Ровно та формула «Between X and Y: a person» из задания: двоеточие-разгадка | Заменить фактом о задаче |
| X3-2 | «A familiar face. A clear return. Proof the dog is home.» | pawly, лид обложки | Тройка рубленых фраз | Одна фраза о том, что сделано |
| X3-3 | «One visit. Different responsibilities.» | vet, лид обложки | Два фрагмента-афоризма | То же |
| X3-4 | Шаблон «один X — два Y»: «Seventeen chats. One cause.», «One material, two entrances», «One owner, two contexts», «Two entrances, one material, separate records», «One visit · three views», «Three candidates, one choice», «The same walk, one earning», «One source row», «Four component families, thirteen states» | agent-ops, learn (×4), vet, partner (×3), pawly | Один ритмический приём в 4 из 5 кейсов; при чтении подряд кейсы звучат одним голосом | Оставить в одном месте на кейс, остальное — обычными предложениями |
| X3-5 | Шаблон «X does not Y»: «Saved does not mean published», «Reading does not finish a unit», «Matching does not promise compatibility», «A photo is still a draft», «Read the promises, not the chats», «they show the decisions, not business impact», «two actions, not one» | vet, learn, partner, pawly, agent-ops | «не X, а Y» как основной двигатель заголовков | Часть заголовков переписать утвердительно |
| X3-6 | Подпись пересказывает заголовок: «Each role receives its own part» → «Each role gets only its part of the visit.»; «One material» → «An answer in the reference…» → «One material: a quick answer and a step in a path.» | vet, learn | Тройной пересказ одной мысли (заголовок, лид, подпись) | Убрать дублирующую подпись |
| X3-7 | Блок итога одним шаблоном: Cost / Evidence / Next evidence (learn, vet), Price of the solution / Evidence / Next check (partner), The boundary / Implemented / Next question (pawly), The trade-off / Scope (agent-ops) | все кейсы | Одинаковая анкета в конце, разные подписи у одного и того же блока (это ещё и H3) | Унифицировать названия и сократить; см. X2-3 |
| X3-8 | RU-кальки и канцелярит: «центр разрешения» (Resolution Center), «Нерешённое соответствие требует выбора или исправления и повторной проверки», «Полный ответ имеет свой адрес», «Вход определён курсами», «У статуса есть явный шаг», «Вызов биллинга содержит сумму», «Забота в трёх семействах компонентов» | partner-ru, learn-ru, agent-ops-ru, pawly-ru | Перевод с английского, а не русский текст | Вычитка RU носителем |
| X3-9 | «$23,000» в RU-тексте | agent-ops-ru | Английский формат числа в русском тексте | «23 000 $» |
| X3-10 | Pawly, EN: ссылка «Explore the EN demo» | pawly-en | Указание языка на английской странице лишнее и звучит как служебная пометка | Убрать «EN» |

## X2 — статусы (CONTENT-RULES) с контекстом

| ID | Текст | Источник | Оценка |
|---|---|---|---|
| X2-1 | «Work project · reinterpreted in 2026» / «Рабочий проект · переосмысление 2026» | `learn.ts:206`, kicker обложки | Прямо запрещённое слово (reinterpretation) в плашке на первом экране. **P1** |
| X2-2 | MetaList «Shown: Independent reconstruction on synthetic data» / «На кадрах: Самостоятельная пересборка на демоданных»; Outcome «The frames here are my independent reconstruction on synthetic data: they show the decisions, not business impact»; Evidence «In the reconstruction, row 38…»; Architecture «…from the reconstruction» | `partner-portal.ts:18,48`, `ru/…:14,43–44` | Статус «reconstruction» плашкой в метаданных и ещё трижды в тексте. Правдивое раскрытие допустимо **один раз** внутри связного текста. **P1** |
| X2-3 | «Next evidence / Next question / Next check» + «not yet measured», «There is no business baseline yet», «Do owners and walkers understand these boundaries in a real task?», «the question bank still needs expert validation» | learn.ts:263 и итог, partner итог, pawly.ts:291, vet итог | По смыслу это «гипотеза, которую ещё нужно проверить» из запрещённого списка, причём системно в каждом кейсе. **P1, нужен владелец** (решение о самом блоке) |
| X2-4 | MetaList-статусы: vet «Working prototype · 2026», «Real clinic under NDA; all demo data invented»; pawly «Evidence: Synthetic QA across seventeen EN/RU routes»; agent-ops «Prototype: Live, invented data» | `vet-clinic.ts:71–72`, `pawly.ts:280`, `agent-ops-console.ts:403` | Плашки-статусы в фактах кейса; NDA допустим, но в связном тексте, а не ярлыком. **P1/P2, нужен владелец** |
| X2-5 | Ссылки «Open the live demo», «Open the demo», «Explore the EN demo», «Открыть демо», «Открыть прототип с вымышленными данными» | `partner-portal.ts:53`, `pawly.ts:292`, vet, agent-ops | «demo» как ярлык работы; в эталоне на главной — «prototype»? Сверить. **P2** |
| X2-6 | About: «most of these builds are prototypes on synthetic data rather than production systems under load» | `about.ts:78` | Самообесценивание всего портфолио одной фразой. **P2, владелец** |
| X2-7 | learn итог: «accounts and certificates are simulated», «progress lives in the browser»; vet «Browser-local prototype, not device synchronization», «does not store past versions» | learn, vet | Технические ограничения прототипа — по правилу «дополнительные статусы, не нужные для рассказа, убрать». **P2** |
| X2-8 | alt/aria «demonstration document», «950 rouble demo charge», «demo send» | CaseScreen, MediaFrame (learn, pawly) | Описание экрана. Низкая уверенность, решение владельца |
| Даты | «2026» (agent-ops Year), «2024–winter 2026; roughly six active months across a long pause» (partner), «September 2026 · EN/RU» (pawly), «Working prototype · 2026» (vet), «reinterpreted in 2026» (learn) | MetaList | Повтора года под превью нет. Формат дат в пяти кейсах пятью разными способами (Year / Period / Version / Delivery / kicker) → H3. «across a long pause» — лишнее оправдание |

## X1 — язык

- EN partner: «камера 4мп уличная» в абзаце — цитата из исходного файла, подана в кавычках рядом с переводом на обложке. Документально, но на EN-странице без перевода в этом месте. **P3**.
- aria-label «source-in-context», «proof-system» — слаги вместо подписи в обеих локалях. **P2** (доступность).
- Navbar aria «Nikita Kanarev — NK» в RU. **P3**.
- 404: на `/ru/404` первым идёт EN-блок, контакт «Let's talk», title «Page not found». **P3**.
- About RU: интро на 1440 рвётся на строки отдельными узлами («Я переформулирую задачу до того, как / начинаю проектировать…») — похоже на ручные переносы, подобранные под EN. Проверить кадром (этап 4).
