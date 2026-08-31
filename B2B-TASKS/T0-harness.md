# T0 — Переиспользуемый харнесс проб (делать первым)

Проект: B2B Partner Portal, `D:\Claude-projects\b2b-dssl`.

## Задача

Собрать один скрипт `scripts/adaptive-probe.mjs`, который прогоняет пробы P1–P18
по маршрутам продукта и пишет компактный JSON. Все следующие подзадачи будут
только вызывать его с флагами. Ничего в UI не чинить.

## Читать (и больше ничего)

- `D:\Claude-projects\Site-portfolio\RECHECK-ADD-COMMON.md`, раздел «4. Каталог проб» — определения P1–P18.
- `src/screens/registry.ts` — реестр маршрутов, откуда брать список.
- `scripts/smoke-stories.mjs` — как в этом репозитории уже поднимается Playwright.

## Контракт скрипта

```
node scripts/adaptive-probe.mjs \
  --routes=all|catalog,orders,xls-import \
  --widths=360,390,480,768,800,900,1024,1200,1280,1440 \
  --locales=en,ru \
  --probes=P1,P3,P4 \
  --out=artifacts/adaptive-recheck/<name>.json
```

- Значения по умолчанию: все маршруты реестра, все десять ширин, обе локали, все пробы.
- Ширины ровно эти десять. Точки 480, 800, 900 и 1200 обязательны: между 1024 и 1280 сейчас нет ни одной пробы, а владелец называет именно 1200.
- `ru` — тот же маршрут с префиксом `/ru`. Русские строки на 20–30 % длиннее, поэтому часть провалов проявляется на RU раньше по ширине.
- Все измерения через `getComputedStyle` и `getBoundingClientRect`. Скриншот — только под провал, в `artifacts/adaptive-recheck/shots/`, и только когда передан `--shots`.
- Прогон с `prefers-reduced-motion: reduce`.

## Формат вывода

JSON должен быть маленьким: это его главное свойство.

```json
{
  "meta": { "widths": [...], "locales": [...], "probes": [...], "cases": 660 },
  "summary": { "P1": { "pass": 118, "fail": 2 }, "...": {} },
  "ownerProbes": [
    { "probe": "P1", "route": "/catalog", "locale": "en", "width": 1200,
      "selector": "…", "detail": "outline 2px auto -webkit-focus-ring-color + ring одновременно" }
  ]
}
```

- В `ownerProbes` пишутся **только провалы**, максимум 40 записей на пробу, дальше — счётчик `truncated`.
- Прошедшие кейсы не перечисляются поимённо, только числами в `summary`.
- Ключ `ownerProbes` — тот же, что требует `RECHECK-ADD-COMMON.md`.

## Приёмка T0

- `node scripts/adaptive-probe.mjs --routes=catalog --widths=1200 --locales=en --probes=P1,P2,P3,P4,P5,P6,P18` отрабатывает и находит хотя бы часть уже известных дефектов каталога на 1200. Если находит ноль — проба реализована неверно, чинить пробу.
- Полный прогон по умолчанию отрабатывает без падения скрипта.
- `npm run typecheck` и `npm run lint` — PASS.
- Итоговый JSON меньше 200 КБ.

## Правила

1. Ничего в `src/` не менять. Это read-only подзадача, кроме `scripts/` и `artifacts/`.
2. В чат — не больше 20 строк: список реализованных проб, результат тестового прогона по каталогу, размер JSON.
3. Один коммит: `chore(qa): один прогон проб P1-P18 вместо разовых харнессов`.
