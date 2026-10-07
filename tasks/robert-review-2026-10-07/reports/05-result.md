# 05 — Learn и Vet

07.10.2026. Локальный пакет готов к интеграции. Изменены только src/components/LearnStage.astro, src/components/VetStage.astro; добавлен src/copy/learn-vet-stage.ts. Общие оболочки, токены, WorkStage и медиа не правились.

## Изменения

- Learn, S11–S16/S30–S33: удалены внешние ↔/↙, номер и мелкие подписи, убран разделитель. Desktop: материал и current unit по одной левой оси, паспорт справа; прежний пустой угол заполнен. Заголовок получил отдельный интервал и оси колонок. Mobile сохраняет current unit → материал → паспорт. Нативный номер ресурса 03 внутри UI сохранён.
- Vet, S11–S16/S30–S33: удалены внешние demo visit, role/device, 01–03 и saved/published строки. Три native кадра имеют общую верхнюю линию на desktop и читаются последовательно на mobile. Существующие вертикальные captures врача и регистратуры дают достаточный масштаб; данные и статусы внутри снимков сохранены. Сцена отделена от страницы цветом surface-cover-vet и полями stage-inset.
- EN/RU: локальная подпись объясняет передачу назначения, счёта и опубликованной выписки; 30 секунд обозначены как исходное ограничение дизайна. На cover используется существующая подпись CaseCover, без дублирования. Новые подписи/alt не содержат запрещённых статусных меток по CONTENT-RULES.md; запуск и результаты не придуманы.

## Проверка

Маршруты /, /ru/, /work/learn, /ru/work/learn, /work/vet-clinic, /ru/work/vet-clinic проверены через CUA на 1440 и 360 px. Все 12 комбинаций без горизонтального overflow. Все три кадра каждой сцены загружаются; native UI не обрезан. Desktop Vet: одинаковая верхняя координата трёх кадров. Масса Home-сцен сопоставима: Learn 834/925 px EN/RU, Vet 851 px; mobile получает самостоятельную последовательную композицию.

| Проверка | Результат / доказательство |
|---|---|
| npm run check, 15:29 MSK | PASS: 0 errors, 0 warnings, 265 hints. Полные логи в 05-check-logs.zip; сводка в [05-check-summary.log](05-check-summary.log). Ранее найденные соседние ошибки исправлены. |
| Изолированный npm run build, 15:21 MSK | PASS, 36 страниц; [05-build.log](05-build.log). Служебные root/cache/outDir изолированы через [05-astro.config.mjs](05-astro.config.mjs), чтобы не конкурировать с другими чатами. |
| check-scoped-css.cjs | PASS: 0 мёртвых правил, включая Learn/Vet EN/RU; [05-css.log](05-css.log). Тот же скрипт npm run check:css запущен из родителя изолированного dist. |
| Keyboard/zoom | 24/24: Enter открывает правильный currentSrc, фокус переходит в диалог; Escape закрывает и возвращает видимый фокус источнику. [05-zoom-focus.json](05-zoom-focus.json). |
| Fallback без скриптов | 12/12: видимые кадры opacity 1, нет overflow, ссылки доступны. Использован точный build HTML с удалёнными script, без изменения остальных узлов; [05-no-js.json](05-no-js.json), [генератор](05-make-fallback.mjs). Два открытия source-ссылок клавиатурой подтверждены в [05-fallback-links.json](05-fallback-links.json). |
| Reduced motion | Проверены существующие CSS no-preference/.js и GSAP preference-gates; нового motion нет. Живая эмуляция reduce недоступна в CUA, остаётся координатору. |
| Diff | git diff --check для собственных компонентов — PASS. |

Геометрия: [05-browser-matrix.json](05-browser-matrix.json). Финальные восемь Home-снимков и подтверждение загрузки: [05-final-captures.json](05-final-captures.json). Примеры: [Learn desktop EN](05-shots/learn-home-en-1440.jpg), [Vet desktop EN](05-shots/vet-clinic-home-en-1440.jpg), [Learn mobile RU](05-shots/learn-home-ru-360.jpg), [Vet mobile RU](05-shots/vet-clinic-home-ru-360.jpg).

Снимки и build относятся к состоянию до последней соседней редакционной правки cover eyebrow; публичный текст финально проверяет пакет 07. Локальный код сцен после проверенной сборки не изменялся. Временный сервер остановлен; конфигурация, генератор, полные логи и доказательства сохранены. Автоматическая проверка отклонила удаление временных 05-build/05-cache с причиной «blocked by policy»; эти каталоги оставлены.

## Передача

Конкретные запросы — [05-requests.md](05-requests.md): синхронизация документации ДС владельцем 01, необязательная очистка неиспользуемой Learn-строки владельцем 04, живая reduce-проверка координатором. Коммит, push и deploy не выполнялись.
