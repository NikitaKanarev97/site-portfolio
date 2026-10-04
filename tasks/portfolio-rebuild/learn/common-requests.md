# Learn · common requests

На старте блокирующих запросов нет. B-G-01 (Next marquee после многократного breakpoint resize) уже назначен G-integrate-1; C фиксирует собственный реальный охват. Новые примеры добавляются после наблюдения, общий слой остаётся frozen.

## Подтверждение B-G-01 · P2 · G-integrate-1

В production build C, EN и RU: 1440×900 → live reduce → full → widths 390→1440→1024→360→1440 → Next scroll. У `.case-next__track` computed transform `none` до и после 350 ms ожидания; движение не возвращается. Обычный click Next → соответствующий `/work/vet-clinic/`, Back и Forward работают, ошибок страницы нет. Сырой охват: lifecycle rows в `verification.json`; runner `verify.mjs`. Слой общего motion не изменён. Это уже известный B-G-01, не новый кейсовый blocker.

Новых запросов к Common A нет. Проверка tab visibility ограничена headless Chrome: открыта настоящая вторая вкладка, но visibilityState остался `visible`. Hidden-tab suspend/resume не объявлен проверенным. Resize, live preference, fast/reverse scroll, next click и history проверены реально.
