# Пакет 04 — запросы смежным владельцам

07.10.2026. Правки только в WorkStage.astro и case-art.ts; общие файлы ДС и CaseCover не изменены.

## Чат 1 — семантическая поверхность Portal и спецификация

- Первоначальная просьба о нейтральном Portal отозвана после 01-requests.md: владелец ДС предоставил `--surface-cover-portal` → `--lavender-100` (#DDD5FF). WorkStage использует именно этот семантический токен на Home/cover. Документальный UI сохраняет собственные цвета. Локального альтернативного цвета больше нет; новых токенов пакет 04 не требует.
- В `ds/components.md`, `ds/patterns.md`, `ds/screens/home.md`: Human review в Home WorkStage — SVG человека + читаемая body-sm подпись, существующие hooks `data-cover-panel` / `data-cover-gate`; Portal — якорь 38 + одна редакционная цитата и пометка Demonstration example / Демонстрационный пример, без Source row; общая lavender-сцена на обеих поверхностях Home/cover; Pawly — общая верхняя линия фото/отчёта, колонки 2:1, gap space-8 от bp-lg, report max space-48 × 2, без центрирования и лишних боковых полей. На mobile материалы последовательно на полную ширину. Learn detail — текстовая связка без ↔. На Agent/Learn WorkStage установлен `data-focus-tone="inverse"` по запросу владельца ДС; поля Agent принадлежат FeaturedCase, не дублируются.

## Координатор — отдельный gate полного Agent cover

`src/components/CaseCover.astro` не входит во владение пакета 04. Agent использует отдельную ветку proof/interlock этого компонента, обходя WorkStage. В ней `.case-opening__gate-line` всё ещё рисует два штриха. Для закрытия замечания на полном cover заменить этот span тем же SVG человека (viewBox 0 0 48 48, circle + плечи) и ds-body-sm подписью; оставить `data-cover-gate`, `data-cover-panel` и `cover-interlock`. Не менять animations.js. Домашний gate исправлен в WorkStage.

## Чат 3 — общая рамка

Portal/Pawly используют обычный CaseScreen с полным исходным кадром. Локально новая белая карточка и `native=true` не добавлены: решение по внешней рамке остаётся в общем компоненте пакета 03.
