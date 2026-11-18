# Этап 1 — отчёт

**Дата:** 18.11.2026 · **Ветка:** `stage-1-hotfix` (worktree `D:\Claude-projects\Site-portfolio-stage-1`) · **Статус:** готово ко второй проверке GPT; merge и выкладка — только по «мержим stage-1»

## Base SHA

| Репозиторий | Base | Почему |
|---|---|---|
| site-portfolio | `3d4ab8f0` — голова `stage-0-criteria` | Этап 0 не смержен в main (main на `368fcd71`); по правилу 2 «Git и выкладка» берётся голова ветки предыдущего этапа |
| b2b-dssl | `6bbe1cd` (коммит съёмки кадров PP V2), временный worktree, удалён после съёмки | Пересъёмка одного кадра; рабочая папка владельца (`redesign/cart-v2`, незакоммиченные правки) не тронута |

## Публикации

- 18.11.2026 ветка `stage-1-hotfix` запушена в публичный GitHub по слову владельца для проверки GPT: сначала `3d4ab8f0`, `0ee74eb5`, затем `db55fde3`, `ec8f3569`. Все четыре коммита доступны в GitHub. Мог запуститься preview-деплой Vercel — не проверено, доступа нет.
- Дальше — Stage 1.1 (`stage-1.1/REPORT.md`): один коммит, без push до отдельного слова владельца.

## Что сделано

**Главная и тексты**
- Vet Clinic OS и Pawly сняты с главной EN/RU (`OFF_HOME`, `src/copy/home.ts`); страницы `/work/vet-clinic`, `/work/pawly` собираются.
- Слоган EN — дословно из `positioning.md`; RU — выбор владельца 18.11: «Продуктовый дизайнер, который доводит решения до кода.» Подзаголовок EN/RU — из `positioning.md`.
- Подпись роли над слоганом убрана (дубль), правило `.hero__profession` удалено.
- Счётчик главной вычисляется из числа кейсов («01 — 02»); ссылка на 404 не называет число кейсов.

**Agent Ops (A1–A3, A5, A6) — снят целиком**
- Маршруты не собираются: `/work/agent-ops-console`, `/ru/work/agent-ops-console`, `/preview/agent-ops-pilot`, `/preview/agent-ops-rebuild/*`, `/preview/common/*`, `/preview/partner-portal-pilot` (пара к пилоту Agent Ops), `/kit`, OG `work-agent-ops-console*`.
- Код: `src/components/agent/`, скрипты `agent-model.js`, `agent-reading.js`, тексты кейса EN/RU, `common/agent-ops.ts`, `pilot/agent-ops.ts`, медиа-манифесты, `kit.astro`, `kit-case.ts`; ссылки вычищены из реестра кейсов, главной, страницы кейса, OG, `case-visuals`, `CaseArtwork`, `WorkStage`, `animations.js`, превью Pawly (Next → Partner Portal), `scripts/check-scoped-css.cjs`.
- `public/`: 155 медиафайлов Agent Ops.
- Репозиторий: `upwork/projects/agent-ops-console/`, обложка в `upwork/cover-originals-…`, все файлы с Agent Ops в пути в `audit/`, `tasks/`, `outputs/`, `research/`, `scripts/`, `ds/screens/case-agent-ops.md`, handoff- и prompt-файлы (кроме `AGENTS.md` — инструкция для Codex). Итого вне `src/` и `public/` около 1 750 файлов.
- Цифры A3/A5 (стоимость инцидента, доля закрытых обращений, объём диалогов, число клиентов, CSAT, оценки) в оставшихся документах заменены метками `[сумма A3]`, `[доля A3]`, `[объём A3]`, `[оценка A5]`; логи и JSON с ними удалены. Включая `upwork/profile.md` — живой профиль Upwork это не меняет.

**P2, L1 — сняты**
- Файлы: `media/case-dssl/legacy-dashboard.webp`, `media/case-dssl-ru/legacy-dashboard.webp`, `media/rebuild/partner-portal/v3/legacy-cart-alternative.webp`, `media/case-learn/before-catalog.webp`, `media/case-learn-ru/before-catalog.webp`, `media/rebuild/learn/archive-catalog.webp`.
- Partner Portal: диагностика остаётся текстом (наблюдение → решение) без архивного кадра; `shot` в данных стал необязательным. Тело блока больше не ссылается на «экраны исходного портала».
- Learn: архивный кадр убран, вместо подписи-ярлыка — фраза о структуре исходной платформы. Блоки сравнения в старых данных историй (только превью) удалены.

