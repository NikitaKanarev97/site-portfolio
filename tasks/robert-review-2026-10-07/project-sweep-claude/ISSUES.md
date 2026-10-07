# Проблемы сайта того же рода, что фидбэк Роберта по главной (прогон Claude)

Параллельный прогон к `project-sweep/` (Кодекс). Задание — `project-sweep/SWEEP-PROMPT.md`, выполнено без отступлений, кроме отмеченных.

## 1. Шапка

- HEAD `0dda338`, ветка `codex/portfolio-integration-g`, дата 2026-10-07.
- Сервер: `astro dev` на `127.0.0.1:4421` (4420 оставлен параллельному прогону). Остановлен в конце.
- Viewport: 1440×900 и 360×780. Состояние кадров: networkidle → fonts.ready → 3 с → прокрутка шагом 400/100 мс → 2 с.
- Маршруты (авто, EN и RU, обе ширины): `/about/`, 5 кейсов, `/404`, `/` (эталон) — 32 прохода. Глазами: EN 1440 все страницы, EN 360 обложки, MetaList, CaseNext, спецификация; RU 1440 About.
- Открыто картинок: **10 из 45** (2 впустую из-за ошибки координат кропа, переснято вырезкой из полностраничных кадров).
- Не проверено: RU 360 глазами (только замер), hover-состояния, тёмная тема, Safari/iOS (глифы-emoji проверены только по кодовым точкам).
- `scripts/find-duplicate-phrases.mjs` не подходит для X3 (ищет дубли ключей локализации); вместо него — свой поиск 4-грамм (`scripts/copy.mjs`).

## 2. Сводка

| Класс | Итог | Как проверено |
|---|---|---|
| T1 ИИ-типографика | 3 находки (S007, S008, S009) | замер + кадр; mono в HTML — 0 |
| T2 Микрошум | 3 (S015, S025, S040) | замер + кадр |
| T3 Глифы | 2 (S010, S045) | замер + кадр |
| T4 Ложные контролы | 1 (S004) | кадр |
| C1 Карточка в карточке | 2 (S005, S014) | кадр (авто-детектор дал 0 — пропустил) |
| C2 Слияние с сайтом | 1 (S032) | замер + кадр; остальные кандидаты отклонены |
| C3 Цвет сцены | не найдено | глазом на обзорных листах, конфликтов нет |
| L1 Оси | не найдено | замер (1 кандидат, отклонён кадром) |
| L2 Интервалы | 1 (S029) | замер + кадр |
| L3 Пустые углы | 1 (S016) | кадр |
| L4 Масса | 2 (S030, S031) | замер высот + кадр |
| L5 Линии | 1 (S033) | замер + кадр |
| H1 Иерархия | 3 (S018, S038, S047) | замер + кадр |
| H2 Повтор шаблона | не найдено как отдельная проблема | глазом: сцены чередуются, но шаблон «eyebrow слева + H2 + абзац» общий — учтено в S008 |
| H3 Разные шаблоны | 4 (S017, S019, S020, S041) | замер + кадр |
| K1 Ссылки-действия | 2 (S011, S013) | замер + focus-кадр; невидимого focus нет |
| X1 Язык | 4 (S036, S037, S043, S044) | замер + чтение |
| X2 Статусы и даты | 8 (S001–S003, S012, S026–S028, S042) | текст, alt, meta, JSON-LD |
| X3 ИИ-звучание | 5 (S021–S024, S025 частично) | чтение выгрузок |
| I1 Изображения | не найдено | глазом: фото Pawly и портрет натуральные; мелкий текст на mobile — в S030 |
| R1 Mobile | 2 (S030, S035) | замер (overflow 0) + кадр |

Приоритеты: **P1 — 12**, **P2 — 18**, **P3 — 14**; всего 44 (номера S006, S034, S039 не заняты: склеены с другими находками). Требуют владельца: **18**.

### Топ-10

