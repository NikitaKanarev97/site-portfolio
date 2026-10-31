## Прозрачный контур native компонентов · 05.10.2026

Паспорта программы, четыре Card, TrustHeader и ProgressMeter RU пересняты с прозрачным фоном окружающей страницы. Их собственные скругления, заливки, текст и поля сохраняются. Общий `scripts/lib/native-alpha-capture.mjs` ставит исходный компонент на целочисленный origin и убирает только фон предков; Card сохраняет 2 CSS px bleed. Оба RU capture entrypoints используют этот helper, чтобы прямоугольная подложка не возвращалась при пересъёмке. `node scripts/verify-learn-native-alpha.mjs` проверяет четыре угла всех 28 EN/RU файлов и отображаемых responsive источников на Home и Learn при 390/820/1440 px; `ALPHA_BROWSER=webkit` запускает ту же проверку в WebKit.

## Поля документальных кадров · 05.10.2026

Assessment и Landing EN/RU сняты целыми native DOM-областями с полями исходной страницы. У assessment сохранены PageShell gutters и верх/низ 32 px на mobile, 48 px на 1024 px; белая карточка не касается края. У landing сохранены поля wrap (20 px на mobile, 120 px на 1440 px), целый hero-bottom и нижний интервал. Внешний CaseScreen не заменяет внутренние поля кадра. Повторная съёмка: `node scripts/shoot-learn-frame-fields.mjs`; размеры, SHA256 и четыре поля каждой области — `tasks/portfolio-rebuild/integration/learn-frame-fields-2026-10-05.json`.

## H · текущий художественный delta · 04.10.2026

**05.10.2026 · локализация native кадров.** RU LearnStage использует пять снимков `art-direction/learn-ru`: desktop/mobile материал и паспорт, текущий ресурс 03. RU story выбирает `rebuild/learn-ru`: материал, плеер, завершение, зачёт, лендинг и компоненты в обеих ширинах. Архивный русский каталог общий. Скрипты `shoot-learn-stage.mjs` и `shoot-learn-story-ru.mjs` снимают реальное приложение с `lang=ru` и native Card fixtures. Текст в изображениях не подменяется. Старые `case-learn-ru` не использовались новой композицией: её общая папка `rebuild/learn` и была вторым источником английских кадров.

**H-ART-02, актуально:** LearnStage Home/cover uses a complete native diagnostic section as the shared plane; current unit03/passport supply the learning context. Same onvif-not-found title in both sources. Mobile current unit precedes material; source alpha/radius preserved. Existing CaseRoutes below remain.

Обложка WorkStage связывает материал с паспортом. one-material заменяет общий focus на CaseRoutes: два native раскрываемых контекста одного onvif-not-found, полный UI в выбранном входе; явное завершение постоянно открыто ниже. Без JS те же controls; чтение не становится завершением.

# TRASSIR Learn · full rebuild preview

Дата: 04.10.2026. База Common A: `936724beff3bb9a01c69381659dc808782cc7950`.
Маршруты: `/preview/learn-rebuild/en/`, `/preview/learn-rebuild/ru/`.
Тексты: `src/copy/cases/learn.ts` (`learnStory`, `makeLearnStory`), `src/copy/ru/cases/learn.ts` (`learnStoryRu`, `assertStoryPair`).
Исполнитель: frozen `CaseStory`; data-contract `src/copy/cases/story.ts`.
Медиа: `public/media/rebuild/learn/`. Источник read-only: `D:/Claude-projects/learn`.

Статус: полный локальный rebuild для инженерной проверки и передачи интегратору. Художественная приёмка владельцем отдельно. Штатные `/work/learn`, `/ru/work/learn`, legacy copy exports, реестры, общий слой и соседний продукт не переключены. Старый состав карты доступен в Git на исходном ref; его сентябрьская приёмка не является приёмкой этой композиции.

## Происхождение и границы

Реальный редизайн в DSSL / TRASSIR продолжался несколько месяцев. После ухода автор переосмыслил решение для портфолио в 2026. Здесь нынешняя переработка, а не переданная тогда версия или действующий сайт компании. Основание: `PROJECT-CONTEXT.md`, прямое уточнение автора 08.09.2026. Даты исходного проекта, состав команды и эффект внедрения не придуманы.

Чтение создаёт историю; explicit completion — отдельная запись; assessment — отдельная попытка. Исторический `junction-two-scales.mmd` содержит формулировку automatic completion обеих шкал, которая не применяется к принятому Player. Факт позиции 3/11 не означает завершение трёх материалов.

