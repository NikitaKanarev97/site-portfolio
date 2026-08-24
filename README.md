# Site-portfolio — кодовый слой

Astro + GSAP, компоненты `.astro`, деплой Vercel. Решение по стеку и обоснование — `ds/motion-concept.md` §2, следствия — `ds/CONTRACT.md` §Стек.

## Команды

```bash
npm install      # Windows: npm approve-scripts esbuild — иначе сборка не найдёт бинарь
npm run dev      # http://localhost:4321
npm run build    # статическая сборка в dist/
npm run preview  # предпросмотр собранного
npm run check    # astro check: типы и диагностика .astro
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

Собрано: `Home` (`/`) и `CaseDSSL` (`/work/partner-portal`). Composition maps — `ds/screens/home.md` и `ds/screens/case-dssl.md`, там же чек-листы приёмки и то, что осталось проверить в браузере.

Маршрут кейса собран шаблоном `src/pages/work/[slug].astro` с первого кейса, а не после второго (`US-20`): новый кейс — файл в `src/copy/cases/` плюс строка в реестре `src/copy/cases/index.ts`, страница не меняется.

Дальше по очереди: `About` → 404/500 → каркас `/ru/`.