1. S001 — Learn: на обложке плашка «Work project · reinterpreted in 2026» (прямо запрещено CONTENT-RULES).
2. S002 — Partner: «Independent reconstruction on synthetic data» в фактах и ещё трижды в тексте.
3. S004 — Agent Ops: в финале pin-сцены огромный знак из двух полос — читается как «пауза» (повтор закрытого F44).
4. S003 — во всех кейсах блок «Next evidence / Next question» с «not yet measured» — по сути запрещённая «гипотеза, которую нужно проверить».
5. S005 — белая карточка-рамка вокруг скриншота у всех кадров с выносками (Agent Ops evidence на чёрном поле — сильнее всего).
6. S008 — eyebrow капсом 12 px с разрядкой над каждым тезисом во всех кейсах.
7. S010 — текстовые стрелки ↓ ← → в оглавлении About, карусели, выносках, метках и числах.
8. S011 — ссылки на прототип в MetaList и под CaseNext постоянно подчёркнуты (inline-вариант для действия).
9. S021 — лиды-формулы на обложках: «Between a promise and a payout: a person.», «A familiar face. A clear return. Proof the dog is home.»
10. S013 — ссылка на прототип висит одна между блоком Next case и «Let's talk», оторвана от кейса.

## 3. Таблица находок

| ID | Класс | Аналог (F) | Где | Что видно | Источник | Доказательство | Приоритет | Направление | Уверенность | Владелец? |
|---|---|---|---|---|---|---|---|---|---|---|
| S001 | X2 | F19, F45 | learn EN/RU, kicker обложки, 1440/360 | «Work project · reinterpreted in 2026» / «Рабочий проект · переосмысление 2026» капсом над названием | `src/copy/cases/learn.ts:206` (CaseCover `media.eyebrow`) | sheet-B2 `learn-en-1440-cover-H3`; sweep X2 | P1 | Убрать статус; если kicker нужен — только предметная область | высокая | да |
| S002 | X2 | F19, F45 | partner EN/RU: MetaList «Shown», тезис Architecture, Outcome, Evidence | «Independent reconstruction on synthetic data», «…from the reconstruction», «my independent reconstruction…: they show the decisions, not business impact», «In the reconstruction, row 38…» | `partner-portal.ts:18,23(body),48`; `ru/cases/partner-portal.ts:14,43–44` | 03-copy X2-2; overview-1 | P1 | Оставить одно правдивое раскрытие внутри связного текста, плашку из фактов убрать | высокая | да |
| S003 | X2 | F45 | итог всех кейсов: learn «Next evidence», vet «Next evidence», partner «Next check», pawly «Next question», learn тезис Assessment | «not yet measured», «There is no business baseline yet», «Do owners and walkers understand…?», «the question bank still needs expert validation» | итоговые блоки в `learn.ts`, `vet-clinic.ts`, `partner-portal.ts`, `pawly.ts:291`; `learn.ts:263` | 03-copy X2-3 | P1 | Решить судьбу блока «что дальше проверить»: по правилу это обесценивающий статус | средняя | да |
| S004 | T4 | F44, F23 | agent-ops EN/RU, последний шаг pin-сцены, 1440 | Две огромные вертикальные белые полосы над «HUMAN REVIEW» — выглядит как кнопка паузы | `src/components/CaseSteps.astro:53` `.case-steps__stop-symbol` (стили `:181–190`), composition=checkpoint | sheet-C `agent-ops-console-en-1440-pin-end` | P1 | Заменить символ, не похожий на элемент управления, или убрать | высокая | нет |
| S005 | C1 | F05 | agent-ops «A closer look» (evidence на чёрном поле); partner архивный дашборд; learn архивный каталог — все CaseCallout | Скриншот в белой скруглённой подложке с паддингом и обводкой внутри цветного поля | `src/components/CaseScreen.astro:25` (appearance='frame' при слоте annotations) + `:77–83` `.case-screen--frame` | sheet-A2 `…evidence-C1`, `…legacy-L3`; sheet-B2 `…callout-T4` | P1 | Кадр с выносками класть на поле так же, как кадры без выносок | высокая | нет |
| S007 | T1 | F25 | MetaList всех 5 кейсов (+ главная), EN/RU | Метки Client / Year / Role / Evidence / Prototype — капс 12 px с разрядкой | `src/components/MetaList.astro:67,75` (`ds-meta-xs`) | sheet-B2 `agent…meta-T1`; sweep T1 ×44 | P1 | Метки строчным текстом как на главной | высокая | нет |
| S008 | T1, T2 | F25, F04 | CaseThesis во всех кейсах (26+ мест), CaseNext «NEXT CASE», CaseRoutes, SectionHead | Eyebrow капсом 12 px над каждым тезисом: Challenge, A closer look, Outcome, Architecture… | `CaseThesis.astro:42`; `CaseNext.astro:48`; `CaseRoutes.astro:9` | sheet-B2 `partner…thesis-L2`; sweep T1 ×46 | P1 | Убрать eyebrow там, где H2 говорит сам, остальные — строчными | высокая | нет |
| S009 | T1 | F02 | CaseSteps (agent-ops, partner, vet, pawly), CaseRoutes (learn), оглавление и главы About | «01 · Find the cause», «01 · Veterinarian · tablet», «02 · Programme», красные «01–04» над H2 About | `CaseSteps.astro:42–43` (`pad(i+1) · label`); `CaseRoutes.astro:13`; `about.astro:35–38` и разметка глав | sheet-B2 `about…chapter-H1`, sheet-C pin-кадры | P1 | Убрать порядковые номера и цепочки «A · B · C» | высокая | нет |
| S010 | T3 | F24, F26 | About оглавление ↓; CaseCarousel ← → (vet, pawly); CaseCallout метки «A → B» (partner); CaseThesis label «Audit → direction» (partner, learn); CaseSteps label «Cause → promise → decision» (agent-ops); CaseNumbers «1,770 → 71 → 2.4 h» | Текстовые стрелки в видимом тексте и кнопках | `about.astro:38`; `CaseCarousel.astro:56,59`; `partner-portal.ts:25`; `learn.ts:221`, `partner-portal.ts:23`; `agent-ops-console.ts:416`; `CaseNumbers.astro:29–30` | sheet-B2 `vet…carousel-T3`, `partner…callout-T4`; sheet-D about-ru | P1 | Стрелки только IconArrow; в метках — словами | высокая | нет (метки — частично текст) |
| S011 | K1 | F01, F29 | MetaList «Prototype/Product/Landing» и ссылка под CaseNext — все 5 кейсов, EN/RU | Ссылка-действие постоянно подчёркнута (вариант inline), на 360 переносится с подчёркиванием | `MetaList.astro:82` и `CaseNext.astro:59` — `<TextLink external>` без `type` → `inline` (`TextLink.astro:42,113`); комментарий `MetaList.astro:33` | sheet-B2 `agent…meta-T1`; sheet-C focus-meta; sheet-D meta-R1 | P1 | Вариант arrow, как у CV/LinkedIn | высокая | нет |
| S012 | X2 | F19 | MetaList: vet «Working prototype · 2026», «Real clinic under NDA; all demo data invented»; pawly «Evidence: Synthetic QA across seventeen EN/RU routes»; agent-ops «Prototype: Live, invented data» | Статусные ярлыки в фактах кейса | `vet-clinic.ts:71–72`; `pawly.ts:280`; `agent-ops-console.ts:403` | 03-copy X2-4 | P1 | Факты — роль, срок, платформа; раскрытие о данных — одной фразой в тексте | средняя | да |
| S013 | K1, L1 | F39, F37 | все 5 кейсов, после блока Next case, 1440 и 360 | Ссылка на прототип стоит одна между Next case и «Let's talk», читается как ссылка следующего кейса | `CaseNext.astro:59` (prop `prototype`) | sheet-A2 `vet…casenext-K1`; sheet-D `pawly-en-360-casenext-R1` | P2 | Перенести к итогу кейса или оставить только в MetaList | высокая | нет |
| S014 | C1, T2 | F05, F11 | CaseSpecimen: partner, learn, pawly | Серый лист → пунктирные синие рамки групп (как component set в Figma) → белые карточки; подписи 11–12 px; до 44 мелких узлов на секцию | `CaseSpecimen.astro:61` (`border: dashed var(--diagram-proto)`) | sheet-A2 `pawly…specimen-C1`; sheet-B2 `partner…specimen-C1` | P2 | Убрать уровень рамок групп, сократить подписи состояний | высокая | нет |
| S015 | T2 | F09, F16 | learn обложка; vet Role flow; learn Content model | Learn: kicker + «One material» + подпись справа + подпись внизу; подписи пересказывают заголовок («Each role receives its own part» → «Each role gets only its part of the visit.») | `learn.ts` (cover), `vet-clinic.ts` (role flow caption) | sheet-B2 `learn…cover-H3`; 03-copy X3-6 | P2 | Одна подпись на сцену; убрать дубли заголовка | высокая | да |
| S016 | L3 | F33 | vet шаг 03 (Owner), pawly The other role (earnings), partner шаг 02 «Confirm the choice», partner архивный дашборд | Маленький кадр в большом поле: пустые углы, соседняя сцена плотная | CasePlate/CaseScreen phone и строки, данные кадров в копи | sheet-A2 `vet…owner-L3`, `pawly…earnings-L3`, `partner…legacy-L3`; sheet-C `partner…pin-mid` | P2 | Подогнать поле под кадр или крупнее кадр | высокая | нет |
| S017 | H3 | F10, F43 | обложки 5 кейсов | Agent Ops: H1 128/800 + лид 48 справа; partner, learn, pawly: H1 64 + лид 20 справа; vet: H1 64 + лид под названием | `CaseCover.astro:103–114,150,174,196` | sweep H; overview-1…4 | P2 | Один шаблон обложки «название слева, тезис справа» как на главной | высокая | нет |
| S018 | H1 | F20, F22 | About EN/RU | H2 глав 24/600 (SectionHead size=sm) при H1 96; длинные колонки текста 14–15 px; линии между главами | `about.astro:50` (`SectionHead size="sm"` → `ds-heading-2xl`, `SectionHead.astro:33`); `about.astro:71` `.chapter::before` | sheet-B2 `about…chapter-H1`; overview-4 | P2 | Поднять заголовки глав до ступени разделов главной | высокая | нет |
| S019 | H3 | F10 | CaseSteps: agent-ops, partner (48/700) против vet, pawly (32/600) | Тезисы шагов разного размера в одинаковом блоке | `CaseSteps.astro:45` (4xl при `focus`/`wide`) | sweep H | P2 | Одна ступень для тезиса шага | высокая | нет |
| S020 | H3, X3 | F43 | итог всех кейсов | Одинаковый блок подписан по-разному: Cost / Price of the solution / The boundary / The trade-off; Evidence / Implemented / Scope; Next evidence / Next check / Next question | копи итогов: `learn.ts`, `vet-clinic.ts`, `partner-portal.ts:48–`, `pawly.ts:291`, `agent-ops-console.ts` | 03-copy X3-7 | P2 | Единые названия полей, короче | высокая | да |
| S021 | X3 | F34 | лиды обложек agent-ops, pawly, vet EN/RU | «Between a promise and a payout: a person.»; «A familiar face. A clear return. Proof the dog is home.»; «One visit. Different responsibilities.» | `outcome` в копи кейсов | 03-copy X3-1…3; sheet-C cover | P1 | Лид — одна фраза о задаче и результате, без формулы | высокая | да |
| S022 | X3 | F34 | 4 из 5 кейсов | Ритм «один X — два Y»: «Seventeen chats. One cause.», «One material, two entrances», «One owner, two contexts», «Three candidates, one choice», «The same walk, one earning»… | копи кейсов | 03-copy X3-4 | P2 | Не больше одного такого заголовка на кейс | высокая | да |
| S023 | X3 | F34 | vet, learn, partner, pawly, agent-ops | Заголовки на «X does not Y / not X but Y»: «Saved does not mean published», «Reading does not finish a unit», «Read the promises, not the chats» | копи кейсов | 03-copy X3-5 | P3 | Часть переписать утвердительно | средняя | да |
| S024 | X3 | F08 | RU: partner, learn, agent-ops, pawly | Кальки: «центр разрешения», «Полный ответ имеет свой адрес», «Вход определён курсами», «У статуса есть явный шаг», «Вызов биллинга содержит сумму» | `ru/cases/partner-portal.ts`, `learn.ts`, `agent-ops-console.ts`, `pawly.ts` (RU-ветки) | 03-copy X3-8 | P2 | Вычитка RU как самостоятельного текста | средняя | да |
| S025 | T2, X3 | F04 | partner (644 слова), learn (542); pawly и agent-ops — подписей почти столько же, сколько прозы | Перегруз за счёт подписей и меток | копи кейсов | 03-copy таблица объёма | P2 | Сократить подписи до бюджета 250–450 | высокая (замер) | да |
| S026 | X2 | F45 | About EN/RU, глава Evidence | «most of these builds are prototypes on synthetic data rather than production systems under load» | `src/copy/about.ts:78` | 03-copy X2-6 | P2 | Описать границу компетенции без обесценивания работ | средняя | да |
| S027 | X2 | F45 | learn итог, vet role flow и итог | «accounts and certificates are simulated», «progress lives in the browser», «Browser-local prototype, not device synchronization», «does not store past versions» | копи learn, vet | 03-copy X2-7 | P2 | Убрать технические ограничения, не нужные рассказу | средняя | да |
| S028 | X2 | F19 | ссылки на прототип: partner, vet, pawly, agent-ops | «Open the live demo», «Open the demo», «Explore the EN demo» (на EN-странице), «Открыть прототип с вымышленными данными» | `partner-portal.ts:53`, `pawly.ts:292`, `vet-clinic.ts`, `agent-ops-console.ts:403` | sweep X2 | P2 | Единая подпись действия без «demo» и указания языка | высокая | да |
| S029 | L2 | F13 | CaseThesis: agent-ops, partner, learn, pawly (26 мест) | H2 48 → абзац 25 px; в vet тот же блок 32–48 px | `CaseThesis.astro:56` (`--flow-pair` 12 px) против `--flow-node` 32 (`global.css:114`) | sweep L2; sheet-B2 `partner…thesis-L2` | P3 | Привести стык к общему ритму | средняя | нет |
| S030 | L4, R1 | F27 | 360: обложка vet (2179 px), learn (2008 px) | 2–2,5 экрана уменьшенных нечитаемых карточек UI до первого абзаца | `CaseCover.astro` (editorial/stage на mobile), VetStage, LearnStage | sheet-D `vet-clinic-en-360-cover-L4`, `learn-en-360-cover-L4`; замер высот | P2 | На mobile показывать одну карточку | высокая | нет |
| S031 | L4 | F27 | partner (11330 px листа), pawly (9826) против agent-ops (6368); CaseSpecimen partner 360 — 2303 px | Два кейса почти вдвое длиннее, основная масса — спецификации компонентов | CaseSpecimen в копи partner, learn, pawly | замер; overview | P3 | Сократить спецификацию или убрать её на mobile | средняя | да |
| S032 | C2 | F14 | learn CaseRoutes (Reference) | Статья на светло-сером фоне с еле видной рамкой прямо на белой странице | `CaseRoutes.astro` (кадр без CasePlate) | sheet-B2 `learn…routes-C2` | P3 | Положить на поле сцены, как остальные кадры | средняя | нет |
| S033 | L5 | F28 | About (оглавление `border-block`, `.chapter::before`), learn CaseRoutes (`border` у списка и `details`), DiagramCanvas (тёмная линия под заголовком схемы), agent-ops вертикальный разделитель в pin-сцене | Линии, которые ничего не группируют | `about.astro:66,71`; `CaseRoutes.astro:33–34`; `DiagramCanvas.astro:386` | sweep L5; sheet-B2, sheet-C | P3 | Убрать декоративные линии | средняя | нет |
| S035 | R1 | — | 360: ссылки-действия 22 px, «Enlarge» 19–34 px (learn, pawly), кнопки карусели ≈32 px | Цели меньше 44 px | `TextLink.astro`, `CaseScreen.astro`, `CaseCarousel.astro` | sweep R1 | P3 | Увеличить зону нажатия | высокая (замер) | нет |
| S036 | X1 | — | partner, pawly, EN/RU | aria-label секций — технические ключи «source-in-context», «proof-system» | `id` в `partner-portal.ts:44`, `ru/…:39`, `pawly.ts:289`, прокидывается в CaseStory | sweep X1 | P2 | aria-label из заголовка секции | высокая | нет |
| S037 | X1 | — | /ru/about | Оглавление и главы: 3 в RU (без «Hiring») против 4 в EN | `src/copy/ru/about.ts:22` против `about.ts:64` | sheet-D `about-ru-1440-intro-X1` | P3 | Подтвердить, что так задумано (RU-найм без раздела авторизации) | низкая | да |
| S038 | H1, X1 | F22 | /404, /ru/404 | Двуязычная страница: EN-блок первым и на /ru/404; H1 32 px, а RU H2 48; нет Navbar; контакт «Let's talk», title английские | `src/pages/404.astro`; `site.ts:100` | sweep X1/H | P3 | Выровнять иерархию, показывать локаль по пути первой | средняя | нет |
| S040 | T2 | F11 | CaseCallout: agent-ops (пины 1–4 на кадре и легенда 1–4), partner (1–2), learn | Нумерованные красные кружки на скриншоте плюс тот же номер в легенде плюс линия-выноска | `CaseCallout.astro:43,51,94–133` | sheet-A2 `…evidence-C1`; sheet-B2 `…callout-T4` | P2 | Одна система пояснений: либо пины, либо подпись | средняя | нет |
| S041 | H3 | F21 | CaseNext всех кейсов | Бегущая строка с повтором названия гигантским кеглем («Pawly Pawly Pawly»), слово обрезается у края | `CaseNext.astro:50–51,96` (marquee) | sheet-A2, sheet-C focus-next | P3 | Вкус: одно название, без повтора | низкая (вкус) | нет |
| S042 | X2 | F45 | alt и aria скриншотов: partner, pawly, learn | «Actual buyer decision…», «Real XLS file upload…», «Safe crop of the original…», «Accepted Pawly … original English UI», «demo charge», «demonstration document» | alt в копи кейсов | logs/text alt-строки | P3 | Alt описывает экран, без «Actual/Real/Safe crop/Accepted» | средняя | да |
| S043 | X1 | — | agent-ops RU | «$23,000» в русском тексте | RU-ветка `agent-ops-console.ts` | 03-copy X3-9 | P3 | Русский формат числа | высокая | нет |
| S044 | X1 | — | все RU | aria-label бренда «Nikita Kanarev — NK» не переведён | `Navbar.astro` | sweep X1 | P3 | Локализовать | высокая | нет |
| S045 | T3 | F24 | partner, learn, vet — DiagramCanvas | 144 «→» в visually-hidden списке рёбер: скринридер прочтёт «стрелка вправо» | `DiagramCanvas.astro:268` | sweep T3 (`ds-visually-hidden`) | P3 | Словами «ведёт в» | высокая | нет |
| S046 | H3 | F10 | agent-ops | Единственный H2 64/700 при 48/700 у CaseThesis везде | `CaseThesis` с вариантом в agent-ops | sweep H | P3 | Проверить, намеренный ли финальный акцент | низкая | нет |
| S047 | H1 | F03 | итог partner, learn, vet, pawly | Финал кейса — H2 48 на белом и мелкие колонки Cost/Evidence; у agent-ops — тёмный блок с крупными числами. Слабый финальный акцент в 4 из 5 | CaseImpact / CaseThesis outcome в копи | overview-1…4 | P2 | Один сильный шаблон итога для всех кейсов | средняя | да |

