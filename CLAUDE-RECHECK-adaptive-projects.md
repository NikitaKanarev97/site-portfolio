# Единый handoff-промпт для независимой перепроверки трёх адаптивов

Скопируй весь блок ниже в новый чат Claude. У Claude должен быть доступ к локальным каталогам `D:\Claude-projects\...`.

---

## ПРОМПТ ДЛЯ CLAUDE

Ты — независимый senior frontend/UX QA reviewer. Нужно перепроверить большой завершённый пакет адаптивных изменений сразу в трёх локальных React-проектах. Не доверяй итоговым отметкам PASS автоматически: используй их как карту покрытия и evidence, но самостоятельно прочитай код, запусти проверки и проверь production preview.

### Главная задача и рабочие каталоги

Общий исходный контракт:

`D:\Claude-projects\Site-portfolio\TASK-adaptive-prototypes.md`

Проекты:

1. Agent Ops Console — `D:\Claude-projects\Agent-ops-console`
2. B2B Partner Portal — `D:\Claude-projects\b2b-dssl`
3. Vet Clinic OS — `D:\Claude-projects\Veterinary-clinic`

Перед любыми выводами полностью прочитай:

- общий `TASK-adaptive-prototypes.md`;
- `ds/CONTRACT.md` каждого проекта;
- `ds/foundation.md`, `ds/patterns.md`, `ds/components.md` каждого проекта;
- финальные `artifacts/adaptive-qa/README.md`, `manifest.json`, `findings.md` каждого проекта.

### Критически важное состояние Git

Все три рабочие копии содержат большой пакет **незакоммиченных** адаптивных изменений. Это и есть проверяемый результат.

Запрещено:

- делать `git reset`, `git checkout --`, `git restore`, `git clean`;
- удалять untracked-файлы;
- начинать проверку только от `HEAD`;
- перезаписывать существующие QA-артефакты;
- исправлять найденные дефекты без отдельного подтверждения пользователя.

Сначала работай строго read-only. Допустимы сборка, typecheck, тесты и временные файлы только в `.tmp/claude-recheck/`. Если найдёшь дефект, опиши его и остановись на отчёте.

### Единый контракт адаптива

Изменения делались mobile-first для полного диапазона, без подмены viewport:

- каноническая шкала: 360 / 480 / 768 / 1024 / 1280 / 1440;
- финальная browser-QA шкала: 360 / 390 / 768 / 1024 / 1280 / 1440;
- таблицы: карточки на телефоне → локальный внутренний scroll/sticky на планшете → полная таблица на desktop;
- сетки: 1 колонка → 2 → исходное N-колоночное представление;
- sidebar: desktop rail → drawer на узких ширинах;
- action rows: вертикальный primary-first stack → wrap → desktop row;
- dialogs/popovers: mobile sheet или bounded overlay с внутренней прокруткой;
- touch targets не меньше 44×44;
- никакого document-level horizontal overflow;
- данные, статусы и действия нельзя выбрасывать ради мобильной версии;
- drawer/modal/popover: focus trap, Escape, возврат фокуса, body/root lock и internal scroll;
- `100dvh`, safe-area и низкая высота viewport должны быть устойчивыми;
- keyboard-only и `prefers-reduced-motion` не должны регрессировать.

## 1. Agent Ops Console

Путь: `D:\Claude-projects\Agent-ops-console`

### Что было изменено

- Добавлены breakpoint tokens: `src/tokens/breakpoints.css`; обновлены `ds/foundation.md`, `ds/patterns.md`, `ds/components.md`, `ds/screens/_index.md`, `PROJECT-MAP.md`.
- Shell: `src/app/shell.tsx`, `shell.module.css`, `SideNav`, `SideNavItem`, `TopStrip`; фиксированный sidebar 232px превращён в drawer, исправлены modal/overlay hosts и KeyboardCheatsheet.
- Общие responsive components: TableRow, ClusterCard, TraceTimeline, Popover, Select, Modal, SystemState, PageHeader, buttons/inputs и их Storybook stories.
- Адаптированы все 19 продуктовых экранов в `src/screens/**`: очередь и разбор, согласования и политики, качество, autonomy, audit log, login, messenger и служебные состояния.
- `ScreensIndex` и `Showcase` адаптированы; `/showcase` подключён к production router.
- Финальный fix/retest закрыл четыре дефекта:
  1. отсутствовавший публичный `/showcase`;
  2. схлопывание `COMMITMENT` до 0px на 768/1024 — общий TableRow получил измеримый минимум и bounded internal scroll;
  3. deep-link `?approval=ap-3` теперь сразу открывает mobile detail;
  4. sticky footer больше не перекрывает textarea Correction.

### Фактическое ожидаемое покрытие

- 19 продуктовых routes + ScreensIndex + Showcase;
- 33 уникальные route/state цели;
- 6 ширин;
- 198 PNG, ожидаемо 198 PASS / 0 FAIL;
- 36 scenario checks, ожидаемо 36 PASS / 0 FAIL;
- Storybook coverage: 42/42 компонентов, 331/331 states.

Registry и валидные query-state entity IDs бери из:

