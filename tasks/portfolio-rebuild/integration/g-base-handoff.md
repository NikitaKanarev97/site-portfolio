# G-base · готов к следующему этапу · 04.10.2026

Checkpoint завершён. Владелец принял A; замечание о красной обводке без внешних белых краёв исправлено и вошло в точную воспроизведённую базу.

**Base ref для B/C:** `936724beff3bb9a01c69381659dc808782cc7950`.

**Alias:** `codex/portfolio-common-a-2026-10-04`.

**G checkpoint code ref:** `68b608a34c382ee80c24ae15f0a45277e2277db7`, ветка `codex/portfolio-integration-g`. В нём сохранены независимые shell/SEO/service/logo исправления G. При интеграции кейсов G продолжает от своей ветки и переносит тематические case commits, не заменяет checkout старой базой A. Следующий commit документации содержит этот handoff и финальный отчёт checkpoint.

**Исходный checkout:** `D:/Claude-projects/Site-portfolio`.

**Чистое воспроизведение A:** `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-a-g01-936724b`, detached HEAD точного base ref. 277 integrity файлов, npm ci/check/build/CSS проходят, git status чист. Все 26 новых captures побайтово одинаково отдаются через 4350/4352/4353; alpha и renderer проверены.

Документы: `integration/base.md` — состав, полный ref, ownership, запуск и frozen interfaces; `integration/report.md` — фактический охват, accepted versions, ограничения, shell и проверки; `integration/handoffs.json` — A принят, B–F ещё не получены. Все пути от `tasks/portfolio-rebuild/`.

Preview: неизменная A — `http://127.0.0.1:4353/preview/common/`, `/kit/`; рабочий G — `http://127.0.0.1:4352/preview/common/`, `/kit/#common-contract`, `/`, `/ru/`. Конкретный исправленный материал: `/preview/common/en/partner-portal/#domain-system`. Кадры — `integration/shots/corners-*.png`, `shell-*.png`, `service-*.png`, `logo-comparison.png`.

Контроллер может переходить к B согласно `orchestration/CONTROL.md`; использовать полный текущий `b-partner-portal.md` и ref A выше. Исполнителю читать `base.md` и этот report из исходного checkout, поскольку они добавлены после base ref. Кейсовый чат делает собственный изолированный checkout, не правит общие файлы и передаёт конкретный case commit, полную EN/RU историю, источники/evidence/media/artifact-plan, preview, desktop/mobile, сцену, проверки и ограничения. Common Portal A является примером контракта, не полной story B.

База второй волны не готова и не выдумывается: после B+C G принимает и интегрирует пару, закрывает общие запросы, проверяет соседние stories, пишет updated base ref и `wave-1-report.md`. Контроллер ведёт последовательный запуск; G не создавал/не дублировал чаты и не изменял STATE.json. Порядок кейсов сохранён. Push/deploy не выполнялись.
