# Принятая общая база A · G-base · 04.10.2026

## Точный ref для первой волны B/C

`936724beff3bb9a01c69381659dc808782cc7950`

Локальный alias: `codex/portfolio-common-a-2026-10-04`. Parent: `62304d8e555193a26926b673a56ba13f631ecd7e`. Это локальный тематический commit, не remote default. Рабочая ветка G: `codex/portfolio-integration-g`; последующие независимые поправки оболочки остаются в ней и будут сохранены при интеграции B/C.

Владелец в текущем чате G ответил «Принимаю A — зафиксировать общую базу». Затем поручил исправить края specimens. Исправление G-01 вошло в этот ref: настоящий alpha-контур компонента, красная обводка без внешнего белого прямоугольника, capture bleed 2 CSS px и native presentation CaseScreen. Основание: `a-acceptance.md`, `common-requests.md`, `corners-verification.json`, шесть кадров `shots/corners-*.png`. Полные новые истории B–F ещё не приняты.

## Происхождение и состав

Из грязного исходного checkout отобраны 263 payload-файла A по `common/base/manifest.json` и 14 файлов приёмки/доводки G. В `base-manifest.json` и `base-files.txt` записаны 277 проверяемых файлов; сами две записи не хешируют себя. Commit включает изменения только отобранного пакета. Несвязанные правки `.claude/skills/ru-cover-letter/`, `.gitignore`, `HHH/pipeline.md`, `linkedin/after-state.md` и несвязанные untracked-файлы не включались.

База содержит:

- текущие PLAN-CHATS, DS contract, schema `src/copy/cases/story.ts`, renderer `src/components/CaseStory.astro` и каталог блоков, mobile geometry, native specimens;
- точные зеркала `ds/tokens.css` → `src/styles/tokens.css`, `ds/motion.js` → `src/scripts/motion.js`;
- парные контрольные Agent Ops и Portal, их diagrams/media и источники; 26 Portal captures с прозрачным внешним полем;
- действующие документы `research/portfolio-rebuild-2026-10-03/`, prompts A–G и все четыре исходных reference PNG;
- проверки A, исходные source/capture manifests, G-01 проверку и кадры;
- обычный проект от parent, включая существующие EN/RU public routes, legacy cases, CV и Learn prototype. Legacy является текущей опубликованной версией, а не новой принятой историей.

56 отобранных UTF-8 текстовых файлов нормализованы CRLF → LF согласно `.gitattributes`; лишние пустые строки в конце сняты. Бинарные файлы не нормализованы. Исходные и итоговые hashes сохранены в manifest. ZIP старого overlay A не является этим commit: для новых checkout использовать полный ref выше, а не старый архив.

## Воспроизведение

Создан чистый detached checkout по полному ref:

`D:/Claude-projects/Site-portfolio/tmp/portfolio-common-a-g01-936724b`

В нём выполнены `npm ci`, `npm run build`, `npm run check`, `npm run check:css` с дополнительными RU/About/Learn routes и `node tasks/portfolio-rebuild/integration/verify-base.mjs`. Результат: 277 файлов совпали побайтово; 24 HTML страницы собраны; check — 99 файлов, 0 errors; CSS — 24 маршрута, 0 мёртвых правил. `git status --porcelain` после установки/сборки пуст. Требуется установленный Node/npm; браузерные съёмки используют локальный Playwright из соседнего проекта только для чтения. `npm ci` сообщил 11 существующих dependency advisories; зависимостей в этом этапе не меняли.

G-01 проверен на `/kit/` и Portal EN/RU в 1440/1024/390/360, reduce и no-JS: 24 профиля, 13 состояний в каждом, 0 failures. У всех 26 source captures alpha четырёх внешних углов равен 0. Хэши 12 продуктовых источников и 26 captures сходятся (`common/source-verification.json`).

