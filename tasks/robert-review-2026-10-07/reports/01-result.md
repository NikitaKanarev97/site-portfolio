# 01 — Типографика, цвета и ритм

07.10.2026, локальный результат. Основа, Onest и активные OG готовы; оставшиеся общие зависимости перечислены ниже и в [01-requests.md](01-requests.md). Общий commit/push/deploy не выполнялся.

## Что изменено

- Завершено подключение Onest во всех display/body/meta ролях. Два локальных WOFF2 из `@fontsource-variable/onest` 5.3.1, variable axis 100–900, EN/RU с Ё/ё, OFL рядом. Latin preload на страницах, дополнительный Cyrillic preload на RU. OG получает статические Onest 400/500/800 TTF с кириллицей и без fvar. Метаданные сайта пропорциональные; собственные шрифты документального UI сохранены.
- Сохранены проверенные ступени Home 36/64/80/112 px и section-gap 128/192 px. На Home широкий заголовок и новая композиция имеют достаточный промежуток до работ; внутренние пары остаются на меньших flow-ступенях. Уменьшать общую шкалу ради отдельных переносов в кейсах оснований нет.
- Акцент насыщеннее: default #D43220, hover #B52B1B, pressed #842014, inverse #FF8A75. Default даёт 4.91:1 на белом и 4.58:1 на бумаге. Inverse даёт 5.72:1 на Agent и 4.93:1 на Learn. Все 20 проверенных text/focus пар проходят свои пороги AA/3:1.
- Portal использует общий `surface-cover-portal` → lavender-100 #DDD5FF вместо голубого. Пакет 04 использует этот токен на Home/cover. Исходные UI не перекрашены.
- Добавлен `focus-ring-color-on-inverse` и hook `data-focus-tone="inverse"`; тёмные CaseCover/CaseNext и diagram получают эту роль в общем слое. Владелец FeaturedCase/WorkStage применил hook к Agent/Learn, белые внешние шапки сохраняют обычный focus.
- Все страницы теперь ссылаются на генерируемые `/og/*-onest.png`, старые `/og/*.png` совместимы. Это устраняет прежние статические OG с Manrope/mono и обновляет URL для кешей соцсетей. Три EN карточки Agent/Portal/Vet заново рендерят левую половину в Onest; правая половина содержит **точно те же декодированные пиксели**, что исходный PNG. В активном Vet OG и alt запрещённая статусная плашка удалена без замены другой оправдательной меткой.
- Общие Foundation, каталог компонентов, паттерны, logo и карта Home обновлены по фактическим изменениям пакетов 02–06. Актуальные записи явно заменяют исторические варианты. Учтено CONTENT-RULES.md.

## Проверка

| Проверка | Результат |
|---|---|
| `npm run check` | Последний прогон: 130 файлов, **0 errors, 0 warnings**, 265 hints. Предыдущая ошибка proof eyebrow в соседнем Vet исправлена владельцем до повторного прогона |
| `npm run build -- --outDir outputs/typography-robert/dist` | PASS, 36 страниц, отдельный каталог; штатный shared dist не заменён этой командой |
| `npm run check:css` + дополнительные RU/Learn маршруты | PASS, 0 мёртвых scoped правил |
| Тот же CSS-checker на собственном dist | PASS, 0 мёртвых правил; изменены только пути проверяемого каталога |
| `npm run check:harmony`, `/kit`, 1440/360 | PASS |
| Расширенный harmony: 15 маршрутов × 1440/360 | 4 нарушения — одиночные слова в мобильных заголовках, см. зависимости. Plate geometry, editorial ceilings, кадры и overflow по метрике checker прошли. Этот прогон использует реальную эмуляцию reduced-motion |
| Browser/CUA: 15 маршрутов × 1440/360 | Onest в h1 и meta, loaded font check на фактическом тексте; RU кириллица загружена, preloads корректны. Home 36/112; About/kit 32/96; Agent 48/128; прочие cover 32/64. На 29 замерах overflow 0; RU Vet mobile показывает 2 px по `scrollWidth-clientWidth` |
| Keyboard focus | `:focus-visible` и 2 px outline: #D43220 на светлом, #FF8A75 на Agent/Learn. Измерения в focus.json |
| Font/asset audit | PASS: hashes Fontsource, cmap, axes/weights, OFL; tokens побайтово равны. 14 новых OG имеют 1200×630; все 36 page OG URL существуют; три documentary half идентичны источнику |

