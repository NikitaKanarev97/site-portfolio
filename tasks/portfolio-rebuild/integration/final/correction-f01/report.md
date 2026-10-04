# G-final-F01 · закрыт 04.10.2026

Исправлена фактическая граница обещания Portal на главной. Принятый B подтверждает source row в Resolution/Cart, но созданный order хранит только SKU/quantity. Source text и row number не сохраняются. Источники — [B report](../../../partner-portal/report.md), portal-order в [evidence](../../../partner-portal/evidence.md). Сам кейс честно раскрывал это ограничение и не менялся.

В src/copy/featured-work.ts изменены ровно две строки:

- EN: “Match a product to the source row, then place the order.”
- RU: «Сначала подобрать товар по исходной строке, затем оформить заказ.»

Новый exact frozen code ref — **c0c69040801d60bcfc836f6728f2ae806911be1d**, branch codex/portfolio-final-f01-2026-10-04. Parent — 93b9f7f5a260636b878fd0d67f863c675e410065. Новый snapshot создан непосредственно от прежнего frozen code, чтобы сохранить все 1270 canonical paths, включая исторические документы в этом кодовом snapshot. Отличается только featured-work.ts, две строки / +44 bytes; остальные 1269 files полностью равны. Тот же delta перенесён в рабочую codex/portfolio-integration-g commit **41c09115a34fb3c552557c7e7f8b01f87c02b51a** после прежней metadata 9dd53859d156fc13b4302d98afc95a3b26e91cd2. Текущие отчёты/handoff идут отдельной metadata; внешний PLAN H и orchestration не входят в commits G.

Доказательства: [byte-identity.json](byte-identity.json), [code-commit.json](code-commit.json), [новый manifest](../code-manifest.json), [старый manifest](previous-code-manifest.json). Сами stories, media, порядок, DS, renderer и motion побайтово сохраняются. Все первоначальные failed harness records и retests остаются с прежним scope, не удалены и не превращены в фиктивный PASS.

Свежий clean checkout: D:/Claude-projects/Site-portfolio/tmp/portfolio-final-f01. Все 1270 файлов / 245198849 bytes совпали без нормализации; npm ci/check/build/CSS exit 0; 113 checked files, 0 errors/0 warnings, 101 inherited hints; 36 built pages, 36 CSS routes / 0 dead rules; mirrors равны; Git status clean. [reproduction.json](reproduction.json), clean-check-summary.log, clean-build.log, clean-css.log. npm ci по-прежнему сообщает 11 унаследованных dependency advisories, зависимости не менялись.

Новый финальный preview — [EN](http://127.0.0.1:4392/) / [RU](http://127.0.0.1:4392/ru/). Старые 4390/4391 — история с прежним Home promise, не окончательный просмотр.

Узкая Home QA: EN/RU × 1440/1024/390/360 × full/reduce/no-JS, **24 profiles / 0 failures**. Проверены правильный текст, actual line rectangles внутри блока, отсутствие overflow/clipping/page errors, пять видимых href в прежнем порядке; **10 case URLs HTTP 200**. [home-verification.json](home-verification.json), [harness](verify-home.mjs).

Просмотрены все четыре corrected Home карточки Portal: [EN desktop](shots/en-portal-home-1440.png), [EN mobile](shots/en-portal-home-390.png), [RU desktop](shots/ru-portal-home-1440.png), [RU mobile](shots/ru-portal-home-390.png). На 390 обе формулировки занимают две строки, без обрезки. Неизменённые кейсы не переснимались.

Предыдущие site-wide 336 / final-delta 51 / Harmony 112 / native focus 36 и 96 switches / controls 11 и 48 switches / film playback+lifecycle / case captures переиспользуются только в прежнем scope на основании 1269 unchanged canonical files. Новую Home покрывает отдельная QA выше. Старые clean proof и report/handoff/base сохранены рядом с префиксами previous-/pre-correction-.

**Техническое исправление G-final-F01 закрыто.** Приёмку G объявляет координатор. Новый обязательный H-art-direction/H-art-review по текущему PLAN остаётся в его цепочке; художественное завершение и отключение heartbeat G не заявляет и не выполняет. Push/deploy, reset/clean/add -A и изменения соседних продуктов не выполнялись.
