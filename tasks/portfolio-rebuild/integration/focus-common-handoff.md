# G-common-F · handoff контроллеру и F · 04.10.2026

F-G-01 исправлен в общем runtime; пакет готов для review контроллера. Следующий шаг — продолжить тот же F, импортировать exact delta и выполнить actual-case retest. F остаётся непринятым до этого шага. G-final ожидает его приёмки.

## Перенос в F

Actual checkout: `C:/Users/kanar/.codex/worktrees/agent-ops-rebuild-f/Site-portfolio`, branch `codex/agent-ops-rebuild-f`. Submitted ref: `3d35b7c88b89f36c72eaff315dec4bfc5dc887a5`; common base: `a6faac3a3d10eb6601fcc34caa70a915bea5dab3`. На момент передачи actual checkout clean и G его не менял.

Прочитать этот актуальный root handoff и report; проверить git status/HEAD своего checkout. Импортировать ровно этот commit:

```powershell
git cherry-pick 6e8f0e075916dec82a90831c7c2c78a38ea60e20
```

Состав delta: `src/scripts/animations.js`, `ds/motion-concept.md`. G proof/metadata и технический snapshot целиком переносить в case branch не требуется. Import точно на F 3d35b7 проверен в G detached checkout `D:/Claude-projects/Site-portfolio/tmp/focus-common-f`: result `7493e45a257866b9824b1290ab82e3d8b3bb448f`, без конфликтов, case payload неизменен, status clean. Ref импортированного commit в actual F может отличаться из-за commit metadata; важны exact patch и bytes.

Expected SHA256 после импорта:

| Файл | SHA256 |
|---|---|
| `src/scripts/animations.js` | `d1468a8e12ca45fbfc941aee94d0c77aa93efec5e889c4eac7929df4976179a4` |
| `ds/motion-concept.md` | `5201fa92b0074443373e9bf2abd2cb5ae6895599fe6791e89f6453433a7aee71` |

Proof: `focus-common/f-transfer.json`. Source/mirror tokens/motion должны остаться равны. Shared files вне delta и собственный case payload не требуют изменений.

## Actual F retest

Использовать свои F preview origins и собственные verifier scripts. Заново проверить исходный reproducer EN/RU 1440×900: fonts ready + decoded visible pilot images, focus start + 1300, три full/reduce цикла с 600 и 1800 ms settle. Promise title сохраняет top с допуском 3 px; full имеет правильный opaque promise и один pin, reduce — natural list без pin.

Проверить новый материал после native wheel в overview/workspace/promise/decision, обратное и быстрое чтение, live preference и resize. После обычного жеста reading anchor должен освобождаться. Native Next, Back/Forward и locale переход остаются свободными; после ухода старые reading observers/frames/timers прекращаются. Проверить static reduce/no-JS и mobile/short профили, film lifecycle соседнего общего адаптера и DS parity. G уже выполнил 96 trusted-wheel transitions и финальную F matrix; actual F retest фиксируется отдельно под своим новым ref.

В actual F выполнить appropriate check/build/CSS/harmony и обновить собственные report/common-requests с actual results/refs. Прежние F failures сохраняются как история исходного 3d35b7. Изменение common checkpoint само по себе не означает приёмку story. Никакой новой художественной перестройки или private motion override не требуется.

## Воспроизводимая common base

Exact frozen ref также равен `6e8f0e075916dec82a90831c7c2c78a38ea60e20`, alias `codex/portfolio-common-focus-2026-10-04`. Parent — прежняя root metadata `0809df0de9dda0f0c1fe0e7172f8dff5a70f1a89`. Он содержит принятую A + G + integrated B/C + film adapter/fixture + этот shared fix; D/E/F public entries остаются legacy, F test payload в этой базе отсутствует.

Immutable checkout: `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-focus-6e8f0e0`, production `http://127.0.0.1:4388`. Integrity: 630 canonical Git blob files / 78,017,347 bytes, 0 failures; те же paths, что film base, rehashed на exact ref. npm ci/build/check/CSS — 30 pages/routes, 108 files, 0 errors/0 warnings, 101 existing hints, 0 dead CSS, clean status. F transfer отдельно: 32 pages/routes и 109 checked files. Dependency advisories прежние.

Новый common checkout создаётся от exact ref. Из актуального root можно сверить его с manifest:

```powershell
git worktree add --detach <new-checkout> 6e8f0e075916dec82a90831c7c2c78a38ea60e20
node tasks/portfolio-rebuild/integration/verify-focus-common-base.mjs --root=<new-checkout>
```

В новом checkout:

```powershell
npm ci
npm run check
npm run build
npm run check:css -- /ru/about /work/learn /ru/work/agent-ops-console /ru/work/partner-portal /ru/work/learn /ru/work/vet-clinic /ru/work/pawly
npm run preview -- --host 127.0.0.1 --port <free-port>
```

Актуальные report/handoff/manifest сохранены следующим metadata commit. Frozen ref содержит прежние base.md/PLAN-CHATS/handoffs, поэтому сначала читать текущую metadata из root; не запускать старые snapshot overlay scripts. Integrity manifest проверяет неизменную базу до собственных изменений.

## G proof и commands

Все новые verifier scripts находятся в актуальном root `tasks/portfolio-rebuild/integration/`. Actual F во время G tests не использовался: production test origin 4386 / DEV 4387 принадлежат G clone. Frozen common origin — 4388. Скрипты используют локальный Playwright из Agent-ops-console/PETS-walking только как dependency runtime; продукты read-only.

```powershell
node tasks/portfolio-rebuild/integration/reproduce-focus-common.mjs --base=http://127.0.0.1:<F-clone-port> --label=<new-proof-label>
node tasks/portfolio-rebuild/integration/verify-focus-native.mjs --base=http://127.0.0.1:<F-clone-port>
node tasks/portfolio-rebuild/integration/verify-f-focus-common.mjs --base=http://127.0.0.1:<F-clone-port>
node tasks/portfolio-rebuild/integration/verify-f-focus-common.mjs --base=http://127.0.0.1:<F-clone-port> --static
node tasks/portfolio-rebuild/integration/verify-f-focus-debug.mjs --base=http://127.0.0.1:<F-dev-port>
node tasks/portfolio-rebuild/integration/verify-focus-controls.mjs --base=http://127.0.0.1:<common-port>
node tasks/portfolio-rebuild/integration/verify-focus-film.mjs --base=http://127.0.0.1:<common-port>
```

Browser suites запускались последовательно; CPU/performance или encoding probes с captures не совмещались. Эти commands предназначены для нового proof при изменении/actual retest; не перезаписывать исторические JSON без нового назначения. Exact reproducer поддерживает новый label; остальные scripts пишут текущий named result в G proof directory.

Evidence: [report](focus-common-report.md), [reproduction](focus-common-reproduction.json), [history](focus-common/history.json), [canonical manifest](focus-common-base-manifest.json), [transfer](focus-common/f-transfer.json). Сравнить [baseline RU](focus-common/shots/baseline-ru-1800-reduce.png), [final full RU](focus-common/shots/final-exact-ru-1800-before.png), [final reduce RU](focus-common/shots/final-exact-ru-1800-reduce.png). Итоговые EN/RU before/reduce пары и film frames включены в metadata whitelist.

Пределы: Chromium 1243, viewport emulation, без physical devices/other engines/CPU benchmark. Film visibility branch проверен synthetic document.hidden; физически скрытая вкладка не подтверждена. Последующие chat dispatch, acceptance и STATE/CONTROL — у контроллера. Public D/E/F/home integration и publication ожидают следующих этапов.
