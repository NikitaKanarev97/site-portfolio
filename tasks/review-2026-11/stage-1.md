# Этап 1 — отчёт (в работе)

**Дата:** 18.11.2026 · **Ветка:** `stage-1-hotfix` (worktree `D:\Claude-projects\Site-portfolio-stage-1`)

## Base SHA

| Репозиторий | Base | Почему |
|---|---|---|
| site-portfolio | `3d4ab8f0` — голова `stage-0-criteria` | Этап 0 не смержен в main (main на `368fcd71`); по правилу 2 «Git и выкладка» берётся голова ветки предыдущего этапа |

Merge в main и production-деплой не выполнялись. Ветка запушена в публичный GitHub 18.11.2026 по слову владельца для проверки GPT; push мог запустить preview-деплой Vercel (не проверено, доступа к Vercel нет). Дальнейших публикаций до следующей проверки нет.

## Сделано

| Коммит | Что |
|---|---|
| `0ee74eb5` | Vet Clinic OS и Pawly сняты с главной EN/RU (`OFF_HOME` в `src/copy/home.ts`), страницы, Next и sitemap не тронуты; слоган и подзаголовок из `positioning.md`; RU-перевод (не согласован); счётчик главной считается из числа кейсов |
| следующий | Ревью GPT: сумма A3 убрана из `case-frames.md`; ссылка 404 больше не называет число кейсов; `stage-0.md` дополнен фактом push; этот отчёт |

Проверено: сборка проходит (37 страниц), `/work/vet-clinic` и `/work/pawly` собираются; на главной EN/RU 1440/390 три кейса, счётчик «01 — 03», горизонтальной прокрутки нет.

## Русский в английской версии

Краулер по `dist/` (175 EN-страниц) + просмотр всех 141 кадра на `/`, `/about`, `/work/*` глазами. Текст, alt, подписи на этих маршрутах — без кириллицы.

| Кадр | Где | Что | Предложение |
|---|---|---|---|
| `media/case-dssl/legacy-dashboard.webp` | /work/partner-portal | P2, исторический | Снять (статус «не решено») |
| `media/rebuild/partner-portal/v3/legacy-cart-alternative.webp` | /work/partner-portal | P2, исторический | Снять |
| `media/case-learn/before-catalog.webp` | /work/learn | L1, прод TRASSIR | Снять |
| `media/rebuild/partner-portal/v2/en/workspace-1280.webp` | /work/partner-portal | P10; строка «камера 4мп уличная» из данных прототипа | Переснять из EN-локали или снять вместе с P10 — зависит от решения по P10 |

Попутно: ₽, Moscow DC, +7 495 в EN-кадрах PP, Vet, Pawly. 404 двуязычная намеренно. `/kit` на русском, закрыт от индексации, снимается вместе с Agent Ops.

## Ревью GPT 18.11.2026 — REVISION REQUIRED

| # | Требование | Статус |
|---|---|---|
| 1 | Убрать клиентские цифры A3 из публичных документов | В `case-frames.md` — сделано. Остальные ~50 файлов — в перечне ниже, ждут «ок» |
| 2 | Безопасный план для P9–P10, L3–L4 | Варианты ниже, решение владельца |
| 3 | Снятие Agent Ops, P2, L1 — сначала перечень | Перечень ниже, ждёт «ок» |
| 4 | Hero: убрать дубль роли, короткий согласованный RU-заголовок, проверка 1440/390/360 | Ждёт выбора RU-заголовка |
| 5 | Счётчики и тексты = число видимых кейсов | Счётчик главной вычисляется; 404 без числа. После снятия Agent Ops на главной 2 кейса |
| 6 | Отчёты этапов 0 и 1 | `stage-0.md` дополнен; этот отчёт — черновик до закрытия этапа |

## Перечень на снятие — ждёт «ок» владельца

### A. Agent Ops (A1–A3, A5, A6)

**Маршруты kanarev.com → 404 после выкладки**
- `/work/agent-ops-console`, `/ru/work/agent-ops-console`
- `/preview/agent-ops-pilot`, `/preview/agent-ops-rebuild/en`, `/preview/agent-ops-rebuild/ru`
- `/preview/common/en/agent-ops`, `/preview/common/ru/agent-ops` (и строка Agent Ops в `/preview/common/`)
- `/kit` целиком (витрина с заглушками кейсов, в т.ч. Agent Ops)
- `/og/work-agent-ops-console*.png`

**Код и тексты (`src/`) — удалить**
- `src/components/agent/` (4 файла), `src/scripts/agent-model.js`, `src/scripts/agent-reading.js`
- `src/copy/cases/agent-ops-console.ts`, `agent-ops-premium.ts`, `agent-ops-v2.ts`, `src/copy/ru/cases/agent-ops-console.ts`, `agent-ops-v2.ts`, `src/copy/common/agent-ops.ts`, `src/copy/pilot/agent-ops.ts`
- `src/data/agent-ops-premium-media.json`, `src/data/agent-ops-v2-media.json`
- `src/pages/preview/agent-ops-pilot.astro`, `src/pages/preview/agent-ops-rebuild/`, `src/pages/kit.astro` (+ `src/copy/kit-case.ts`)

**Код — вычистить ссылки** (кейс из реестра, главной, Next, sitemap, OG, превью): `src/copy/cases/index.ts`, `src/copy/ru/cases/index.ts`, `src/copy/featured-work.ts`, `src/copy/og.ts`, `src/copy/case-visuals.ts`, `src/components/CaseArtwork.astro`, `src/pages/og/[card].png.ts`, `src/pages/preview/common/*`, `src/pages/preview/partner-portal-pilot.astro`, `src/pages/preview/pawly-rebuild/[locale].astro`, `src/pages/work/[slug].astro`, `src/scripts/animations.js` (хореография с цифрами A3), `src/data/diagrams/README.md`.

