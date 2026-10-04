# E · Pawly · передача · 04.10.2026

Полная индивидуальная история EN/RU собрана и готова к просмотру и передаче интегратору. Её основа — совместимость, ожидаемое возвращение, локальное фото, подтверждение и отчёт; деньги исполнителя завершают историю второй ролью. Это самостоятельный концепт одного продуктового дизайнера. Повышение доверия, человеческая валидация и коммерческий результат не заявлены.

Статичная история и штатные блоки готовы к интеграции. Полная приёмка native film остаётся зависимой от **E-G-01/02/03** в общем слое: inline `film`, codec без JS и пауза вне viewport. Это не PASS всей интеграции и не визуальная приёмка владельцем. Пока фильм — настоящий вручную запускаемый companion после CaseNext, доступный из ранних facts и обратной ссылкой к статичным состояниям.

## Checkout, ref и просмотр

- Checkout: `C:/Users/kanar/.codex/worktrees/pawly-rebuild-e/Site-portfolio`.
- Branch / результирующий ref: `codex/pawly-rebuild-e`, локальный тематический HEAD с данным отчётом. Полный hash передан владельцу в финальном сообщении.
- Точная база после B+C: `58002c398c3386c9df4b398f324ab07115c979f7`. До правок сверены 585 файлов базы, 0 расхождений. Root metadata `28cf1876` не использовался как стартовый ref.
- [EN preview](http://127.0.0.1:4370/preview/pawly-rebuild/en/), [RU preview](http://127.0.0.1:4370/preview/pawly-rebuild/ru/).
- [EN manual film](http://127.0.0.1:4370/preview/pawly-rebuild/en/#return-proof), [RU manual film](http://127.0.0.1:4370/preview/pawly-rebuild/ru/#return-proof).

Оба preview noindex/nofollow, без canonical и подключения к sitemap. Собственный production preview origin 4370 оставлен работающим. Чужие origins не трогались. Публичные кейсы, главная, порядок реестра, PLAN/CONTROL/STATE не менялись. Push/deploy и сообщения другим чатам не выполнялись.

## Рассказ и данные

Экспорт `pawlyStory` и общая фабрика локалей находятся в `src/copy/cases/pawly.ts`; `pawlyStoryRu` и `assertStoryPair` — в `src/copy/ru/cases/pawly.ts`. Legacy exports сохранены. Совпадают порядок, ID, типы блоков, evidence/media IDs и геометрия. Нового renderer, schema, GSAP handler или токенов нет.

Шесть блоков: `care-context` → `compatibility` → `return-boundary` → `proof-system` → `walker-earnings` → `inspectable-care`. Cover показывает настоящий профиль, активную прогулку и отчёт; mobile первые два, отчёт дальше целиком. Carousel начинает с профиля и сохраняет весь выбор исполнителя. Static steps разделяют ожидаемые 14:50, ещё не отправленный полный кадр и полученные 14:52. Отдельный specimen показывает 11 состояний трёх принятых семейств. Один полный earnings screen различает начисление, доступный баланс и историю периода. Outcome содержит реализованный объём, компромисс и вопрос следующей проверки с людьми.

Harmony narrative budget: EN 323, RU 272 слова; документальные значения specimen и Next исключены по общему контракту. Короткий film companion дополнительно объясняет ручной запуск. Тексты не заполнялись ради обязательного числа секций. Case map: `ds/screens/case-pawly.md`; прежняя композиция помечена историей.

## Источники и медиа

Read-only продукт `D:/Claude-projects/PETS-walking`, HEAD `06322ba1a64306687f4ca7d2289fd6e32d463b0b`. Принятый runtime `7d975f0`, затем удаление landing `c946c73`; catalogue 04 / acceptance 05 от 13.09.2026, site media 06. Использовался `.tmp/pawly-walker-storybook`, не старый root storybook-static. Сопоставлены PhotoProof, TimelineRow, InfoNote, owner/walker модель и текущие EN/RU dist screens. Августовская дата в UI относится к выдуманной прогулке в сентябрьском приложении.

- `evidence.md`: 7 утверждений с источниками, версиями и границами доказательства. 17 демомаршрутов — охват прежней составной сентябрьской synthetic QA, не новый полный прогон продукта. Figma reverse-sync и test adapter не объявлены принятыми.
- `media.md` + `captures.json`: 40 публичных файлов. 18 существующих EN/RU кадров/фильмов скопированы побайтово; 22 новых capture — 11 native states в двух ширинах 343/288 CSS px, DPR2, прозрачный bleed 2px. Целые экраны 390×844, DPR1.5. Снимки продукта не ретушировались.
- `sources.json`: 21 точный SHA256 источника; `integrity.json` подтверждает источники, все 40 media, 18 reuse, scope и оба зеркала.
- Сохраняются реальные Inter, роли, цвета, фотографии, поля и действия продукта. Матрицы документируют исходный EN catalogue; окружающие пояснения локализованы, screens и film настоящие EN/RU. Общий Inter/OFL уже входит в базу; зависимости и шрифты не добавлены.

950 − 171 = 779 ₽ и 3116 + 779 = 3895 — fixture arithmetic. Фото, личности и адреса демонстрационные. Send — имитация fixture GET, не настоящий upload; карта — подписанный sample, не live GPS. Платежи и бизнес-метрики не реализованы и не выданы за результат.

## Артефакт → эталон → кадры

`artifact-plan.md` заполнен до capture; там точные states, группировка, размеры, EN/RU подписи и финальные кадры. Оригинал HA-DS-01 открыт до реализации; повторно просмотрены крупные desktop/mobile кадры и сопоставление при одинаковой ширине листа.

| ID | Эталон / сохранённые детали | Адаптация | Кадры в shots/ |
|---|---|---|---|
| PAW-DS-01, три семьи | HA-DS-01: одна спокойная поверхность, четыре колонки foundation, свотчи, пунктир вокруг семейства, естественная высота и вертикальные states | 2 Inter роли, 3 реальных цвета; PhotoProof 4 и TimelineRow 4 рядом, InfoNote 3 wide ниже. Mobile — каждое семейство отдельно, native narrow captures | `reference-HA-DS-01-Pawly.png`, `en-1440-900-reduce-proof-system.png`, `ru-1440-900-reduce-proof-system.png`, `en-390-844-reduce-photo-proof.png`, `ru-360-800-reduce-info-note.png` |
| PAW-RETURN-01 | Текущий продукт: целые поля, фотографии, статусы, действия и время | Три крупных static steps, nativeWidth390; report служит экраном применения PhotoProof/TimelineRow | `en-1440-900-reduce-return-boundary.png`, `ru-360-800-reduce-return-boundary.png`, `en-390-no-js-sequence.png` |
| PAW-FILM-01 | Настоящий return-proof 06, исходные timing/оба codec/poster | Existing MediaFrame film, explicit play; companion до E-G-01 | `recording/en-native-return-proof.webm`, `recording/ru-native-return-proof.webm`, `recording/en-end.png`, `ru-390-no-js-poster.png` |
| PAW-COVER-01 / PAW-MATCH-01 / PAW-MONEY-01 | Нативные UI источника; отдельная схема или IA не нужна | Песочный cover, профиль прежде списка, один целый earnings; без мерча и финансового движения | `ru-360-800-reduce-cover.png`, `en-390-844-reduce-compatibility.png`, `ru-390-844-reduce-walker-earnings.png` |

Для whole-page, верха, середины и финала сохранены EN/RU reduce кадры в 1440/390/360, все шесть блоков и каждое семейство отдельно. Дополнительно 12 no-JS кадров sequence/system/poster на 1440/390. Записи браузера показывают реальный ручной запуск и завершение; сам исходный ролик длится 10.966667 s, без ретайминга.

## Проверки и их границы

| Проверка | Реальный охват / результат |
|---|---|
| Astro check | 107 файлов, 0 errors. `--minimumFailingSeverity error --minimumSeverity error` — существующая конвенция, порог ошибок не ослаблен |
| Build | 30 статических страниц, успех; `build.log` |
| Scoped CSS | 30 маршрутов, 0 dead rules, оба новых preview включены автоматически; `css.log` |
| Harmony | EN/RU × 1440/1024/390/360, height900 и height600: 16 samples, 0 нарушений; `harmony.log`, `harmony-short.log` |
| Production browser matrix | 2 локали × 5 окон (1440×900,1024×900,390×844,360×800,1440×600) × full/reduce/no-JS = 30 профилей; 0 failures/page errors/overflow/pin spacers/broken visible images; 11 states, 6 blocks, noindex в каждом |
| Full lifecycle | 10 full профилей: fast/reverse scroll, resize mobile↔desktop, live reduce↔full. Повторная structural/media проверка без failures |
| Native navigation | 4 mobile EN/RU JS/no-JS профиля: locale, Back, Next и Back; штатные Agent Ops destinations, без wheel navigation. Итог 34 записей / 0 failures в `verification.json`, `navigation.log` |
| Native film full/reduce | 4 профиля EN/RU: controls, первоначальная пауза, no loop/autoplay, декодированный MP4, ручная пауза; full доходит до ended. Две записи браузера сохранены |
| Film no-JS | 2 профиля: poster + complete static fallback есть; WebM metadata/decode на Chromium1243 отсутствует. **E-G-02, не PASS playback** |
| Film departure / Back | 390×844 reduce: route-departure paused=true/connected=false; Back один film paused=true. Уход/возврат в viewport paused=false — **E-G-03** |
| Integrity / mirrors | 21 источниковый hash, 40 media, 18 reuse, ≤2MB каждый media; tokens и motion побайтово равны. Изменения только own scope; `integrity.json` |

Сводка film: `film-verification.json`, 6 playback/poster profiles + 4 lifecycle observations, 4 failure records по двум общим причинам. `film-lifecycle.log` содержит полный итог и ожидаемо возвращает exit1. Ни один failure не скрыт и не превращён в общий PASS. First-attempt logs сохранены как `initial-*-harness.log`: устаревший DOM после Astro Back, неправильная точка native control, load interrupt. Harness исправлен ожиданием `astro:page-load`, корректным native control и ожиданием metadata; последние результаты выше.

Все браузерные проверки — локальный Chromium1243/Playwright из соседнего продукта только для чтения; CLI agent-browser отсутствует, проверки production preview выполнены Playwright. Физические устройства, другие браузеры, медленная сеть, performance/CPU и новая приёмка продукта не проверялись. Отдельного CPU probe во время capture/encoding не было. `npm ci` не изменил lockfile/deps; сообщил 11 существующих advisories.

## Общие запросы и художественные ограничения

Подробные воспроизводимые примеры и ожидаемое поведение — `common-requests.md`:

1. **E-G-01:** optional `film?: boolean` в ShotItem → CaseScreen → существующий MediaFrame. Сейчас статичная local review в ordered story, manual film — отдельный companion. После исправления G подключить film в штатное место и убрать companion.
2. **E-G-02:** безопасный native codec selection без JS. Static fallback уже читается; playback в проверенном no-JS Chromium не работает.
3. **E-G-03:** вручную запущенный film должен освобождать ресурсы вне viewport и оставаться ручным при возврате. Route departure/Back уже прошли.

Whole-phone screenshots намеренно сохраняют все поля и кнопки. На 360 мелкий вторичный продуктовый текст меньше исходного; ключевые заголовки, время, фото и основные действия видны, component matrices используют отдельный native narrow capture. Companion после Next менее связен, чем film внутри return-boundary; эта граница архитектуры явно передана G. Никакой сценарий pin не добавлен: полная цепочка остаётся обычным вертикальным чтением и без JS.

## Точный пакет и воспроизведение

Все изменённые/добавленные пути перечислены в `files.txt`, SHA256 payload — в `manifest.json`. Основные три tracked файла: `src/copy/cases/pawly.ts`, `src/copy/ru/cases/pawly.ts`, `ds/screens/case-pawly.md`; новые только `src/pages/preview/pawly-rebuild/[locale].astro`, `public/media/rebuild/pawly/**`, `tasks/portfolio-rebuild/pawly/**`. Общие DS/schema/renderer/motion/проверки/package/registries/public routes имеют исходную версию базы. Продукт сохранил прежние шесть несвязанных dirty cover PNG; их не меняли.

После checkout точного result ref: `npm ci`, `npm run check -- --minimumFailingSeverity error --minimumSeverity error`, `npm run build`, `npm run check:css`, `npm run preview -- --host 127.0.0.1 --port 4370`. Harmony: `node scripts/harmony-check.mjs --base=http://127.0.0.1:4370 --widths=1440,1024,390,360 /preview/pawly-rebuild/en/ /preview/pawly-rebuild/ru/`; повторить с `--height=600`. Browser: `node tasks/portfolio-rebuild/pawly/verify.mjs`; film: `node tasks/portfolio-rebuild/pawly/film-verify.mjs` (до закрытия E-G-02/03 ожидается exit1). Integrity: `node tasks/portfolio-rebuild/pawly/integrity.mjs`.

Source capture воспроизводится через собственный `serve-source.mjs` (read-only catalogue4371 / dist4372), затем `capture.mjs`. Он не собирает и не меняет продукт. `inventory.mjs` документирует fingerprints/media, `static-fallback.mjs` снимает no-JS кадры. Для переноса достаточно тематического case commit; G закрывает common requests, подключает pair к публичным маршрутам и повторяет приёмку полной интеграции. Настоящий отчёт не изменяет статус координатора.
