# 03 — общий шаблон превью

07.10.2026, локальный результат. Пакет реализован в своих трёх компонентах; чужие файлы, токены и общий каталог ДС не редактировались. Коммит, push и deploy не выполнялись.

## Изменения

- `src/components/FeaturedCase.astro`: одинаковая белая внешняя шапка пяти проектов. Название `ds-display-6xl`, пояснение справа в сетке 3:2 от bp-lg; ниже — одна колонка. Удалены порядковые номера, повторяющийся год, нижняя линия и локальные исключения Vet/Pawly/Portal/Learn. Agent graphite ограничен сценой, инверсный focus назначен её обёртке. Одна строка факта о работе и единый CTA используют текущий copy владельца.
- CTA: общий `IconArrow.astro` пакета 06, роли text-link/hover/pressed, без постоянного подчёркивания, цель минимум 48 px. Сохранены stretched whole-card target и отдельные интерактивные цели.
- `src/components/CaseScreen.astro`: новый семантический вариант `appearance="edge"` по умолчанию — снимок без белой padded карточки. `appearance="frame"` сохраняет прежнюю геометрию; автоматически выбирается при annotations, чтобы не сдвинуть CaseCallout. nativeWidth учитывает поля только frame. Native alpha, actual currentSrc, подпись zoom и видео через MediaFrame сохранены. Keyboard focus показывает cue также на touch.
- `src/components/ScreenSurface.astro`: optional `outlined` рисует тонкую границу по существующему единственному radius-media контуру. Нет добавленной заливки, дорисовки пикселей или второго clipping edge; native пропускает маску и обводку.
- Reduced motion: явные CSS-правила отключают подъём сцены, смещение стрелки и scale zoom cue. Новые motion hooks не добавлены.

Прочитаны CLAUDE.md, ds/CONTRACT.md, актуальная основа/компоненты/паттерны/карта Home и ссылки S01/S02/S03/S05/S10/S19/S27/S28/S29/S14. Реальные продуктовые изображения не редактировались. Новое CONTENT-RULES.md принято: прежнее указание сохранять публичный Concept отменено, актуальный Home copy владельцев использует описание выполненной работы без этих статусов. Сквозной контроль текстов, изображений и PDF относится к пакету 07.

## Проверки

| Проверка | Результат |
|---|---|
| `npm run check -- --minimumSeverity error` | PASS, 145 файлов, 0 errors; 12:21 MSK, `03-check.log`. Флаг меняет порог вывода, результат проверки ошибок сохранён. |
| `npm run build` | PASS, 36 страниц; 12:26 MSK, `03-build.log`. |
| `npm run check:css -- /work/learn /ru/work/agent-ops-console /ru/work/partner-portal /ru/work/learn /ru/work/vet-clinic /ru/work/pawly` | PASS, 0 мёртвых правил на 35 проверенных маршрутах; `03-css.log`. |
| Home `/` и `/ru/`, 360×800 | Все пять заголовков 32 px, одна колонка 297 px, CTA 48 px. Документ 345/345, без горизонтального overflow. |
| Home `/` и `/ru/`, 1440×1000 | Все пять заголовков 96 px; одна сетка 720.594 + 480.398 px, нижние оси title/outcome совпадают. Footer border 0, CTA decoration none, обычный CaseScreen padding 0. Документ 1425/1425. |
| Светлый полный `/work/vet-clinic` и `/ru/work/vet-clinic`, 360/1440 | Контрастная сцена и полные исходные кадры проверены. EN cover zoom на 360 открывает trace-en-narrow. В RU полном кейсе найдено узкое переполнение вне рамки снимков — запрос ниже. |
| Тёмный полный `/work/agent-ops-console` и `/ru/work/agent-ops-console`, 360/1440 | Снимки и annotations frame сохранены; на 360 выбран message-390/payout-390. Найден обрезанный RU подстрочник CaseCover — запрос ниже. |
| Native specimens полного `/ru/work/partner-portal`, 360 | 13 native фрагментов. Surface display:contents, padding 0, прозрачная подложка, img radius 0, без outlined. Native zoom оставляет display:contents и родной alpha-контур. |
| Whole-card и клавиатура | Нажатие свободной области карточки Vet ведёт в кейс. Title/CTA Enter работают; CTA :focus-visible рисует общий outline. Zoom Enter открывает dialog; Escape закрывает и возвращает :focus-visible к исходному снимку, в том числе native specimen. |
| Reduced motion | Правила проверены в исходниках и CSSOM собранного Home. Доступный CUA не предоставляет media-emulation; живой прогон с включённым prefers-reduced-motion не подтверждён. Текущая браузерная настройка — no-preference. |

Использование CaseScreen/ScreenSurface сверено во всех носителях: WorkStage, LearnStage, VetStage, CaseCover, CaseSteps, CaseShot, CaseRoutes, CaseCallout, CaseCarousel, CaseSpecimen, MediaFrame и MediaZoom. Полный аннотированный frame сохраняет поля и маркеры; остальные обычные снимки получают edge. CSS-проверка покрыла все публичные кейсы EN/RU и каталог/preview-маршруты.

## Доказательства

Снимки — `reports/03-shots/`. Основные актуальные примеры после последней сборки:

- `home-en-1440-agent.jpg`, `home-ru-1440-agent.jpg`: шапка, сцена, факт и CTA целиком.
- `home-ru-360-agent.jpg`, `home-en-360-pawly.jpg`: мобильная шапка и материал.
- `portal-ru-360-native.jpg`, `portal-ru-360-native-zoom.jpg`: сохранённые native-фрагменты.
- `vet-en-360-zoom.jpg`, `agent-en-1440-zoom.jpg`: dialog обычных снимков.
- `agent-ru-360-cover.jpg`: внешний дефект RU CaseCover.

Численные данные свежего Home: `en-mobile.json`, `ru-mobile.json`, `en-desktop.json`, `ru-desktop.json`. Остальные снимки пяти сцен на EN/RU 360/1440 фиксируют промежуточную визуальную сверку; отдельные тексты в них могут предшествовать правкам пакета 07.

Проверяемая локальная сборка доступна на http://127.0.0.1:4403/ru/; вкладка сохранена для просмотра, временный viewport override сброшен.

## Оставшиеся зависимости

Все конкретные запросы записаны в `03-requests.md`:

1. Пакет 01: каталог ДС должен отразить edge/frame/outlined и общий featured header. Новые токены не нужны; обратная связь по инверсному focus уже реализована.
2. Пакет 05: передать `native` для прозрачного Learn passport, чтобы не накладывать новую тонкую границу на родной alpha-контур. Его исходник и LearnStage не принадлежат пакету 03.
3. Координатор: исправить перенос RU lead полного Agent в CaseCover на 360. Отдельный pause-glyph этого cover также остаётся запросом пакета 04; домашний human-review уже исправлен владельцем WorkStage.
4. Координатор/пакет 07: проверить 2 px горизонтального overflow полного RU Vet и перенос текста в MetaList. Home EN/RU переполнения не имеет.

Общий финальный content-check и сборка после завершения всех соседних пакетов остаются интеграционной проверкой координатора. Этот отчёт подтверждает локальный пакет 03, не приёмку всех параллельных правок.
