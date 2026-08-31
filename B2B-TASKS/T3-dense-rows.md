# T3 — Контракт плотной строки (находки 5 и 7, рассинхрон сеток из 6)

Проект: B2B Partner Portal, `D:\Claude-projects\b2b-dssl`. Зависит от T0.

## Что видел владелец

**Каталог, таблица «4 products».** В продуктовую ячейку не помещаются thumbnail,
SKU, название товара и ссылка «Open product details». Заголовки колонок в серой
строке наслаиваются, в первой колонке визуально перекрываются два названия. SKU
переносится почти по одному символу, название сжимается в очень узкую колонку,
ссылка разбивается на множество коротких строк, price и availability смещаются
вправо.

**XLS-import / parse result.** Колонки Source text, Matched product, Qty, Price,
Availability, Status на промежуточной ширине чрезмерно сжимаются: SKU по несколько
символов на строку, product name становится высокой узкой колонкой, статусы
«Ambiguous», «Missing», «No quantity» прижаты к правому краю, badges и ссылки
«Go to review» / «Fix here» без внутреннего пространства, последний столбец
выглядит обрезанным.

**Orders.** Header и body перестают совпадать по колонкам.

## Корневая причина (уже найдена, не искать заново)

Единого контракта плотной строки нет: `DataTable` и пять компонентов строк
(`ProductRow`, `OrderRow`, `ResolutionRow`, `DocumentRow`, `ShipmentGroup`) плюс
таблица разбора в `src/screens/xls-import/XlsImport.tsx` задают колонки каждый
по-своему. Отсюда и посимвольный перенос, и расхождение сеток header/body.

## Закрыть класс целиком

```bash
grep -rn --include=*.tsx "grid-cols\|grid-template\|minmax(\|min-w-\|max-w-" src/components/DataTable src/components/*Row src/components/ShipmentGroup src/screens
grep -rn --include=*.tsx --include=*.css "break-all\|break-words\|overflow-wrap\|truncate\|line-clamp" src
grep -rn --include=*.tsx "object-cover\|object-contain\|<img" src/components src/screens
```

Вторая команда закрывает весь класс «лестница по символам» (проба P4): `break-all`
допустим только для непрерывного идентификатора, но не для названия товара и не для
ссылки. Третья закрывает класс растянутых превью.

## Целевой контракт

1. Одна сетка на header и body каждой таблицы: одно определение колонок, используемое обоими. Расхождение computed `grid-template-columns` больше 0.5 px — провал (проба P3).
2. У каждой колонки содержательный `min-width`. Таблица не сжимается ниже суммы минимумов: вместо этого включается внутренний горизонтальный скроллер.
3. Продуктовая ячейка: thumbnail ограничен по размеру и `object-fit: contain`, не растягивается; SKU не разбивается посимвольно; название переносится по словам; «Open product details» остаётся читаемой ссылкой в одну-две строки.
4. Status: badge целиком внутри своей ячейки, справа от badge и ссылки сохраняется нормальный padding, статус и действие могут переноситься вертикально внутри ячейки.
5. Заголовки колонок не перекрываются между собой ни на одной ширине из матрицы.
6. Горизонтальный скролл только внутри контейнера таблицы, никогда на документе (проба P18: в списке скроллеров допустимы только заявленные таблицы и tab-strip).
7. Уровни раскладки: mobile — карточка с явными labels; tablet — внутренний скроллер с залипающей первой колонкой; desktop — обычная таблица. Границы ширин задаёт T4, здесь фиксируются только минимумы колонок и поведение содержимого.

## Скоуп файлов

`src/components/DataTable/**`, `src/components/ProductRow/**`, `OrderRow`,
`ResolutionRow`, `DocumentRow`, `ShipmentGroup`, `src/screens/xls-import/XlsImport.tsx`,
`src/screens/orders/Orders.tsx` и `src/screens/catalog/Catalog.tsx` — только в части
описания колонок. Слои и sticky — не здесь, это T2. Фильтры — не здесь, это T5.

## Проверка

```
node scripts/adaptive-probe.mjs --probes=P3,P4,P5,P9,P15,P18 \
  --widths=768,900,1024,1200,1280 --locales=en,ru \
  --routes=catalog,search-results,orders,xls-import,resolution-center \
  --out=artifacts/adaptive-recheck/t3-rows.json
```

P3 и P4 обязаны дать `fail: 0`. RU проверяется обязательно: русские заголовки
длиннее и ломают колонку раньше по ширине.

## Правила

1. Читать только файлы из скоупа. `ds/components.md` — только раздел про плотные строки, не файл целиком.
2. Свой харнесс не писать, полную матрицу не гонять.
3. В чат — не больше 30 строк: таблица минимальных ширин колонок по семействам, список изменённых файлов, `summary` проб.
4. Один коммит: `fix(tables): у колонок появился минимум, а у строк — общая с шапкой сетка`.