108 сочетаний состояния/ширины относятся к сентябрьской агентной QA нынешнего прототипа. Это инженерная проверка, не юзабилити с людьми и не метрика обучения. Банк вопросов не прошёл экспертную валидацию; нет официальной сертификации. Проверки аккаунта и документы демонстрационные, storage ограничен браузерной вкладкой. Эти ограничения входят в видимый результат EN/RU.

## Состав страницы

| Stable ID | Модуль / evidence / media | Аргумент и источник | Motion / fallback |
|---|---|---|---|
| cover | proof / learn-origin / cover | Целые TrustHeader, заголовок и lead материала рядом с паспортом программы. Asymmetric composite только из реальных областей текущего UI; мобильный composite вертикальный | Обложка и sheet из общего слоя; без JS полное содержание |
| facts | MetaList | Роль, несколько месяцев исходной работы, текущий прототип после ухода, scope, работающие product/landing ссылки | Статика |
| audit-direction | comparison / learn-audit / archive-catalog | Курсовый вход и баллы видны в архиве. Два callout, направление — рабочий вопрос / программа | Reveal; полный архив остаётся доступен |
| shared-material | artifact / learn-model / learn-content-model | PRD §4.2/5.3, sitemap, MaterialPage, Player: один владелец, два входа и раздельные записи | Draw once; полный граф без движения |
| one-material | steps / learn-completion / material-contexts | onvif-not-found отдельно, в puskonaladka/2 и в конце той же статьи. Действие Complete and continue целое | Один focus-stage от 1024×820; native three-panel flow на mobile, short, reduce и no-JS |
| content-language | specimen / learn-themes / learn-content-theme | Две родные Onest роли, пять semantic цветов, четыре Card content modes, TrustHeader, счётный ProgressMeter | Родной CaseSpecimen, reveal; всё открыто в статике |
| neutral-assessment | shot / learn-trust / assessment | Полное введение и правила assessment в Neutral. Capture заканчивается до следующего раздела; не обрезает контроль | Reveal; реальный narrow DOM |
| public-promise | shot / learn-landing / landing | Пример материала и программы на лендинге: тема в другом редакционном масштабе | Reveal; реальный mobile hero |
| honest-result | outcome / learn-validation | Демонстрируемые маршруты, реальная QA, цена explicit completion, следующие человеческая/экспертная проверки | Статика, без count достижений |
| next | CaseNext | Обычная ссылка на Vet Clinic OS, отдельная ссылка в соответствующую языковую версию прототипа | Общий marquee и click transition; no-JS/reduce обычная ссылка |

Порядок не копирует Portal: content model → общий материал → компактная тематическая система → нейтральная оценка → публичная подача. Визуальное ядро — граница чтения и завершения.

## Артефакты и медиа

Паспорта: `tasks/portfolio-rebuild/learn/artifact-plan.md`; фактура: `evidence.md`; источники и границы кадров: `media.md`; точные размеры, SHA256 и fixtures: `captures.json`; исходные hashes: `source-verification.json`.

- `learn-content-model` следует HA-MAP-01: прямоугольные узлы, ортогональные связи без наконечников, пунктир функций, подчёркивания. Номера отсутствуют, поскольку это сущности. Desktop 132×76 cells, mobile 31×112, одинаковые IDs и пять связей.
- `learn-content-theme` следует HA-DS-01: four-column type table, палитра под ней, широкая область компонентов справа, вертикальные состояния и пунктир семейства. Это тематический subset, не полный каталог. Onest self-hosted из текущего Learn; Golos/Mono остаются настоящими в capture.
- Card взят из accepted Storybook. Args используют реальные title/result/unit count из trajectories; нынешний Home использует MaterialRow, поэтому Card не назван его текущим снимком. Captures 312/288 CSS px, alpha + 2px bleed; compact TrustHeader/ProgressMeter 288px. NativeWidth исключает увеличение мелкого контрола.
- Исторические wireframe-сources прочитаны. В source доступны markdown-спеки; они не выдаются за сохранившиеся изображения wireframe. По процессному правилу case-plan диагноз и новая карта достаточны; полная sitemap и access-flow остаются резервом.

Вокруг общих EN кадров — полная EN/RU редактура, русские alt/captions и native RU diagram. Это документация одной принятой версии продукта; screenshot text не перерисован ради локализации.

## Проверка и передача

Полная матрица и lifecycle: `tasks/portfolio-rebuild/learn/verification.json`, `verification.log`. Статические страницы и ключевые блоки: `shots/`. Движение центральной сцены: `motion/` (исходная browser recording, MP4 и contact sheet без ретайминга). Reference comparisons: `comparison-reference-map.png`, `comparison-reference-theme.png`.

