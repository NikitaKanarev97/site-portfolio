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