## 4. Группы исправлений (одна правка — много мест)

| Группа | Файл | Мест | Закрывает |
|---|---|---|---|
| G-A Рамка кадра с выносками | `CaseScreen.astro:25,77–83` | 3+ сцены (agent-ops, partner, learn) | S005, часть S016 |
| G-B Метки `ds-meta-xs` капсом | `MetaList.astro:67`, `CaseThesis.astro:42`, `CaseNext.astro:48`, `CaseRoutes.astro:9`, `CaseSteps.astro:35` | ~100 узлов во всех кейсах | S007, S008 |
| G-C Номера `pad(i+1) ·` | `CaseSteps.astro:42–43`, `CaseRoutes.astro:13`, `about.astro` | 4 кейса + About | S009 |
| G-D TextLink по умолчанию inline | `MetaList.astro:82`, `CaseNext.astro:59` | 5 кейсов × 2 | S011, S013 |
| G-E Стрелки-глифы | `CaseCarousel.astro:56,59`, `CaseNumbers.astro:29`, `about.astro:38`, `DiagramCanvas.astro:268` + метки в копи | 6 компонентов | S010, S045 |
| G-F Шаблон обложки | `CaseCover.astro` (варианты proof/editorial) | 5 кейсов | S017, S030 |
| G-G Знак остановки | `CaseSteps.astro:53,181–190` | agent-ops | S004 |
| G-H Спецификация | `CaseSpecimen.astro:61` | 3 кейса | S014, S031 |
| G-I Ступени заголовков | `CaseSteps.astro:45`, `SectionHead` в `about.astro:50` | 4 кейса + About | S018, S019 |
| G-J Копи статусов (владелец) | `learn.ts:206,263`, `partner-portal.ts`, `ru/cases/partner-portal.ts`, `vet-clinic.ts:71–72`, `pawly.ts:280,291–292`, `about.ts:78`, `agent-ops-console.ts:403` | все кейсы + About | S001–S003, S012, S020, S026–S028 |

