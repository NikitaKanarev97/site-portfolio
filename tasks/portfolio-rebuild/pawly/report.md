# E · Pawly · inline film завершён · 04.10.2026

Полная EN/RU история готова к передаче: native return-proof занимает штатный второй шаг `return-boundary`, между expected и confirmed. Временный companion после CaseNext и ссылка на удалённый #return-proof убраны. Свежие actual-case проверки закрывают E-G-01/02/03: 6 native playback + 2 lifecycle профиля, 34 профиля страницы, 0 failures. Это собственная проверка E; координаторская/владельческая приёмка и публичная интеграция не объявляются выполненными.

Художественная история сохранена: совместимость → ожидаемое возвращение → local/sending/confirmed → report → деньги исполнителя. Три native семьи компонентов и фактические September UI/fixtures остаются прежними. Реальные пользователи, рост доверия и коммерческий эффект не заявляются.

## Ref, checkout и интеграция

| Пакет | Точный ref / роль |
|---|---|
| Исходная база E после B+C | `58002c398c3386c9df4b398f324ab07115c979f7` |
| Исходный E payload | `d3bbbbd78fb3a75c87d3f6117f91d1606e462932`; история сохранена |
| Принятый общий delta G | `433c80bcba29eda2060067570e9f8ec2087a2a91`; ровно шесть shared файлов |
| Локальный import в E | `129b96f5bebcb9f11c93a42b2f78617b3b217d9c`; чистый cherry-pick, E payload не менялся |
| Результирующая case-добавка | Тематический HEAD `codex/pawly-rebuild-e`, содержащий этот отчёт; полный hash отдельно передан в финальном сообщении |

