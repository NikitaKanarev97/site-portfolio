# 07 — авторские проекты без статусных пометок

07.10.2026. Пакет завершён после передачи 01–06. В проверенной итоговой локальной production-сборке запрещённых публичных статусных пометок не найдено. Commit/push/deploy не выполнялись; состояние kanarev.com не выдается за обновлённое.

## Изменения

- `src/copy/featured-work.ts`: EN/RU превью Vet/Pawly описывают выполненный продуктовый дизайн и сценарии.
- `src/copy/cases/vet-clinic.ts`, `src/copy/ru/cases/vet-clinic.ts`: удалён статусный eyebrow, переработаны evidence/outcome и старое пояснение объёма работы. Обязательное поле eyebrow получает пустую строку; видимой плашки нет.
- `src/copy/cases/pawly.ts`, `src/copy/ru/cases/pawly.ts`: удалён факт Status; evidence описывает синтетическую проверку 17 EN/RU маршрутов. Переписаны старые meta/header/context/decision/result без статусных заменителей. Методологические факты сохранены.
- `src/copy/cases/learn.ts`: удалена отдельная строка Portfolio prototype в facts; старые caption/note/result рассказывают работу и технические проверки.
- `src/copy/cases/film-common-fixture.ts`: исправлен текст доступного preview.
- `src/copy/home.ts`: после передачи владельца 02 исправлены устаревшие внутренние описания классификации; композиция и публичные строки владельца сохранены.
- `cv/resume-data.json`, `cv/resume-data-ru.json`, `cv/fact-sheet.md`: новые формулировки авторских работ и актуальное правило без выдуманных результатов. EN/RU HTML, master Markdown, resume TXT и три PDF пересобраны штатными CV builders. `cv/build.mjs`: сохранён одностраничный A4 с полностью видимым футером EN.
- `public/prototypes/learn/**`: исправлены title в 128 HTML и словарь/его обращения в одном JS bundle. `public/prototypes/learn-landing/**`: удалена оправдательная строка футера в 18 HTML. `scripts/lib/learn-public-copy.mjs`, `scripts/sync-learn-prototypes.mjs`: те же точные редакционные изменения применяются при новом экспорте, без правки соседнего checkout.
- `scripts/build-linkedin-assets.mjs`: удалён статус из Pawly; добавлен адресный `--case`. Его два Featured PNG и контактный лист пересобраны из прежних источников UI.
- `public/media/linkedin/og/work-vet-clinic.png`: старый публичный PNG заменён результатом принятого Onest renderer пакета 01. Правая документальная половина совпадает по декодированному RGBA pixel buffer; статус слева убран без замены. Проверка и hash — `07-og-promotion.json`; старый публичный URL больше не содержит метку. `src/copy/og.ts` и OG renderer изменил владелец 01, пакет 07 сохранил его результат.
- `public/media/case-learn-ru/trajectory.webp`: реальный снимок обновлённого прототипа, без перерисовки UI. URL, viewport и текст записаны в `07-reshoot.json`.
- `scripts/check-public-content.mjs`: повторяемая проверка copy literals, двух CV JSON, публичных HTML/SVG/JSON/JS, LinkedIn builder и всех собранных HTML, включая meta/alt/aria/hidden/JSON-LD. Комментарии, внутренние IDs и технические пути не принимаются за публичную плашку; вывод пути и найденного текста при нарушении.
- `package.json`: добавлена команда `check:content` после передачи владельца 01. Точные пути 179 отредактированных/пересобранных файлов и их SHA-256 — `07-files.json`; служебные отчёты/кэш в этот список не включены.

## Уже проверено

- `node scripts/check-public-content.mjs --source-only`: PASS, 35 copy/builder файлов, 2 CV JSON, 156 публичных текстовых файлов. Это явно частичный режим без build.
- `node tasks/robert-review-2026-10-07/reports/07-check-fixtures.mjs`: PASS. Запрещённая metadata с HTML entity, RU alt и скрытый текст дают FAIL с file/text. Внутренний комментарий и методологическое объяснение проходят.
- OCR Windows (`07-ocr.ps1`): прочитано 500 растров, 0 ошибок чтения. Инвентарь `07-public-ocr.json` обнаружил старую Vet OG и старый Learn trajectory; второй уже переснят. Весь OCR повторно не запускается, финальная сверка относится к изменённым файлам и новым OG.
- Текст извлечён из EN/RU CV и EN ATS: все по одной странице, запрещённых меток 0. Все три страницы визуально просмотрены после редакции, EN футер проверен после правки размещения. Снимки `07-cv-1.png`, `07-cv-ru-1.png`, `07-Nikita_Kanarev_Product_Designer_ATS-1.png`.
- CUA: реально просмотрены исправленные RU Learn trajectory и EN landing; новые title/футер и сохранённые методологические notices видны в DOM/AX.

## Актуальная инструкция и ограничения

CONTENT-RULES.md имеет приоритет над старым «сохранить Concept» в документах исследования, исторических картах и промежуточных отчётах. В частности, статус в `ds/screens/case-vet.md`, прежняя запись Home и 05-requests не являются действующим разрешением вывести плашку. Архивы не удалялись и в публикацию не превращались.