`report.md` фиксирует точный охват, ограничения браузера, checks, known common B-G-01 и commit handoff. Изменений общих tokens, renderer, schema, animations и CSS-mirrors нет. Push и публикация не выполняются в Chat C.

## Технические исправления владельца · 04.10.2026

Новые кадры сохраняют родные голубые поля со всех сторон. Ответ показывает целый первый диагностический раздел; завершение — целый финальный раздел и действие, без обрезанной строки программы. Assessment имеет 32px родного поля до заголовка и после правил. Landing заканчивается на границе hero, до следующего заголовка. TrustHeader и ProgressMeter сняты целиком с прозрачностью внешних углов; внутренние стили продукта сохранены. Архивный каталог заканчивается после первого полного ряда карточек. Источники, границы и hashes — tasks/technical-fixes/captures.json.
## V2 · 31.10.2026 · implementation for independent review

This section supersedes the historical composition below for `/work/learn/` and
`/ru/work/learn/`. New case-scoped renderer: `src/components/learn/LearnCase.astro`.
Shared renderer, tokens, motion registry, adjacent cases and route order remain.
Copy: `src/copy/cases/learn-v2.ts`, RU export in `src/copy/ru/cases/learn-v2.ts`.
Prepared task/storyboard constitute the owner's implementation authorization.
This implementation is not design acceptance.

| Beat | Composition / evidence | Responsive behaviour |
|---|---|---|
| 00 Hero | Light native surface, strong title, two-path thesis; dominant real Home beside one complete Material detail; verified reference-library CTA | Whole native mobile Home; supporting detail omitted below lg |
| 01 Problem | Original archive untouched, alongside concise task argument | Image follows prose; zoom preserves full archive |
| 02 Paths | Two editorial descriptions of reference and learning jobs | Stacked below md; no simulated product controls |
| 03 Architecture | ONVIF Reference and archive-depth Player as explicitly different examples; opening ≠ completion; original content-model graph | Native mobile sources; graph behind keyboard-accessible native details |
| 04 Preparation | Whole programme header/first group/passport; current explicit completion panel | Whole mobile passport; complete native mobile completion panel in both layouts |
| 05 Workspace | Both complete progress cards, learner versus reader | Native stacked mobile progress cards; no cropped count strips |
| 06 Assessment | Complete failed/passed results with next actions; whole wrong-answer record | Real localized mobile layout and complete question/answer/source |
| 07 Outcome | Connected flows, deliberate-completion trade-off, next human/expert validation, verified live reference and landing links | Stacked content; shared localized CaseNext to Vet |

V2.1: `public/media/case-learn-v2/current/{en,ru}/`, 44 lossless DPR-2 WebP files
(1,880,034 bytes). Source: integrated Learn main e9ac4b0, embedded by portfolio
main 49d2fb0. Reproduce with scripts/learn-v2/capture-current.mjs; exact targets,
native/pixel widths and fields are in src/data/learn-v2-media.json. All old public
V2 root crops were removed. The 23 prepared historical PNG originals remain in
the audit folder. New EN images are genuine EN UI; RU images are genuine RU UI.
No raster translation, repainting or fabricated document area.

V2.3 owner clarification supersedes V2.1's universal extra frame. All screenshot
canvases retain radius-media (16 px). Home, Reference, Player and Programme use
one native coloured canvas, with no external white/grey nesting. Default framed
details/results keep equal frame-inset (16/24 px); zoom also keeps its fields and
16 px rounding. Native details retain captured transparent fields; page regions
keep native gutters. Every selected block/question is complete.

The hero has Home + one answer in one desktop row; no trailing programme card or
generic capture instruction. Programme evidence appears only in beat 04. Home's
blue canvas is extended by 24 CSS px per side on desktop / 16 on mobile, keeping
UI content at exactly the same size and page coordinates. Four new DPR-2 captures
are in public/media/case-learn-v2/composition/{en,ru}; the current manifest points
to them. Reproduce all media with scripts/learn-v2/media.mjs (static source on
4415). Capture geometry: audit/trassir-learn-case-v2/composition-v23/home-canvas.json.
Other cases remain a later pass after Learn.

Home: Learn-only `LearnHome` composition in WorkStage, localized two-path thesis,
native responsive Home crop and one normal case link. EN/RU registry and OG
identity remain TRASSIR Learn. No change to other WorkStage branches.

Motion: existing lines/fade/rise/fade-image via shared lifecycle. No pin or new
timings. MediaZoom, Escape/focus return and no-JS image links remain shared.
Checks and exact before/after evidence: `audit/trassir-learn-case-v2/REPORT.md`.