Для создания нового checkout использовать точный ref. После `npm ci` достаточно обычных `npm run check`, `npm run build`, `npm run dev -- --host 127.0.0.1 --port <свободный порт>`. Перед правками case можно выполнить `verify-base.mjs`; после собственных изменений payload сравнивается с базой как baseline, а не с изменённым рабочим деревом. `snapshot-base.mjs --create` — одноразовый аудированный перенос из исходного parent; повторно для кейсов его не запускать.

## Preview origins и конвенции

| Назначение | Origin | Пути |
|---|---|---|
| Неизменная воспроизведённая A | `http://127.0.0.1:4353` | `/preview/common/`, `/kit/`, четыре парных контрольных preview |
| Рабочая интеграция G / production preview | `http://127.0.0.1:4352` | `/`, `/ru/`, `/about/`, `/ru/about/`, текущие `/work/<slug>/` и `/ru/work/<slug>/`, `/preview/common/`, `/kit/` |
| Исходный dev G | `http://127.0.0.1:4350` | те же пути; для стабильной визуальной сверки использовать production preview выше |

Контрольные paths: `/preview/common/en/agent-ops/`, `/preview/common/ru/agent-ops/`, `/preview/common/en/partner-portal/`, `/preview/common/ru/partner-portal/`. Portal здесь — пример общего контракта, не готовый B. Эти локальные серверы действуют пока процессы запущены; paths воспроизводимы на свободном порту. Новые case preview изолировать под `/preview/<свой пакет>/...`, обе локали дают native ссылки друг на друга. Preview и `/kit` — noindex и вне sitemap. Новый Common preview не имеет canonical. Исторические `/kit` и два pilot preview в ref A ещё имеют собственный canonical; в следующем независимом commit G он снят, что подтверждает `shell-verification.json` на origin 4352.

## Ownership и интерфейсы

Общий слой после A принадлежит G: schema/renderer/components/DS/motion и зеркала, routes/registries/Next/home/shell/SEO. B–F владеют только своим story copy, diagrams, media, case map, evidence/source/media/artifact-plan и preview/report. Соседние продуктовые проекты — источники только для чтения. Общий запрос записывать в своём `common-requests.md`; частную копию renderer или новую DS вместо общего решения не создавать.

Исполняемый контракт — `ds/story-contract.md`: `defineStory`, `assertStoryPair`, упорядоченные blocks и общая мобильная геометрия. Actual specimens — `CaseSpecimen` → `CaseScreen native`; фон снаружи продуктового контура прозрачен, геометрия и UI продукта сохраняются. Next и публичные EN/RU registries подключает G после приёмки конкретного пакета. До переноса entry остаётся legacy fallback. Public slugs неизменны: `agent-ops-console`, `partner-portal`, `learn`, `vet-clinic`, `pawly`.

Каждый кейс передаёт точные checkout/branch/commit ref, EN/RU preview URL, story pair, case map, evidence/source/media inventories, `artifact-plan.md`, common requests, desktop/mobile кадры и запись центральной сцены, fallback/motion/navigation проверки и ограничения. Наличие commit или PASS-логов само по себе не означает приёмку. G сверяет источники, смотрит полную историю и основные материалы на desktop/mobile до штатного подключения.

## Следующая волна

B и C могут использовать указанный ref. Полные prompts находятся в `research/portfolio-rebuild-2026-10-03/prompts/`; контроллер читает их актуальные версии из исходного checkout. Общая база для D/E/F **ещё не подготовлена**: её точный ref появится после приёмки и интеграции B+C, закрытия common requests и проверки соседних историй. Ref A не обозначать обновлённой базой второй волны.

Последовательность запуска ведёт отдельный контроллер согласно `orchestration/CONTROL.md`. G не создаёт дубли case-чатов и не изменяет `orchestration/STATE.json`. Порядок Agent Ops → Portal → Learn → Vet → Pawly сохраняется до сравнения пяти финальных историй. Push/deploy не выполнялись.