`D:\Claude-projects\Agent-ops-console\artifacts\adaptive-qa\manifest.json`

Финальные QA-артефакты:

- `D:\Claude-projects\Agent-ops-console\artifacts\adaptive-qa\README.md`
- `D:\Claude-projects\Agent-ops-console\artifacts\adaptive-qa\index.html`
- `D:\Claude-projects\Agent-ops-console\artifacts\adaptive-qa\manifest.json`
- `D:\Claude-projects\Agent-ops-console\artifacts\adaptive-qa\findings.md`

Обязательные команды:

```powershell
cd D:\Claude-projects\Agent-ops-console
npm run typecheck
npm run build
npm run screens:smoke
npm run flows:smoke
npm run context:check
npm run storybook:coverage
npm run build-storybook
git diff --check
```

Ожидается: screens 19/19, flows 61/61. Известное неблокирующее предупреждение: основной JS chunk больше 500 kB. Vercel deploy и физический телефон не проверялись.

## 2. B2B Partner Portal

Путь: `D:\Claude-projects\b2b-dssl`

### Что было изменено

- Общие breakpoints добавлены в Tailwind v4/theme; обновлены `src/index.css`, `ds/foundation.md`, `ds/DECISIONS.md`, `ds/components.md`, screen specs и adaptive inventory.
- `src/screens/_shell/AppShell.tsx`, Sidebar и AppHeader переведены на drawer/mobile shell; поиск, корзина и уведомления сохранены.
- Общие компоненты: DataTable, ProductRow, OrderRow, ResolutionRow, TableViewport, TableToolbar, pagination, forms, Dialog, Drawer, DatePicker, CheckoutProgress, PageHeader и Storybook stories.
- Адаптированы catalog, product details, search results, quick order, cart, checkout, order details/list/success, XLS import, dashboard, counterparty select, fulfillment plans, resolution center, login, password recovery и system states.
- Index и Showcase адаптированы; EN и RU работают через `/...` и `/ru/...` с locale-preserving navigation.
- Добавлены safe-area/`viewport-fit=cover`, низковысотные auth-layouts и `100dvh`.
- Telemetry сделан opt-in через `VITE_UT_ENDPOINT`: при QA endpoint не настроен, внешние события не отправляются. HTTP-only collector является внешним infrastructure limitation и не должен включаться в локальной перепроверке.
- DatePicker намеренно остаётся двухмесячным на mobile с внутренним вертикальным scroll — это принятое DS-решение.

### Фактическое ожидаемое покрытие

- 20 product/system routes;
- 6 promoted prototype states;
- 2 utility routes (`/`, `/showcase`);
- 5 query-state families;
- всего 33 entries × 2 локали × 6 ширин = 396 PNG;
- ожидаемо 396 PASS / 0 FAIL;
- 14 scenario checks, ожидаемо 14 PASS / 0 FAIL;
- Storybook: 45/45 families, 309/309 cells, catalog smoke 263 stories / 0 failures.

Полный registry находится в:

`D:\Claude-projects\b2b-dssl\artifacts\adaptive-qa\manifest.json`

Финальные QA-артефакты:

- `D:\Claude-projects\b2b-dssl\artifacts\adaptive-qa\README.md`
- `D:\Claude-projects\b2b-dssl\artifacts\adaptive-qa\index.html`
- `D:\Claude-projects\b2b-dssl\artifacts\adaptive-qa\manifest.json`
- `D:\Claude-projects\b2b-dssl\artifacts\adaptive-qa\findings.md`

Обязательные команды:

```powershell
cd D:\Claude-projects\b2b-dssl
npm run typecheck
npm run build
npm run lint
npm run catalog-coverage
# catalog-smoke требует предварительно поднятый Storybook на :6006
npm run storybook -- --host 127.0.0.1 --ci
npm run catalog-smoke
npm run build-storybook
git diff --check
```

Известные неблокирующие вопросы:

- JS bundle около 941.56 kB (примерно 278 kB gzip), render-регрессии не найдено;
- Index не имеет отдельного явного language toggle, но прямые RU routes и сохранение локали работают;
- production telemetry требует реального HTTPS endpoint;
- Vercel deploy и физический телефон не проверялись.

## 3. Vet Clinic OS

Путь: `D:\Claude-projects\Veterinary-clinic`

### Что было изменено

- Добавлены `src/tokens/breakpoints.css`, `ds/adaptive-inventory.md`; обновлены foundation, patterns и components.
- Shell/components: SideNav drawer, AppHeader, PageHeader, ActionBar, Breadcrumb, TableRow/TableCell/TableHeaderRow, QueueRow, VisitRow, ScheduleRow, ServiceLine, PrescriptionLine, KeyValue и TimeSlot; stories обновлены.
- Адаптированы LandingPage и owner flows как mobile-native сценарии.
- Адаптированы clinical flows: day queue, schedule, appointment editor, visit record/quick trace, patient card/weight, dose calculator, invoice draft и shift impact.
- Для экранных групп добавлены `LandingPage.module.css`, `V3Screens.module.css`, `V4Screens.module.css`, `V5Screens.module.css`.
- ApplicationIndex, Showcase и PrototypePanel адаптированы; EN/RU работают через обычные и `/ru/...` routes.
- PrototypePanel поддерживает `default`, `offline`, `empty`, focus trap, Escape, overlay close, inert/background lock и internal scroll.
- Финальный fix/retest перенёс collapsed PrototypePanel toggle из `position: fixed` в статичную safe-area-aware preview-полосу, поэтому он больше не перекрывает клинические controls/CTA.

