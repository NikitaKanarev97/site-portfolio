> Актуальный checkpoint: **G-integrate-1**, приёмка/интеграция B+C и B-G-01 — [wave-1-report.md](wave-1-report.md). Ниже сохранён исторический G-base. Точный updated ref и воспроизведение — [base.md](base.md).

# G · checkpoint общей базы · 04.10.2026

**G-base завершён.** Принятая владельцем A с исправлением G-01 зафиксирована локально, воспроизведена в чистом checkout и доступна для первой волны B/C. Независимая подготовка оболочки G проверена и сохранена отдельно. Это промежуточный отчёт: пяти новых принятых stories и финального сайта пока нет.

## Refs и владение

| Пакет | Полный ref | Назначение |
|---|---|---|
| Принятая A + G-01 | `936724beff3bb9a01c69381659dc808782cc7950` | Точная база B/C; alias `codex/portfolio-common-a-2026-10-04` |
| Независимая оболочка / G checkpoint code | `68b608a34c382ee80c24ae15f0a45277e2277db7` | Nav/contact/service/OG/logo и отчёты подготовки; ветка `codex/portfolio-integration-g` |

Parent принятой A — `62304d8e555193a26926b673a56ba13f631ecd7e`. Оба commits тематические: исходные несвязанные tracked/untracked изменения сохранены и не включены. Main, push, deploy и соседние продуктовые проекты не менялись. Подробный состав, provenance, интерфейсы и запуск — `base.md`; 277 integrity-файлов — `base-manifest.json`/`base-files.txt`; 37 файлов следующего commit G — `g-base-files.txt`. Этот отчёт и `g-base-handoff.md` добавлены последующим commit документации.

Общими schema/renderer/components/DS/motion владеет G после приёмки A. B–F передают только свою историю и материалы; изменения общей композиции проходят через конкретный common request. Очередью чатов и `orchestration/STATE.json` владеет отдельный контроллер, G эти файлы не редактировал.

## Приёмка версий и порядок

| Владелец | Версия / статус | Публичный маршрут |
|---|---|---|
| A | Принята владельцем: «Принимаю A — зафиксировать общую базу»; G-01 закрыт в ref A | Четыре контрольных preview и /kit |
| B Portal | Новая полная story не получена, ref отсутствует | Legacy `/work/partner-portal/` и RU |
| C Learn | Новая story не получена, ref отсутствует | Legacy `/work/learn/` и RU |
| D Vet | Новая story не получена, ref отсутствует | Legacy `/work/vet-clinic/` и RU |
| E Pawly | Новая story не получена, ref отсутствует | Legacy `/work/pawly/` и RU |
| F Agent Ops | Новый пакет штатного переноса не получен, ref отсутствует | Legacy `/work/agent-ops-console/` и RU; Common checkpoint сохранён |

Контрольный Portal A не подменяет B. Ни один неподготовленный entry не перенесён в public routes. Исходные slugs, registries и порядок Agent Ops → Portal → Learn → Vet → Pawly сохранены. Финальная главная, рекомендация порядка, сравнение реальных финальных обложек и первых двух экранов зависят от пяти готовых историй и остаются следующим этапом. Наличие старых кадров, PASS-логов и нынешних публичных обложек не является их приёмкой. Текущий инвентарь — `handoffs.json`.

## Закрытые правки

**G-01 — аккуратный край actual specimen.** У первого исправления сохранился непрозрачный body фон Storybook, поэтому вокруг красной рамки появился белый прямоугольник. Финальный capture снимает фон html/body/root inline `!important`; если у корня продукта нет своей заливки, исходный canvas сохраняется внутри его собственного контура. Capture имеет alpha и bleed 2 CSS px. CaseSpecimen применяет общий `CaseScreen native`, без маски radius/shadow портфолио. Родные поля, состояния, шрифты, цвета и радиусы продукта сохранены. 26 captures пересняты; соседний b2b-dssl остался read-only. Кадры `shots/corners-availability-*`, `corners-upload-*`, `corners-resolution-*` показывают финальный результат. Старые comparative sheets A исторические, финальный контур сверять по G-кадрам.

**G-02 — native navigation/contact без JS.** До инициализации меню реальные ссылки Work/About/Contact/EN/RU видны и на телефоне. При работающих обработчиках появляется прежняя modal panel. AbortController удаляет обработчики старого Navbar при Astro swap; focus trap, Escape, resize и unlock работают после Back. Contact получил прямую mailto-ссылку в обеих локалях; CV использует существующие PDF. Носcript объясняет доступный просмотр и контакт.