Приёмка относится к существующему checkout и поставляемой им production-сборке. Обновление kanarev.com и внешних демо Veterinary/Pawly не поручено. OCR — автоматическое распознавание растров, не доказательство каждого пикселя; релевантные изменённые материалы дополнительно просматриваются визуально. PDF/Raster не входят в текстовый Node-check и проверяются отдельными перечисленными процедурами.

## Итог после 01–06 — 07.10.2026

Сначала получены итоговые отчёты 01–06 и подтверждение завершения их рабочих правок через компактные wait_threads. Повторного художественного аудита не было. Сборка изолирована от shared cache/dist; после обновления старого Vet PNG сборка обновлена, чтобы публичная копия этого материала тоже вошла в результат.

| Команда / область | Итог |
|---|---|
| `npm run check -- --config tasks/robert-review-2026-10-07/reports/07-astro.config.mjs` | PASS: 137 файлов, 0 errors, 0 warnings, 421 hints; полный `07-check.log` |
| `npm run build -- --config tasks/robert-review-2026-10-07/reports/07-astro.config.mjs` | PASS: 36 page(s), итоговый `07-build.log`; с копиями public всего 182 HTML |
| `npm run check:content -- --dist tasks/robert-review-2026-10-07/reports/07-build/dist` | PASS: 35 copy/builder, 2 CV JSON, 156 публичных текстовых файлов, 182 built HTML; 0 findings, `07-content-check.log` |
| Штатный `check-scoped-css.cjs`, запущенный с cwd `.../reports/07-build` | PASS: мёртвых правил 0; `07-css.log`. Это тот же checker команды check:css по собственной сборке, без проверки чужого dist |
| Guard fixtures | PASS; `07-guard-tests.json`. Точное техническое имя ds/motion-concept.md разрешено правилом, включая документацию /kit; вся страница не исключается |
| 28 финальных OG PNG, включая совместимые URL | OCR: 0 ошибок чтения, 0 запрещённых меток; `07-og-ocr.json`. Все 14 активных EN/RU карточек визуально просмотрены в `07-og-sheet.png`; список — `07-og-sheet.json`. Старый Vet PNG побайтово совпадает с итоговой карточкой |
| Переснятый Learn trajectory | OCR: 1 файл, 0 ошибок, 0 меток; `07-learn-ocr.json`. Визуальный просмотр подтверждает удалённую строку и сохранённый UI |
| CV | EN/RU public PDF и EN ATS: по одному A4, текст/вид проверены, 0 запрещённых меток. `npm run cv:build`, `npm run cv:build:ru` выполнены; футер EN целиком виден |

Реальные страницы итоговой сборки просмотрены через CUA на `http://127.0.0.1:4407`. Проверены тексты, title/description, OG URL/alt, доступные подписи. Во всех перечисленных просмотрах найдено 0 запрещённых меток.

**Основные 14 EN/RU маршрутов, 1440 и 360 px:** `/`, `/about/`, `/work/agent-ops-console/`, `/work/partner-portal/`, `/work/learn/`, `/work/vet-clinic/`, `/work/pawly/`; `/ru/`, `/ru/about/`, `/ru/work/agent-ops-console/`, `/ru/work/partner-portal/`, `/ru/work/learn/`, `/ru/work/vet-clinic/`, `/ru/work/pawly/`. В фактах Pawly видны роль/версия/метод QA без Status; Vet показывает роль/основание/результат/данные без статусного eyebrow. Learn показывает роль/исходную работу/объём/ссылки без Portfolio prototype.

**Служебные поверхности, 1440 px:** `/404.html`, `/500.html`, `/kit/`.

**Все 19 доступных preview HTML, 1440 px:** `/preview/agent-ops-pilot/`, `/preview/partner-portal-pilot/`, `/preview/common/`; `/preview/common/{en,ru}/{agent-ops,partner-portal}/`; `/preview/{agent-ops,partner-portal,learn,vet-clinic,pawly}-rebuild/{en,ru}/`; `/preview/film-common/{en,ru}/`. Проверяется и текущий preview, а не исключается целиком как «архив».

**Локальные демо, итоговая сборка:** `/prototypes/learn/home/?lang={en,ru}`, `/prototypes/learn/trajectory/proekt/?lang={en,ru}`, `/prototypes/learn/certificate/?lang={en,ru}`, `/prototypes/learn-landing/?lang={en,ru}`. Во всех восьми просмотрах title/текст чисты; язык переключается правильно. Certificate проверен в реально доступном состоянии Document not found / Документ не найден. Состояние выданного документа и скачивание не объявляются пройденными: их исходные строки/HTML-шаблон проверены в публичном JS, без создания новой учебной попытки. Все 128 продуктовых и 18 landing HTML автоматически проверены; каждый сценарий этих демо вручную заново не проходился.

Остающиеся визуальные замечания других пакетов (переносы заголовков, 2 px Vet, общий Agent gate, reduced-motion) принадлежат общей интеграции координатора и не являются незакрытой редакционной зависимостью пакета 07. Чужие файлы/правки не откатывались. Исходные внутренние keys вроде `paw-concept` и техническая документация не превращены в публичные метки.

Обычный повторяемый путь после будущих правок: `npm run build` → `npm run check:content`. Для 07 использован явный путь изолированной сборки выше. Проверка не претендует на автоматический OCR/PDF и не исключает целые публичные страницы, чтобы скрыть нарушение.
