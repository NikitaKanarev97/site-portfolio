# G-integrate-1 · Portal + Learn · 04.10.2026

B и C приняты координатором по ночному поручению владельца и подключены к штатным EN/RU work routes. Визуальная приёмка владельцем относится к A; для B/C она не заявляется. Это checkpoint первой волны. Следующий этап — D/E/F от обновлённой базы; финальная главная и выбор порядка зависят от пяти готовых историй.

## Происхождение и сохранность

| Пакет | Переданный ref | Commit в ветке G |
|---|---|---|
| A, принята владельцем | 936724beff3bb9a01c69381659dc808782cc7950 | тот же commit |
| G, подготовка оболочки | 68b608a34c382ee80c24ae15f0a45277e2277db7 | тот же commit; docs checkpoint 742dbac893a700fc2563942b34b4371f167b330d |
| B, реализация | 172a468fc5570ada70aae033a52ecc3b78c11d69 | 3d75650ac32b8757bcf0035c50a96899cba35a55 |
| B, исправленный RU mobile capture | ae47c6bec7641669470783269e63280debeaa5ee | 1dc263f11fba969e6a822a985b4201c70ba0d26b |
| C, финальный пакет | 9d714b3994169d87620f1704f029e78d94ec15b2 | afe6785cc20d230c96b8c1d3f350ffa13bbeb18f |

Перенос выполнен последовательными cherry-pick: отдельные B/C commits и исправление B сохранены. 105 файлов B и 118 файлов C совпадают с переданными версиями; G не редактировал их story/evidence/media/report, source inventories или case maps. Проверка scope и refs — wave-1/intake.json. Несвязанные tracked/untracked изменения исходного checkout сохранены вне commits G. Продуктовые проекты не менялись. Orchestration CONTROL/STATE прочитаны, их владелец — контроллер; G эти файлы не редактирует.

## Приёмка B

Полные EN/RU stories содержат семь блоков: аудит, общий файл спецификации, решение покупателя, три состояния source line, доменная система, исходный контекст и итог отгрузки. Просмотрены owner desktop/mobile материалы и интегрированные кадры. Ядро истории читается на 390/360: строка 38, текст «камера 4мп уличная», восемь единиц, выбранный KX-2CB4046F2-I, подтверждение и корзина. Схема сохраняет source row до передачи заказа. 13 native состояний в четырёх specimen sets показывают ResolutionRow, FileUpload, Availability, FulfillmentPlan. Красная обводка и прозрачные внешние углы G-01 сохранены.

Исходный редизайн DSSL отгружен целиком по подтверждению владельца. Текущие кадры — демонстрационная пересборка. После submit созданный demo order хранит SKU/quantity, но не исходный текст/номер строки; это ограничение явно сохранено в evidence, narrative и outcome. Бизнес baseline, измерение эффекта и человеческое тестирование не заявляются. B accepted coordinator; native public URLs: /work/partner-portal/ и /ru/work/partner-portal/.

## Приёмка C

Полные EN/RU stories содержат семь блоков: аудит, модель материала, один материал в двух входах, язык контента, нейтральная оценка, публичное обещание и честный результат. Просмотрены owner desktop/mobile материалы и интегрированные кадры. ONVIF материал узнаётся в справочнике и player; история чтения, явное завершение и assessment не смешиваются. Content model сохраняет единственный owner/version. Четыре тематических режима, нейтральный assessment и landing относятся к текущей пересборке Learn, исходная работа — DSSL/TRASSIR.

Specimen использует реальные Storybook Cards четырёх modes, TrustHeader и ProgressMeter: четыре DOM sets, шесть states. Это исходные Card fixtures, не подмена MaterialRow главной. Onest Bold сохранён без выдуманного Semibold; wide/mobile размеры и alpha bleed остаются продуктовыми. QA engineering counts не объявлены пользовательским исследованием. Банк оценок, обучение и коммерческий эффект не подтверждены. C accepted coordinator; native public URLs: /work/learn/ и /ru/work/learn/.

## Штатная интеграция и общий запрос

EN/RU registries сохраняют public slugs и прежние legacy данные, добавляют theme/story только для принятой пары. Единый [slug].astro выбирает CaseStory при наличии story и прежнюю ветку для Agent Ops/Vet/Pawly. Next получает theme/title из следующего entry и native URL с завершающим slash. RU использует тот же renderer. Meta description взята из подтверждённого cover outcome. Новых публичных routes нет; четыре изолированных owner previews вошли в сборку и остаются noindex, без canonical, вне sitemap.

