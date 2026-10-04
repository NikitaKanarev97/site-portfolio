# Общие запросы G · 04.10.2026

## F-G-01 · исправлен G-common-F, actual F retest ожидается

Delta `6e8f0e075916dec82a90831c7c2c78a38ea60e20`, ровно animations.js и ds/motion-concept.md. Исходный F 3d35b7 воспроизведён в отдельном G checkout: 5/24 live preference position failures. Trace показал промежуточную pin/list геометрию после двух прежних ранних измерений. Shared ResizeObserver удерживает identity/top до фактического reflow, освобождается при жесте/native navigation/route teardown; epoch отменяет прошлые callbacks. Actual registry capture после native wheel устраняет сохранение предыдущего panel. GSAP timings, DS mirrors и case payload прежние.

Final exact 24 и native wheel 96 switches — 0 failures; F motion/static 12+24 observations, registry 30 snapshots, common controls 8 routes/42 transitions, additive film 14 и Harmony 20 profiles — 0 failures. Transfer на exact F ref clean, payload неизменен; новая common base 630 files воспроизведена. Report/handoff — focus-common-report.md / focus-common-handoff.md. F остаётся непринятым до импорта и retest своего actual checkout; review/STATE/chat dispatch — у контроллера.

## E-G-01/02/03 · закрыты G-common-E в общем слое

Delta `433c80bcba29eda2060067570e9f8ec2087a2a91`: optional ShotItem.film и guard, передача CaseScreen → существующий MediaFrame; film MP4 → WebM для настоящего native playback без JS; pause вне viewport/вкладки с сохранением времени и ручным возвратом, cleanup observers/listeners/stall timers на route leave. Loop semantics/codecs прежние. 14 film/lifecycle/loop/geometry observations и 8 B/C profiles + 26 alpha HTTP captures — 0 failures. Физически скрытая вкладка не подтверждена; visibility branch проверен synthetic probe. Перенос delta на E d3bbbb воспроизведён без конфликтов и изменений case payload. См. film-common-report.md и film-common-handoff.md. E должен подключить film в своём среднем шаге и повторить case verification; готовность общей правки не означает приёмку его истории. D-G-01 zone labels отложен до G-final.

Владелец принял A в текущем чате, затем указал конкретную визуальную ошибку углов specimens на /kit. Доводка вошла в первую базу. Общий слой передан G; текущая приёмка и закрытие запросов B/C записаны ниже.

## G-01 · Настоящие края specimens

Подтверждено двумя крупными кадрами владельца: фон capture остаётся вокруг закруглённого продуктового контура; CaseScreen дополнительно отрезает углы своим radius. В результате край Availability/FileUpload выглядит вырезанным. Нужно сохранить настоящий alpha-контур, включая внешнюю обводку, и убрать маску портфолио у actual specimen. Один native-вариант CaseScreen, автоматическое применение из CaseSpecimen. Проверка: /kit и контрольная Portal EN/RU, 1440/1024/390/360. Продуктовые компоненты не меняются.

## G-02 · Мобильная навигация без JS

Navbar прячет desktop navigation на телефоне, оставляет кнопку без работающего обработчика и hidden-панель. Нужно дать те же native URL в потоке, если скрипт меню не инициализирован; обычная панель остаётся при работающем JS. Проверка: no-JS и заблокированный JS, EN/RU, 360/390, focus/Escape/resize/Back при JS.

## G-03 · OG-локали

BaseLayout выдавал og:locale=en/ru. Общий routes map теперь задаёт en_US/ru_RU и alternate для парных публичных страниц; hreflang остаётся en/ru/x-default. Источник формата: https://ogp.me/, Optional Metadata. Снят собственный canonical у /kit и двух исторических pilot preview; Common уже имел canonical=false. Preview без canonical не получают пару публичных OG locales. На Common review index исправлен отсутствовавший h1. Проверяется во всех публичных EN/RU маршрутах, /kit и preview.

## Монограмма · подтверждённое замечание Роберта

Исходник mentor-robert-garmaza-2026-10-02.md, строки 84–86: K читается как «<»; штрихи должны держать оптическую линию. У текущего v3 K был только шеврон, без собственного штриха, соединённый с N. Добавлен отдельный вертикальный штрих и небольшой просвет N–K; торцы обеих букв совпадают сверху и снизу. Стиль, цвет, высота Navbar и tap target прежние. Favicon повторяет ту же геометрию. Сравнение — shots/logo-comparison.png.

## Закрытие checkpoint G-base

G-01 закрыт в принятом ref A: 26 alpha captures, 24 профиля /kit и Portal EN/RU, 0 failures. На трёх локальных origins 4350/4352/4353 все 78 HTTP-ответов captures совпадают с исправленными файлами (`base-reproduction.json`). G-02 закрыт в рабочей ветке G: 32 профиля двух локалей, четыре ширины, full/reduce/no-JS/blocked-JS; focus/Escape/resize/live preference/Back и короткое окно. G-03 закрыт: 24 страницы, 14 public sitemap routes, 14 OG assets и два PDF, 0 failures; /kit имеет RU locale корректно. Две служебные страницы дают native email/CV, 404 содержит EN/RU выходы; их contact lead больше не ссылается на отсутствующий кейс сверху. После последней правки текста служебные страницы дополнительно проверены в 16 профилях 600 px высоты. Монограмма просмотрена на сравнительном кадре и в текущей desktop/mobile оболочке. Подробности — `shell-verification.json`, `service-verification.json` и `report.md`.

## B-G-01 · закрыт G-integrate-1

B и C подтвердили остановку общего Next после многократного resize. Причина — cached start/end после пересоздания pin geometry; на /kit затронут также legacy pin-swap. Structural pins обновляются с refreshPriority=1. Видимость marquee отслеживает IntersectionObserver реального viewport, resize пересчитывает GSAP tween; синхронный промежуточный размер до reflow не записывается как финальная видимость. Lifecycle очищает observer и listeners. Один общий вариант, без изменения schema, длительности, hover/focus и fallback. Проверены public Portal/Learn EN/RU, Common Agent EN/RU и /kit: семь routes, повторный resize до Next и в его окне, exit/re-entry, live reduce/full, native Next/Back/Forward; 0 failures. Доказательство: wave-1/next-verification.json; логика — ds/motion-concept.md. Публичная матрица B/C: 64 profiles, 0 failures. Исторические отчёты владельцев сохраняют исходный finding; это актуальный статус общего исправления.
