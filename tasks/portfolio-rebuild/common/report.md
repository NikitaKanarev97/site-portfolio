# Common A — передача на визуальную приёмку

**Приёмка и доводка G, 04.10.2026:** владелец принял A в чате интегратора; запись — integration/a-acceptance.md. Затем указал белые края actual specimens. G-01 исправлен: прозрачный source canvas с сохранением исходной поверхности внутри настоящего контура, целая обводка и CaseScreen native. Новые 26 captures / 24 kit+Portal EN/RU профиля проходят alpha/layout-проверку (integration/corners-verification.json). Ниже сохранён исходный отчёт A на момент передачи; прежние кадры specimens исторические. Принятая версия и её ref описаны в integration/base.md.

04.10.2026. Реализация общего слоя готова к просмотру. Художественная приёмка владельца и фиксация координатором ещё не выполнены. Portal здесь — контрольный фрагмент другого типа истории, не готовый кейс B.

## Посмотреть

Production preview, текущая сборка: [общая витрина](http://127.0.0.1:4340/preview/common/), [kit](http://127.0.0.1:4340/kit/#common-contract).

| Контроль | EN | RU |
|---|---|---|
| Agent Ops, сохранённый checkpoint | [EN](http://127.0.0.1:4340/preview/common/en/agent-ops/) | [RU](http://127.0.0.1:4340/preview/common/ru/agent-ops/) |
| Partner Portal, IA / flow / actual specimen / Outcome | [EN](http://127.0.0.1:4340/preview/common/en/partner-portal/) | [RU](http://127.0.0.1:4340/preview/common/ru/partner-portal/) |

Старый адрес [Agent Ops pilot](http://127.0.0.1:4340/preview/agent-ops-pilot/) использует тот же новый renderer. Старый короткий Portal pilot и опубликованные кейсы продолжают прежний путь. Все новые preview и kit — noindex; canonical у парных preview снят, в sitemap их нет. Navbar и ссылка внизу ведут в парный EN/RU preview; CaseNext — обычная ссылка.

[Контрольное движение](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/recording/central-scene.mp4): настоящий wheel, вперёд и назад, без ретайминга. [Кадры из фильма](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/recording/movie-sheet.jpg). Последний материал целый, обе кнопки видны; $420 workspace и $340 approval остаются разными fixtures.

## Что реализовано и замораживается

Действующий интерфейс описан в [ds/story-contract.md](D:/Claude-projects/Site-portfolio/ds/story-contract.md). `CaseStory = {theme,plate,cover,facts,blocks,prototype?}`. `next` приходит внешним prop. `CaseBlock` — union thesis / numbers / artifact / comparison / process / steps / shot / detail / specimen / outcome. Порядок и количество выбирает автор истории. Stable ID, evidenceId/mediaId и разрешённый motion вариант находятся в данных; timing/GSAP остаются в общем исполнителе. `defineStory` проверяет IDs, modes, specimen groups/states и обязательные evidence/tradeoff Outcome; `assertStoryPair` проверяет структурную парность EN/RU.

Frozen common files:

- `ds/CONTRACT.md`, `ds/story-contract.md`, `ds/foundation.md`, `ds/components.md`, `ds/patterns.md`, `ds/motion-concept.md`, `ds/tokens.css`, `ds/motion.js`, общий `ds/screens/case.md`.
- `src/copy/cases/story.ts`; `src/components/CaseStory.astro`, `CaseSpecimen.astro`, все существующие `Case*.astro`; `Diagram.astro`, `DiagramCanvas.astro`; `src/data/diagrams/schema.ts`; `src/lib/diagram.ts`.
- `src/scripts/animations.js`, `src/scripts/motion.js`, `src/styles/tokens.css`, `src/styles/specimen-fonts.css`; сохранённые pilot support `MetaList.astro` и `src/styles/global.css`.
- `PageShell.astro` / `BaseLayout.astro`: добавлен только optional `localePaths` для пары изолированных preview, публичные defaults прежние.
- `scripts/harmony-check.mjs`, `scripts/check-scoped-css.cjs`; `/kit` и общий preview.

`LegacyKitStory` — тип исторического fixture `/kit`, а не второй renderer новых историй. Опубликованные EN/RU `[slug]` пока используют существующие `section`-данные; подключение новых готовых кейсов и реестр принадлежат G. Публичные case copy, главная, реестры и индивидуальные case maps в A не редактировались.

Точные данные примеров: `src/copy/pilot/agent-ops.ts` (прежний материал перенесён в четыре ordered blocks); `src/copy/common/agent-ops.ts` (EN/RU контроль), `src/copy/common/partner-portal.ts` (EN/RU фрагмент), `src/data/diagrams/common/portal-map.ts`, `portal-flow.ts`. Следующие case-чаты создают собственные copy/media/diagram data и `tasks`; общие изменения направляют интегратору.

## Mobile и настоящая система продукта

`GraphDiagram.mobile` задаёт другую геометрию тех же node/edge IDs. Labels, формы, функции, yes/no и логика общие. `DiagramCanvas` — один renderer; `Diagram` выбирает целую композицию по bp-md, скрытый вариант не создаёт draw сцены. При resize завершённое объяснение остаётся полным. Старые схемы без mobile могут прокручиваться внутри контейнера.

`Specimen` содержит live foundation, продуктовые цвета, локализованные groups, sets и выбранные states с настоящими `ShotItem`. Groups задаются данными, Portal названия не зашиты в renderer. Новый тонкий `CaseSpecimen` составлен из CasePlate, CaseScreen и native table: общие CaseShot/Carousel не дают одновременно foundation и вертикальные реальные матрицы. Он описан в каталоге до реализации.

На 1440 — foundation 35%, матрицы 65%; на 1024 foundation занимает верх, матрицы остаются в двух колонках; на 390/360 — последовательные материалы и отдельные foundation records. Реальные адаптивные source DOM captures 288 CSS px / DPR2, не уменьшенный desktop sheet. 13 состояний четырёх настоящих семейств: ResolutionRow, FileUpload, Availability, QuantityStepper. Все выбранные состояния видны в статике. `nativeWidth` ограничивает увеличение маленьких controls. Настоящий Inter загружен отдельным font-face, OFL приложен. UI source остаётся EN, окружающий рассказ и alt — EN/RU.

Источники Portal использовались только для чтения: accepted `b2b-dssl/storybook-static` от 14.09.2026, refinement closeout 11.09, текущие stories/tokens, D007–D010, sitemap и xls-to-order flow. [Паспорта](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/artifact-plan.md) написаны до capture; последующие уточнения сохранены отдельно. [Evidence](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/evidence.md), [media](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/media.md), [capture registry](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/captures.json) содержат источник, версию, fixture, viewport/DPR, размеры и SHA256. Проверены 12 source файлов и 26 captures, хеши совпадают.

## Сверка с закреплёнными эталонами

В сравнительных листах оригинал слева, текущий результат справа; обе половины приведены к ширине 900 только для обзорной сверки. Реальные кадры UI в сайте сохраняют собственный размер.

| ID | Сохранённые детали | Адаптация | Доказательство |
|---|---|---|---|
| HA-MAP-01 | Белые узлы, тонкая гребёнка без стрелок, пунктир функций, синий квадрат внутри верхнего правого угла | Portal: 7 выбранных экранов, собственные функции; vertical mobile. Новый semantic `diagram-screen-badge` → sky-700, white number в обеих темах | [kit](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-kit-map.png), [Portal](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-portal-map.png) |
| HA-FLOW-01 | Шапка с линией, старт с чертой, прямоугольник / ромб / параллелограмм, yes/no на выходах, открытые стрелки | Portal: импорт, ручное решение, отдельная коммерческая дельта, явные возвраты. Одна выбранная цепочка вместо двух сценариев донора | [kit](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-kit-flow.png), [Portal](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-portal-flow.png) |
| HA-DS-01 | Четыре foundation колонки, палитра ниже, большая правая область, вертикальные состояния семейства, пунктир | 6 реальных Inter ролей, 10 цветов, 4 actual domain семьи / 13 состояний; adaptive cards 288, две колонки; отдельно целое применение. Source Missing → Request item, Error → Fix line, Confirmed → was Ambiguous / Undo | [kit, условный fixture](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-kit-library.png), [Portal actual](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-portal-specimen.png) |
| HA-PROTO-01 | Рамки экранов, content hints, hotspot внутри конкретного wireframe, ортогональные стрелки, внешние связи за поле | Только условный kit fixture, явно маркированный. Не объявлен настоящим прототипом Portal/Agent | [kit](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/reference-kit-prototype.png) |

Четыре оригинальных references входят в тематическую базу, в public media не скопированы.

## Кадры для приёмки

| Материал | Desktop | Mobile |
|---|---|---|
| Agent cover EN | [1440](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-1440-cover.png) | [390](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-390-cover.png) |
| Agent static sequence EN | [1440](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-1440-human-checkpoint.png) | [390](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-390-human-checkpoint.png) |
| Agent RU | [cover](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-ru-1440-cover.png) | [cover](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-ru-390-cover.png), [sequence](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/agent-ops-ru-390-human-checkpoint.png) |
| Portal IA EN | [1440](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-1440-shared-specification.png) | [390](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-390-shared-specification.png) |
| Portal specimen EN | [1440](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-1440-domain-system.png) | [390](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-390-domain-system.png), [foundation detail](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-390-foundation-detail.png) |
| Portal RU flow / outcome | [flow](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-ru-1440-buyer-decision.png) | [flow 360](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-ru-360-buyer-decision.png), [outcome](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/shots/partner-portal-ru-390-shipped-redesign.png) |

## Проверки

- `npm run build`: 24 статических страницы. `npm run check -- --minimumFailingSeverity error --minimumSeverity error`: 99 файлов, 0 errors. Фильтр убирает несодержательные hints из встроенных public prototypes, порог ошибок не ослаблен.
- `check:css`: 24 маршрута, 0 dead rules. Любые новые `/preview` находятся автоматически; дополнительные routes задаются CLI. Проверка теперь возвращает exit 1 при нарушении.
- Harmony: 6 маршрутов × 4 ширины 1440/1024/390/360; дополнительно 5 × 4 с height 600. Сохранены пределы caption/para/case, orphan lines, поля plate, overflow, повтор соседнего медиа. Новые истории учитывают все editorial facts/labels/outcome: Agent EN 402/366, RU 333/305; Portal EN 245, RU 209 слов. Документальные specimen/diagram values и навигация имеют отдельный смысл и не прибавляются к narrative budget. Минимумов слов или числа секций нет.
- Static: 4 preview × 5 окон × reduce/no-JS = 40 профилей. Все факты/важные states видимы; 0 page overflow/blank text/broken visible media/pin spacers/pause controls. IDs/types/evidence/media совпадают между EN/RU.
- Full motion: те же 20 профилей, fast/reverse scroll, live reduce/full; 12 реальных resize переходов. 0 duplicate scenes и page errors. Focus есть от 1024 и height 820, на телефоне/short/reduce выключен. History/Back/Forward пересоздают structural geometry и CaseNext без повторного вступления; hover/focus не останавливают marquee.
- Kit: 15 сочетаний full/reduce/no-JS и пяти окон. Все lazy carousel slides реально посещены перед проверкой медиа. Public: 5 кейсов × EN/RU × 1440/390 = 20 regression профилей в reduce, прежний renderer сохранён.
- Native EN/RU переходы и Back проверены с JS и без него на 1440/390. Navbar destinations также проверены в статике.
- Оба зеркала совпадают побайтово: tokens 31 208 bytes, motion 4 703 bytes. Подробности — `mirrors.json`.
- Финальная визуальная доводка specimen: рамки семейств имеют естественную высоту, короткий FileUpload не растягивается до ResolutionRow. Повторно проверены 8 EN/RU × 1440/1024/390/360 профилей и harmony Portal/kit; кадры обновлены. Результат — `specimen-verification.json`.

Сырые отчёты: `static-verification.json`, `motion-verification.json`, `support-verification.json`, `navigation-verification.json`, `source-verification.json`, `mirrors.json`; команды и logs находятся рядом. CPU probe выполняется отдельно, после завершения browser capture и ffmpeg; результат — `production-probe.json`. Это один локальный замер на профиль, CPU эмуляция, сеть без throttle; физический телефон не проверен.

Production: 8 профилей (2 примера × 1440/390 × CPU 1×/6×), ошибок загрузки/исполнения нет. На 1× frame p95 17–17,2 ms, без кадров >34 ms. На 6× p95 24,6–39,7 ms; самый тяжёлый профиль — focus Agent на 1440 (16 из 200 кадров >34 ms). LCP 152–716 ms, CLS 0–0,00181 на локальной сети. Это граница наблюдения, не гарантия 60 fps на слабом устройстве; художественное движение и настоящие панели сохранены.

## Тематическая база и оставшиеся границы

`base/manifest.json`, `base/files.txt`, `base/common-theme.zip` и `base/README.md` задают воспроизводимый overlay над Git HEAD `62304d8e555193a26926b673a56ba13f631ecd7e`. Включены нужные принятые pilot/DS support, новый schema/renderer, checks, media, текущие документы и все четыре references. Точный список и SHA256 — manifest. Накопленные изменения HHH/LinkedIn/letters и другие несвязанные файлы в overlay не входят. Git index/ветка не менялись; commit/push/deploy не выполнены. Координатор фиксирует принятую базу после визуальной приёмки.

Открытых блокирующих common requests нет: [common-requests.md](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/common-requests.md). Следующие case-чаты не запущены. Portal capture — нынешняя пересборка на демоданных; исходная коммерческая отгрузка подтверждена владельцем отдельно. Полный рассказ и центральная сцена Portal, а также кейсы B–F и главная остаются своими следующими задачами. Новым контрактом проверены два выбранных типа истории; остальные payload варианты опираются на существующие модули и kit, их case-specific композиции требуют своей приёмки.