### Фактическое ожидаемое покрытие

- 14 product routes;
- utilities `/app` и `/showcase`, aliases `/` и `/ru`;
- PrototypePanel на `/app` и 13 внутренних app routes в состояниях default/offline/empty;
- 44 route/state scenarios × 2 локали × 6 ширин = 528 PNG;
- ожидаемо 528 PASS / 0 FAIL;
- 42 interaction checks, ожидаемо 42 PASS / 0 FAIL;
- Storybook: 31/31 компонентов, 148/148 состояний.

Полный registry находится в:

`D:\Claude-projects\Veterinary-clinic\artifacts\adaptive-qa\manifest.json`

Финальные QA-артефакты:

- `D:\Claude-projects\Veterinary-clinic\artifacts\adaptive-qa\README.md`
- `D:\Claude-projects\Veterinary-clinic\artifacts\adaptive-qa\index.html`
- `D:\Claude-projects\Veterinary-clinic\artifacts\adaptive-qa\manifest.json`
- `D:\Claude-projects\Veterinary-clinic\artifacts\adaptive-qa\findings.md`

Обязательные команды:

```powershell
cd D:\Claude-projects\Veterinary-clinic
npm run typecheck
npm run build
npm run verify-storybook-coverage
npm run build-storybook
git diff --check
```

Известный out-of-scope вопрос: медицинская корректность схемы мелоксикама «первый день / поддерживающая доза». Адаптив данные показывает полностью, но медицинскую логику нельзя менять без клинического решения. Vercel deploy и физический телефон не проверялись.

## Как провести независимую перепроверку

Для каждого проекта сделай один и тот же цикл:

1. Зафиксируй `git status --short` и `git diff --stat`. Не меняй дерево.
2. Прочитай изменённый код и проверь, что responsive-правки не изменили бизнес-логику, данные, маршрутизацию или клинические/финансовые расчёты случайным образом.
3. Выполни обязательные команды проекта.
4. Подними **production preview**, не dev server. Используй свободный локальный порт для каждого проекта.
5. Получи registry из текущего кода/живого Index и сравни с QA manifest. Не полагайся только на ручной список выше.
6. Независимо пройди все manifest entries на ширинах 360, 390, 768, 1024, 1280, 1440. Для B2B и Vet проверь EN/RU. Не обязательно создавать второй комплект PNG: можно использовать существующие кадры как визуальную карту, но DOM/browser measurements должны быть получены заново.
7. На каждом route/state проверь:
   - `document.scrollWidth <= document.clientWidth`;
   - отсутствие console/page/network errors и framework overlay;
   - сохранность значимых данных и основных действий;
   - visible touch targets ≥44×44;
   - отсутствие перекрытия контента fixed/sticky элементами;
   - корректный scroll ownership;
   - длинные RU-строки, числа, валюты, дозы и единицы;
   - tablet transitional layouts на 768/1024 и отсутствие desktop-регрессии на 1280/1440.
8. Сценарно перепроверь drawer, modal/dialog, popover/select, keyboard sheet или PrototypePanel: first focus, trap, Escape, focus return, body/root lock, internal scroll.
9. Проверь keyboard-only, reduced-motion, low-height auth и mobile master-detail/deep-links.
10. Открой каждый `artifacts/adaptive-qa/index.html` через `file://` и проверь filters, thumbnails и относительные ссылки.

Если автоматический анализатор сигнализирует о потере данных или overlap, не принимай это автоматически: подтверди визуально, DOM geometry и hit-test. Аналогично не снимай реальный дефект как «шум» без воспроизводимого доказательства.

## Требуемый финальный отчёт

Ничего не исправляй. Верни один консолидированный отчёт:

| Проект | Кодовые проверки | Registry parity | Browser matrix | Interaction QA | Итог |
|---|---|---|---|---|---|
| Agent Ops | ... | ... | ... | ... | PASS/FAIL |
| B2B | ... | ... | ... | ... | PASS/FAIL |
| Vet Clinic | ... | ... | ... | ... | PASS/FAIL |

После таблицы:

1. Сначала перечисли только подтверждённые дефекты с severity, абсолютным файлом/строкой, route/state/locale/viewport и шагами воспроизведения.
2. Отдельно перечисли расхождения между кодом, registry и существующими manifests.
3. Отдельно перечисли неблокирующие технические долги и out-of-scope вопросы.
4. Укажи, можно ли принимать каждый проект и весь пакет целиком.
5. Если всё зелёное, явно напиши: `Все три адаптива независимо перепроверены и готовы к приёмке`.

Не считай существующие PASS-отчёты доказательством сами по себе и не вноси изменения без моего следующего сообщения.

## КОНЕЦ ПРОМПТА