B-G-01: после повторного breakpoint resize Next мог оставаться неподвижным до exit/re-entry. Диагностика показала устаревший cached start/end после пересоздания pin geometry; /kit также содержал legacy pin-swap. Структурные pins имеют refreshPriority=1, по [официальному порядку GSAP refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Видимость marquee теперь определяет IntersectionObserver по реальному viewport; resize пересчитывает размер GSAP tween, не считывает промежуточную раскладку pin-сцен. Observer, resize/visibility listeners очищаются в общем lifecycle. Прежний цикл 24 с, hover/focus, reduce/no-JS и native ссылка сохранены. Общий вариант один для обеих историй, Common Agent и /kit.

Schema, DS tokens и motion mirrors не изменены. Документы components/motion-concept/story-contract описывают общий runtime и registry bridge. Частных renderer или дополнительных зависимостей не добавлено. Главная и порядок Agent Ops → Portal → Learn → Vet → Pawly сохранены.

## Проверки

- check: 106 файлов, 0 errors, 0 warnings; 101 существующий hint. build: 28 HTML страниц.
- check:css: 28 routes, 0 мёртвых правил, включая публичную пару EN/RU, четыре owner previews и прежние routes.
- harmony: девять routes × четыре ширины = 36 samples, 0 нарушений; B/C, Common Agent EN/RU, соседний Vet EN/RU, /kit.
- public matrix: 64 profiles — Portal/Learn × EN/RU × 1440/1024/390/360 × full/reduce/no-JS/short 600. Семь blocks, loaded images, 13/6 native states, отсутствие горизонтального overflow/errors, парные IDs, full-contrast forward/reverse focus stops и три fallback панели подтверждены. 0 failures.
- Next/lifecycle: семь routes, 0 failures; итог фиксирует wave-1/next-verification.json. Проверяются повторный resize до Next и уже в его окне, hover/focus, exit/re-entry, live reduce/full, native Next, Back, Forward/Back и EN/RU locale. Соседи — Common Agent EN/RU и /kit.
- sitemap: 14 прежних public URLs; оба DS mirrors побайтово совпадают. Canonical/hreflang/OG pair проверены в публичной паре и legacy neighbours.

Доказательства: wave-1/{profiles,next}-verification.json, intake.json, build/css/harmony logs, check-summary.txt; воспроизводимые проверки verify-wave-1.mjs и verify-wave-1-base.mjs. 32 интеграционных кадра в wave-1/shots охватывают cover/shared source/specimen/outcome каждой истории на 1440/390 EN/RU. Просмотренные крупные native края отдельно сохранены в shots/corners-*.png. В проверке Common EN повторён только navigation/lifecycle профиль: ожидание нативного ViewTransition.finished заменило ранний снимок CSS animations, который мог пропустить ещё идущий переход; motion runtime не менялся, ошибки не игнорировались. Owner записи и исходные findings остаются историческими; новое исправление общего Next описано здесь, без переписывания их старых отчётов.

## Обновлённая база и границы

Обновлённый code/base ref: 58002c398c3386c9df4b398f324ab07115c979f7; alias codex/portfolio-common-wave-1-2026-10-04. Чистый checkout D:/Claude-projects/Site-portfolio/tmp/portfolio-wave-1-58002c3 воспроизвёл 585 файлов, install/build/check/CSS и восемь браузерных smoke profiles, 0 failures. Точные records — base.md, wave-1-reproduction.json и wave-1-handoff.md. Финальный evidence/handoff commit добавлен после неизменного snapshot; это не другая UI версия. Новый wave-1-base-manifest.json хеширует canonical Git blobs выбранного пакета; исходный base-manifest.json относится только к неизменному ref A. D/E/F используют новую базу целиком, без overlay старого ZIP.

Production integration origin: http://127.0.0.1:4352. Проверено в локальном Chromium/Playwright; viewport profiles не заменяют физические устройства, человеческий UX-тест или измерение продуктового эффекта. Новый CPU/performance benchmark не выполнялся; capture и encoding не объявлены performance evidence. Истории F/D/E ещё не получены, их public entries остаются legacy. Финальный site-wide QA и главная выполняются на G-final. Push/deploy не выполнялись; готовность к публикации не заявлена.

Точный список 61 файла implementation/integration commit — wave-1-files.txt; полный integrity payload — wave-1-base-files.txt. Последующий evidence/handoff commit содержит только итоговые статусы, воспроизведение и узкий launch-proof script.
