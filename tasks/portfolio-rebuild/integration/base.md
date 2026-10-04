# Общая база · G-common-F · 04.10.2026

**Новый точный common ref: 6e8f0e075916dec82a90831c7c2c78a38ea60e20.** Alias: codex/portfolio-common-focus-2026-10-04. База воспроизведена: A + G + B/C + manual film + F-G-01 shared reading-position fix. Продолжающий F на `3d35b7c88b89f36c72eaff315dec4bfc5dc887a5` импортирует только этот двухфайловый delta; его case payload сохраняется. Актуальный пакет — focus-common-handoff.md и focus-common-report.md. Common checkpoint готов для review контроллера, F ждёт actual-case retest. Прочитать текущую root metadata до создания checkout; ниже сохраняется история баз. D/E приняты контроллером в своих checkout, public D/E/F пока legacy.

## Текущий checkpoint G-common-F

Delta/common ref `6e8f0e075916dec82a90831c7c2c78a38ea60e20`, parent metadata `0809df0de9dda0f0c1fe0e7172f8dff5a70f1a89`; exact base до правки — `a6faac3a3d10eb6601fcc34caa70a915bea5dab3`. Только animations.js и ds/motion-concept.md. Новый frozen checkout: `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-focus-6e8f0e0`, origin `http://127.0.0.1:4388`; 630 canonical files / 78,017,347 bytes совпали с `focus-common-base-manifest.json`. Check/build/CSS: 108 files, 0 errors/0 warnings, 101 hints, 30 pages/routes, 0 dead CSS, status clean; mirrors равны.

Чистый перенос delta точно на F 3d35b7 проверен в G checkout `tmp/focus-common-f`: result `7493e45a257866b9824b1290ab82e3d8b3bb448f`, diff ровно два shared файла, payload неизменен; 109 checked files, 32 pages/routes, clean status. Production F proof — 4386, DEV registry — 4387. Actual F checkout остался clean на 3d35b7.

Финальные G данные: 24 exact preference switches, 96 native-wheel switches, 12 F motion/lifecycle + 24 fallback observations, 30 DEV snapshots, 8 common routes / 42 preference switches, 14 film regression observations и 20 Harmony profiles — 0 failures. Historical failed attempts сохранены отдельно. Metadata/report/handoff/manifest идут последующим commit и не являются частью code delta. Frozen ref содержит прежние base.md/PLAN-CHATS/handoffs; integrity verifier запускается из актуального root с `--root=<unchanged-checkout>`.

## История принятой A · G-base

## Точный ref для первой волны B/C

`936724beff3bb9a01c69381659dc808782cc7950`

Локальный alias: `codex/portfolio-common-a-2026-10-04`. Parent: `62304d8e555193a26926b673a56ba13f631ecd7e`. Это локальный тематический commit, не remote default. Рабочая ветка G: `codex/portfolio-integration-g`; последующие независимые поправки оболочки остаются в ней и будут сохранены при интеграции B/C.

Независимый G checkpoint code ref: `68b608a34c382ee80c24ae15f0a45277e2277db7`. Он содержит оболочку и этот документ, добавленные после принятой A. Исполнители первой волны читают актуальные `base.md`/`report.md` из исходного checkout и начинают case от ref A. Подробный готовый handoff — `g-base-handoff.md`.

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

B и C могут использовать указанный ref. Полные prompts находятся в `research/portfolio-rebuild-2026-10-03/prompts/`; контроллер читает их актуальные версии из исходного checkout. B/C интегрированы в ветке G. Точный обновлённый ref для D/E/F зафиксирован ниже после чистого воспроизведения; ref A сохраняется исторической базой первой волны.

Последовательность запуска ведёт отдельный контроллер согласно `orchestration/CONTROL.md`. G не создаёт дубли case-чатов и не изменяет `orchestration/STATE.json`. Порядок Agent Ops → Portal → Learn → Vet → Pawly сохраняется до сравнения пяти финальных историй. Push/deploy не выполнялись.

## G-integrate-1 · обновление первой волны

B/C перенесены отдельными commits с сохранёнными payload: B 1dc263f11fba969e6a822a985b4201c70ba0d26b, C afe6785cc20d230c96b8c1d3f350ffa13bbeb18f. Новые CaseStory доступны на штатных /work/partner-portal/, /work/learn/ и RU. Agent Ops/Vet/Pawly сохраняют legacy fallback. Общий runtime Next обновлён по B-G-01; schema и оба DS mirrors прежние. Подробная приёмка/проверки — wave-1-report.md. Новый integrity пакет: wave-1-base-manifest.json, wave-1-base-files.txt, verify-wave-1-base.mjs. Точный updated ref и чистое воспроизведение зафиксированы ниже.

