# Stage 1.1 — отчёт для независимой приёмки

**Дата:** 18.11.2026 · **Ветка:** `stage-1-hotfix` · **Base SHA:** `ec8f3569e3f18a8f371a42e3ebf39a459fd832de` (= `origin/stage-1-hotfix` на старте) · **Итоговый SHA:** коммит, в котором лежит этот файл (`git log -1 -- tasks/review-2026-11/stage-1.1/REPORT.md`)

**Статус: READY FOR INDEPENDENT REVIEW.** Не ACCEPTED: приёмку выполняет ChatGPT. Merge в `main`, production deploy, правки Figma, внешних профилей и разрешений в `evidence-inventory.md` не выполнялись. Push — только по отдельному слову владельца.

## Замечание → исправление → доказательство

| # | Замечание ревью | Исправление | Доказательство |
|---|---|---|---|
| P0 | A3/A5 в `case-frames.md`, `upwork/profile.md`, `upwork/competitive-analysis.md` и др. | Скан всего дерева по 12 шаблонам A3/A5 в разных записях (пробел, запятая, точка, %, валюта, EN/RU-слова, производные оценки). 53 строки в 20 файлах: значения заменены метками `[доля A3]`, `[объём A3]`, `[размер команды A3]`, `[число A3]`, `[оценка A5]`, `[доля A5]`; 1 OCR-дамп кадров Agent Ops вынесен в архив | Раздел «P0: поиск» ниже; повторный скан — 12 совпадений, все ложные (таблица) |
| P0 | Действующие рекомендации публиковать Agent Ops, ссылки на прототип | `upwork/profile.md`: §5.1 заменён пометкой «снято», highlighted, порядок действий, таблица пакетов, два шаблона писем без Agent Ops и ссылки; `project-catalog.md`: строки медиа и примеры; `tools/build-upwork-covers.ps1`: обложка Agent Ops убрана; навыки `upwork-proposal`, `upwork-triage`, `ru-cover-letter` — баннер «снят», ссылки заменены `[ссылка снята]`, кейс зачёркнут; `scripts/shoot-cover-sources.mjs` — съёмка прототипа Agent Ops убрана; `public/media/presentation/README.md` | `git grep agent-ops-console.vercel` в `.claude/ upwork/ scripts/ public/ cv/ linkedin/ src/ ds/` — 0 |
| P1 | Производные P2/L1 в `outputs/media-edge-audit/` и полностраничные скриншоты с Agent Ops | Решение владельца 18.11: все 7 453 изображения из `audit/`, `tasks/`, `outputs/`, `research/` вынесены в закрытый архив и убраны из дерева (включая 6 названных файлов). Дополнительно: `upwork/projects/b2b-partner-portal/01.png` (P2), `upwork/cover-proof-sheet.png` (обложка Agent Ops), `public/media/linkedin/cases/featured-v3-contact-sheet.png` (карточка Agent Ops), OCR-дампы `07-ocr.json`, `07-og-ocr.json` | Раздел «P1» ниже: копии сверены побайтово (0 расхождений); детектор по оставшимся 772 изображениям — 1 находка, вынесена |
| P1 | Hero: EN/RU-слоганы, дубль роли, скриншоты 1440/390/360 | Тексты уже были верны (проверено по коду и в браузере). Дефектов hero нет. Найдены и исправлены два дефекта этапа 1 вне hero (пустая колонка диагностики PP, висящая фраза в Learn) | `evidence/home-*-first.png`, `evidence/home-*-full.png` (12), `evidence/section-*.png` (8) |
| — | Работоспособность после очистки | Typecheck, сборка, `check:content`, `check:css`, зеркала ДС, краулер этапа, браузерный smoke 13 страниц × 3 ширины | Раздел «Проверки» ниже; `evidence/smoke-results.json` |
| — | Отчёты | Этот файл; `stage-1.md` исправлен: коммиты `db55fde3`, `ec8f3569` опубликованы в GitHub | `stage-1.md`, раздел «Публикации» |

## P0: поиск A3/A5

Шаблоны (скрипт сканирует все отслеживаемые текстовые файлы, бинарные пропускает, значения в отчёт не выводит): доля закрытых обращений, CSAT, стоимость инцидента, дневной объём диалогов, число клиентов, размер команды и часовые пояса, число обещаний/возвратов; A5 — FTE, часы проверки, число проверяющих, доля обязательств, карточек в день. Дополнительно — поиск по формулировкам без чисел (`of contacts`, `contacts alone`, `full-time reviewers`, `диалогов в день`, `expired promotion`, `CSAT`) в `.md`, `.json`, `.log`, `.txt`, `.html`.