Маршруты: `/`, `/about`, `/work/{agent-ops-console,partner-portal,learn,vet-clinic,pawly}`, те же семь RU маршрутов и `/kit`. Width 1440/360; CUA height 1000/900. EN не обязан загружать Cyrillic face до появления кириллического текста: ранний fontRU=false в EN замерах ожидаем, это не подмена фактических EN глифов.

Стабильное static preview на `http://127.0.0.1:4401/` обслуживает собственный dist, обходя гонку `.astro/data-store.json.tmp` между соседними dev/build. Финальная общая сборка и сквозной content-check остаются координатору/пакету 07 по новому экономному порядку.

Доказательства в `outputs/typography-robert/`: `check-final.log`, `build.log`, `css-shared.log`, `css-isolated.log`, `harmony-kit.log`, `harmony.log`, `browser-matrix.json`, `focus.json`, `font-audit.json`, `contrast.json`, `og-audit.json`. Визуально проверены завершённые Home EN/RU 1440/360 и новые OG; файлы `home-en-*.jpg`, `home-ru-*.jpg` сохранены после вступления. Остальные first-screen captures матрицы могут содержать промежуточное состояние движения; они подтверждают маршруты, но не заменяют финальную визуальную приёмку координатором. Саму матрицу повторно не запускал.

## Точные файлы

`ds/tokens.css`, `src/styles/tokens.css`, `src/styles/fonts.css`, `src/layouts/BaseLayout.astro`, `src/pages/og/[card].png.ts`, `src/copy/og.ts`, `package.json`, `package-lock.json`; `public/fonts/onest-{latin,cyrillic}-wght-normal.woff2`, `public/fonts/OFL-Onest.txt`; `scripts/og-fonts/Onest-{400,500,800}.ttf`, `scripts/og-fonts/OFL-Onest.txt`; `ds/{foundation,components,patterns,logo}.md`, `ds/screens/home.md`; собственные `outputs/typography-robert/*` и `reports/01-*.md`.

Onest и изменения BaseLayout/dependencies продолжены из переданного незакоммиченного результата. Старые Manrope/JetBrains зависимости оставлены для независимых CV/LinkedIn build-скриптов, которые всё ещё их используют. Компоненты соседних владельцев не редактировались.

## Конкретные зависимости

1. **Координатор / редактор текстов:** четыре мобильных thesis: EN Portal «Keep the request beside the candidates»; EN Learn «Show the answer before asking for trust»; RU Agent «Прототип принят»; RU Vet «След за время паузы». Нужна короткая связная редакция, затем адресный harmony этих строк. Они не исправляются уменьшением общих кеглей.
2. **Координатор, CaseCover:** отдельный proof/interlock полного Agent всё ещё рисует pause-gate; заменить тем же SVG человека из Home, сохранив motion hooks. Пакет 03 также зафиксировал обрезанный RU Agent lead на 360; оба запроса вне владения 01.
3. **Координатор, общий экран/карусель:** RU Vet 360 имеет 2 px разницы scrollWidth/clientWidth после вступления. Выходящих элементов вне внутренних scroller не найдено; checker с innerWidth это не отмечает. Проверить локальную геометрию, не менять глобальные токены без причины.
4. **Пакет 07:** проверить старые доступные `public/media/linkedin/og/*`, их генератор, PDF и остальные публичные материалы по CONTENT-RULES.md. Активный новый Vet OG/alt исправлен; старый источник с прежней плашкой оставлен для документальной половины и не переписывается пакетом 01. Сквозная редакционная приёмка ещё не объявляется завершённой.

Документальные пиксели, чужие правки и существующая хореография сохранены. Общие межпакетные спецификации ДС внесены; новых требований к токенам от 02–06 не осталось.
