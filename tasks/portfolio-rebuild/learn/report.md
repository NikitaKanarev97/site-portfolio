# Chat C · TRASSIR Learn · передача интегратору

04.10.2026. Полный EN/RU rebuild реализован и локально проверен. Художественная приёмка владельцем не присваивается. Push/deploy не выполнялись.

## Checkout и ref

- База Common A: `936724beff3bb9a01c69381659dc808782cc7950` (`codex/portfolio-common-a-2026-10-04`).
- Ветка: `codex/learn-rebuild-2026-10-04`.
- Worktree: `C:/Users/kanar/.codex/worktrees/learn-rebuild/Site-portfolio`.
- Тематический commit передаётся полным SHA в финальном handoff Chat C; `git rev-parse HEAD` в этой ветке возвращает его после commit. Сам report включён в этот commit.
- Production preview: `http://127.0.0.1:4360/preview/learn-rebuild/en/`, `http://127.0.0.1:4360/preview/learn-rebuild/ru/`. Свободные порты C: 4360 production, 4361 dev, 4362 read-only capture helper; занятые 4350/4352/4353/4354/4355 не использованы.
- После проверок dev/capture helper остановлены; production 4360 оставлен для review. Его временные server logs находятся в ignored `tasks/portfolio-rebuild/learn/tmp/`.

## Что готово

Полная композиция: асимметричная обложка материала и паспорта программы → факты → архивный Audit → Direction → собственная модель общего материала → три остановки того же ONVIF материала → лист контентной темы → нейтральные правила зачёта → лендинг → честный результат и цена → обычный Next.

400 слов EN, 361 RU по действующему harmony-count, без документальных данных артефакта/типографической таблицы. `defineStory` и `assertStoryPair` подтверждают одинаковые stable IDs, evidence/media IDs, группы, состояния и motion. RU имеет полноценный перевод рассказа, alt/captions и native RU диаграммы; документальные UI captures сохраняют EN текста исходника.

`learn-content-model` сохраняет HA-MAP-01: иерархию, функциональные группы, прямоугольные узлы, ортогональные связи без стрелок, пунктир и подчёркивания. Никаких фиктивных номеров экранов. Desktop и mobile — отдельная геометрия одного графа.

`learn-content-theme` сохраняет HA-DS-01: четыре колонки таблицы, palette ниже, более широкую область настоящих компонентов, вертикальные состояния и пунктир групп. Компактная выборка Learn: две реальные Onest Bold роли, пять semantic цветов, четыре Card content modes и две родные контекстные детали. Card — принятый каталожный fixture с реальными названиями/result/count; это не снимок нынешнего Home, где используется MaterialRow. Capture адаптирован к фактическим 312/288px, шрифт продукта не уменьшается из широкого образца. TrustHeader/ProgressMeter — родные компактные 288px.

Один материал `onvif-not-found` показан в reference и `player/puskonaladka/2`, затем настоящий конец с whole completion action. Один shared focus-stage. Native three-panel flow сохраняется при reduce, no-JS, mobile и коротком окне. Motion меняет контекст; чтение не выдаётся за завершение. Neutral и landing доказываются настоящими крупными областями UI, без дорисованных controls.

Исторические markdown wireframes прочитаны и использованы как источники решений; отдельного PNG wireframe в источнике нет. Текущий high-fidelity UI не выдаётся за исторический wireframe. Диагноз + новая модель оставлены по процессному правилу case-plan. Для компактной foundation выбраны две настоящие Bold роли вместо синтеза отсутствующего Semibold. Это документированные адаптации в `artifact-plan.md`.

## Фактура и границы

Реальный редизайн автора в DSSL / TRASSIR, несколько месяцев; после ухода — нынешняя переработка для портфолио. Не заявлены исходные даты отгрузки, команда, live интерфейс компании или внедрение этой версии. Историческая automatic-completion формулировка junction-two-scales отменена accepted Player. QA 108 state/width combinations остаётся сентябрьской инженерной проверкой прототипа, не результатом обучения. Отсутствуют новая человеческая проверка и экспертная валидация question bank; документы/аккаунт checks демонстрационные, storage внутри вкладки. Эти ограничения и цена explicit completion видимы в обеих локалях.

Источники и версии: `evidence.md`, `source-verification.json`. Media provenance / fixtures / dimensions / hashes: `media.md`, `captures.json`, `media-manifest.json`. План артефактов записан до capture и дополнен финальной геометрией в `artifact-plan.md`. Права на media — материалы автора и существующего портфолио; HA references остаются research/QA, не site assets. Onest Bold — существующий bundled font продукта.