| Файл | Строки | Категория | Решение |
|---|---|---|---|
| `tasks/review-2026-11/case-frames.md` | 90 | A5 | значения → метки |
| `upwork/profile.md` | §5.1 (бывш. 445–479), 461, 463, 785, 798 | A3, A5, ссылка A1 | раздел снят, шаблоны без Agent Ops |
| `upwork/competitive-analysis.md` | 155 | A3 | → метки |
| `ds/screens/case.md` | 94, 145, 259 | A3, A5 | → метки |
| `src/components/CaseNumbers.astro` | 5–6 (комментарий) | A3, A5 | нейтральный пример |
| `research/portfolio-benchmark/*` (4 файла) | 33, 34, 42, 47–49, 87, 184, 322 | A3, A5 | → метки |
| `research/portfolio-rebuild-2026-10-03/case-plan.md` | 38 | A5 | → метки |
| `tasks/portfolio-rebuild/common/evidence.md` | 7–8 | A3, A5 | → метки |
| `tasks/robert-review-2026-10-07/{FIXES,project-sweep-claude/ISSUES,project-sweep/01-auto}.md` | 43, 68, 50 | A3, A5 | → метки |
| `audit/hiring-readiness-2026-08-28.md` | 70 | A5 | → метка |
| `tasks/robert-review-2026-10-07/reports/07-public-ocr.json` | весь файл | OCR кадров A2 | вынесен в архив |

Повторный скан: 12 совпадений, все ложные — координата `y` в `facts.json` (2), фрагмент sha256, прогресс `git checkout`, «fourteen screens» Partner Portal (4 копии), «fourteen text styles» Pawly (4 копии). Поиск по формулировкам: в тексте — только описание категории A3 в `evidence-inventory.md` без значений и аббревиатура CSAT в словарях сканеров. В QA-логах `audit/portfolio-*/logs/*.json` остались alt-тексты кадров прототипа Agent Ops (синтетические данные фикстур, не A3) — см. «Остаточные риски».

Безопасные факты об авторской роли (35 макетов, три роли, месяц, приёмка клиентом) в `cv/` и `linkedin/` не трогались: это опубликованное резюме и профили, их правка — только по слову владельца (PLAN-CHATS, «Git и выкладка», п. 4).

## P1: изображения

