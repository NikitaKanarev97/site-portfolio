# G-integrate-1 · завершённый checkpoint для контроллера

Статус: complete. B/C приняты координатором и штатно интегрированы. B-G-01 закрыт. Обновлённая база выдана для последовательных D/E/F. Этот handoff не является финальной приёмкой сайта или художественной приёмкой B/C владельцем.

## Ref и запуск

Updated base/code ref: **58002c398c3386c9df4b398f324ab07115c979f7**. Alias: codex/portfolio-common-wave-1-2026-10-04. Source checkout: D:/Claude-projects/Site-portfolio; branch codex/portfolio-integration-g. Parent: afe6785cc20d230c96b8c1d3f350ffa13bbeb18f. Чистый detached checkout: D:/Claude-projects/Site-portfolio/tmp/portfolio-wave-1-58002c3. Идея snapshots прежняя: точные final metadata добавляются после code ref; исполнитель читает актуальные документы из source checkout перед созданием своего worktree.

Неизменный production origin: http://127.0.0.1:4364. Integration production: http://127.0.0.1:4352; dev: http://127.0.0.1:4350. Локальные процессы действуют пока запущены; любой свободный порт воспроизводит paths после npm ci / npm run build / npm run preview -- --host 127.0.0.1 --port <port>.

- Portal: /work/partner-portal/ и /ru/work/partner-portal/.
- Learn: /work/learn/ и /ru/work/learn/.
- Owner previews: /preview/partner-portal-rebuild/en/, /preview/partner-portal-rebuild/ru/, /preview/learn-rebuild/en/, /preview/learn-rebuild/ru/.
- Shared checks: /kit/, /preview/common/en/agent-ops/, /preview/common/ru/agent-ops/; контрольный Portal не подменяет story B.

## Точные принятые версии

B submitted ae47c6bec7641669470783269e63280debeaa5ee; imported 3d75650ac32b8757bcf0035c50a96899cba35a55 + отдельный capture-fix 1dc263f11fba969e6a822a985b4201c70ba0d26b. C submitted 9d714b3994169d87620f1704f029e78d94ec15b2; imported afe6785cc20d230c96b8c1d3f350ffa13bbeb18f. A 936724beff3bb9a01c69381659dc808782cc7950 и все G-base commits сохранены. 223 payload-файла B/C совпадают с исходными refs. Ownership не обходился, чужие отчёты/common-requests не переписаны; актуальное закрытие finding находится у G.

Содержание и visual/evidence acceptance: wave-1-report.md. Integrity: wave-1-base-manifest.json / wave-1-base-files.txt, 585 canonical Git blobs. Reproduction: wave-1-reproduction.json. Launch proof: reproduce-wave-1-browser.mjs. В unchanged new checkout до правок можно выполнить node tasks/portfolio-rebuild/integration/verify-wave-1-base.mjs; исторический verify-base.mjs относится только к старой A.

## Проверенный охват

64 public profiles (четыре ширины, EN/RU, full/reduce/no-JS/short), семь Next/lifecycle routes, 36 harmony samples: 0 failures. Build/check/CSS: 28 страниц / 106 файлов, 0 errors / 28 routes, 0 dead rules. Оба DS mirrors побайтово совпадают. В чистом checkout повторены install/build/check/CSS, 585 hashes и узкий launch proof: восемь browser profiles, Next/Back/locale для Portal→Learn и Learn→Vet, 26 исправленных capture HTTP responses, 0 failures; git status пуст. Полные matrix/Next повторно в клоне не запускались, UI/code bytes подтверждены manifest.

32 интеграционных desktop/mobile EN/RU кадра: wave-1/shots. Просмотренные крупные края specimens: shots/corners-*.png. Общий Next теперь получает видимость реального viewport через IntersectionObserver и GSAP measurement при resize; pins refreshPriority=1. Длительность, hover/focus и статичные fallback сохранены.

## Продолжение очереди

Контроллер может переходить к D, затем E, затем F от указанного updated ref. G не создаёт новые case чаты и не меняет orchestration/STATE.json. Дальнейшим исполнителям принадлежат их story pair, data/media/case map/preview/reports; общие запросы передаются G. Schema frozen, public slugs неизменны. Agent Ops/Vet/Pawly пока legacy. Порядок Agent Ops → Portal → Learn → Vet → Pawly и главная прежние, финальное сравнение/рекомендация — G-final после пяти stories.

Сохранённые границы: DSSL demo order не удерживает source text/row после submit; Learn assessment не объявлен экспертным банком или доказанным эффектом обучения. Человеческие тесты, коммерческие метрики, физические устройства и новый CPU benchmark не заявлены. Зависимости прежние; npm ci сообщает те же 11 advisories. Source checkout содержит несвязанные чужие tracked/untracked изменения; они не включены и не откатывались. Push/deploy не выполнялись.
