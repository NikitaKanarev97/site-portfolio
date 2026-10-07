# Роберт 04 — Agent Ops, Portal и Pawly

Дата: 07.10.2026. Локальный результат в существующем checkout; commit/push/deploy не выполнялись. Исторические PLAN-CHATS не запускались повторно. Прочитаны README/04-stages, CLAUDE.md, DS contract, актуальные записи Foundation/Components и карты Home/Agent/Pawly/Portal; просмотрены S04/S06/S07/S08/S09/S17/S18/S27.

## Изменённые продуктовые файлы

- `src/components/WorkStage.astro`: в Home Agent два pause-штриха заменены декоративным SVG человека с читаемой body-sm подписью Human review / Человеческая проверка. SVG 32 px на mobile и 48 px от bp-md. Сохранены `data-cover-panel`, `data-cover-gate`, `cover-interlock` и существующий home fade; animations.js не изменён. Центральная композиция и реальные панели сохранены.
- Там же Portal: удалена отдельная Source row метка, число 38 — первый якорь. Единственный поясняющий блок — редакционная цитата + объём + Demonstration example / Демонстрационный пример. На mobile число и контекст соседствуют над полным узким UI; от bp-lg выбор товара занимает 4/5 колонок. Одинаковая сцена Home/cover с stage-inset и `surface-cover-portal`, без дополнительной белой карточки.
- Цвет Portal согласован через токен владельца пакета 01: `surface-cover-portal` → `lavender-100` (#DDD5FF). Первоначальный локальный нейтральный вариант заменён этим общим семантическим токеном. Исходные UI-поля, включая исходную русскую строку внутри документального EN capture, не перерисованы.
- Там же Pawly: от bp-lg колонки 2:1, общий верхний край фотографии и отчёта, gap space-8 (32 px), report max space-48 × 2 (384 px). Убраны вертикальное центрирование фото, центрирование отчёта и дополнительные боковые поля на xl. На 360 px — последовательные фото/подпись/полный отчёт во всю колонку. Фото не обрезано, confirmed return 14:52 и весь нижний proof/report UI сохранены.
- На Agent и Learn WorkStage установлен `data-focus-tone="inverse"` по запросу пакета 01. Светлый focus остаётся локальным свойством тёмной сцены; внешние белые заголовки/CTA используют обычный focus.
- `src/copy/case-art.ts`: EN Portal quote переведена в “4 MP outdoor camera” · 8 units; RU quote сохранена. Добавлена явная пометка демонстрационного примера. Learn detail теперь Reference and learning path / Справочник и учебная программа без ↔. Pawly caption явно называет фотографию демонстрационной. Текущий единственный вызов caseArt — WorkStage; Learn/Vet владелец пакета 05 перевёл на свой локальный copy.

## Что закрыто и что осталось

Закрыты домашний Agent gate, редакционные подписи/локализация/сцена Portal, выравнивание/промежуток Pawly и emoji-риск Learn detail. Общий CaseScreen пакета 03 используется без локального обхода его frame/edge API; его согласованные изменения сохранены. Продуктовые claims, даты, Concept и evidence не усиливались.

**Остаётся интеграция полного Agent cover:** CaseCover.astro использует отдельную Agent proof/interlock ветку, обходящую WorkStage, и всё ещё рисует `.case-opening__gate-line` двумя штрихами. Этот файл не входит в владение пакета 04. Конкретная замена на тот же SVG человека с сохранением hooks записана в `04-requests.md`. Полный cover проверен на доступность, zoom, конечное движение и reduce; визуальное замечание о pause там пока не закрыто. Существующий checkpoint ниже в кейсе и общий motion также вне пакета.

**Общий каталог ДС:** владельцу пакета 01 передано фактическое описание WorkStage/Portal/Pawly и изменения case-art в `04-requests.md`. Общие ds-файлы пакет 04 не редактировал. Цветовой запрос и инверсный focus согласованы и подключены; нового токена больше не требуется.

## Проверки

Финальный браузерный прогон выполнен Chromium/Playwright по изолированной production-сборке на `http://127.0.0.1:4404`. Снимки и JSON находятся в `04-evidence`; сценарий воспроизводится через `node tasks/robert-review-2026-10-07/reports/04-qa.mjs`. Dev toolbar скрывается только в QA harness; product DOM/media не изменяются.

| Проверка | Результат |
|---|---|
| `npm run check` | PASS: 130 файлов, 0 errors, 0 warnings, 265 hints. Диагностик в WorkStage/case-art нет. Компактный лог `04-check.log`; hints относятся в основном к существующим bundled prototype JS. |
| `npm run build -- --outDir C:/Users/kanar/AppData/Local/Temp/site-portfolio-robert04-dist` | PASS: 36 страниц, `04-isolated-build.log`. Изолированный outDir исключает конкурентную очистку общего dist. |
| `npm run check:css` | PASS: мёртвых правил 0, `04-css.log`. Тот же неизменённый checker дополнительно выполнен с путями изолированной сборки: 0 во всём охвате, `04-isolated-css.log`. |
| Собственные CSS var references / `git diff --check` | Все токены существуют; whitespace ошибок нет. |
| EN/RU Home и три публичных cover, 360/1440 | 16 сочетаний маршрута/ширины, 24 сцены. Везде document.scrollWidth = viewport; 0 pageerror/HTTP errors, 0 unloaded images. |
| Keyboard / zoom | 24 фокусируемые ссылки с видимым outline; 12 открытий cover-кадра через Enter, актуальный wide/narrow источник, Escape и возврат фокуса — PASS. Home ссылки сохраняют переход в соответствующий кейс. |
| Focus tone | Home Agent/Learn outline #FF8A75, Portal #D43220; `04-evidence/focus.json`. |
| Agent motion / reduced-motion | EN/RU 360/1440: 4 прогона обычного interlock до конечного кадра и смена на reduce. Обе панели и gate имеют opacity 1. Home gate также видим, SVG человека на месте. |
| Pawly geometry | EN/RU Home/cover 1440: разница верхних краёв 0 px, gap 32 px. На mobile каждый материал целиком по левой/правой оси общей колонки. |

Проверенные маршруты: `/`, `/ru/`, `/work/agent-ops-console`, `/work/partner-portal`, `/work/pawly` и соответствующие `/ru/work/...`.

Общий `npm run build` сначала застал временно несогласованные Home copy/index (`map` у undefined), затем конкурентную очистку dist/chunks/astro (`ENOENT`). Это зафиксировано в `04-build.log` и не выдано за PASS. Финальная изолированная сборка и production-прогон чистые; обычный общий build следует выполнить координатору после стабилизации всех шести пакетов.

Краткая машинная сводка: `04-evidence/summary.json`. Полные измерения: `04-evidence/verification.json`. Примеры финальных кадров: `home-agent-ru-360.png`, `home-portal-en-1440.png`, `cover-portal-ru-360.png`, `home-pawly-en-1440.png`.