### Точный ref для D/E/F

**58002c398c3386c9df4b398f324ab07115c979f7**

Локальный alias: codex/portfolio-common-wave-1-2026-10-04. Parent: afe6785cc20d230c96b8c1d3f350ffa13bbeb18f. Ветка интеграции: codex/portfolio-integration-g. История содержит принятую A, независимые G-base commits, три отдельных cherry-pick B/C и общий integration commit. Это полный Git checkout, не overlay и не remote default.

Новый integrity пакет содержит 585 файлов / 75 742 739 bytes. Хэши рассчитаны по canonical Git blobs; бинарные owner captures не менялись. Manifest/list исключают только собственное самохеширование. Исходный base-manifest.json по-прежнему проверяет старый ref A; для второй волны запускать verify-wave-1-base.mjs в чистом checkout нового ref до собственных изменений.

Чистое воспроизведение: D:/Claude-projects/Site-portfolio/tmp/portfolio-wave-1-58002c3. Node v24.18.0 / npm 11.16.0. npm ci, build (28 страниц), check (106 файлов, 0 errors / 0 warnings / 101 hints), check:css (28 routes / 0 dead rules) завершились успешно. Все 585 integrity-файлов совпали побайтово, оба DS mirrors совпадают. Git status --porcelain после установки/сборки и браузерного запуска пуст. Восемь smoke profiles public B/C EN/RU на 1440 full / 360 no-JS, Next/Back/locale для двух соседних переходов и 26 HTTP alpha captures проверены: 0 failures. Полная матрица и motion/lifecycle записаны на идентичном UI integration origin 4352; без новых изменений повторно весь набор в клоне не запускался. npm ci сообщает 11 существующих advisories, зависимости не менялись.

Неизменный production preview этого ref: http://127.0.0.1:4364, штатные /work/partner-portal/, /ru/work/partner-portal/, /work/learn/, /ru/work/learn/, /preview/common/ и /kit/. Рабочий G production preview 4352 и dev 4350 остаются доступны. Четыре owner previews: /preview/partner-portal-rebuild/en/, /ru/ и /preview/learn-rebuild/en/, /ru/ на том же origin. Отчёт воспроизведения — wave-1-reproduction.json; handoff — wave-1-handoff.md.

Исполнители D/E/F сначала читают актуальные base.md, wave-1-report.md, wave-1-handoff.md и свой полный prompt из исходного checkout: финальные records с полным ref добавлены отдельным evidence/handoff commit после snapshot и не могут входить в его собственный hash. Затем создают свой checkout строго от 58002c398c3386c9df4b398f324ab07115c979f7. Snapshot содержит принятый код, shared contracts, B/C материалы и все четыре reference PNG. Центральная schema и native specimens сохранены; B-G-01 закрыт одним общим runtime. D/E/F не меняют shared renderer/registries/routes/DS: необходимые расширения передают common-request G.

## G-common-E · manual film и новая база F

E-G-01/02/03 закрыты общим delta `433c80bcba29eda2060067570e9f8ec2087a2a91` (ровно шесть файлов). Проверенный чистый snapshot `a6faac3a3d10eb6601fcc34caa70a915bea5dab3`, alias `codex/portfolio-common-film-2026-10-04`; checkout `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-film`, origin http://127.0.0.1:4381. 630 canonical files / 78,007,784 bytes совпали; build 30 pages, check 108 с 0 errors/0 warnings, CSS 30 routes с 0 dead rules, mirrors равны, git status clean. Source film matrix 14 и B/C 8+26 responses без failures; clone native no-JS launch EN/RU, /kit full/no-JS и 10 media hashes без failures. Физически скрытая вкладка не подтверждена; visibility handler проверен synthetic probe.

Доказательства: film-common-report.md, film-common-reproduction.json, film-common-handoff.md. Metadata handoff/readback находится в последующем commit и читается из исходного checkout; snapshot содержит прежние base.md/handoffs как исторический вход. E подключает film в actual middle step и пересдаёт свой case; F использует новый frozen ref. D принят контроллером отдельно, публичная интеграция D/E/F и G-final остаются следующими фазами. Предыдущая wave-1 база 58002c3 и A 936724b сохранены, не заменены задним числом.
