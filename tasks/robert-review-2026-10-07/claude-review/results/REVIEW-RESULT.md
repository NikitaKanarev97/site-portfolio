# Проверка исправлений по фидбэку Роберта

## Версии и условия

- **Проверяющий / дата:** Claude (Opus 5.5), 07.10.2026. Исходники, git и деплой не трогались.
- **Старый URL / версия:** https://kanarev.com/. Отдаёт Vercel с заголовками `Last-Modified: Tue, 06 Oct 2026 13:56:21 GMT` и ETag `12abbd8acc74e40f9ce80dd418bd866a`. Это время идёт через ~10 минут после коммита `0dda338` (06.10 16:46 +03), разметка структурно совпадает с HEAD. Считаю это опубликованной версией HEAD до правок. Ограничение: сопоставление сделано по времени и разметке, сборочный ID Vercel я не сверял.
- **Локальная версия:** `astro dev` на http://127.0.0.1:4410/, ветка `codex/portfolio-integration-g`. HEAD и origin/main указывают на `0dda3387860b5cd49a8a5a296eb5d33824d03e06`, в рабочем дереве 412 незакоммиченных путей. Это dev-режим, production-сборку я не запускал. Тулбар Astro dev скрыт в кадрах стилем `astro-dev-toolbar{display:none}`.
- **Viewport и локали:** 1440×900 и 360×780, DPR 1; EN `/`, RU `/ru/`. Порядок съёмки: networkidle → `document.fonts.ready` → 3 с на intro → прокрутка всей страницы шагом 300 px → 2,5 с → кадр участка.
- **Инструменты:** Playwright + Chromium 1243 (headless). Проверены keyboard focus (Tab / Shift+Tab), hover, клик Copy email с чтением буфера, mobile-меню, `prefers-reduced-motion: reduce`. Замеры лежат в `logs/metrics-all-1440_360.json`, `logs/metrics-summary.txt`, `logs/shoot2.json`; результаты content-check — в `logs/f45-rendered.tsv` и `logs/f45-crawl.txt`.
- **Кадры:** `evidence/{old|local}-{en|ru}-{1440|360}-{участок}.png`. Склейки `evidence/cmp-*.png` показывают старое слева и локальное справа, между ними пурпурный разделитель. Склейка 360 обрезает правую половину по ширине старого кадра. Края сцен на 360 проверены замером: все стоят в 24–336 px, симметрично.

## Ответ на главный вопрос

**Все ли указанные проблемы устранены?** **Нет.**

Основание: большая часть замечаний (38 из 45) визуально закрыта на Home EN/RU при 1440 и 360. Но один явный пункт не закрыт в полном кейсе: F44, pause-глиф в cover Agent Ops. Ещё пять пунктов закрыты частично: F09, F29, F41, F42, F45. Регрессий по исходным пунктам нет.

Статистика: **исправлено 38; частично 6; не исправлено 0; регрессия 0; не проверено 0; обоснованное отклонение 1.** Сумма 45.

> F44 записан как «частично»: Home исправлен, cover кейса — нет. Если считать по поверхности cover, это «не исправлено».

## Покрытие пунктов

