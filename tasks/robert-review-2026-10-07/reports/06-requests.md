# Пакет 06 — запросы в общий каталог ДС

07.10.2026. Изменения общей документации принадлежат чату 1; здесь записана спецификация до реализации.

1. `IconArrow` — добавить в `ds/components.md`: декоративный inline SVG, `direction=right | down | up-right` (по умолчанию right), `size=base | small` (по умолчанию base), `class`. Геометрия SVG в viewBox 0 0 24 24; цвет currentColor, размер base=1em, small=`size-link-marker`, без собственного движения. `aria-hidden=true`, `focusable=false`. Используется в TextLink вместо шрифтовых стрелок. Компонент готов к импорту из `src/components/IconArrow.astro`.
2. `TextLink`: API inline/arrow/nav сохраняется. Inline — постоянное подчёркивание только текста для ссылок в прозе. Arrow/nav — линия только под label на hover/focus/active, у active nav постоянная. Для внешнего arrow один маркер up-right, для внутреннего right; маркер не подчёркивается. Inverse hover сохраняет контрастный `text-link-on-inverse`; pressed использует `text-link-pressed-on-inverse`; focus ring currentColor на inverse.
3. `CopyEmail`: appearance=address — выделяемая mailto-ссылка, `ds-heading-3xl`, перенос перед @, без copy-подсказки. Appearance=action — прежний совместимый copy API и aria-live feedback, реальный выделяемый адрес в `ds-body-sm`, failure остаётся видимым и озвучивается. Копирование не переносится в ContactBlock.
4. `PageShell`/`ContactBlock` в `ds/patterns.md` и `ds/screens/home.md`: h2 `ds-display-7xl` (48/64/128 px по существующей роли), пояснение ProseBlock, mailto `CopyEmail appearance=address`, вторичные TextLink arrow на CV и LinkedIn. Desktop — слева, пояснение/контакты в двух колонках; mobile — заголовок → текст → email → вторичные ссылки в ряд с переносом и touch-целью 48 px. Вертикаль flow-node/flow-group/flow-text, без новых токенов.
5. `Footer`: одна спокойная строка `ds-body-sm`: EN «Copyright 2026», RU «Авторские права 2026». Личные география/время не выводятся. Legacy optional props location/utcLabel/timeZone/timeLabel принимаются для совместимости витрины /kit, но не отображаются. Отдельный клиентский таймер снят.

Новые токены не нужны. Владельцам CTA/hero/stage доступен IconArrow; их файлы пакет 06 не меняет. Общий каталог и карты должен обновить чат 1.

## Зависимость общей проверки

Последний `npm run check` 07.10.2026 обнаружил 1 ошибку вне пакета 06: `src/copy/cases/vet-clinic.ts:67:129`, `media.variant='proof'` не содержит обязательного `eyebrow` из `CoverMedia`. Файл пакет 06 не редактирует. Владельцу текущей правки Vet/контракта истории согласовать поле либо тип и повторить общий check. Ранее check после реализации пакета 06 проходил без ошибок; в закреплённых файлах 06 ошибок нет.

EN `site.footer.location` оставлен как существующий источник факта для `src/copy/og.ts`; PageShell и Footer его не выводят. Это сохраняет текущий OG и не добавляет географию в видимый футер. Clock/UTC больше не передаются и не исполняются.
