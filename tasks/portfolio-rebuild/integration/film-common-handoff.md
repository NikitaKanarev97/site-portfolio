# G-common-E · handoff E и F · 04.10.2026

Общая правка E-G-01/02/03 готова. Контроллер продолжает тот же чат E для подключения film внутри истории и case-проверок; F получает новую воспроизведённую базу. История Pawly этим этапом не принята и не подключена к public registry. D принят контроллером в отдельном checkout; его интеграция выполняется позже по очереди.

## Для E: перенос только общего delta

Исходный E ref: `d3bbbbd78fb3a75c87d3f6117f91d1606e462932`, branch `codex/pawly-rebuild-e`, checkout `C:/Users/kanar/.codex/worktrees/pawly-rebuild-e/Site-portfolio`.

```powershell
git cherry-pick 433c80bcba29eda2060067570e9f8ec2087a2a91
```

Этот commit содержит ровно шесть файлов: `src/copy/cases/story.ts`, `src/components/CaseScreen.astro`, `src/components/MediaFrame.astro`, `ds/story-contract.md`, `ds/components.md`, `ds/motion-concept.md`. Перенос на d3bbbb проверен в отдельном checkout: без конфликтов, все шесть файлов совпадают побайтово, E payload не изменён, git status clean. Доказательство — `film-common/e-transfer.json`. Actual checkout E не менялся. G fixture/evidence snapshot переносить в ветку E не требуется.

E подключает `film: true` и `video` с сохранённым poster у `return-boundary` → `handover-photo-review` в своём story factory; before/after остаются статичными. Использовать прежние ID, evidence/media identities, EN/RU структуры и исходные MP4/WebM/poster. Удалить временный companion `#return-proof` после CaseNext и раннюю ссылку на него; фильм занимает штатный средний шаг, без отдельной renderer/motion-копии. Общий режим уже поддерживает native controls, MP4 первым, manual pause/return и cleanup.

Повторить собственные film/case проверки на actual Pawly EN/RU: native play/pause/resume/end full/reduce/no-JS, offscreen/manual return с сохранением времени, live preference, native Next/Back, mobile/static before/after, отсутствие companion после Next, source hashes и обычные checks. No-JS требует **настоящего native play и decoded frames**: одно ожидание metadata с preload=none не доказывает отказ codec; rAF waitForFunction в JS-disabled context не обновляет polling. В G используется доверенная Space на focused native video, read-only Node polling; scripted play/pause/seek не используется. Исторические четыре ошибки E сохраняются как findings старого ref, актуальное закрытие фиксируется новым evidence/ref E.

## Для F: новая точная база

**Ref: `a6faac3a3d10eb6601fcc34caa70a915bea5dab3`.** Alias: `codex/portfolio-common-film-2026-10-04`. Parent — переносимый shared delta `433c80bcba29eda2060067570e9f8ec2087a2a91`, предыдущий metadata ref `28cf1876ec633797193b4f0ada3de5d817ff89f9`, предыдущая code base `58002c398c3386c9df4b398f324ab07115c979f7`.

База включает принятые A и B/C, G shell/Next, additive film interface, технический EN/RU noindex fixture и доказательства. D/E/F public entries остаются legacy. F читает актуальные **base.md, этот handoff, film-common-report.md и свой prompt из исходного checkout до создания checkout от ref**. Metadata результатов воспроизведения сохранена отдельным последующим commit, поэтому snapshot намеренно содержит исторические base.md/handoffs предыдущей волны. Использовать ref выше; не запускать старый snapshot-base.mjs overlay и не брать грязное рабочее дерево.

Неизменный чистый checkout: `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-film`, production origin `http://127.0.0.1:4381`. Fixture: `/preview/film-common/en/#return-boundary` и `/preview/film-common/ru/#return-boundary`. Block ID — `return-boundary`, без prefix caseId. Public Portal/Learn, Common и /kit доступны на этом же origin. Предыдущие immutable A 4353 и wave-1 4364 сохранены.

## Воспроизведение и проверка

630 проверяемых canonical Git blob файлов, 78,007,784 bytes; все совпадают. Чистые npm ci/build/check/CSS: 30 страниц, 108 файлов, 0 errors/0 warnings, 101 существующих hints; 30 routes, 0 dead CSS rules; status clean. Зеркала tokens/motion равны. Npm ci сообщил прежние 11 dependency advisories; зависимости не менялись.

Основная source-проверка: 14 film/lifecycle/loop/geometry observations, 0 failures; 8 B/C profiles + 26 corrected capture HTTP responses, 0 failures; guards и итоговые 24 harmony samples без ошибок. В clean checkout дополнительно выполнены два EN/RU no-JS native play/decode/pause профиля; два /kit full/no-JS профиля и 10 fixture HTTP media hashes совпали. Полная матрица 14 не объявляется повторно выполненной в clone: canonical source bytes подтверждены manifest, clone имеет отдельный запуск.

В новом неизменном checkout после npm ci:

```powershell
node tasks/portfolio-rebuild/integration/verify-film-common-base.mjs
npm run check
npm run build
npm run check:css -- /ru/about /work/learn /ru/work/agent-ops-console /ru/work/partner-portal /ru/work/learn /ru/work/vet-clinic /ru/work/pawly
npm run preview -- --host 127.0.0.1 --port <free-port>
```

Browser evidence reproducible with locally installed Playwright and Chromium paths used in the verifier (read-only dependency runtime from PETS-walking). `verify-film-common.mjs --base=http://127.0.0.1:<port>` выполняет полную матрицу; `--launch` — только два no-JS native профиля. Extras script из актуального root metadata принимает `--root=<unchanged-checkout> --base=<origin> --output-dir=<evidence-directory>`. CPU/encoding probes одновременно с browser capture не запускались.

Integrity manifest используется до собственных изменений как baseline. После case edits несовпадение изменённых payload с baseline ожидаемо. Metadata после snapshot перечислена в `film-common-handoff-files.txt`; её можно читать из исходного checkout, а не смешивать с frozen ref.

## Ограничения и дальнейшая очередь

Только локальный Chromium 1243; физические устройства/другие engines не проверены. Visibility handler проверен synthetic document.hidden probe; **физически скрытая вкладка не подтверждена**. No-JS сохраняет native controls/static states, offscreen/visibility cleanup enhancement требует JS. D-G-01 optional zone labels оставлен до G-final. CONTROL/STATE, запуск/сообщения E/F и принятие следующего этапа принадлежат контроллеру. Publication, финальная главная и порядок пяти работ ещё не приняты.
