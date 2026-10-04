# G-common-F · F-G-01 · 04.10.2026

Общая правка reading position подготовлена для проверки контроллером и переноса в тот же F. Это завершение узкого common checkpoint; приёмка actual F и G-final остаются следующими этапами контроллера.

## Версии и область

| Назначение | Точный ref |
|---|---|
| Входная общая film base | `a6faac3a3d10eb6601fcc34caa70a915bea5dab3` |
| Проверенный исходный F | `3d35b7c88b89f36c72eaff315dec4bfc5dc887a5` |
| Переносимый shared delta / новая frozen common base | `6e8f0e075916dec82a90831c7c2c78a38ea60e20` |
| Parent общей правки, прежняя metadata | `0809df0de9dda0f0c1fe0e7172f8dff5a70f1a89` |
| Проверенный import в изолированный F | `7493e45a257866b9824b1290ab82e3d8b3bb448f` |

Alias общей базы: `codex/portfolio-common-focus-2026-10-04`. Commit delta содержит ровно `src/scripts/animations.js` и `ds/motion-concept.md`: 62 добавленных / 8 удалённых строк. Proof/metadata передаются последующим отдельным commit и перечислены в `focus-common-handoff-files.txt`.

Actual F checkout `C:/Users/kanar/.codex/worktrees/agent-ops-rebuild-f/Site-portfolio` остался clean на исходном 3d35b7. G использовал собственный detached checkout `D:/Claude-projects/Site-portfolio/tmp/focus-common-f`; его diff от F содержит только два shared файла. F case copy, media, preview, evidence и diagrams сохранены. Public D/E/F entries и главная остаются текущими. D/E приняты контроллером в своих checkout; их public integration выполняется позже. STATE/CONTROL принадлежат контроллеру.

## Исходная ошибка и установленная причина

G воспроизвёл F-G-01 на production-копии точного F ref: EN/RU, 1440×900, decoded visible `.pilot img`, fonts ready, вход в promise на focus start + 1300, три reduce/full цикла с ожиданиями 600 и 1800 ms. В 24 переключениях обнаружены пять смещений: обычно +548 px EN / +580 px RU; при повторении один сдвиг накопился до +1360 px. Cold reduce/no-JS entry из исходных F данных работал; finding касался live preference lifecycle.

Сохранённый trace `focus-common/internal-diagnosis.json` показывает промежуточную геометрию после снятия pin: promise сначала измеряется при padding 48 px и размере 1184×784; окончательная natural раскладка имеет padding 0 и размер 1280×1346. Прежние rAF + fixed reflowWait=0.18 s могли оба попасть до окончательного изменения размеров. Сохранённый target Y соответствовал ранней раскладке, а видимый заголовок позже смещался. Реализация/engine, из-за которых конкретный reflow доставляется позже, отдельно не установлены.

Дополнительно native wheel suite выявил порядок событий: после жеста ScrollTrigger уже показывал новый panel, а прежний early return в scroll handler оставлял прошлую reading identity. Общая правка учитывает обе наблюдаемые причины.

## Исправление

`restoreFocusReading` сохраняет identity/top выбранного материала и наблюдает размеры list + material через ResizeObserver. Окончательный reflow повторяет восстановление той же точки чтения. Промежуточная доставка scroll не заменяет выбранный материал.

Новый жест, обычный scroll с неизменной геометрией, уход native navigation за сцену и route teardown освобождают observer, frame и timer. Epoch отменяет callbacks прошлого восстановления. Scroll handler и onUpdate читают actual focus ScrollTrigger registry через общий `rememberFocusReading`; новый panel становится текущим после wheel/scroll.

GSAP timings и существующий reflowWait сохранены. Runtime использует прежнюю общую разметку и DS; motion/tokens mirrors, schema, components и case payload не менялись. DEV debug дополнен reading/focusScenes; в обоих production builds `__dsMotionDebug` отсутствует.

## Проверки финальных bytes

Browser-проверки F выполнены на G origin 4386. Финальные bytes runtime имеют SHA256 `d1468a8e12ca45fbfc941aee94d0c77aa93efec5e889c4eac7929df4976179a4`. Native/exact suites сохраняют этот hash. После cherry-pick чистого delta два файла сверены с root и frozen common checkout побайтово, затем F заново прошёл check/build/CSS. Browser suites с идентичным кодом повторно не снимались.

