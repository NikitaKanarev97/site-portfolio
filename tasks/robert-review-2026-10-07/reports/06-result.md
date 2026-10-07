# Роберт 06 — контакты, ссылки и футер

07.10.2026. Пакет выполнен до проверяемого локального результата. Предыдущие изменения Onest, hero и Navbar сохранены; общий commit, push и deploy не выполнялись.

## Что изменено

- **S22:** ContactBlock получил доминантный h2 `ds-display-7xl`: 128 px на desktop, 64 px на tablet, 48 px на mobile. Заголовок над двумя колонками пояснения/контактов, последовательный поток на телефоне. Отличается по весу и композиции от How I work. Существующие Onest, брейкпоинты и flow-токены; новых токенов нет.
- **S23:** адрес — обычная крупная выделяемая mailto-ссылка без copy-подсказки. Перенос перед `@` не меняет сам адрес. Удалена повторяющая Email/Написать ссылка; рядом остались CV и LinkedIn. Hero `CopyEmail appearance=action` сохраняет API, подтверждение, возврат через 2 секунды и `aria-live=polite`; при отказе Clipboard API адрес доступен для выделения, сообщение видно и озвучивается. RU подсказка показывает реальный адрес вместо инструкции «в один клик».
- **S24/S29:** общий `IconArrow.astro`: right/down/up-right, base/small, SVG/currentColor, скрыт от accessibility tree. TextLink сохраняет inline/arrow/nav; arrow/nav без постоянного подчёркивания, линия по hover/focus/active только под label. Стрелка не подчёркивается; внешний action использует единственный up-right. Inline-ссылки в прозе постоянно подчёркнуты. Inverse hover/pressed/focus сохраняют контраст.
- **S25/S26:** Footer — одна пропорциональная строка Onest, «Copyright 2026» / «Авторские права 2026». Видимые география и часы сняты, таймер удалён. Optional legacy props принимаются для /kit. Исторический символ в его fixture нормализуется компонентом. Существующий EN факт location оставлен в copy только для текущего OG; PageShell его не выводит.

## Файлы

Только закреплённые продуктовые файлы:

- `src/layouts/PageShell.astro`
- `src/components/CopyEmail.astro`
- `src/components/TextLink.astro`
- `src/components/Footer.astro`
- `src/components/IconArrow.astro` — новый
- `src/copy/site.ts`
- `src/copy/ru/site.ts`

Общая ДС и соседние компоненты не редактировались. Спецификация для владельца каталога — [06-requests.md](06-requests.md).

## Проверки

| Проверка | Результат и область |
|---|---|
| `npm run check` после реализации | PASS: 0 errors, 0 warnings. Последний повтор на текущем общем checkout: 1 ошибка вне файлов 06 — Vet `CoverMedia` без `eyebrow`, см. зависимости ниже и [06-check.log](06-check.log). |
| Изолированная `npm run build -- --outDir …` | PASS: 36 страниц, [06-build.log](06-build.log). Снимок после собственных правок, до поздней ошибки соседнего Vet. |
| Проверка из `npm run check:css` | Тот же `scripts/check-scoped-css.cjs` выполнен с cwd изолированной сборки: PASS, 0 мёртвых правил на всех проверяемых маршрутах, [06-css.log](06-css.log). Общий dist не перезаписывался. |
| Browser, EN/RU, 1440/360 | PASS: 34 наблюдения. Home, About, пять полных кейсов в обеих локалях, /404, /500 и Footer fixture /kit. В каждом ContactBlock 0 overflow, mailto с настоящим адресом, CV нужной локали, LinkedIn с noopener/noreferrer и доступным пояснением, SVG-маркеры. [verification.json](06-evidence/verification.json), [06-browser.log](06-browser.log). |
| Клавиатура/copy | PASS: Enter/Space, фактическая запись/чтение clipboard, подтверждение и reset, отказ записи с видимым fallback и aria-live, selectable email. EN/RU на 1440 и отдельный прогон 360; порядок contact mailto → CV → LinkedIn. [mobile-controls.json](06-evidence/mobile-controls.json), [06-mobile-controls.log](06-mobile-controls.log). |
| CV / без JavaScript | Оба локальных PDF отдаются 200/application/pdf. Mailto на RU доступен без JS. Почтовый клиент не запускался, email не отправлялся, внешние люди не получали сообщений. |
| Link states и motion | PASS: active nav, постоянное подчёркивание inline, inverse default/hover/keyboard-focus/pressed, обычное fade и reduced-motion. Контраст на surface-inverse: 8,47:1 для default/hover/focus, 19,45:1 для pressed; focus ring currentColor. [states.json](06-evidence/states.json), [06-states.log](06-states.log). |
| `git diff --check` | PASS по закреплённым файлам. |

Визуально просмотрены финалы Home EN/RU при 1440 и 360. Снимки также сохранены для About, тёмного полного Agent Ops и 404 в `06-evidence/`. Например: [EN desktop](06-evidence/_-1440.png), [RU mobile](06-evidence/_ru_-360.png).

Разработка на 4406 столкнулась с гонкой общих Astro data-store/cache при параллельных серверах. Приёмка выполнена на изолированном production preview, без dev error overlay. Сборка и кэш перенесены в игнорируемую `.tmp`, исходные доказательства остались в reports.

Локальный просмотр: `http://127.0.0.1:4406/#contact` / `http://127.0.0.1:4406/ru/#contact`. Это сохранённая проверенная сборка пакета, не заявление о завершённости всех соседних пакетов. Перезапуск: `npm run preview -- --outDir .tmp/robert-06-build/dist --host 127.0.0.1 --port 4406`. QA scripts: `06-verify.mjs`, `06-mobile-controls.mjs`, `06-states.mjs`.

## Оставшиеся зависимости

1. Чат 1: перенести 5 пунктов спецификации из `06-requests.md` в общий `ds/components.md`, `ds/patterns.md`, `ds/screens/home.md`. Новых токенов не требуется.
2. Владелец текущей правки Vet/контракта историй: согласовать отсутствующий `eyebrow` в `src/copy/cases/vet-clinic.ts:67` с `CoverMedia`, затем повторить общий check. Пакет 06 этот файл не меняет.
3. После стабилизации всех шести пакетов — общий финальный build/check/CSS прогон координатора. Остальные владельцы могут импортировать IconArrow самостоятельно; их оставшиеся стрелки пакет 06 не правит.
