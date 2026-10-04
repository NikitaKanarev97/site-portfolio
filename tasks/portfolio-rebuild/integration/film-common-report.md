# G-common-E · общий manual film · 04.10.2026

Общие запросы E-G-01/02/03 закрыты переносимой правкой `433c80bcba29eda2060067570e9f8ec2087a2a91`. Исходная база: `58002c398c3386c9df4b398f324ab07115c979f7`, metadata checkpoint `28cf1876ec633797193b4f0ada3de5d817ff89f9`. Проверяемый вход E: `d3bbbbd78fb3a75c87d3f6117f91d1606e462932`. Этот этап меняет общий адаптер; приёмка и перенос истории Pawly остаются следующим шагом контроллера.

## Поведение

- `ShotItem.film?: boolean` передаётся существующим CaseScreen в MediaFrame. Guard в defineStory и CaseScreen запрещает film без video и неверный тип; EN/RU pair проверяет одинаковый режим. Все старые shot остаются прежними.
- Ручной film имеет native controls, poster, без autoplay и loop. Только film отдаёт MP4 первым и WebM вторым. Автоматическая петля сохраняет WebM → MP4. Кодеки и исходные записи сохранены.
- С JS уход из viewport, скрытие документа и live motion preference ставят film на паузу. Время сохраняется; возврат требует явного play. `astro:before-swap` очищает observers, listeners и stall timer, ставит старый video на паузу; Back получает один новый paused film. Без JS доступны native controls и полные статичные состояния, lifecycle enhancement требует JS.

## Проверки исходного результата

`film-common/verification.json`: 14 observations, 0 failures. Шесть EN/RU профилей full 1440, reduce 390, no-JS 360 проверяют настоящий native play, декодированные кадры, pause/resume и конец исходной записи 10.966667 s. Ввод — focus video + доверенная клавиша Space в нативные controls Chromium; scripted play/pause/seek не используется. В no-JS состояние опрашивается из Node: браузерный rAF polling там не обновляет ожидание.

Два lifecycle профиля проверяют offscreen pause, ручной возврат с сохранением времени, смену motion preference, уход native Next и Back. Два профиля существующего public Vet проверяют обычную петлю, codec order, ручную паузу и автоматический rewind при re-entry. Четыре геометрических профиля проверяют 1024 и короткое окно 1440×600: три статичных шага, без внешнего overflow. `shots/*-inline.png` — шесть кадров среднего шага; desktop EN и mobile no-JS RU просмотрены вручную.

`bc-verification.json`: 8 public B/C профилей и 26 alpha capture HTTP responses, 0 failures; native locale, Next/Back. Зеркала tokens/motion побайтово равны. Guards: два допустимых режима и три отклонённых invalid media/pair. Source build — 30 страниц; check — 108 файлов, 0 errors/0 warnings, 101 hints; CSS — 30 routes, 0 dead rules. Harmony — 24 samples, 0 итоговых ошибок: исходные 20 прошли, четыре RU fixture samples повторно прошли после сокращения двух заголовков. `harmony.log` сохраняет первоначальные четыре finding, `harmony-ru.log` — их закрытие.

G fixture `/preview/film-common/{en,ru}/#return-boundary` содержит реальный CaseSteps → CaseScreen → MediaFrame в среднем шаге и static before/after. Десять fixture media перенесены побайтово из submitted E ref, provenance/hashes в `media.json`; payload E и соседний продукт не редактировались. Это технический noindex preview без canonical, с native locale и Next, не публичная интеграция E. Film не вынесен после Next.

Перенос delta проверен в отдельном чистом checkout от E d3bbbb: cherry-pick без конфликтов, ровно шесть общих файлов совпадают с G, caseFilesChanged=0, status clean (`e-transfer.json`). Actual checkout E не изменён.

## Границы результата

Локальный Chromium 1243; физические устройства и другие движки не проверялись. Скрытие документа проверено явно помеченным synthetic visibility handler probe; физически скрытая вкладка не подтверждена. E исходно фиксировал четыре ошибки film; его исторический отчёт не переписан. No-JS доказательство здесь — actual native MP4 playback, а не ожидание metadata или переоценка старого WebM результата.

Новых dependency, токенов, GSAP timings или отдельной motion-системы нет. Производительные замеры параллельно со съёмкой не выполнялись. B/C stories, D/E/F public legacy entries, public slugs и порядок сохранены. D-G-01 о zone labels остаётся для G-final. Контроллер владеет CONTROL/STATE, очередью E/F и окончательной приёмкой.

Обновлённый ref для F: `a6faac3a3d10eb6601fcc34caa70a915bea5dab3`, alias `codex/portfolio-common-film-2026-10-04`. Clean checkout `D:/Claude-projects/Site-portfolio/tmp/portfolio-common-film` на origin 4381 воспроизвёл 630 файлов / 78,007,784 bytes, 30 страниц, check 108 с 0 errors/0 warnings и CSS 30 routes с 0 dead rules; status clean. Clone дополнительно подтвердил два native no-JS EN/RU play/decode/pause профиля, два /kit full/no-JS профиля и 10 fixture HTTP hashes, 0 failures. Каталог содержит 10 MediaFrame, один specimen и 33 CaseScreen; MediaFrame clip там отсутствует, отдельный CaseOpening video не затронут. Offscreen lazy images не объявляются ошибкой до загрузки. Полная матрица 14 относится к source; clone launch и manifest приведены отдельно. Handoff и reproduction сохраняются последующим metadata commit; frozen snapshot не хеширует будущие результаты воспроизведения.