| Проверка | Фактический охват | Результат / evidence |
|---|---|---|
| Исходный reproducer, final | EN/RU × 600/1800 ms × 3 reduce/full цикла | 24 переключения, 0 failures; `focus-common/final-exact.json` |
| Native wheel reading | Четыре состояния EN/RU, 600/1800 ms, три цикла; reverse/fast wheel | 36 observations, 96 переключений, 0 failures; `native-states.json` |
| F motion/lifecycle | EN/RU 1440/1024/390/360/short; focus stops, reverse/fast, resize, preference, Next hover/focus, Back/Forward, locale | 12 observations, 0 failures; `f-motion-verification.json` |
| F fallback | Те же 10 geometry profiles × reduce/no-JS + native Next/Back EN/RU desktop/mobile | 24 observations, 0 failures; `f-static-verification.json` |
| DEV registry/release | Actual registry + reading observer instrumentation, preference/resizes/Next/away/Back | 30 snapshots, 0 duplicates/failures; observers 0 на Next/away/Back; `f-debug.json` |
| Общие controls | /kit, accepted pilot, Common Agent EN/RU, public Portal/Learn EN/RU, Next после resize | 8 routes, 42 live transitions, 0 failures; `controls.json` |
| Additive film regression | На frozen common 4388: EN/RU native full/reduce/no-JS play/pause/resume/end; outside/manual return/preference/synthetic visibility/route cleanup/Back; existing loop; tablet/short | 14 observations, 0 failures; `film/verification.json` |
| Harmony | F EN/RU × 4 widths × 900/600 height; public Portal EN / Learn RU × 1440/360 | 20 profiles, 0 violations; `focus-common-reproduction.json` и три harmony logs |
| Чистый F import | Check/build/CSS после cherry-pick, status clean | 109 files, 0 errors/0 warnings, 101 hints; 32 pages/routes, 0 dead CSS; `checks.json`, `f-transfer.json` |
| Чистая common base | npm ci/check/build/CSS + canonical manifest, status clean | 108 files, 0 errors/0 warnings, 101 hints; 30 pages/routes, 0 dead CSS; 630 files / 78,017,347 bytes совпали; `checks.json`, `clean-integrity.json` |
| DS parity | tokens и motion source/mirror | Побайтовое равенство; `f-transfer.json` |

`npm ci` сохранил прежние 11 dependency advisories; dependency changes в delta отсутствуют. Полные многомегабайтные check diagnostics оставлены локально; в пакет входят короткие официальные Result summaries.

## История попыток и кадры

Первые неудачные попытки сохранены отдельно в `focus-common/history.json` и их raw JSON. Diagnostic overflow-anchor:none: 6/24 failures; saveStyles-only: 3/24; ранний observer удерживал Next — 6 failures; ранний native suite обнаружил старую reading identity — 72 failures. Эти результаты относятся к промежуточным версиям. Финальные exact/native/motion/static/registry/controls/film данные приведены выше. CSS anchoring override и diagnostic saveStyles не вошли в delta. Temporary internal trace был только в G test checkout и снят до финальной сборки.

Просмотрены исходный [RU shift](focus-common/shots/baseline-ru-1800-reduce.png) и итоговый [RU reduce](focus-common/shots/final-exact-ru-1800-reduce.png). В итоговом кадре заголовок promise сохраняется у прежней верхней координаты ≈123 px; natural transcript идёт в потоке. Парные final before/reduce кадры EN/RU, 600/1800 ms лежат в `focus-common/shots/final-exact-*`. Film regression имеет свои EN/RU desktop/mobile native frames в `focus-common/film/shots/`.

Отдельная проверка красной рамки Portal сохранена в `focus-common/outline-confirmation.json`: текущий 4350 отдаёт те же corrected alpha bytes; у Availability все внешние pixels прозрачны, renderer без собственной маски/тени; 26 captures без alpha corner failures. Это сохранение уже исправленного G-01; новые media не переснимались.

## Preview и передача

Frozen common: `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-focus-6e8f0e0`, `http://127.0.0.1:4388`. Доступны /kit, Common EN/RU, accepted pilot, public B/C и технический film fixture `/preview/film-common/en/`, `/preview/film-common/ru/`.

G isolated F: `D:/Claude-projects/Site-portfolio/tmp/focus-common-f`, production `http://127.0.0.1:4386/preview/agent-ops-rebuild/en/` и `/ru/`; DEV registry — 4387. Origins работают, пока запущены локальные процессы; сборка и paths воспроизводимы на свободном порту.

Точный импорт, commands, hashes и следующий actual-case retest — [focus-common-handoff.md](focus-common-handoff.md). Для F переносится только двухфайловый delta. Frozen common ref используется для новых общих checkout. Прочитать актуальную root metadata до checkout: frozen ref намеренно предшествует этому report/handoff/manifest.

## Пределы

Только локальный Chromium 1243 с viewport emulation. Физические устройства/другие engines и отдельные CPU/performance probes не проверялись. Film hidden handler проверен явным synthetic probe; physically hidden tab не подтверждён. G-проверка clean F import не заменяет retest и приёмку того же actual F владельцем/контроллером. G-final, final order, home и publication pending.
