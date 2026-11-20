# Stage 1.2 — финальные точечные исправления

Ветка `stage-1-hotfix`, base `ba91940a627d76ab2d46a07e66324f3bbcafed38`, один коммит поверх.
Статус: **READY FOR INDEPENDENT REVIEW**. Это не приёмка. Push, merge в `main` и деплой не выполнялись.

## 1. Замечания и исправления

| # | Замечание | Что сделано | Чем подтверждено |
|---|---|---|---|
| P0 | Готовые письма и рекомендации в навыках описывают Agent Ops как довод | Все копируемые тексты переписаны на разрешённые кейсы (подробно ниже). Строки-кейсы Agent Ops в таблицах доказательств сведены к записи ограничения «снят 18.11.2026 до проверки прав: не называть, не ссылаться, цифры не приводить», без описания и цифр. В таблицах «во что бить» Agent Ops нигде не стоит первым или вторым кейсом | Поиск в §4: в навыках и `upwork/` остались только записи ограничения и история |
| P0 | Баннер «~~Agent Ops Console~~ (снят) снят» с инструкцией «брать следующий кейс строки» | Баннер в 8 файлах исправлен на «Agent Ops Console снят»; инструкция заменена на «тексты и таблицы ниже переписаны на разрешённые кейсы; где Agent Ops остался — это запись ограничения, не довод» | `grep '(снят) снят'` — 0 |
| P2 | `scripts/shoot-cover-sources.mjs` зависит от `d:/Claude-projects/Agent-ops-console` | Playwright берётся из `../b2b-dssl` (переопределяется через `PLAYWRIGHT_REPO`), как в `shoot-learn-frames.mjs`. Скрипт снимает Partner Portal, так что зависимость от его репозитория естественна | Прогон `node scripts/shoot-cover-sources.mjs dssl-fulfillment`: оба кадра (EN, RU) сняты, файлы в `tmp/` (в `.gitignore`) |
| P2 | `upwork/project-catalog.md` ссылается на удалённый `agent-ops-console/README.md` §4 | Ссылка ведёт на `upwork/projects/b2b-partner-portal/README.md` §4. Туда перенесена спецификация 5:4 (замер плитки 384×306, диалог 4:3), без контента Agent Ops. Те же мёртвые ссылки исправлены в README Pawly и Vet Clinic OS | `grep 'agent-ops-console/README'` по `upwork/` — 0 |
| P2 | Другие действующие ссылки на удалённые файлы | Скан всех путей, удалённых на этапах 1 и 1.1 (9 567), по действующим файлам: корневые `*.md`, `.claude/skills`, `upwork`, `scripts`, `src`, `ds`, `cv`, `linkedin`. Исправлено: витрина `src/pages/kit.astro` в `README.md` и в двух местах `ds/components.md` описывалась как живая. Теперь она помечена как снятая на этапе 1 | Разбор оставшихся совпадений — §3, «Не исправлено намеренно» |
| P2 | Пунктуация после механических замен | Задвоенное «снят», двойная точка `(см. §5.1)..` в `upwork/profile.md`, непарная обратная кавычка в строке Agent Ops в `evidence.md` (ушла вместе со строкой) | Поиск по `(снят) снят`, `..`, непарным `` ` `` в заменённых строках — 0 |
| P2 | Bloomlex пустой на `stage-1.1/evidence/home-en-1440-full.png` | **Причина — момент съёмки, не код.** Обложки Webflow-сборок стоят с `loading="lazy"`. Полностраничный снимок 1.1 делался без прокрутки, поэтому ленивые картинки ниже первого экрана ещё не были запрошены. Проверено в Chromium на сборке: без прокрутки все четыре `complete=false, naturalWidth=0`; после прокрутки все четыре загружены (2000 px), неудачных запросов 0, на EN и RU одинаково. Код сайта не менялся. Съёмка исправлена: `capture.mjs` проматывает страницу до низа и ждёт `complete && naturalWidth > 0` у каждой `<img>` | `evidence/builds-en-1440.png`, `evidence/home-en-1440-full.png` — Bloomlex на месте |

### P0 — что именно переписано

Готовые тексты для отправки:

- `upwork-proposal/references/examples.md`
  - §1, строка ссылки: Partner Portal — «a distributor portal redesign that shipped in full on a backend that could not change. Client under NDA, every screen runs on fixture data».
  - §2: вторая ссылка — Partner Portal.
  - §4, «similar projects»: Partner Portal, Vet Clinic OS, Pawly, все со ссылками.
  - §4, «GitHub/website»: Partner Portal и Pawly. Оговорка про NDA теперь относится только к порталу: Pawly — собственный проект.
  - Строки «Форма», highlights: B2B Partner Portal, Vet Clinic OS, Pawly.
  - «three product cases» → «the product cases»: на сайте их больше трёх.
- `upwork-proposal/references/patterns.md` §2: строка-заготовка с консолью удалена, остальные четыре ссылки на месте.
- `ru-cover-letter/references/examples-ru.md`
  - Telegram-шаблон: «Живой прототип похожей консоли» → «Разбор редизайна B2B-портала: kanarev.com/ru/work/partner-portal».
  - Ответ «опыт с исследованиями»: консоль заменена работой в B2B-портале DSSL «от исследования до передачи в разработку» (формулировка из `evidence-ru.md`).
- `ru-cover-letter/references/patterns-ru.md`
  - Заготовка «Консоль контроля ИИ-агента…» удалена.
  - В шаблоне «несколько ролей» фраза про консоль убрана без замены: подтверждённого факта о ролях в Partner Portal в доказательной базе нет, придумывать его нельзя.
- `upwork/profile.md` §6.2, текст Employment для вставки: консоль убрана из перечня.
- `upwork/project-catalog.md`, «WHY ME»: перечень — портал, клиника, маркетплейс.

Рекомендации и таблицы выбора:

- `upwork-proposal/SKILL.md`, highlights: A/B — Partner Portal, Vet Clinic OS, Pawly; D — Partner Portal, Pawly и карточка UX audit.
- `upwork-triage/SKILL.md`, полоса A: козыри — Partner Portal, Vet Clinic OS.
- `upwork-triage/references/evidence.md`
  - Заголовок «восемь ссылок» → «семь».
  - Строка кейса сведена к ограничению.
  - Из «цифр, которые можно называть» убрано «19 экранов / 3 роли».
  - Строка NDA и четыре строки «во что бить» переведены на разрешённые кейсы. Где замены нет, стоит «—», а не натяжка.
- `upwork-triage/references/proposal.md`, шаблоны A и B: Partner Portal (для 0→1 — Vet Clinic OS), Pawly + Partner Portal.
- `ru-cover-letter/SKILL.md`, полоса A: козыри — Partner Portal, TRASSIR Learn.
- `ru-cover-letter/references/evidence-ru.md`
  - Ядро — два кейса (решение 11.09.2026, сужено 18.11.2026, согласуется с памятью «кейсы для писем»).
  - Строка кейса сведена к ограничению.
  - Цифра «35 макетов» убрана из списка для писем.
  - Граница заявлений: «не упоминается вовсе».
  - Таблица «во что бить»: девять строк переведены. Для AI-продукта и скорости честно указано, что прямого довода нет.
  - Сверка объёмов помечена как неактуальная для писем.
- `upwork/profile.md`
  - §10: запрос отзыва у заказчика Agent Ops помечен как снятый.
  - §11: формулировка `Paid client · user-tested · accepted` больше не идёт в overview и карточки.
  - §5: пометка о снятой карточке.

Факты и результаты не добавлялись: все новые формулировки взяты из тех же справочников (`evidence.md`, `evidence-ru.md`, `patterns.md`).

**Выход за список замечания.** Названы три файла, а исправлено десять файлов навыков и два файла `upwork/`. Критерий замечания — «любой готовый текст, который можно скопировать и отправить». Тот же дефект был в `patterns.md`, `SKILL.md` обоих upwork-навыков, трёх файлах `ru-cover-letter`, в `profile.md` §6.2 и в `project-catalog.md`.

## 2. Изменённые файлы

```
.claude/skills/ru-cover-letter/SKILL.md
.claude/skills/ru-cover-letter/references/evidence-ru.md
.claude/skills/ru-cover-letter/references/examples-ru.md
.claude/skills/ru-cover-letter/references/patterns-ru.md
.claude/skills/upwork-proposal/SKILL.md
.claude/skills/upwork-proposal/references/examples.md
.claude/skills/upwork-proposal/references/patterns.md
.claude/skills/upwork-triage/SKILL.md
.claude/skills/upwork-triage/references/evidence.md
.claude/skills/upwork-triage/references/proposal.md
PLAN-CHATS.md                                  статус этапа 1 → READY FOR INDEPENDENT REVIEW
README.md                                      kit.astro помечен снятым
ds/components.md                               kit.astro помечен снятым (2 места)
scripts/shoot-cover-sources.mjs                playwright из ../b2b-dssl
upwork/profile.md
upwork/project-catalog.md
upwork/projects/b2b-partner-portal/README.md   §4: спецификация 5:4 перенесена сюда
upwork/projects/pawly/README.md                мёртвые ссылки
upwork/projects/vet-clinic-os/README.md        мёртвая ссылка
tasks/review-2026-11/stage-1.2/REPORT.md       этот отчёт
tasks/review-2026-11/stage-1.2/capture.mjs     smoke и съёмка с догрузкой картинок
tasks/review-2026-11/stage-1.2/evidence/*      6 PNG + smoke-results.json
```

Код сайта (`src/`), токены, зеркала ДС, опубликованные CV, `cv/*`, `linkedin/*` и архивы не менялись.

## 3. Проверки

| Проверка | Команда | Результат |
|---|---|---|
| Типы | `npx astro check` | 0 ошибок, 0 предупреждений (164 hints) |
| Сборка | `npx astro build` | 25 страниц, Complete |
| Контент | `npm run check:content` | 0 находок |
| Scoped CSS | `npm run check:css` | мёртвых правил 0 |
| Зеркала ДС | `cmp ds/tokens.css src/styles/tokens.css`, `cmp ds/motion.js src/scripts/motion.js` | совпадают |
| Browser smoke | `node tasks/review-2026-11/stage-1.2/capture.mjs` по `astro preview`, Chromium. 6 страниц × EN/RU × 1440/390 = 24 прогона | Все 200, ошибок консоли 0, неудачных запросов к сайту 0, видимых незагруженных картинок 0, горизонтального переполнения 0, текст «Agent Ops» на страницах 0. Скрытые картинки (закрытые `<dialog>` разборов сборок, кадры, скрытые на 390) браузер лениво не запрашивает. Они проверены прямым запросом: 22 проверки, все 200. Детали — `evidence/smoke-results.json` |
| Повторный кадр Bloomlex | тот же скрипт | `evidence/builds-en-1440.png` — четыре обложки, Bloomlex с цветком; `evidence/home-en-1440-full.png` |
| Agent Ops в навыках и `upwork/` | `grep -rniE 'agent ops\|agent-ops\|ссылка снята\|oversight\|консол\|ии-агент\|19 screens\|19 экран\|35 макет'` | В готовых текстах и таблицах выбора — 0. Остались: баннеры и строки-ограничения (8 баннеров, 2 строки таблиц, граница в `evidence-ru.md`), история в `upwork/profile.md` (§5.1 «снято», §11 факт 31.08 с пометкой), `project-catalog.md` (строки «снято»), «заведён по образцу пакета agent-ops-console» в трёх README пакетов, `upwork-cover-research.md` (исследование обложек), `competitive-analysis.md:271` (история плана) |
| Ссылки на удалённые файлы | скан путей, удалённых на этапах 1–1.1, по действующим файлам | Исправлены 3 места про `kit.astro` и 5 ссылок в `upwork/`. Остальное — §3, «Не исправлено намеренно» |

**Доказательства** (`tasks/review-2026-11/stage-1.2/evidence/`):

- `home-en-1440-full.png`, `home-ru-1440-full.png`, `home-en-390-full.png`, `home-ru-390-full.png` — главная целиком, после догрузки всех картинок;
- `builds-en-1440.png`, `builds-ru-1440.png` — секция Webflow-сборок;
- `smoke-results.json` — 24 прогона.

**Не исправлено намеренно** (не действующие рекомендации, не публично на сайте):

- Поля `source` в `src/data/{partner-portal-v2,learn-v2,vet-v2,vet-v3}-media.json` (214 совпадений) — запись происхождения кадров из `audit/`, ушедшего в закрытый архив. В рантайме они не читаются: сборка и smoke без битых картинок.
- Комментарии в `src/pages/index.astro:114`, `src/copy/home.ts:98`, `ds/screens/*.md`, `ds/patterns.md`, `ds/foundation.md`, `ds/motion-concept.md`, `ds/logo.md` ссылаются на снятые документы. Это история обоснований, не инструкции.
- Разовые скрипты прошлых этапов (`scripts/crop-artifacts.mjs`, `scripts/build-linkedin-assets.mjs`, `scripts/b2b-v3/make-boards.mjs`, `scripts/b2b-v31/crop-archive.mjs`, `scripts/verify-case-{controls,resize}.mjs`) читают снятые файлы. Действующим пайплайном они не запускаются.
- `PLAN-CHATS.md:80` — промпт закрытого этапа 0. `RECHECK-*.md`, `PLAYBOOK-product-upgrade.md:231` — записи прошлых проходов.

## 4. Внешние риски — решение владельца

1. **История публичного GitHub.** Снятые материалы, цифры A3/A5 и скриншоты лежат в прежних коммитах `main`, `course-v1.1`, `stage-0-criteria` и `stage-1-hotfix` до `ba91940a`. Этот коммит их из истории не убирает. Закрывается приватностью репозитория или переписыванием истории. Приватность закроет доступ и внешнему ревьюеру без подключённого GitHub.
2. **Production kanarev.com** показывает Agent Ops до merge этой ветки и деплоя.
3. **Vercel:** прототип `agent-ops-console.vercel.app` и старые preview-деплои портфолио.
4. **Опубликованное резюме** `public/cv.pdf`, `public/cv-ru.pdf`, `cv/*` ведёт на `/work/agent-ops-console` — после merge будет 404. По правилам этапа резюме не трогалось.
5. **Upwork и LinkedIn:** карточка и тексты профиля с Agent Ops. Файлы в репозитории исправлены, опубликованные профили — нет.
6. **Кэши** Google, OG-превью соцсетей и мессенджеров.

## 5. Backlog (не блокирует этап)

- Ещё 22 скрипта в `scripts/` берут playwright через `createRequire('D:/Claude-projects/Agent-ops-console/package.json')`. Если репозиторий Agent Ops уйдёт с диска, они сломаются. Переводить на `PLAYWRIGHT_REPO` одной правкой вне этого этапа.
- `audit/`-пути в полях `source` media JSON можно переписать на путь в архиве или удалить поле.
- Комментарии со ссылками на `ds/screens/case-agent-ops.md` переписать, когда будет пересобираться главная (этапы 2+).
- Расхождение «35 макетов / 19 экранов» в `HHH/README.md` §5 — вместе с решением по резюме.
