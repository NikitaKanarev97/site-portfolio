# Site-portfolio — кодовый слой

Astro + GSAP, компоненты `.astro`, деплой Vercel. Решение по стеку и обоснование — `ds/motion-concept.md` §2, следствия — `ds/CONTRACT.md` §Стек.

## Команды

```bash
npm install      # Windows: npm approve-scripts esbuild — иначе сборка не найдёт бинарь
npm run dev      # http://localhost:4321
npm run build    # статическая сборка в dist/
npm run preview  # предпросмотр собранного
npm run check    # astro check: типы и диагностика .astro
npm run check:css # мёртвые скоупленные правила: запускать ПОСЛЕ build
```

## Что где лежит

| Путь | Что это |
|---|---|
| `src/styles/tokens.css` | **зеркало** `ds/tokens.css` один в один |
| `src/scripts/motion.js` | **зеркало** `ds/motion.js` один в один |
| `src/styles/fonts.css`, `public/fonts/` | Manrope и JetBrains Mono, self-hosted (`TECH-15`) |
| `src/styles/global.css` | сброс, контейнер, `SkipLink`, начальные состояния движения |
| `src/layouts/BaseLayout.astro` | `ClientRouter`, preload шрифтов, инлайн-скрипт `.js`, единственный `<script>` продукта, именованный слот `footer` |
| `src/layouts/PageShell.astro` | оболочка маршрута: `BaseLayout` + `Navbar` + содержимое + `ContactBlock` + `Footer`. Реализация паттерна `PageShell` |
| `src/copy/` | слой текстов, отделённый от композиции. `site.ts` — сквозные строки, `home.ts` — строки главной |
| `src/scripts/animations.js` | хореография всех пяти движений словаря |
| `src/components/` | одиннадцать компонентов каталога `ds/components.md` |
| `src/pages/index.astro` | `Home` — главная. Собрана по `ds/screens/home.md` |
| `src/pages/about.astro` | `About` — собран по `ds/screens/about.md` |
| `src/pages/work/[slug].astro` | шаблон кейса, разворачивается из реестра `src/copy/cases/` |
| `src/pages/404.astro`, `src/pages/500.astro` | служебные страницы, `ds/screens/service.md` |
| `src/pages/ru/index.astro` | каркас русской локали. Механика — `src/copy/routes.ts` |
| `src/copy/routes.ts` | реестр маршрутов и локалей — единственный источник для `hreflang`, `sitemap.xml` и `robots.txt` |
| `src/copy/og.ts` | спека карточек превью: род страницы, название, подпись |
| `src/pages/og/[card].png.ts` | рендер карточек на билде: Satori → SVG с контурами → sharp → PNG |
| `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` | карта сайта и robots, оба растут из реестра маршрутов |
| `src/lib/tokens.ts` | чтение токенов и типографических ролей из `tokens.css` на билде. Билд-ассет, в браузер не уезжает |
| `scripts/og-fonts/` | статические TTF под Satori плюс лицензии OFL. Не путать с `public/fonts/` — это билд-ассет |
| `src/pages/kit.astro` | витрина компонентов — поверхность визуального QA. Съехала с `/` 2026-08-24: корень принадлежит `Home` |
| `ds/patterns.md` | композиции из компонентов: обложка кейса, карточка сборки, шапка кейса, оболочка страницы |

## Два правила, которые нельзя нарушать

**Зеркала совпадают побайтово.** Правка идёт в `ds/`, копия обновляется тем же коммитом:

```bash
diff ds/tokens.css src/styles/tokens.css && diff ds/motion.js src/scripts/motion.js
```

**Компонент не пишет анимаций.** Он объявляет движение атрибутом `data-motion`, хореографию ведёт `src/scripts/animations.js`. Словарь атрибутов — в шапке этого файла. Всё остальное — `ds/CONTRACT.md`, читать целиком перед любой задачей по интерфейсу.

## Сборка экранов

Финальные экраны собираются **боевыми маршрутами** в `src/pages/`, не песочницей: в коде экран и есть маршрут, а параллельная ветка страниц была бы вторым носителем той же страницы. Решение владельца от 2026-08-24, вместе с ним витрина съехала на `/kit`.

Composition map каждого экрана — `ds/screens/<name>.md`: из каких компонентов собран, какие токены задействованы, какие состояния приняты. Апрув карты идёт до вёрстки.

Тексты лежат в `src/copy/`, отдельно от композиции: три решения владельца по копирайтингу ещё открыты (`ia/open-questions.md`), а каркас RU-локали входит в MVP (`TECH-13`) — переписывание строк не должно трогать вёрстку.

Собрано: `Home` (`/`), `CaseDSSL` (`/work/partner-portal`), `About` (`/about`), служебный слой — `/404`, `/500`, каркас `/ru/`. Composition maps — `ds/screens/*.md`, там же чек-листы приёмки и то, что осталось проверить в браузере.

Маршрут кейса собран шаблоном `src/pages/work/[slug].astro` с первого кейса, а не после второго (`US-20`): новый кейс — файл в `src/copy/cases/` плюс строка в реестре `src/copy/cases/index.ts`, страница не меняется.

## Мета-слой и SEO

Три потребителя обязаны сходиться — `hreflang` в `BaseLayout`, `sitemap.xml` и `robots.txt`, — поэтому все трое растут из одного реестра `src/copy/routes.ts`. Пакет `@astrojs/sitemap` не ставится: он собрал бы карту из файлов в `src/pages` и включил бы туда витрину и страницы ошибок.

- Превью-режим (`PREVIEW_NOINDEX` в `src/copy/site.ts`) закрывает сайт целиком; `robots.txt` в этом режиме не отдаёт и строку `Sitemap`.
- `/kit` и каркас `/ru/` закрыты `noindex` собственным пропом — и после боевого запуска тоже.
- RU-локаль публикуется флагом `RU_PUBLISHED` в реестре маршрутов, **одновременно с появлением русских текстов**, не раньше.
- Карточки превью пересобираются на каждом билде из `src/copy` — руками их править негде и не нужно.

Настоящие HTTP-коды 404 и 500 — забота хостинга (`TECH-06`). Статическая сборка кладёт в `dist/` файлы `404.html` и `500.html`; Vercel отдаёт `404.html` с кодом 404 сам, кода 500 у статики не бывает вовсе.

Дальше по очереди: аудит консистентности (`/screens-audit`) → доступность и вёрстка → Lighthouse.
