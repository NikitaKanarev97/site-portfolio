# T2 — Шапка и шкала слоёв (находки 2 и 8, sticky-часть 6)

Проект: B2B Partner Portal, `D:\Claude-projects\b2b-dssl`. Зависит от T0.

## Что видел владелец

Шапка с глобальным поиском, контрагентом, уведомлениями, корзиной и профилем
оказывается ниже прокручиваемого содержимого: строки каталога и заголовки таблиц
проходят поверх неё, текст и карточки товара визуально попадают внутрь области
глобального поиска. На Orders sticky-заголовок таблицы, включая ячейку «ITEM»,
отрывается от таблицы и поднимается поверх глобального поиска.

Отдельно владелец просит пройти шапку на ширинах 390–1200: поиск, контрагент,
уведомления, корзина, профиль.

## Корневая причина (уже найдена, не искать заново)

Шкалы слоёв нет. Во всём `src` четыре значения без токенов: `z-50` ×11, `z-10` ×7,
`z-20` ×3, `z-30` ×1. `sticky` встречается в 15 файлах, в том числе в `DataTable`,
`OrderRow`, `ProductRow`, `ResolutionRow`, `screens/_shell/AppShell.tsx`,
`screens/_shell/catalog-content.tsx`, `screens/catalog/Catalog.tsx`,
`screens/orders/Orders.tsx`. Шапка не создаёт собственный stacking context, поэтому
любой `z-10` внутри контента конкурирует с ней напрямую.

## Закрыть класс целиком

```bash
grep -rn --include=*.tsx --include=*.css "z-\[\|z-0\|z-10\|z-20\|z-30\|z-40\|z-50" src
grep -rn --include=*.tsx "sticky\|fixed" src/components src/screens
grep -rn --include=*.tsx "overflow-hidden" src/screens/_shell src/components/DataTable
```

Третья команда важна отдельно: `position: sticky` внутри предка с `overflow: hidden`
залипать не будет — это отдельный класс поломки, проба P2 его ловит.

## Целевой контракт

1. Шкала слоёв объявляется токенами в `ds/foundation.md` и применяется во всём `src`. Ступени, снизу вверх: контент → sticky-заголовок таблицы → sidebar/drawer → AppHeader → popover/dropdown/combobox → dialog → toast. Голых числовых `z-*` в `src` после задачи не остаётся.
2. AppHeader создаёт собственный stacking context, имеет непрозрачный фон и лежит выше контента и любых sticky-заголовков таблиц.
3. Sticky-заголовок таблицы залипает внутри своего скроллера, а не относительно документа, и не выходит за пределы карточки таблицы.
4. Dropdown, combobox и popover, открытые из шапки, рисуются поверх шапки и контента.
5. Композиция шапки на 390–1200: элементы остаются внутри viewport, не выталкивают друг друга, не обрезают текст поиска, touch target не меньше 44×44, высота шапки не меняется при открытии dropdown, раскладка в одну или две строки переключается на объявленном breakpoint.
6. Ни одного нового перекрытия и ни одного document-level горизонтального скролла.

## Скоуп файлов

`src/components/AppHeader/**`, `src/components/Sidebar/**`, `src/components/DataTable/**`
(только слои и sticky), `src/screens/_shell/**`, `src/index.css`, `ds/foundation.md`
(секция со шкалой слоёв). Ширины колонок и содержимое ячеек — не здесь, это T3.

## Проверка

```
node scripts/adaptive-probe.mjs --probes=P2,P6,P11,P13,P16 \
  --widths=390,480,768,900,1024,1200 --locales=en,ru \
  --routes=catalog,orders,dashboard,search-results,xls-import \
  --out=artifacts/adaptive-recheck/t2-layers.json
```

P2 обязана дать `fail: 0`, включая проверку `elementFromPoint` в пяти точках внутри
rect шапки после прокрутки на 300 px и до конца страницы.

## Правила

1. Читать только `AppShell.tsx`, `AppHeader.tsx`, `Sidebar.tsx`, `DataTable.tsx`, `catalog-content.tsx` и результат грепа по `z-`.
2. Свой харнесс не писать, полную матрицу не гонять.
3. В чат — не больше 30 строк: шкала слоёв таблицей из семи ступеней, список изменённых файлов, `summary` проб.
4. Один коммит: `fix(shell): шапка снова выше содержимого, и у слоёв появилась шкала`.