Checkout: `C:/Users/kanar/.codex/worktrees/pawly-rebuild-e/Site-portfolio`. Preview origin 4370 оставлен работающим: [EN](http://127.0.0.1:4370/preview/pawly-rebuild/en/), [RU](http://127.0.0.1:4370/preview/pawly-rebuild/ru/). Native scene: [EN return-boundary](http://127.0.0.1:4370/preview/pawly-rebuild/en/#return-boundary), [RU return-boundary](http://127.0.0.1:4370/preview/pawly-rebuild/ru/#return-boundary).

Для G: перенести исходный own-case d3bbbb, если его ещё нет, затем новую case-добавку. Shared 433c80b уже есть у G; локальный import129b96f повторно переносить не требуется. Case-добавка меняет только прежнюю область E. `files.txt` / `manifest.json` описывают полный собственный payload, shared шесть исключены и отдельно сверены через `common-import.json`. Никаких root snapshot/fixture commits G в E не импортировано.

Публичные routes, registries, главная, PLAN/STATE/CONTROL не менялись. Новых чатов/сообщений другим чатам, push/deploy, изменений соседнего продукта и остановки чужих preview не было. Свои read-only source helper4371/4372 завершены после первоначального capture.

## Реализация и композиция

`pawlyStory` и единая locale factory — `src/copy/cases/pawly.ts`; `pawlyStoryRu` / assertStoryPair — `src/copy/ru/cases/pawly.ts`. Legacy exports сохранены. Порядок, IDs/types/evidence/media и геометрия EN/RU совпадают. Case map — `ds/screens/case-pawly.md`.

Четыре ранних факта дают статус концепта, единственного дизайнера, September EN/RU и synthetic QA. Шесть блоков: `care-context`, `compatibility`, `return-boundary`, `proof-system`, `walker-earnings`, `inspectable-care`. Подбор начинается с полного профиля/потребностей и сохраняет CTA; список доступен в carousel. Возвращение различает expected14:50, исходный local poster и ручную демоотправку, подтверждённые14:52/два фото. Отдельный статичный report остаётся полным. Один earnings screen объясняет вторую роль и fixture arithmetic. Outcome показывает реализованную цепочку, компромисс и следующий вопрос проверки с людьми.

Средний ShotItem использует **film:true**, оригинальные `/media/rebuild/pawly/{en,ru}/clip-return-proof-poster.webp` и video prefix. Штатный CaseSteps → CaseScreen → MediaFrame отдаёт native controls, MP4 первым, WebM вторым, без autoplay/loop. Исходная запись 10.966667s не ускорялась. После ручного play общий слой с JS ставит паузу при уходе, сохраняет время и требует явного повторного play. Live preferences тоже ставят паузу; before-swap очищает ресурсы. Без JS доступны настоящий native input/playback и полные статичные states, lifecycle enhancement требует JS.

Свой renderer/video handler/GSAP/tokens не добавлен. Все шесть imported shared файлов сверены с canonical Git blobs принятого 433c80b; любые другие shared changes по-прежнему запрещены guard. Зеркала tokens/motion совпадают. Harmony narrative budget: **329 EN / 279 RU**; specimen values и Next исключены по контракту. Companion больше не увеличивает объём.

## Источники и границы

Read-only `D:/Claude-projects/PETS-walking`, HEAD `06322ba1a64306687f4ca7d2289fd6e32d463b0b`; accepted runtime7d975f0, landing removalc946c73, catalogue04 / acceptance05 от13.09.2026 и media06. Использован принятый `.tmp/pawly-walker-storybook`, не старый root catalogue. Август в UI — дата выдуманной прогулки в September build.

`evidence.md` содержит 7 утверждений/источников/границ. 17 EN/RU демомаршрутов — прежняя составная September synthetic QA, не новый прогон продукта. Figma reverse-sync/test adapter, человеческая/физическая валидация не заявлены. Source fingerprints21 совпадают с submitted d3bbbb и текущими read-only файлами; продукт сохранил прежние шесть несвязанных dirty cover PNG.

`media.md` / `captures.json`: 40 public media, без новых source captures на этом completion. 18 September EN/RU кадров/фильмов побайтово reused; 22 component captures — 11 states в343/288 CSS px, DPR2, transparent bleed2px. Whole phone390×844 DPR1.5, nativeWidth390. Сохраняются настоящие Inter, цвета, поля, фотографии, действия и состояния. Component matrices — документальный исходный EN catalogue с локализованными пояснениями; screen/film настоящие EN/RU. Shared Inter/OFL и зависимости прежние.

950−171=779 ₽ и3116+779=3895 — fixture arithmetic. Фото/имена/адреса выдуманные; send симулируется fixture GET, не upload; карта явно sample, не live GPS. Платежи, conversion/retention, safety certification или измеренный рост доверия не представлены как результат.

## Свежие доказательства

| Проверка | Новое выполнение на actual Pawly |
|---|---|
| Astro check / build / CSS | 107 файлов, 0 errors; 30 страниц; 30 routes, 0 dead rules. `check-inline.log`, `build-inline.log`, `css-inline.log`. Error threshold не ослаблен, existing severity convention сохранена |
| Harmony | 2 локали ×1440/1024/390/360, height900 и600: 16 samples, 0 нарушений. `harmony-inline.log`, `harmony-inline-short.log` |
| Страница full/reduce/no-JS | 2 локали ×5 окон ×3 режима =30 профилей; 11 states/6 blocks/3 steps, один film в шаге2 до Next, 0 companion/stale anchors/overflow/pin spacers/broken visible images/page errors |
| Full lifecycle | 10 full профилей: fast/reverse scroll, mobile↔desktop resize, live preferences, повторная структурная/media проверка; 0 failures |
| Native locale/Next/Back | 4 mobile EN/RU JS/no-JS профиля. Locale, Back, Agent Ops Next и Back рабочие; итог **34 profiles / 0 failures** в `verification-inline.json`, `browser-inline.log` |
| Native playback | EN/RU ×full1440×1100 / reduce390×844 / no-JS360×844 =6 профилей. Trusted Space на focused native video; play, decoded frames, pause, resume, end10.966667s; controls без autoplay/loop, MP4 current source. Не scripted play/pause/seek |
| Film lifecycle | 2 EN/RU390×844 reduce профиля: offscreen paused; return сохраняет время и остаётся paused; ручной resume; live full↔reduce pause; native Next old node paused/disconnected/unbound; Back ровно один paused film |
| Visibility handler | В тех же lifecycle профилях явно **synthetic document.hidden** pause/return probe. Физически скрытая вкладка не подтверждена |
| Film итог | `film-inline-verification.json`, `film-inline.log`: **8 observations / 0 failures**, две свежие записи `recording/inline/{en,ru}-native-return-proof.webm` и end PNG |
| Integrity | 6 точных shared canonical hashes, неизменные21 source fingerprints и40 media/18 reuse, budget≤2MB для каждого public file, mirrors, own scope. `integrity.json` |

Пять окон страницы:1440×900,1024×900,390×844,360×800,1440×600. Native input в no-JS проверяется read-only Node polling: rAF waitForFunction там не используется для ожидания playback. Ошибки прежнего metadata-only ожидания не переносятся в новый вывод.

Проверки используют локальный Chromium1243/Playwright, зависимость из продукта только read-only. Физические устройства, другие engines, slow network, CPU/performance и новая product acceptance не тестировались. CPU probe одновременно с capture/encoding не было. Package/lockfile/dependencies не менялись; прежний npm ci сообщал11 advisories.

## Артефакты и визуальная проверка

Passport `artifact-plan.md` сохраняет до-capture состав, HA-DS-01, происхождение, размеры, группировку и EN/RU подписи; film placement обновлён после принятого общего delta. Система не переделывалась художественно: foundation35:65, два Inter role/три цвета, PhotoProof4 + TimelineRow4 рядом, InfoNote3 wide; mobile по одному native семейству. Оригинальный HA-DS-01 и сравнение одинаковой ширины просмотрены в первой передаче; pixel data/captures системы неизменны.

| ID | Эталон / сохраняемые детали | Адаптация / актуальные кадры |
|---|---|---|
| PAW-DS-01 | HA-DS-01: общая поверхность, 4 foundation columns, palette, пунктир/естественная высота, вертикальные states | 3 доменные семьи/11 native states. Неизменные `shots/reference-HA-DS-01-Pawly.png`, `shots/ru-1440-900-reduce-proof-system.png`, mobile PhotoProof/InfoNote |
| PAW-RETURN-01 | Native September UI: весь экран/фото/время/действия | Static expected/poster/report и inline film. `shots/inline/{en,ru}-1440-900-reduce-return-boundary.png`, `ru-360-800-reduce-return-boundary.png`, `ru-390-no-js-sequence.png` |
| PAW-FILM-01 | Оригинальный return-proof06, timing/codecs/poster | Штатный средний шаг. `shots/inline/{en,ru}-{full,reduce,no-js}-native-paused.png`, `recording/inline/{en,ru}-end.png`, новые native WebM records |
| Cover / match / money | Подлинный UI продукта, не новая схема | Тёплый cover, профиль перед списком, одно earnings. Whole pages в shots/inline, unchanged native screens; без мерча/финансового движения |

Переснят затронутый объём: full pages EN/RU1440/390/360, return-boundary/средний шаг/Next; 6 native paused frames; 8 no-JS sequence/poster frames. Ещё8 review crops верха/финала из тех же actual full pages, без ретуши. **46 новых PNG** в `shots/inline` и2 новых WebM +2end PNG в `recording/inline`. Крупно просмотрены desktop middle, RU no-JS360 middle, новый верх/финал и end report; full page композиция проверена по whole/crops. Уход companion проверен DOM и финальными кадрами.

Static fallback реально присутствует до play: active-service, local original poster, order-details. Whole phone сохраняет все исходные пиксели; на360 вторичный текст меньше native, ключевые время/фото/действия читаются. Native Chromium controls при паузе накладываются на низ видеокадра; отдельный статичный end-report остаётся полным. Нового pin или декоративного движения денег нет.

## История findings и готовность

`history/d3bbbb-film-verification.json`, старый script/log/report и page verification сохраняют первоначальную передачу. E-G-01 был реальной schema dependency; E-G-03 подтверждал offscreen play. Старые E-G-02 metadata/rAF ожидания не были достаточным доказательством отказа native playback. Свежий trusted play/pause/resume/end и decoded frames подтверждают работу нового adapter в actual case, включая no-JS. Старые результаты не переименованы в PASS.

`common-requests.md`: E-G-01/02/03 закрыты на actual Pawly, новых открытых common requests E нет. История готова для G; никакая public или coordinator acceptance самим E не присвоена.

## Воспроизведение

После checkout result HEAD: npm ci при необходимости, `npm run check -- --minimumFailingSeverity error --minimumSeverity error`, `npm run build`, `npm run check:css`, `npm run preview -- --host 127.0.0.1 --port 4370`. Harmony: `node scripts/harmony-check.mjs --base=http://127.0.0.1:4370 --widths=1440,1024,390,360 /preview/pawly-rebuild/en/ /preview/pawly-rebuild/ru/`, повторить с `--height=600`. Actual tests: `node tasks/portfolio-rebuild/pawly/verify.mjs`, `node tasks/portfolio-rebuild/pawly/film-verify.mjs`, `node tasks/portfolio-rebuild/pawly/static-fallback.mjs`. Все свежие проверки имеют exit0. Scope/source guard: `node tasks/portfolio-rebuild/pawly/integrity.mjs`.

Own-case manifest / полный точный список: `manifest.json`, `files.txt`; точный delta новой case-добавки: `case-addition-files.txt`; shared import authority: `common-import.json`. В интеграции не копировать изменённый общий schema/renderer поверх G: использовать уже принятый 433c80b и только case commits E.