- **Проверено глазами:** 6 названных файлов `outputs/media-edge-audit/**` — производные P2 (`legacy-dashboard`) и L1 (`archive-catalog`); `legacy-*` в аудите Learn — скриншоты новой страницы кейса, не L1; `upwork/projects/b2b-partner-portal/01.png` — P2; `upwork/cover-proof-sheet.png` — содержит обложку Agent Ops; `Images/Main-screenshot*.png` — Partner Portal (P10, разрешено).
- **Детектор:** ORB + RANSAC + попиксельная проверка (NCC) по 157 удалённым кадрам (151 A2, 3 P2, 3 L1); положительные контроли на старых снимках главной найдены, ложные срабатывания на кадрах PP отсеяны. На 7 453 скриншотах `audit/ tasks/ outputs/ research/` полноты он не гарантировал (до этапа 1 Agent Ops стоял первым кейсом, почти любой снимок главной ниже hero его содержит), поэтому по решению владельца все они вынесены целиком. По оставшимся 772 изображениям репозитория — 1 находка (`public/media/linkedin/cases/featured-v3-contact-sheet.png`, NCC 0.96), вынесена.
- **Архив:** `D:\Design\Cases\Case\site-portfolio-archive\` (вне репозитория): `stage-1.1-screenshots/` — 7 453 изображения + 6 файлов этого прохода, побайтово сверены; `stage-1-removed/` — 2 108 файлов, удалённых на этапе 1, из `git archive 3d4ab8f0`; `README.md`. Текстовые отчёты аудитов остались в репозитории; ссылки из них на картинки ведут в архив по тем же путям.

## Hero и главная

| | EN | RU |
|---|---|---|
| H1 | Product designer who turns design decisions / into working interfaces. | Продуктовый дизайнер, который / доводит решения до кода. |
| Подзаголовок | из `positioning.md` | перевод тем же смыслом |
| Подпись роли над H1 | нет | нет |
| Кейсы | B2B Partner Portal, TRASSIR Learn | B2B-портал DSSL, TRASSIR Learn |
| Счётчик | 01 — 02 | 01 — 02 |

Скриншоты (реальный браузер, Chromium, локальная сборка текущего дерева, `prefers-reduced-motion: reduce`): `evidence/home-{en,ru}-{1440,390,360}-{first,full}.png`. Глазами: переносы заголовка без висячих слов, CTA и email в первом экране на всех ширинах, портрет справа от имени на мобильных и справа от подзаголовка на 1440, overflow 0.

## Дефекты, найденные и исправленные в этом проходе

| Где | Дефект (внесён на этапе 1) | Исправление | Доказательство |
|---|---|---|---|
| `/work/partner-portal`, EN/RU, ≥ bp-lg | После снятия архивных кадров левые 8 колонок диагностики пустые, наблюдения прижаты вправо | `PortalCase.astro`: без кадра наблюдения встают в колонку текста (`4 / -1`), одно правило через `:has()` | `evidence/section-pp-*.png` |
| `/work/learn`, EN/RU | Оставленная фраза об архиве висит в пустой колонке и повторяет вводный абзац | `LearnCase.astro`: фраза убрана; на ≥ bp-lg два сценария под колонкой текста в две колонки; мёртвое правило `.learn-archive` удалено | `evidence/section-learn-*.png` |

Токены и компоненты ДС не менялись; `check:css` — 0 мёртвых правил.

## Проверки (выполнены, команды и результаты)

| Проверка | Команда | Результат |
|---|---|---|
| Typecheck | `npx astro check` | 0 errors, 0 warnings, 164 hints (подсказки существовали до этапа) |
| Production build | `npx astro build` | 25 страниц, exit 0 |
| Контент | `npm run check:content` | 0 находок, 171 HTML |
| Scoped CSS | `npm run check:css` | 19 маршрутов, мёртвых правил 0 |
| Зеркала ДС | `diff ds/tokens.css src/styles/tokens.css`, `diff ds/motion.js src/scripts/motion.js` | идентичны |
| Краулер этапа по `dist/` | снятые маршруты и файлы не собраны; нет файлов с «agent»; локальные ссылки и картинки; кириллица на EN-страницах; счётчик | PASS: 171 HTML, 1 901 ссылка, главная EN/RU — 2 кейса, «01 — 02» |
| Sitemap | `dist/sitemap.xml` | 12 адресов: главная, about, partner-portal, learn, vet-clinic, pawly × EN/RU; Agent Ops нет |
| OG | `dist/og/` | карточек `work-agent-ops-console*` нет |
| Browser smoke | Playwright, 13 страниц (12 из sitemap + несуществующая) × 1440/390/360 | PASS: статусы 200 (404 для несуществующей), 0 ошибок консоли, 0 неудачных запросов к сайту, 0 битых картинок, overflow 0, первые три Tab-остановки видимы и со стилем фокуса, текст «Agent Ops» на страницах отсутствует, 132 внутренние ссылки — 200 |
| Next case | ссылки со всех кейсов | `/work/learn`, `/work/vet-clinic`, `/work/pawly`, `/work/partner-portal` (+ RU) — все существуют |
| Навигация | клик по шапке EN/RU, 1440 и 390 (мобильное меню) | About → `/about`, Work → `/#work`, Contact → `/#contact`; RU аналогично |
| EN-кадры глазами | сравнение текущего набора с просмотренным | 115 кадров на EN-страницах, все из ранее просмотренных 141; русский интерфейс был в 4 — 3 сняты, `workspace-1280` переснят (строка 38 — «outdoor cam 4mp», проверено открытием файла) |

**Замечание к smoke:** `<img src="">` у `MediaZoom` — заглушка, которую заполняет скрипт увеличения; она была и до этапа 1, в счёт битых картинок не входит.

## Что не проверено

- Реальный production kanarev.com и preview-деплои Vercel — доступа нет; проверка только на локальной сборке.
- Включена ли Deployment Protection, удалены ли старые деплои, доступен ли `agent-ops-console.vercel.app`.
- Полнота детектора по изображениям — не гарантирована; закрыто выносом всех скриншотов, а не детектором.
- Контраст отдельно не измерялся: тексты и цвета не менялись, токены не трогались.
- Safari/WebKit и Firefox — smoke только в Chromium.

## Остаточные точки распространения