**P9–P10, L3–L4 — разрешены владельцем 18.11.2026** (запись в `evidence-inventory.md`, строки и журнал решений).
- Кадр P10 `rebuild/partner-portal/v2/en/workspace-1280.webp` переснят тем же скриптом (`scripts/b2b-v2/capture-product.mjs`, коммит прототипа `6bbe1cd`) с одной правкой данных во временном worktree: исходная строка 38 «камера 4мп уличная» → «outdoor cam 4mp» (в `src/data/specification-lines.ts` и фикстуре `audit/dashboard-v3/baseline-state.json`). RU-кадр не менялся. В репозитории b2b-dssl правка не закоммичена — при пересъёмке P10 после этапа 3 её надо внести в прототип (EN-строка + RU через словарь локализации).

**Документы этапа 0**
- `case-frames.md`: сумма A3 убрана; `stage-0.md`: дополнен фактом публикации.

## Проверки (локальная сборка)

| Проверка | Результат |
|---|---|
| `astro build` | 25 страниц (было 37), без ошибок |
| Краулер этапа (`dist/`, 171 HTML): снятые маршруты и файлы не собраны; нет файлов с «agent»; 1 901 локальная ссылка — битых нет, на Agent Ops — нет; EN-страницы (кроме двуязычной 404, превью, прототипов) — без кириллицы в тексте, alt, aria, title, meta; главная EN/RU — 2 кейса, «01 — 02» | PASS |
| `npm run check:content` | 0 находок |
| `npm run check:css` | мёртвых правил 0 на всех маршрутах |
| Зеркала ДС `ds/tokens.css`, `ds/motion.js` | побайтово совпадают |
| Скриншоты главной EN/RU 1440, 390, 360 | горизонтальной прокрутки нет; RU-заголовок на 1440 — 4 строки, кнопки в первом экране |

Просмотр глазами: все 141 кадр EN-страниц до правок; после правок — новый кадр workspace и главная целиком.

## Остаётся доступным после исправления ветки

- **История публичного GitHub `site-portfolio`**: кадры A2, цифры A3, P2, L1 — во всех прежних коммитах `main`, `course-v1.1`, `stage-0-criteria`, `stage-1-hotfix` (включая запушенные `3d4ab8f0` с суммой A3 и `0ee74eb5`). Удаление новым коммитом этого не убирает. Действенно: сделать репозиторий приватным (обратимо) или переписать историю (необратимо).
- **Скриншоты в `audit/`, `tasks/`, `outputs/`** без «agent» в имени, но с обложкой Agent Ops на главной (снимки главной до этапа 1) — по имени не находятся; закрываются только приватностью репозитория.
- **Vercel**: прежние production- и preview-деплои kanarev.com (неизменяемые снимки с Agent Ops, P2, L1), возможный preview `stage-1-hotfix`, `agent-ops-console.vercel.app` (A1).
- **Production kanarev.com** до merge — прежняя версия со всеми снятыми материалами.
- **Внешние копии**: Upwork-портфолио и профиль (тексты с цифрами A3), LinkedIn Featured, кэш Google, OG-кэш соцсетей.

## Действия владельца

1. GitHub: сделать `site-portfolio` приватным (рекомендация) — до следующего push.
2. Vercel: список деплоев; Deployment Protection или удаление старых preview kanarev.com и проекта `agent-ops-console`.
3. Upwork: убрать Agent Ops из портфолио и цифры из профиля; LinkedIn Featured — убрать Agent Ops.
4. Google Search Console: удаление снятых URL после выкладки.
5. «Мержим stage-1» после повторной проверки GPT.

## Открыто

- L5 — бренд TRASSIR в названии кейса и прототипа: право не записано.
- ₽, Moscow DC, +7 495 в EN-кадрах PP (P10, пересъёмка после этапа 3), Vet, Pawly (этап 4).
- В карточке Learn на главной и в кейсе Learn — бренд DSSL/TRASSIR (L5).