## Реальные проверки

| Проверка | Охват / результат |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 101 hints; summary `check.log` |
| `npm run build` | 26 страниц; EN/RU preview в dist; `build.log` |
| `npm run check:css` | Все 26 маршрутов, 0 dead rules, включая оба новых; `css.log` |
| Harmony | EN/RU × 1440/1024/390/360 × height 900 и 600; 0 нарушений, `harmony{,-short}.log` |
| Production browser matrix | 32 сочетания: EN/RU × четыре ширины × full/reduce/no-JS/short. Полный состав, нет page errors, broken media, overflow; native fallback открыт, focus включается только от 1024×820 |
| Focus scroll | Три целых состояния в обе стороны на 1440/1024, без смешанных headings/UI; скриншоты остановок EN/RU |
| Lifecycle | EN/RU live reduce/full, widths 390→1440→1024→360→1440, fast wheel forward/reverse, обычный Next, Back и Forward; 0 кейсовых failures |
| Links | Настоящий locale switch; product/landing EN/RU status 200 и содержательные h1. Deep product URLs обслуживаются существующими wrappers |
| Read-only / frozen | `integrity.json`: ownership whitelist, unchanged source hashes, оба DS/CSS/JS mirrors побайтово совпадают |

Runner: Playwright + установленный Chromium 1243. Skills agent-browser/agent-browser-verify применены; CLI agent-browser отсутствует, поэтому использован локальный Playwright fallback. Не заявлены физические устройства или screen-reader QA. Реальная вторая вкладка в headless оставляет visibilityState=`visible`; hidden-tab suspend/resume не подтверждён, это явное ограничение охвата.

Тестовый runner дожидается реальной загрузки после открытия каждой native области, а на focus — каждой видимой остановки. Первый быстрый scan не трактуется как доказательство broken image: offscreen lazy image ещё не запрошена браузером. Смена состояний проверяется после browser settling, а не на середине кадра. Финальный `verification.json` содержит 32 profile rows + 2 lifecycle rows, 4 link responses и пустой failures. Последний прогон относится к финальным media и build.

Отдельный cold local CPU probe после завершения capture/QA: desktop 1× FCP 300ms / LCP 388ms / CLS 0; mobile full 4× FCP/LCP 668ms / CLS 0.0011; mobile reduce 4× FCP/LCP 352ms / CLS 0. Это по одному initial-viewport замеру без network throttle, не field performance. Long tasks сохранены без сглаживания в `production-probe.json`.

## Визуальная приёмка и motion evidence

Просмотрены финальные desktop/mobile cover, карта, тематический лист, neutral assessment, RU result, HA comparisons и contact sheet. Для страницы сняты полные EN/RU страницы при 1440/390, отдельные ключевые блоки, EN/RU motion stops, no-JS 360 и short end. `shots/` содержит реальные production captures. Перед full-page capture страницы пройдены естественным scroll, чтобы document images были открыты, а не остались offscreen lazy placeholders.

`comparison-reference-map.png`, `comparison-reference-theme.png` — reference слева, нынешний rendered artifact справа. Иерархия/семейства сохранены; адаптации перечислены в паспортах.

`motion/central-raw.webm` — исходная browser recording; `central.mp4` — codec conversion без изменения времени; `timeline.json` — пять реальных остановок forward/reverse; `contact-sheet.png` и `frame-{1…5}.png` — извлечённые кадры с исходными timestamps. Никакого ретайминга или нарисованного перехода. Центральная сцена не зависит от видеофайла: это живой shared focus-stage с полным native fallback.

## Common и интеграция

Единственный общий открытый пункт — уже известный P2 **B-G-01**, assigned **G-integrate-1**: после повторных breakpoint resize Next marquee computed transform остаётся `none`. Воспроизведён EN/RU; link, Back и Forward работают. Детали в `common-requests.md` / lifecycle rows. Новых blockers и новых Common A requests нет. Общий runtime не исправлялся в C.

К интеграции готовы story exports, own diagrams/media, screen map и preview route. Штатные `/work/learn`, `/ru/work/learn` и реестры сохраняют прежнюю явную композицию до решения интегратора. Shared components/schema/renderer/tokens/animations/fonts CSS/package/check scripts и DS mirrors не менялись; корневой checkout и соседний Learn read-only. Следующая операция координатора — review тематического commit и подключение story через штатный общий порядок интеграции.