**G-03 — метаданные и служебные страницы.** Общая карта выдаёт OG `en_US`/`ru_RU` и reciprocal alternate, hreflang — `en`/`ru`/`x-default`. У /kit и двух исторических pilots снят собственный canonical; Common уже был изолирован. Common index получил h1. 404 содержит EN/RU native выходы к работам/About/соответствующему CV. Служебные copy описывают реальные маршруты; contact lead на 404/500 больше не ссылается на кейс сверху. Новые публичные страницы не создавались: обзор работ уже доступен через `/#work` и `/ru/#work`.

**Монограмма NK.** Замечание Роберта подтверждено исходным документом `D:/Freelance/portfolio-review/mentor-robert-garmaza-2026-10-02.md`, строки 84–86, и текущей геометрией знака. У K был только шеврон, соединённый с N. Добавлен отдельный вертикальный штрих и просвет; верхние/нижние торцы совпадают. Favicon повторяет знак. Высота Navbar, цвет и tap target сохранены. До/после — `shots/logo-comparison.png`; знак просмотрен в desktop/mobile оболочке.

## Проверки

| Проверка | Фактический охват | Результат |
|---|---|---|
| Чистое воспроизведение A | Detached checkout `tmp/portfolio-common-a-g01-936724b`, npm ci/check/build/CSS | 277 файлов сходятся; 24 страницы; 99 файлов, 0 errors; 24 CSS routes, 0 мёртвых правил; чистый git status |
| Captures через HTTP | Все 26 files × origins 4350/4352/4353 | 78 совпадений с исправленными файлами; `base-reproduction.json` |
| G-01 alpha/renderer | 26 sources; /kit и Portal EN/RU × 1440/1024/390/360 × reduce/no-JS | 24 профиля, 13 состояний в каждом; 0 failures; `corners-verification.json` |
| Источники A | 12 продуктовых файлов и 26 captures | Все hashes совпали; `common/source-verification.json` |
| Последний G build/check | Текущий source после оболочки и service copy | 24 страницы; 100 файлов, 0 errors, 0 warnings, 101 hints; `build.log`, `check-summary.txt` |
| Scoped CSS | Все 24 HTML routes, включая обе локали и Learn | 0 мёртвых правил; `css.log` |
| Harmony | Те же 24 routes × 1440/1024/390/360 | 96 замеров, нарушений нет; `harmony.log` |
| SEO/assets | 24 страницы, 14 public sitemap entries с reciprocal pairs, robots, 14 OG assets и 2 PDF | 0 failures; `shell-verification.json` |
| Navbar/contact | EN/RU × 4 ширины × full/reduce/no-JS/blocked-JS | 32 профиля, 0 errors/overflow/failures; четыре динамических сценария focus/Escape/resize/Back/live preference, 390×600 |
| Service после последней правки текста | 404/500 × 4 ширины × reduce/no-JS, высота 600 | 16 профилей, 0 failures; native email/CV, RU exit на 404; `service-verification.json` |
| DS зеркала | tokens и motion | Побайтовое совпадение; hashes в `shell-verification.json` |

Harmony выполнен до последней смены одной contact lead строки 404/500; после неё сделаны build/check и узкая проверка этих страниц на всех ширинах/коротком окне. Остальные страницы, размеры, CSS, schema и motion не менялись. Полный повтор остальных проверок не требовался.

Эти измерения подтверждают checkpoint и текущий legacy baseline. Полный финальный прогон пяти **новых** историй — scroll/resize/live preference/уход-возврат/Next/Back, все локали/ширины и full/reduce/no-JS — состоится после их приёмки и миграции. Старые тесты A относятся к описанной в A версии. Новые CPU/performance измерения не выполнялись: scene/motion runtime в этой доводке не менялся. Физический телефон в этом этапе не проверялся.

## Локальный результат и следующий checkpoint

Рабочий site-wide production preview G: `http://127.0.0.1:4352/` и `/ru/`. Обе локали/About/пять нынешних public cases доступны по native URLs. Контроль A: `http://127.0.0.1:4352/preview/common/`, `/kit/#common-contract`; Portal EN/RU — `/preview/common/en/partner-portal/`, `/preview/common/ru/partner-portal/`. Неизменная A в чистом checkout: origin `http://127.0.0.1:4353`. Исходный dev — 4350; он тоже отдаёт исправленные captures. Серверы действуют пока процессы запущены; команды воспроизведения в `base.md`.

Кадры: четыре `shots/shell-{en,ru}-{1440,390}.png`, два `shots/service-*.png`, `shots/logo-comparison.png` и шесть кадров углов. Их просмотр подтверждён; это нынешняя оболочка и контрольные материалы, не финальное сравнение пяти новых covers.

**Готовность:** база первой волны готова, B/C можно начинать от точного ref A. После их пакетов G выполняет приёмку, интеграцию, common requests и пишет `wave-1-report.md` с новым ref для D/E/F. Пока `updatedBaseForSecondWave=null`; публикация не готова и не выполнялась. Полная передача контроллеру — `g-base-handoff.md`.