1. **История публичного GitHub.** Все снятые файлы (A2, P2, L1), цифры A3/A5 и скриншоты — в прежних коммитах `main`, `course-v1.1`, `stage-0-criteria`, `stage-1-hotfix` (включая опубликованные `3d4ab8f0`, `0ee74eb5`, `db55fde3`, `ec8f3569`). Новый коммит их из истории не убирает. Закрывается приватностью репозитория или переписыванием истории — решение владельца.
2. **Production kanarev.com до merge** — прежняя версия: кейс Agent Ops, P2, L1, `/kit`, превью.
3. **Vercel**: прежние production- и preview-деплои kanarev.com — неизменяемые снимки; возможные preview веток `stage-1-hotfix`.
4. **`agent-ops-console.vercel.app`** — отдельный прототип A1, публичен на 18.11 (по `evidence-inventory.md`).
5. **Внешние копии:** Upwork (карточка Agent Ops, тексты профиля с цифрами A3), LinkedIn (Featured, проекты, `linkedin/*.md` — источник), опубликованное резюме `public/cv.pdf`, `public/cv-ru.pdf` и `cv/*` — ссылки на `/work/agent-ops-console`, после merge отдадут 404; кэш Google, OG-кэш соцсетей и мессенджеров.
6. **Другие найденные копии:** alt-тексты кадров прототипа Agent Ops (синтетические данные, не A3) в QA-логах `audit/portfolio-*/logs/*.json`, `tasks/robert-review-2026-10-07/**/logs/*.json`; ссылки на `agent-ops-console.vercel.app` в этих логах и в `TASK-adaptive-prototypes.md` (историческая запись задачи). Действующими рекомендациями не являются. Неизменённые `public/media/case-dssl/polish-before-resolution.webp`, `polish-after-resolution.webp` (P10, разрешено) содержат строку «камера 4мп уличная» — на опубликованных страницах не используются (ссылки только в старых данных историй), доступны по прямому адресу.

## Действия владельца

1. GitHub `site-portfolio` — сделать приватным или решить про историю (до следующего push).
2. Vercel — список деплоев, Deployment Protection или удаление старых preview kanarev.com и проекта `agent-ops-console`.
3. Резюме (`public/cv*.pdf`, `cv/*`) и LinkedIn — решить, чем заменить Agent Ops: ссылка станет 404 после merge.
4. Upwork — удалить карточку Agent Ops, текст профиля с цифрами; LinkedIn Featured.
5. Google Search Console — удаление снятых URL после выкладки.
6. Push ветки и затем «мержим stage-1» — после приёмки ChatGPT.

## Изменённые файлы

Без изображений — 34:

```
M .claude/skills/ru-cover-letter/references/evidence-ru.md
M .claude/skills/ru-cover-letter/references/examples-ru.md
M .claude/skills/ru-cover-letter/references/patterns-ru.md
M .claude/skills/upwork-proposal/SKILL.md
M .claude/skills/upwork-proposal/references/examples.md
M .claude/skills/upwork-proposal/references/patterns.md
M .claude/skills/upwork-triage/references/evidence.md
M .claude/skills/upwork-triage/references/proposal.md
M audit/hiring-readiness-2026-08-28.md
M ds/screens/case.md
M public/media/presentation/README.md
M research/portfolio-benchmark/case-blueprint/case-blueprint.html
M research/portfolio-benchmark/competitive_analysis_final.md
M research/portfolio-benchmark/competitor_ux_patterns.md
M research/portfolio-benchmark/fishki.md
M research/portfolio-rebuild-2026-10-03/case-plan.md
M scripts/shoot-cover-sources.mjs
M src/components/CaseNumbers.astro
M src/components/learn/LearnCase.astro
M src/components/portal/PortalCase.astro
M tasks/portfolio-rebuild/common/evidence.md
M tasks/review-2026-11/case-frames.md
M tasks/review-2026-11/stage-1.md
A tasks/review-2026-11/stage-1.1/REPORT.md
A tasks/review-2026-11/stage-1.1/evidence/ (20 PNG + smoke-results.json)
M tasks/robert-review-2026-10-07/FIXES.md
M tasks/robert-review-2026-10-07/project-sweep-claude/ISSUES.md
M tasks/robert-review-2026-10-07/project-sweep/01-auto.md
D tasks/robert-review-2026-10-07/reports/07-ocr.json
D tasks/robert-review-2026-10-07/reports/07-og-ocr.json
D tasks/robert-review-2026-10-07/reports/07-public-ocr.json
M upwork/competitive-analysis.md
M upwork/profile.md
M upwork/project-catalog.md
M upwork/projects/b2b-partner-portal/README.md
M upwork/tools/build-upwork-covers.ps1
```

Удалённые медиафайлы — 7 456 (изображения, видео, PDF; все вынесены в архив): 7 453 из `audit/`, `tasks/`, `outputs/`, `research/` (из них PNG/JPG/WebP: `audit/` 5 723, `tasks/` 1 301, `outputs/` 281, `research/` 92) + `upwork/` 2 + `public/` 1. Полный перечень — `git show --stat` итогового коммита.