## 5. Отклонённые кандидаты

- Ссылки на `preview/*`, `/kit`, `/500` с публичных страниц — 0 (проверено по всем `a[href]` 32 проходов).

- Mono в HTML-тексте — 0. Моно-подписи на панелях обложки Agent Ops («WHAT THE CUSTOMER READS») — внутри растра, та же обложка принята на главной.
- C2 по большинству CaseScreen (agent-ops, partner) — медиа лежат на сером поле CasePlate; детектор видел белую обёртку.
- L1 ступенька 50 px обложки Agent Ops — намеренный наклон панелей (interlock), как на главной.
- Белые провалы в полностраничных кадрах (agent-ops 2749 px, partner 2131 px) — pin-зоны, шаги сменяются (sheet-C).
- Обрезанный текст (104) — visually-hidden «(external link…)», «Next case: …».
- Footer border-top, «Copyright 2026» — сквозное, есть на эталоне; глифа © нет.
- «камера 4мп уличная» в EN-абзаце partner — документальная цитата исходной строки в кавычках, рядом перевод на обложке. Принято как документальное.
- Reduced motion — конечный кадр обложки совпадает с обычным.
- Focus — видимая рамка у всех проверенных CTA.
- C3 — конфликтов цвета полей с UI не видно.
- 404 двуязычная — архитектурное решение для статической выдачи; остаются только иерархия и порядок (S038).

## 6. Что не проверено

- RU 360 глазами (перенос длинных RU-заголовков и тезисов) — только замер overflow (0).
- Hover-состояния ссылок и карточек, тёмная тема — вне состояния кадров задания.
- Поведение глифов на реальном iOS (emoji-подмена) — только по кодовым точкам.
- Публичные PDF (`cv.pdf`, `cv-ru.pdf`) и тексты внутри OG-картинок — по CONTENT-RULES входят в поверхность, но в задании не значились.
- H2 «повтор шаблона» оценён только на обзорных листах при уменьшении до 480 px.