| ID | Место | Старое состояние | Локальное состояние | Вердикт | Доказательство | Осталось |
|---|---|---|---|---|---|---|
| F01 | Home → Agent Ops → Read the case | Под «→» отдельная линия | Ссылка без подчёркивания, стрелка SVG. Вынесена под сцену, на белое поле. Focus-рамка видна, hover даёт затемнение цвета | исправлено | cmp-en-1440-agent.png; crop-local-en-1440-focus-agent-cta.png; local-en-1440-hover-portal-cta.png | — |
| F02 | Home → Portal → «02» | Мелкий mono-номер у базовой линии | Номера проектов сняты у всех пяти | исправлено (номер удалён — допустимый вариант) | cmp-en-1440-portal.png | — |
| F03 | Home → названия проектов | 64 px / 700 (Pawly 96) | 96 px / 800 у всех пяти на 1440, без обрезки; на 360 по-прежнему 32 px / 800 | исправлено | cmp-en-1440-home-full.png; metrics-summary.txt | — |
| F04 | Home → Portal → SOURCE ROW над 38 | Mono-надпись над числом | Надпись снята, 38 — первый якорь | исправлено | local-en-1440-portal.png | — |
| F05 | Home → Portal → белая карточка вокруг UI | Карточка в карточке | Внешний белый слой снят, UI лежит на цветном поле. В Agent и Learn тоже нет белых рамок | исправлено | cmp-en-1440-portal.png; cmp-en-1440-agent.png | — |
| F06 | Home → Portal → фон | Бледно-голубой | Насыщенный лавандовый | исправлено | cmp-en-1440-portal.png | — |
| F07 | Home → Portal → фон и серо-лавандовое окно UI | Голубое поле + белая рамка + серо-лавандовое окно | Окно UI на лавандовом поле того же тона, реальные пиксели UI не перекрашены | исправлено (оценка субъективная) | local-en-1440-portal.png | Разделение держится на небольшой разнице светлоты; при желании Роберта — тонкая граница окна |
| F08 | Home EN → Portal → цитата | «камера 4мп уличная» в EN | EN: “4 MP outdoor camera”; RU: «камера 4мп уличная» · 8 шт. Документальная строка внутри скриншота сохранена | исправлено | cmp-en-1440-portal.png; cmp-ru-1440-portal.png | — |
| F09 | Home → Portal → подписи у 38 | SOURCE ROW + цитата + «· 8 units» | SOURCE ROW снят. В EN «· 8 units» переносится отдельной строкой, начинающейся с точки (1440 и 360). Добавлена новая мелкая серая подпись «Demonstration example» / «Демонстрационный пример» | **частично** | local-en-1440-portal.png; cmp-en-360-portal.png | См. незакрытые |
| F10 | Home → Vet → outcome | Под названием | Справа, как у остальных; на 360 — под названием | исправлено | cmp-en-1440-vet.png; cmp-en-360-vet.png | — |
| F11 | Home → Vet → мини-теги над UI | MARSIK · DEMO VISIT, 01 · VETERINARIAN · TABLET | Тегов нет | исправлено | cmp-en-1440-vet.png | — |
| F12 | Home → Vet → SAVED → PUBLISHED | Отдельная строка | Строки нет; времена внутри UI сохранены | исправлено | cmp-en-1440-vet.png | — |
| F13 | Home → Vet → стык панели и следующей подписи | Вплотную | Desktop: три колонки с ровными промежутками. 360: стопка с ровными зазорами, без подписей между панелями | исправлено | cmp-en-1440-vet.png; cmp-en-360-vet.png | — |
| F14 | Home → Vet → белый UI на белом | Сливается с сайтом | Шалфейная подложка сцены, без лишней карточки | исправлено | cmp-en-1440-vet.png | — |
| F15 | Home → Vet → верхи карточек | Ступеньки | Три карточки на одной верхней линии | исправлено | cmp-en-1440-vet.png | — |
| F16 | Home → Vet → пояснения | Теги по сцене + строка Thirty seconds | Одно пояснение внутри сцены и одна подпись под ней | исправлено | cmp-en-1440-vet.png | — |
| F17 | Home → Pawly → композиция | Фото и отчёт на разных высотах, без осей | Фото и Walk report стартуют по одной верхней линии сразу под шапкой; outcome справа по общему шаблону | исправлено | cmp-en-1440-pawly.png | — |
| F18 | Home → Pawly → промежуток | Большой провал | Узкий ровный зазор, без обрезки | исправлено | cmp-en-1440-pawly.png | — |
| F19 | Home → год в превью | «2026» / «2024–2026» под каждой сценой | Годы в превью убраны совсем; 2024/2025 не подставлены. Год остаётся в футере и в реальных датах внутри кейсов | **обоснованное отклонение** | cmp-en-1440-home-full.png | Совет «написать 2024/2025» буквально не выполнен, потому что даты были бы выдуманы. Цель (нет россыпи свежих дат) достигнута |
| F20 | Home → Selected web builds / How I work | 24 px против 32 px | 32 и 32 px (на 360 — 24 и 24) | исправлено | cmp-en-1440-dev.png; metrics-summary.txt | — |
| F21 | Home → How I work перед контактом | Тот же шаблон, что у контакта | How I work — строка: заголовок + три шага; контакт — огромный заголовок + email | исправлено | local-en-1440-about.png; local-en-1440-contact.png | — |
| F22 | Home → Let's talk | 32 px | 128 px (на 360 — 48 px), email переносится по «@», без overflow | исправлено | local-en-1440-contact.png; local-ru-360-contact.png | — |
| F23 | Home → контакт → Copy in one click | Подсказка под email | Подсказки нет; адрес — крупная ссылка `mailto:` | исправлено | local-en-1440-contact.png; shoot2.json | — |
| F24 | Home → иконка CV (PDF) | Текстовая стрелка → (риск emoji) | SVG-стрелки у всех CTA и контактных ссылок; текстовых ↓→↗↔↙ на главной ноль | исправлено | local-en-1440-contact.png; metrics-summary.txt (glyphs '') | — |
| F25 | Footer → Armenia · UTC+4 mono | JetBrains Mono | Onest; география и время удалены | исправлено | cmp-en-1440-footer.png | — |
| F26 | Footer → © | «© 2026» | «Copyright 2026» / «Авторские права 2026» | исправлено | cmp-en-1440-footer.png; metrics-summary.txt | Формулировка RU «Авторские права 2026» звучит канцелярски — вкус, не блокер |
| F27 | Home → масса Portal | Голубое поле с белой карточкой выбивалось | Portal собран тем же приёмом, что Agent: цветное поле во всю ширину, UI без рамки. Высоты сцен: Agent 739 / Portal 644 / Learn 1150 / Vet 1070 / Pawly 1116 | исправлено | cmp-en-1440-home-full.png; shoot2.json | Portal и Agent — две «короткие» сцены; это следует из их UI, не выбивается |
| F28 | Home → линии под превью | Горизонтальная линия над годом у каждой работы | Линий нет; разделение держат сцены и интервалы 192 px | исправлено | cmp-en-1440-home-full.png | — |
| F29 | Home → Read the case | Сплошное подчёркивание текста и стрелки | Read the case без линии у всех пяти, focus виден. Но в hero «Download CV (PDF)» по-прежнему с постоянным подчёркиванием, а соседняя «Copy email» и «CV (PDF)» в контактах — без него | **частично** | local-en-1440-hero.png; local-en-1440-hero-copy-clicked.png | См. незакрытые |
| F30 | Home → Learn → Reference ↔ Learning path | Глиф ↔ | Фраза «An answer in the reference, the same resource in a learning path.» | исправлено | crop-local-en-1440-learn-top.png | — |
| F31 | Home → Learn → One material и следующий слой | Крупный заголовок, линия и REFERENCE · ONVIF MATERIAL вплотную | One material стал подзаголовком сцены, линия и подписи-слои сняты, до карточек ~32 px | исправлено | crop-old-en-1440-learn-top.png; crop-local-en-1440-learn-top.png | — |
| F32 | Home → Learn → «03» и «↙» | Внешний декоративный слой | Снят; номер ресурса 03 внутри UI сохранён | исправлено | cmp-en-1440-learn.png | — |
| F33 | Home → Learn → пустой угол | Пустой левый нижний угол возле белой карточки | Обе колонки закрываются по одной нижней линии | исправлено | cmp-en-1440-learn.png | — |
| F34 | Весь сайт → mono и микротеги | JetBrains Mono в номерах, тегах, email, футере | Ноль текстовых элементов в mono на Home EN/RU, About и пяти кейсах; Onest грузится и с латиницей, и с кириллицей | исправлено | metrics-summary.txt (mono []); проба кейсов — 0 элементов | Mono-подписи остались только внутри растровых скриншотов UI — это документальные пиксели |
| F35 | Home → ритм | Межсекционный отступ 128 px | 192 px между секциями и между работами; тесных стыков и провалов нет на 1440 и 360 | исправлено | cmp-en-1440-home-full.png; shoot2.json | — |
| F36 | Шапка → NK и меню | Тяжёлый знак | Знак меньше, меню легче. Кнопка Menu на 360 — 52×48 px, раскрывается (aria-expanded false → true) | исправлено | cmp-en-1440-nav.png; local-en-360-menu-open.png | — |
| F37 | Hero → Product Designer справа | Висит у правого края | Рядом с именем у левой оси (EN/RU, 1440/360) | исправлено | cmp-en-1440-hero.png; local-ru-360-hero.png | — |
| F38 | Hero → h1 | 96 px | 112 px, общая левая ось, RU на 360 без overflow (scrollWidth = viewport) | исправлено | cmp-en-1440-hero.png; local-ru-360-hero.png | — |
| F39 | Акцент | Приглушённый томатный | Насыщенный красный rgb(212,50,32); на белом читается, focus-рамка того же цвета видна | исправлено | cmp-en-1440-hero.png; crop-local-en-1440-focus-contact.png | — |
| F40 | Hero → индекс работ | Номера, ↓, линии, Research/Design/Build | Один вертикальный индекс из пяти ссылок рядом с портретом, все пять якорей ведут на свои превью | исправлено | cmp-en-1440-hero.png; cmp-en-360-hero.png; metrics (href #work-*) | — |
| F41 | Hero → email/copy | Mono-email + Copy email + подписи | Шрифт общий, копирование работает (в буфере адрес, появляется «Copied»). Но адрес `.copy-email__hint` прижат к верху 48-px кнопки (top 634 при центре текста кнопки ~658) и стоит на ~12 px выше строки «Copy email». После клика «Copied» так же приподнят | **частично** | local-en-1440-hero.png; local-en-1440-hero-copy-clicked.png | См. незакрытые |
| F42 | Hero / About → портрет | Тот же кадр | Файл `/media/about/portrait.webp` не изменён; портрет только уменьшен в композиции (192 px). Подтверждённого другого снимка нет (reports/02-result.md) | **частично** | cmp-en-1440-hero.png | Нужен другой реальный снимок владельца |
| F43 | Home → шапки пяти работ | Agent внутри тёмного поля, остальные снаружи | Все пять: название слева снаружи сцены, outcome справа | исправлено | cmp-en-1440-home-full.png | — |
| F44 | Agent → gate (Home и cover кейса) | Глиф «‖» + HUMAN REVIEW | Home: иконка человека + «Human review», в том числе в reduced-motion. **Cover `/work/agent-ops-console/` не изменён:** две толстые вертикальные полосы + HUMAN REVIEW, и в обычном, и в reduced-motion режиме. `src/components/CaseCover.astro` не менялся, `.case-opening__gate-line` рисует `border-inline` | **частично** | local-en-1440-rm-agent.png; cmp-en-1440-case-agent-cover-normal-top_rm-bottom.png | См. незакрытые |
| F45 | Все публичные EN/RU поверхности | «Concept · …» на Home (Vet, Pawly), «CONCEPT · NOT DEPLOYED IN A CLINIC», «Independent concept», «Самостоятельный концепт», «Concept.» в meta Vet | 14 маршрутов (Home, About, 5 кейсов × EN/RU): в тексте, alt/aria/title, meta и JSON-LD ноль «concept/концепт/pet project». 14 OG-картинок и `cv.pdf`/`cv-ru.pdf` чистые. Но в превью Home вместо Concept стоят статусные подписи: «Demonstration example», «Commercial redesign · reconstruction shown», «Work project · current reinterpretation», «A demonstration handover photo…» (RU: «Демонстрационный пример», «показана реконструкция», «нынешнее переосмысление») | **частично** | logs/f45-rendered.tsv; evidence/local-og-sheet.png | Нужно решение владельца по замещающим статусам, см. незакрытые |

## Незакрытые проблемы

1. **F44 — P1.** Полный кейс `/work/agent-ops-console/` (и RU), cover на первом экране: между панелями две вертикальные полосы «‖» и HUMAN REVIEW. Это ровно ложный pause-affordance из замечания, и он виден в обычном и в reduced-motion режиме. Кадр: `evidence/cmp-en-1440-case-agent-cover-normal-top_rm-bottom.png`. **Исправление:** в `src/components/CaseCover.astro` (стр. 120, 350–353, 367) заменить `.case-opening__gate-line` тем же знаком, что на Home в WorkStage (иконка человека + «Human review»), или убрать линии. Затем проверить итоговый кадр анимации `data-cover-gate` в `src/scripts/animations.js` и reduced-motion.
2. **F45 — P2, решение владельца.** Home EN/RU, подписи под сценами: Portal — «Demonstration example» и «Commercial redesign · reconstruction shown»; Learn — «Work project · current reinterpretation»; Pawly — «A demonstration handover photo and a dated return report». В кейсах есть «Independent reconstruction on synthetic data», «One demo booking; no live GPS…», в RU Learn — «РАБОЧИЙ ПРОЕКТ · ПЕРЕОСМЫСЛЕНИЕ 2026». По CONTENT-RULES («не заменять Concept другой оправдательной плашкой…, дополнительные статусы убрать») это пограничные случаи. Пояснения про NDA и синтетические данные внутри текста кейса допустимы как факт. **Исправление:** на Home заменить строку-статус на описание работы (как уже сделано у Vet и Pawly: «Product design · clinic role flows»), снять «Demonstration example». В кейсах оставить раскрытие про NDA и синтетические данные внутри повествования, а не плашкой.
3. **F09 — P2.** Home EN, Portal, 1440 и 360: строка «· 8 units» начинается с висящей точки, под ней новый мелкий слой «Demonstration example». Кадры: `evidence/local-en-1440-portal.png`, `evidence/cmp-en-360-portal.png`. **Исправление** в `src/copy/case-art.ts` / `src/components/WorkStage.astro`: убрать разделитель «·» в начале переноса (сделать «8 units» отдельной строкой без точки или запретить перенос перед ней) и удалить «Demonstration example».
4. **F41 — P2.** Home hero, 1440: адрес рядом с «Copy email» стоит на ~12 px выше строки; после клика «Copied» тоже приподнят. Кадры: `evidence/local-en-1440-hero.png`, `evidence/local-en-1440-hero-copy-clicked.png`. **Исправление:** в `src/components/CopyEmail.astro` выровнять `.copy-email__hint` и статус по базовой линии или центру кнопки (`align-items: baseline/center`), либо поставить адрес отдельной строкой под действиями.
5. **F29 — P3.** Home hero: «Download CV (PDF)» (`ds-link ds-link--inline`) с постоянным подчёркиванием рядом с неподчёркнутыми action-ссылками. **Исправление:** перевести CTA hero на тот же вариант TextLink, что «CV (PDF)» в контактах, в `src/pages/index.astro`.
6. **F42 — P3, нужен материал владельца.** Портрет тот же файл. Пункт закрывается только другим реальным снимком; генерировать замену нельзя.

## Непроверенные условия и отклонения

- Сравнение шло со старым сайтом на kanarev.com и локальным **dev-сервером**. Production-сборку и preview я не делал, чтобы не конкурировать с общим Astro cache. Перед публикацией нужна одна свежая сборка с `npm run check:content -- --dist …` и просмотр Home из dist.
- Полные кейсы проверены на 1440 EN: первый экран всех пяти, reduced-motion для Agent, meta/OG, отсутствие mono и overflow. Остальные экраны кейсов выборочно не листались: в чеклисте они не указаны, кроме F44.
- Браузер — только Chromium. На Safari/iOS emoji-подмену стрелок я не проверял, но текстовых стрелок на главной больше нет, все маркеры SVG.
- Zoom 200% не проверялся.
- F19 — обоснованное отклонение: годы убраны, выдуманные 2024/2025 не подставлены.
- Вне фидбэка Роберта (не включено в счёт): в контакте главной текст «If the case above answered your question» стоит под пятью превью, а не под кейсом. Это общий текст из PageShell.

## Следующий шаг

1. Исправить F44 в CaseCover (P1) и пересмотреть cover в обычном и reduced-motion режимах.
2. Владельцу решить по замещающим статус-подписям на Home (F45); затем снять «Demonstration example» и висящую точку (F09).
3. Выровнять email и «Copied» в hero (F41), унифицировать CTA «Download CV» (F29).
4. Одна свежая production-сборка, `check:content` по dist, повторная съёмка Home 1440/360 EN/RU этим же скриптом.

Код и деплой в ходе этого аудита не изменялись.

---

## Перепроверка доводки — 07.10.2026 (Claude, независимо от REVIEW-FOLLOWUP.md)

Проверено на живом dev-сервере http://127.0.0.1:4410/ из текущего рабочего дерева: HEAD `0dda338`, 413 незакоммиченных путей. Кадры исполнителя в `evidence/followup/` как доказательство не использовались. Свои кадры: `evidence/recheck/`, замеры: `logs/recheck-*.json|tsv`.

| ID | Что увидел | Вердикт | Доказательство |
|---|---|---|---|
| F44 | Cover `/work/agent-ops-console/` EN/RU × 1440/360 × normal/reduce (8 вариантов): вместо «‖» SVG человека с подписью «Human review» / «Решение человека», элемента `.case-opening__gate-line` нет, opacity 1. RU-тезис «Между обещанием и выплатой — человек.» на 360 виден целиком. Overflow нет | **исправлено** | recheck/cmp-cover-agent-1440-en-normal_ru-rm.png; recheck/cmp-cover-agent-360-ru-normal_en-rm.png; logs/recheck-cover.json |
| F09 | «“4 MP outdoor camera”, 8 units» — точки в начале строки нет, «Demonstration example» снят (EN/RU) | **исправлено** | recheck/local-en-1440-portal.png |
| F41 | Desktop EN/RU: центры кнопки, адреса и «Copied» совпадают (658/658/658, RU 609/609). Enter копирует адрес в буфер. На 360 «Copied» стоит отдельной строкой под кнопкой | **исправлено** | recheck/crop-hero-actions-en_ru-1440.png; recheck/hero-copied-en-1440.png |
| F29 | «Download CV (PDF)» в hero — без постоянного подчёркивания, со SVG-стрелкой, как остальные действия | **исправлено** | recheck/crop-hero-actions-en_ru-1440.png |
| F45 | Подписи пяти превью на Home EN/RU описывают работу («Product design · product matching and ordering» и т. д.), «Demonstration example» удалён. В 14 маршрутах ноль concept/концепт. В кейсах остались фактические раскрытия (NDA, синтетические данные, демо-данные прототипа) в тексте | **исправлено** | logs/recheck-f45-rendered.tsv |

Регрессий нет: на Home EN/RU 1440/360 изменились только подписи Portal, Learn и Pawly. Hero, остальные сцены и контакты по тексту и высотам прежние; scrollWidth = viewport; mono 0; текстовых стрелок 0. Обложки всех пяти кейсов на 360 EN/RU без выхода за край.

**Итог: исправлено 43, частично 1 (F42 — нужен другой настоящий портрет), обоснованное отклонение 1 (F19). Сумма 45.**

Пограничное место для решения владельца, на счёт не влияет: eyebrow первого экрана Learn «WORK PROJECT · REINTERPRETED IN 2026» / «РАБОЧИЙ ПРОЕКТ · ПЕРЕОСМЫСЛЕНИЕ 2026» и строка фактов «Version shown: Current reinterpretation · interactive prototype» (`src/copy/cases/learn.ts:31`, `:206`). Это правдивое раскрытие, а не «Concept». Но оно стоит плашкой на первом экране; можно перенести в текст кейса.

Не проверено в этой перепроверке: production-сборка (смотрел dev), Safari/iOS, zoom 200%.
