# G-final · пять историй и итоговый сайт · 04.10.2026

Локальная реализация G завершена по прямому поручению владельца и последовательному CONTROL. Все пять принятых историй подключены в EN/RU, главная показывает Product Designer и пять реальных работ, лишняя legacy-ветка удалена. Общие запросы закрыты. Итог проверен и воспроизведён в чистом checkout. Художественная приёмка владельцем новых кейсов не заявляется: A принята владельцем, B–F — координатором по согласованному ночному процессу.

**Смотреть сайт:** [EN](http://127.0.0.1:4391/) / [RU](http://127.0.0.1:4391/ru/). Исправленный контур — [Portal, Domain system](http://127.0.0.1:4391/work/partner-portal/#domain-system). [Обложки и полные desktop/mobile кадры](final/visual-gallery.md), [сравнение и порядок](final/order-review.md), [handoff](final-handoff.md).

## Точные версии и происхождение

Финальный frozen code ref — **93b9f7f5a260636b878fd0d67f863c675e410065**, ветка codex/portfolio-integration-g. Parent после переносов D/E/F — 65da74a9d32f1cfb2787bcb633eacf2242f750e0. Последующая metadata добавляет отчёты, указатель base.md, manifest, QA и кадры; она не меняет финальный код. Для воспроизведения использовать frozen code ref, а не актуальное название ветки. Старые base.md и отчёты внутри frozen ref исторические; текущая передача — этот документ.

| Пакет | Принятая версия | Статус и маршрут |
|---|---|---|
| A + G-01 | 936724beff3bb9a01c69381659dc808782cc7950 | Принята владельцем в G; общий contract, renderer, specimens и /kit |
| B Portal | ae47c6bec7641669470783269e63280debeaa5ee | Координатор; /work/partner-portal/ и RU |
| C Learn | 9d714b3994169d87620f1704f029e78d94ec15b2 | Координатор; /work/learn/ и RU |
| D Vet | 81db809e6ac1f9e99bc117b9b63a9f52e72e32d0 | Координатор; /work/vet-clinic/ и RU |
| E Pawly | a3641e8203dc250dc520ac494eec7fea0cf5f965 | Координатор после actual film retest; /work/pawly/ и RU |
| F Agent Ops | cfba94c0d184e1063484961b1ac5f463d6981e27 | Координатор после actual focus retest; /work/agent-ops-console/ и RU |

История точных баз: A — 936724beff3bb9a01c69381659dc808782cc7950, 277 файлов; A + G + B/C — 58002c398c3386c9df4b398f324ab07115c979f7, 585; film base — a6faac3a3d10eb6601fcc34caa70a915bea5dab3, 630; focus delta/common ref — 6e8f0e075916dec82a90831c7c2c78a38ea60e20, 630. Старые manifests и отчёты сохранены, не перезаписаны. Подробнее — [base.md](base.md), [wave-1-report.md](wave-1-report.md), [film-common-report.md](film-common-report.md), [focus-common-report.md](focus-common-report.md). Прежний общий report сохранён в [history/g-base-report.md](history/g-base-report.md).

B/C уже были интегрированы в первой волне, повторно не переносились. D/E/F перенесены только собственными commits; общие E 129b96f5bebcb9f11c93a42b2f78617b3b217d9c и F c950cb20ec9557f6a656dd8ed825c18b40970c88 пропущены как дубликаты уже принятого общего delta.

| Источник D/E/F | Commit в G |
|---|---|
| 4919971ab2a75135fd4efa4a332a998eed292c0f | 86d6a2c0dab70041e1b29ffc7d45a30420f0e2de |
| 81db809e6ac1f9e99bc117b9b63a9f52e72e32d0 | 79b468aaa4425e2c7319d226515f7925efea2b87 |
| d3bbbbd78fb3a75c87d3f6117f91d1606e462932 | 50b570834cbf7504decb840df334846c220d9d92 |
| a3641e8203dc250dc520ac494eec7fea0cf5f965 | fb6f2748c6b69f587ef059f363cb1cb48527623e |
| 3d35b7c88b89f36c72eaff315dec4bfc5dc887a5 | 742dc7c80171fb4a8305fae489ea9358cb851497 |
| cfba94c0d184e1063484961b1ac5f463d6981e27 | 65da74a9d32f1cfb2787bcb633eacf2242f750e0 |

[final/inputs.json](final/inputs.json) фиксирует checkout/ref каждого исполнителя, собственные пути и исходные hashes чужих dirty-файлов. [final/imports.json](final/imports.json): 632 собственных файла D/E/F совпали с принятыми версиями, 0 расхождений. G не переписывал их story/evidence/media/case maps. Продуктовые проекты остаются read-only. Пять исходных несвязанных tracked-правок сохранены вне commits; untracked-инвентарь и orchestration CONTROL/STATE не включались. Main, push и deploy не выполнялись.

## Итоговая композиция и оболочка

Единый штатный renderer теперь показывает CaseStory для всех пяти entry; 579 строк legacy-ветки удалены. Public slugs и языковые пары сохраняются. Реестры используют принятые story titles/outcomes/themes; Next получает соседнюю историю из того же порядка. Новая /work страница не нужна: обзор работает на /#work и /ru/#work.

Home открывается ролью Product Designer, именем и коротким контекстом B2B/tools/mobile. Все пять работ видны сразу в обычном потоке. Новый общий featured-work.ts берёт название, media и theme из принятых stories; обещания кратко описывают материал, статусы различают клиентскую работу, независимую пересборку и концепт. Обложки показывают настоящий принятый UI, без старых художественных замен. Desktop меняет масштаб и плотность по истории; mobile сохраняет родные пропорции. Pawly mobile показывает полный подтверждённый report. Webflow остаётся дополнительным доказательством навыка; его anchors открывают прежний dialog при JS и работают как реальные внешние ссылки без JS.

About и контакт сохранены в существующей структуре, с актуальной краткой связкой на Home. Mobile navigation, локализация, Email/LinkedIn, существующие EN/RU CV, footer и 404/500 сохраняют ранее принятую G-оболочку и проверены в новом сайте. Новое CV не создавалось. Монограмма NK уже исправлена в G-base по подтверждённому замечанию Роберта: отдельный вертикальный штрих K, просвет, согласованные торцы и соответствующий favicon; повторный бренд-процесс не нужен. История и before/after — history/g-base-report.md и shots/logo-comparison.png.

SEO: OG titles соответствуют принятым историям; description берётся из cover outcome. Public canonical имеет завершающий slash, hreflang en/ru/x-default и reciprocal OG locale. 14 public sitemap URLs сохранены. /kit и preview остаются noindex, без собственного canonical и вне sitemap; robots, 14 OG assets и оба PDF проверены. Нужды в redirects не возникло.

Порядок **Agent Ops → Portal → Learn → Vet → Pawly** сохранён согласованно в Home, EN/RU реестрах и Next. После сравнения пяти финальных обложек и первых двух экранов рекомендую оставить его: Agent показывает подтверждённый клиентский цикл и human review; Portal — отгрузку и системный UI; Learn расширяет B2B материал; Vet — роли и плотный workspace; Pawly завершает native mobile и человеческий контекст. Portal мог бы быть первым при приоритете enterprise delivery. Выбор альтернативы не нужен для готового локального результата. [Конкретное сравнение](final/order-review.md).

## Общие запросы

| Запрос | Итог и доказательство |
|---|---|
| G-01, край specimens | Закрыт в принятой A: снят внешний Storybook canvas, alpha вне родного контура, capture bleed 2 CSS px; CaseScreen native без собственной маски/радиуса/тени. Красная рамка самого продукта сохранена целиком. В итоговом сайте 26 captures имеют прозрачные внешние углы; 142 загруженных media совпали с файлами. Свежий кадр из clean preview — final/shots/availability-outline-final.png |
| B-G-01, Next после resize | Закрыт первой волной; общий IntersectionObserver и пересчёт tween. Новый site-wide retest: 11 маршрутов, 48 live preference transitions, resize 1440→1024, native Next/Back, 0 failures |
| D-G-01, названия зон ролей | Закрыт G-final: DiagramCanvas выводит уже предусмотренное optional label у group. Один общий SVG вариант, существующие роли/токены; schema, nodes/edges и данные Vet не менялись. Все три заголовка внутри своих групп в EN/RU, full/reduce/no-JS и четырёх ширинах. /kit с неподписанными group и другая история Portal остаются корректными |
| E-G-01/02/03, ручной inline film | Закрыты shared delta 433c80bcba29eda2060067570e9f8ec2087a2a91 и actual E retest. Без autoplay/loop, нативные controls, статичный poster, pause при уходе/preference/disposal. Public Pawly: шесть playback profiles, две lifecycle и четыре geometry проверки; clean preview — ещё два no-JS native launch |
| F-G-01, reading position при preference | Закрыт shared 6e8f0e075916dec82a90831c7c2c78a38ea60e20 и actual F retest. Public Agent: 36 native observations / 96 live switches, быстрый и обратный wheel, 0 failures. animations.js в G-final не менялся |

Общий renderer один. Новых tokens, dependencies или motion patterns G-final не добавляет; точные DS-зеркала сохраняются. Документы components/patterns/screens-home описывают существующие group labels, принятую cover-композицию и progressive dialog anchor. Собственный список code commit — [final/code-files.json](final/code-files.json), 16 путей: PLAN, три DS-документа, DiagramCanvas/FeaturedCase/ProjectDialog, EN/RU registries/home, featured-work, OG, Home/kit/work route.

## Проверки и фактические ограничения охвата

| Проверка | Охват и результат |
|---|---|
| Types/build/CSS | 113 файлов, 0 errors/0 warnings, 101 существующий hint; 36 HTML страниц; 36 CSS routes, 0 мёртвых правил. build-final.log, check-final-summary.log, css.log |
| Site-wide matrix | 336 профилей: EN/RU × 1440/1024/390/360 × обычная/600 высота × full/reduce/no-JS × Home/About/пять stories. Один h1, отсутствие горизонтального overflow/page errors, native links/contact/CV, блоки историй, статичные fallback и Next. Первоначальные 26 замечаний harness закрыты 30 целевыми retests; см. пояснение ниже |
| Final delta | После последней Home copy/mobile selection и D-G-01: 51 профиль, 0 failures. 48 Home/Vet профилей + /kit и Portal EN/RU; group labels внутри рамок, все пять cards, выбранный native Pawly report |
| Native motion | Agent: 36 observations, 96 preference switches, fast/reverse wheel и reading stops; controls: 11 маршрутов, 48 switches, resize, marquee и Next. 0 failures |
| Pawly film | Шесть full/reduce/no-JS playback profiles EN/RU прошли play/pause/resume/end. После исправления URL-assertion harness — 2 lifecycle + 4 geometry, 0 failures. Выход/возврат не запускает film сам, Next удаляет bindings, Back возвращает единственный paused video |
| Harmony | Все 14 public страниц × 4 ширины × высоты 900/600 = 112 профилей, 0 нарушений. EN/RU слова: Agent 404/336, Portal 448/394, Learn 400/361, Vet 339/298, Pawly 329/279; утверждения и статусы не расширены |
| SEO/assets/parity | 18 metadata routes, 14 public sitemap URLs, robots, два PDF; 142 served image files совпали, 26 alpha captures без внешних непрозрачных углов; tokens.css и motion.js mirrors побайтово равны |
| Итоговые кадры | 28 полных EN/RU desktop/mobile страниц после actual decode и first carousel stop, 0 failures; также пары первых двух экранов, 20 Home cover кадров и Vet role flow |
| Чистое воспроизведение | 1270 canonical files / 245198805 bytes совпали без дополнительной нормализации; npm ci/check/build/CSS exit 0, status clean, оба mirrors равны. Новый preview 4391: 28 launch profiles + 2 Pawly no-JS native playback, 0 failures |

Исходный site-verification.json честно сохраняет 26 findings, а не искусственный PASS: 10 проверок приняли offscreen lazy carousel slides за уже загруженные; 12 canonical assertions забыли завершающий slash; два nav assertions ожидали dialog вместо существующего custom panel; два Back assertions сработали до завершения Astro DOM swap. findings-retest.json проверяет реальное decode, правильный canonical/panel и завершённый DOM, 30 observations, 0 failures. Маршрутных/layout/h1/overflow ошибок в исходной матрице не было.

Первый film/verification.json сохраняет одну ошибку harness после шести успешных playback profiles: Next пришёл на правильный Agent URL без slash, а waitForURL ожидал slash. Assertion исправлен по pathname; film/lifecycle-verification.json отдельно фиксирует весь остаток, 6 observations / 0 failures. Failed history не удалена и не смешана с retest. Последние source-правки проверены отдельно final-delta/capture и затем clean build/launch.

Браузерный охват — локальный Chromium 1243 с заданными viewport. Физические устройства, другие движки и физически скрытая вкладка не проверены; document.hidden — явно синтетический handler probe. Внешние Webflow/LinkedIn/demo проверены как корректные ссылки, без запроса к внешним сайтам; письмо не отправлялось. CPU/performance benchmarking на финальном этапе не выполнялся и не смешивался с capture/encoding. npm ci сообщает 11 существующих dependency advisories; lockfile и dependencies этим этапом не менялись, их исправление не заявляется. Полные verbose check logs остаются локально; в metadata сохранены компактные summaries.

Приёмка подтверждает реализованный локальный сайт и источник каждого результата, не новые коммерческие показатели. Для Vet 30 секунд — ограничение; Pawly trust — гипотеза; Learn reconstruction не доказывает измеренный learning effect; Portal показывает отгруженную исходную работу отдельно от demo; оценки Agent помечены оценками. Пользовательское исследование и художественная приёмка владельца не подменены QA.

## Воспроизведение и передача

Чистый frozen checkout: D:/Claude-projects/Site-portfolio/tmp/portfolio-final-93b9f7f. Preview запущен командой npm run preview -- --host 127.0.0.1 --port 4391. Он обслуживает финальный dist этого checkout, независимо от последующих root-правок. Preview endpoints всех владельцев и /kit остаются техническими, публичные истории доступны по сохранённым /work slugs.

Для нового checkout использовать полный ref 93b9f7f5a260636b878fd0d67f863c675e410065 и обычные npm ci, npm run check, npm run build. Integrity verifier запускается из текущего root: node tasks/portfolio-rebuild/integration/final/reproduce-final.mjs --root=<fresh-checkout>. Он сверяет committed manifest, запускает команды, проверяет mirrors и clean status. Выходы — final/reproduction.json и clean-* logs. Canonical manifest объединяет прежние 630 common paths, точные D/E/F payloads и G code whitelist; 1270 уникальных путей. Metadata и её собственный manifest не хешируют себя.

Готовность: полный локальный кандидат для просмотра владельцем и отдельной production-публикации. Открытых технических common-requests и незавершённых public migrations нет. Публикация и новая художественная приёмка требуют соответствующего отдельного действия владельца; текущий пакет не содержит push/deploy. Orchestration и запуск чатов принадлежат контроллеру; G оставляет конечный handoff и не меняет CONTROL/STATE.
