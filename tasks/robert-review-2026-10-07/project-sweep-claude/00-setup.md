# 00 — подготовка (параллельный прогон Claude)

- Дата: 2026-10-07. HEAD `0dda338`, ветка `codex/portfolio-integration-g`.
- Незакоммиченных путей на старте: **413** (`git status --short | wc -l`).
- Папка прогона: `tasks/robert-review-2026-10-07/project-sweep-claude/`. Кодекс пишет в соседнюю `project-sweep/`, сюда не заходим, чтобы потом свести результаты.
- Dev-сервер: `npx astro dev --host 127.0.0.1 --port 4421`, лог `logs/dev.log`. Порт 4421 вместо 4420, чтобы не мешать параллельному прогону.
- Маршруты EN/RU: `/about/`, 5 кейсов → 200; `/404`, `/ru/404` → статус 404 (страница рендерится, это ожидаемо). Главная снята как эталон.
- CONTENT-RULES.md прочитан: запрещены Concept, pet-project и любые заменяющие обесценивающие статусы («лишь прототип», «гипотеза…»). Правдивые методологические факты в объяснении решения допустимы.
- Особенность: dev-тулбар Astro снимает `data-astro-source-*` после загрузки, поэтому скрипт копирует их в `data-sf` init-скриптом.
- Отклонение от задания: `scripts/find-duplicate-phrases.mjs` ищет дубли ключей в словаре локализации (`RussianLocalization.tsx`), а не повторы фраз между кейсами. Для X3 написан свой n-граммный поиск (этап 3).

## Инвентарь (EN 1440, корневые вхождения компонента)

| Компонент | about | agent-ops | partner | learn | vet | pawly | 404 | home |
|---|---|---|---|---|---|---|---|---|
| CaseCover | | 1 (proof) | 1 | 1 | 1 | 1 | | |
| CaseSheet | | 1 | 1 | 1 | 1 | 1 | | |
| CaseThesis | | 3 | 5 | 7 | 4 | 4 | | |
| CaseStory | | 6 | 9 | 9 | 7 | 8 | | |
| CasePlate | | 5 | 8 | 5 | 8 | 9 | | |
| CaseScreen | | 14 | 38 | 30 | 20 | 39 | | 20 |
| ScreenSurface | 2 | 8 | 20 | 16 | 11 | 21 | 1 | 20 |
| CaseShot | | | 2 | 4 | 2 | 2 | | |
| CaseSpecimen | | | 2 | 2 | | 2 | | |
| CaseSteps | | 1 | 1 | | 1 | 1 | | |
| CaseCallout | | 6 | 4 | 4 | | | | |
| CaseArtifact | | | 2 | 1 | 1 | | | |
| Diagram / DiagramCanvas | | | 2/4 | 1/2 | 1/2 | | | |
| CaseCarousel | | | | | 1 | 1 | | |
| CaseNumbers | | 1 | | | | | | |
| CaseImpact | | 1 | 1 | 1 | 1 | 1 | | |
| CaseRoutes | | | | 1 | | | | |
| MetaList | | 2 | 2 | 2 | 2 | 2 | | 4 |
| WorkStage / LearnStage / VetStage | | | 1/–/– | 1/1/– | 1/–/1 | 1/–/– | | 5/1/1 |
| MediaFrame | 2 | | | | | 2 | | 18 |
| MediaZoom | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| CaseNext | | 1 | 1 | 1 | 1 | 1 | | |
| SectionHead | 4 | | | | | | 1 | 2 |
| AuthorPortrait | 1 | | | | | | | 1 |
| Navbar | 6 | 6 | 6 | 6 | 6 | 6 | **—** | 6 |
| CopyEmail / Footer | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 2/1 |

MoreCases, DecisionBlock, NoteBlock, ScreenStack, CaseCarousel вне vet/pawly на публичных страницах не стоят. На 404 нет Navbar.