Безопасный текст кейса: в текущем коде нет фрагментов, свободных от A1–A3 (цифры клиента, кадры поставки, находки исследования) — кейс снимается целиком до этапа 7.

**Медиа `public/` — удалить (155 файлов)**
`media/case-agent-ops/` (30), `media/case-agent-ops-ru/` (30), `media/pilot-agent-ops/` (23), `media/rebuild/agent-ops/` (61), `media/home-cover-polish/agent-*` (4), `media/presentation/{en,ru}/*agent-queue*` (2), `media/linkedin/**/agent-ops*` (5).

**Прочее в репозитории — удалить**
- `upwork/projects/agent-ops-console/` (15), `upwork/cover-originals-2026-09-04/projects/agent-ops-console/` (1)
- Цифры A3 в рабочих документах вне `src/` (~45 файлов: `audit/agent-ops-*`, `audit/vet-portfolio-*`, `audit/portfolio-release-v1/logs`, `tasks/robert-review-2026-10-07/**`, `tasks/portfolio-rebuild/**`, `research/portfolio-*`, `ds/`, `outputs/`) — вычистить или удалить файл
- Кадры A2 вне `public/`: ~1 600 изображений и роликов в `audit/` (agent-ops-home-cover-v1 141, agent-ops-portfolio-premium-v3 439, agent-ops-v2 41, portfolio-final-quality-2026-11-03 329 и др.), `tasks/portfolio-rebuild` (200), `tasks/robert-review-2026-10-07` (104), `outputs/agent-ops-*` (12). Часть папок смешанная — по ним точный список файлов отдельно

### B. P2 — исторические кадры DSSL
- Файлы: `public/media/case-dssl/legacy-dashboard.webp`, `public/media/case-dssl-ru/legacy-dashboard.webp`, `public/media/rebuild/partner-portal/v3/legacy-cart-alternative.webp`
- Ссылки: `src/copy/cases/partner-portal.ts` (37, 282), `partner-portal-v2.ts` (139, 149), `src/copy/ru/cases/partner-portal.ts` (38, 237), `ru/cases/partner-portal-v2.ts` (40, 50) — блок «было» остаётся текстом без кадра

### C. L1 — прод TRASSIR
- Файлы: `public/media/case-learn/before-catalog.webp`, `public/media/case-learn-ru/before-catalog.webp`, `public/media/rebuild/learn/archive-catalog.webp`
- Ссылки: `src/copy/cases/learn.ts` (64, 218–222), `src/copy/ru/cases/learn.ts` (58), `src/components/learn/LearnCase.astro` (42) — фигура архива убирается, текст остаётся

## P9–P10, L3–L4: противоречие и варианты

Статус «не решено», а материалы публичны: P9 — `b2b-partner-portal-five.vercel.app`; P10 — ~125 кадров переработки PP на сайте; L3 — `/prototypes/learn/*`, `/prototypes/learn-landing/*` (171 файл); L4 — ~140 кадров Learn. По правилу 7.1 («нет записи о разрешении — не на сайте») их тоже надо снимать; тогда на главной не остаётся ни одного кейса с кадрами.

| Вариант | Что | Цена |
|---|---|---|
| 1. Владелец даёт разрешение сейчас | Запись в evidence-inventory с условиями (переработка, синтетика, без бренда/с брендом L5) | Решение и ответственность владельца; противоречие снято |
| 2. Снять вместе с A/P2/L1 | Главная — без кейсов с кадрами до этапов 3/5/8; Vercel P9 закрывает владелец | Сайт перестаёт работать на отклики |
| 3. Временный режим | Кейсы PP и Learn остаются текстом; кадры и `/prototypes/learn*` закрыты; главная — обложки без кадров | Требует правок разметки сверх «минимально» |

## Остаётся доступным после исправления ветки

- **История публичного GitHub `site-portfolio`**: все кадры A2 (~1 750), цифры A3, P2, L1, P10, L4 — во всех прежних коммитах `main`, `course-v1.1`, `stage-1-hotfix`, включая `3d4ab8f0` (сумма A3 в `case-frames.md`). Удаление файлов новым коммитом это не убирает. Действенно: сделать репозиторий приватным (обратимо) или переписать историю (необратимо, ломает форки и ссылки).
- **Vercel**: прежние production- и preview-деплои kanarev.com (каждый — неизменяемый снимок с медиа Agent Ops), возможный preview ветки `stage-1-hotfix`, проект `agent-ops-console.vercel.app` (A1), `b2b-partner-portal-five.vercel.app` (P9). Закрываются Deployment Protection или удалением деплоев.
- **Внешние копии**: Upwork-портфолио, LinkedIn Featured, кэш Google, OG-кэш соцсетей и мессенджеров.

## Действия владельца

1. GitHub: сделать `site-portfolio` приватным (рекомендация) или решить иначе.
2. Vercel: список деплоев; Deployment Protection на kanarev.com preview, `agent-ops-console`, `b2b-partner-portal-five`; удалить старые preview.
3. Upwork, LinkedIn Featured: убрать Agent Ops.
4. Google Search Console: запросить удаление снятых URL после выкладки.

## Осталось по этапу

- «Ок» на перечень → удаление, сборка, краулер (снятые адреса 404, EN без русских кадров).
- Hero: RU-заголовок, дубль роли, скриншоты 1440/390/360 EN/RU.
- Повторная проверка GPT, затем «мержим stage-1».
