# Промпт для чата A — Agent Ops Console

Открыть новый чат в каталоге `D:\Claude-projects\Agent-ops-console`.
Скопировать всё ниже разделителя.

---

Ты — независимый senior frontend/UX QA reviewer. В этом рабочем дереве
**137 незакоммиченных файлов**: пакет адаптивных правок, сделанный другой
сессией. Это и есть проверяемый результат. Существующие отчёты с отметками PASS
писала та же сессия — считай их картой покрытия, а не доказательством.

## Обязательное чтение

- `D:\Claude-projects\Site-portfolio\RECHECK-CHECKLIST.md` — свод проверок, метод
  измерений и формат отчёта. **Читай целиком, он определяет всю работу.**
- `D:\Claude-projects\Site-portfolio\TASK-adaptive-prototypes.md` — раздел 2,
  контракт адаптива.
- `ds/CONTRACT.md`, `ds/foundation.md`, `ds/patterns.md`, `ds/components.md`,
  `ds/screens/_index.md`, `PROJECT-MAP.md`.
- `artifacts/adaptive-qa/README.md`, `manifest.json`, `findings.md`.

Правила git, две фазы и формат отчёта — из чеклиста, повторять не буду.
Фаза 2 не начинается без моей явной команды.

## Обязательные команды

```powershell
npm run typecheck
npm run build
npm run screens:smoke        # ожидается 19/19
npm run flows:smoke          # ожидается 61/61
npm run context:check
npm run storybook:coverage   # ожидается 42 компонента / 331 состояние
npm run build-storybook
git diff --check
```

Production preview на порту **4173**, baseline-worktree — на **4183**.
Dev server не использовать. Известно и не блокирует: основной JS-чанк больше
500 kB.

## Объём матрицы

19 продуктовых маршрутов плюс ScreensIndex и Showcase, 33 уникальные
route/state цели, ширины 360 / 390 / 768 / 1024 / 1280 / 1440. Реестр и валидные
ID сущностей для query-состояний — из `artifacts/adaptive-qa/manifest.json`,
но собери реестр заново из живого кода и сверь.

## Зацепки этого проекта

Ниже то, что уже видно снаружи. Это не готовые находки и не полный список —
проверь каждую и ищи то, чего здесь нет.

**1. Переделан базовый Input, и это главный подозреваемый по отступам.**
В `src/components/Input/Input.module.css` визуальная коробка поля переехала с
самого `<input>` на псевдоэлемент `.fieldWrap::before` с фиксированной
`--field-visual-height`, а фокус-кольцо стало отдельным абсолютным слоем
`.focusRing` с зашитыми `left/right: -3px` и `height: calc(... + 6px)`.
Проверь по всем экранам с формами:

- высота поля больше не задаётся паддингами — вертикальный ритм «подпись → поле →
  подсказка» и «поле → следующий блок» мог поехать по всему проекту;
- кликабельная область (`min-height: var(--bar-top)`) и видимая коробка
  (`--field-visual-height`) разъехались: клик выше или ниже видимой рамки может
  попадать в поле, а кольцо и красная обводка рисоваться со смещением;
- `-3px` и `+6px` зашиты в пикселях и не масштабируются вместе с размером
  контрола — проверь `sm`, `md`, `lg` на всех ширинах;
- те же вопросы к `Textarea` и `Select`, если они переделаны так же.

**2. Красная рамка при клике в поле.** В CSS проекта нет ни одного правила
`:invalid` или `:user-invalid` — красное приходит только из состояния компонента:
`aria-invalid={destructive}` в `Input.tsx` и правило
`.root[data-destructive='true'] .fieldWrap::before` с `--border-alert`.
Значит, ловится это исключительно прогоном по состояниям — блок E чеклиста,
целиком, на каждом поле каждого экрана. Особое внимание: `policy-editor`,
`reject-with-reason`, `correction`, `consequence-preview`, `login`.

**3. 202 PNG против заявленных 198.** Объясни расхождение: это четыре таргетных
репро-кадра или реестр разошёлся с manifest.

**4. Один сырой `padding-left: 15px` в диффе.** Найди его, проверь по шкале
`--space-2xs … --space-5xl`.

**5. Четыре дефекта заявлены закрытыми — перепроверь воспроизведением:**
AQ-001 публичный `/showcase`; AQ-002 схлопывание колонки `COMMITMENT` до 0 px на
768 и 1024; AQ-003 deep-link `/screens/action-approvals?approval=ap-3` на 360 и
390 обязан сразу открывать мобильную деталь; AQ-004 sticky-футер над textarea
на `correction`.

**6. Десктоп — отдельная обязательная полоса.** Заказчик сообщает о регрессиях
именно на ПК, а в отчётах 1280 и 1440 везде PASS. Слой 1 чеклиста (дельта против
baseline-сборки) на этом проекте обязателен и идёт первым.

**7. Плотные экраны с историческим `min-width: 62rem`** — `audit-log`,
`keyboard-cheatsheet`, `autonomy` с сетками `3fr 5fr 4fr` и `repeat(5,1fr)`,
`action-approvals` `4fr 8fr`, `consequence-preview` на 12 колонок,
`TraceTimeline` `168px minmax(0,1fr)`, `ClusterCard` `1fr auto`. Здесь ищи
схлопывания в 0 px и потерю колонок.

**8. Оверлеи шелла:** drawer сайдбара, `.modalHost` и `.overlayHost` с их
`padding-left: var(--nav-width)`, `KeyboardCheatsheet`, `Popover`, `Select`,
`Modal`. Блок F чеклиста целиком.

## Что дальше

Финал фазы 1 — `artifacts/adaptive-recheck/findings.md` плюс краткий отчёт в чат
по формату из раздела 3 чеклиста. Ничего не чини. Остановись и жди.
