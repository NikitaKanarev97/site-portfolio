# T1 — Один контракт фокуса (находка 1)

Проект: B2B Partner Portal, `D:\Claude-projects\b2b-dssl`. Зависит от T0.

## Что видел владелец

При клике мышью вокруг интерактивных элементов появляется системная синяя рамка,
иногда одновременно с собственной границей компонента — двойной контур. Названы:
глобальный поиск «Search by SKU, name or manufacturer», «Search counterparties»,
селект контрагента, поле Quantity, прочие Input и Select, кнопка уведомлений,
кнопка корзины, остальные IconButton. На Quantity кольцо накладывается на
validation-state и конфликтует с красным сообщением.

Существование дефекта доказано наблюдением. Доказывать заново не нужно.

## Корневая причина (уже найдена, не искать заново)

В `src` осталось 37 вхождений `focus:` против 129 `focus-visible:` — то есть часть
компонентов рисует кольцо на любой фокус, включая мышиный, а часть только на
клавиатурный. Плюс `outline-none` расставлен точечно и не везде заменён кольцом ДС.

Плотность `focus:` по файлам: `ui/dropdown-menu.tsx` 11, `ui/calendar.tsx` 3,
`ui/select.tsx` 2, `Select/Select.tsx` 2, `DropdownMenu/DropdownMenu.tsx` 2,
по одному — `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Button`, `Tabs`,
`Sidebar`, `Pagination`, `Breadcrumbs`, `Accordion`, `Combobox`, `DatePicker`,
`DataTable`, `screens/quick-order/QuickOrder.tsx`.

## Закрыть класс целиком

```bash
grep -rn --include=*.tsx --include=*.css "focus:" src | grep -v "focus-visible:"
grep -rn --include=*.tsx --include=*.css "outline-none\|outline: none" src
grep -rn --include=*.tsx "ring-\|ring\[" src | grep -n "border-"
```

Первая команда даёт полный список мест, где кольцо появляется от мыши.
Вторая — где системный outline снят и мог остаться не заменённым.
Третья — кандидаты на «кольцо поверх собственного border».

## Целевой контракт

- Кольцо рисуется только на `:focus-visible`, одним токеном ДС, с одинаковым `ring-width` и `ring-offset` во всех семействах.
- `outline-none` допустим только в паре с кольцом ДС в том же классе.
- Кольцо не дублирует собственную границу компонента: либо кольцо со смещением наружу, либо border меняет цвет, но не оба контура сразу.
- `invalid + focus-visible` — один согласованный state; сообщение об ошибке остаётся читаемым.
- Кольцо не обрезается родительским `overflow` — проверяется пробой P1.
- Одинаковое поведение у Input, Textarea, Select, Combobox, DatePicker, Checkbox, RadioGroup, QuantityStepper, Button, IconButton, Tabs, Pagination, Breadcrumbs, Accordion, DropdownMenu, Sidebar и примитивов в `src/components/ui/`.

Ничего не удалять целиком: keyboard accessibility обязана остаться.

## Скоуп файлов

`src/components/**`, `src/index.css`, при необходимости токен в `ds/foundation.md`.
Раскладку, ширины, отступы и бизнес-логику не трогать.

## Проверка

```
node scripts/adaptive-probe.mjs --probes=P1 --widths=390,1024,1440 --locales=en,ru \
  --routes=catalog,orders,quick-order,counterparty-select,login,xls-import \
  --out=artifacts/adaptive-recheck/t1-focus.json
```

P1 обязана дать `fail: 0`. Отдельно вручную: Tab по форме Quick Order — кольцо
видно на каждом шаге.

## Правила

1. Читать только файлы из грепа выше. `ds/` целиком не перечитывать.
2. Свой харнесс не писать.
3. В чат — не больше 30 строк: список изменённых компонентов, формулировка контракта в одном абзаце, `summary` пробы P1.
4. Один коммит: `fix(a11y): одно кольцо фокуса на клавиатуру и ни одного на мышь`.
