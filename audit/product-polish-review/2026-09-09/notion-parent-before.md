<callout icon="🚀">
	**Четыре этапа от ТЗ заказчика до работающего прототипа — и пятый, для уже выпущенного продукта.**
	Каждый этап — набор шагов. Раньше шаг начинался с того, что в чат прикладывался файл директивы. Теперь директив нет: достаточно сказать задачу словами, нужный навык поднимается сам.
	**5 этапов · \~45 навыков**
</callout>
## Как это работает
Раньше каждый шаг начинался с того, что в чат прикладывался файл директивы. **Теперь директив нет — есть навыки.** Достаточно сказать задачу словами: нужный навык поднимается сам по описанию.
В каждом шаге всех этапов есть строка **Скажи** — это и есть фраза, с которой шаг начинается. Не заклинание: формулировать можно своими словами, важен смысл.
```plain text
говоришь задачу словами → навык поднимается сам → шаг идёт по своей процедуре
```
Если хочется вызвать явно — `/имя-навыка`. Список всех — спросить «какие навыки доступны».
<callout icon="✋" color="orange_bg">
	**Пять навыков вызываются только руками**, потому что у них последствия наружу: `/deploy`, `/handoff`, `/dashboard`, `/prd-notion`, `/release-environment`. Сам агент их не запустит.
</callout>
Навыки лежат в `~/.claude/skills/` и работают **во всех проектах**, не только в текущем.
## Карта этапов
<table header-row="true">
<tr>
<td>Этап</td>
<td>Роль</td>
<td>Вход</td>
<td>Выход</td>
</tr>
<tr>
<td>1</td>
<td>**AI Strategist**</td>
<td>ТЗ заказчика</td>
<td>PRD, исследование, персоны, приоритизация</td>
</tr>
<tr>
<td>2</td>
<td>**System Architect**</td>
<td>PRD</td>
<td>IA, wireframes, дизайн-система, собранные экраны</td>
</tr>
<tr>
<td>3</td>
<td>**Visual Engineer**</td>
<td>собранные экраны</td>
<td>бренд-направление и серия ассетов</td>
</tr>
<tr>
<td>4</td>
<td>**AI Prototyper & Agents**</td>
<td>финальный макет</td>
<td>работающий прототип, тестовые прогоны, находки</td>
</tr>
<tr>
<td>5</td>
<td>**Product Polish**</td>
<td>выпущенный продукт</td>
<td>поднятый UI, вторая локаль, переснятый кейс</td>
</tr>
</table>
## Этапы
### [1 — AI Strategist](https://app.notion.com/p/3b82eeb7cb4481b5897fdb6a1bf0d31f)
От ТЗ заказчика до PRD за один прогон. Рекурсивный брифинг, быстрый и глубокий ресёрч с проверкой цифр, конкурентный анализ, UX-аудит конкурента, персоны, симулированное интервью, приоритизация, PRD.
**9 шагов · 2 обязательных подшага · 17 артефактов**
### [2 — System Architect](https://app.notion.com/p/3bb2eeb7cb44818eb65dfe2da213af63)
От PRD до собранных экранов. Информационная архитектура, low-fi wireframes, дизайн-система с контрактом, UI-кит, матрицы состояний, два захода за референсами в Mobbin, финальные экраны, аудит консистентности.
**10 навыков · 11 шагов · 2 развилки**
### [3 — Visual Engineer](https://app.notion.com/p/3bb2eeb7cb4481239b54fbf5342214f4)
От бренд-направления до серии продакшен-готовых ассетов в одном стилевом языке: JSON-промпт серии, выбор подхода и модели, генерация, апскейл, форматы, промо-ролик.
**2 навыка · 8 шагов · 2 развилки**
### [4 — AI Prototyper & Agents](https://app.notion.com/p/3bb2eeb7cb448123a98af318dda8e2a1)
От макета до работающего прототипа: перенос ДС в код, каталог компонентов, экраны, оживление, публикация, дашборд прогонов, агентское тестирование с циклом «находка → фикс → ретест».
**10 шагов · 3 только руками**
### [5 — Product Polish](https://app.notion.com/p/3d62eeb7cb4481329185ff0bdbcb81fb)
От выпущенного продукта до кейса, который продаёт уровень работы. Опись и baseline, аудит по группам экранов, системные причины, референсы и бриф, пилот на трёх экранах, перенос волнами, приёмка, вторая локаль прототипа, пересъёмка кейса.
**11 шагов · 3 навыка · 1 опциональный**
---
## Шпаргалка: фраза → навык
Все 45 навыков. Формулировать можно своими словами — важен смысл, не точная фраза.
### Исследование и продукт
<table fit-page-width="true" header-row="true">
<tr>
<td>Скажи</td>
<td>Навык</td>
</tr>
<tr>
<td><span color="orange">«Собери бриф по проекту, вот ТЗ заказчика»</span></td>
<td>`recursive-briefing`</td>
</tr>
<tr>
<td><span color="orange">«Прогони быстрый конкурентный ресёрч»</span></td>
<td>`quick-research`</td>
</tr>
<tr>
<td><span color="orange">«Сделай глубокое исследование рынка — нужны источники и цифры»</span></td>
<td>`deep-research`</td>
</tr>
<tr>
<td><span color="orange">«Собери финальный конкурентный анализ»</span></td>
<td>`competitive-analysis`</td>
</tr>
<tr>
<td><span color="orange">«Проведи UX-аудит по эвристикам Нильсена»</span></td>
<td>`ux-audit`</td>
</tr>
<tr>
<td><span color="orange">«Сделай прото-персоны»</span></td>
<td>`personas`</td>
</tr>
<tr>
<td><span color="orange">«Проведи интервью от лица персоны»</span></td>
<td>`simulated-interview`</td>
</tr>
<tr>
<td><span color="orange">«Приоритизируй фичи по MoSCoW, определи scope MVP»</span></td>
<td>`scope-prioritization`</td>
</tr>
<tr>
<td>`/prd-notion` — **только руками**</td>
<td>`prd-notion`</td>
</tr>
</table>
### Архитектура и дизайн-система
<table fit-page-width="true" header-row="true">
<tr>
<td>Скажи</td>
<td>Навык</td>
</tr>
<tr>
<td><span color="orange">«Подключи Figma MCP»</span> — дальше поднимается сам при любой работе с макетом</td>
<td>`figma-mcp`</td>
</tr>
<tr>
<td><span color="orange">«Преврати PRD в sitemap и user flow»</span></td>
<td>`prd-to-sitemap`</td>
</tr>
<tr>
<td><span color="orange">«Сделай low-fi wireframes»</span></td>
<td>`wireframes`</td>
</tr>
<tr>
<td><span color="orange">«Поставь дизайн-систему с нуля»</span></td>
<td>`ds-baseline`</td>
</tr>
<tr>
<td><span color="orange">«Проиндексируй существующую ДС из Figma»</span></td>
<td>`ds-scan`</td>
</tr>
<tr>
<td><span color="orange">«Добавь в UI-кит недостающие компоненты»</span></td>
<td>`grow-ui-kit`</td>
</tr>
<tr>
<td><span color="orange">«Дополни матрицы вариантов и состояний»</span></td>
<td>`component-variants`</td>
</tr>
<tr>
<td><span color="orange">«Сверь структуру ключевых экранов с живыми паттернами Mobbin»</span> — **до** сборки</td>
<td>`mobbin-structure`</td>
</tr>
<tr>
<td><span color="orange">«Собери финальный экран \<имя\> в Figma»</span></td>
<td>`final-screens`</td>
</tr>
<tr>
<td><span color="orange">«Проверь консистентность экранов с ДС»</span></td>
<td>`screens-audit`</td>
</tr>
<tr>
<td><span color="orange">«Сверь финальные экраны с Mobbin и доведи UX/UI»</span> — **после** сборки и аудита</td>
<td>`mobbin-finalization`</td>
</tr>
<tr>
<td><span color="orange">«Перенеси правки из Figma в локальные файлы»</span></td>
<td>`figma-local-sync`</td>
</tr>
</table>
### Визуал и движение
<table fit-page-width="true" header-row="true">
<tr>
<td>Скажи</td>
<td>Навык</td>
</tr>
<tr>
<td><span color="orange">«Собери визуальное бренд-направление»</span></td>
<td>`brand-visual-direction`</td>
</tr>
<tr>
<td><span color="orange">«Интерфейс работает, но ощущается сыро»</span></td>
<td>`emil-design-eng`</td>
</tr>
<tr>
<td><span color="orange">«Добавь анимацию \<чего\>»</span></td>
<td>`gsap-core`</td>
</tr>
<tr>
<td><span color="orange">«Сделай последовательность анимаций»</span></td>
<td>`gsap-timeline`</td>
</tr>
<tr>
<td><span color="orange">«Привяжи анимацию к скроллу, параллакс, пин»</span></td>
<td>`gsap-scrolltrigger`</td>
</tr>
<tr>
<td><span color="orange">«Анимация в React / Next.js»</span></td>
<td>`gsap-react`</td>
</tr>
<tr>
<td><span color="orange">«Анимация во Vue / Nuxt / Svelte»</span></td>
<td>`gsap-frameworks`</td>
</tr>
<tr>
<td><span color="orange">«Нужен плагин GSAP: Flip, Draggable, SplitText, ScrollSmoother»</span></td>
<td>`gsap-plugins`</td>
</tr>
<tr>
<td><span color="orange">«Хелперы gsap.utils: clamp, mapRange, random, snap»</span></td>
<td>`gsap-utils`</td>
</tr>
<tr>
<td><span color="orange">«Анимация тормозит, дёргается, не держит 60fps»</span></td>
<td>`gsap-performance`</td>
</tr>
<tr>
<td><span color="orange">«Сделай раскадровку промо-ролика»</span></td>
<td>`video-storyboard`</td>
</tr>
</table>
### Код, прототип, проверка
<table fit-page-width="true" header-row="true">
<tr>
<td>Скажи</td>
<td>Навык</td>
</tr>
<tr>
<td><span color="orange">«Разверни React и перенеси ДС в код»</span></td>
<td>`react-base`</td>
</tr>
<tr>
<td><span color="orange">«Собери каталог компонентов в Storybook»</span></td>
<td>`storybook`</td>
</tr>
<tr>
<td><span color="orange">«Собери экран \<имя\> в React из компонентной базы»</span></td>
<td>`screens`</td>
</tr>
<tr>
<td><span color="orange">«Оживи экраны: навигация, данные, состояния»</span></td>
<td>`wire`</td>
</tr>
<tr>
<td><span color="orange">«Вынеси контент в CMS, чтобы правился без кода»</span></td>
<td>`directus-cms`</td>
</tr>
<tr>
<td>`/deploy` — **только руками**</td>
<td>`deploy`</td>
</tr>
<tr>
<td>`/handoff` — **только руками**</td>
<td>`handoff`</td>
</tr>
<tr>
<td>`/dashboard` — **только руками**</td>
<td>`dashboard`</td>
</tr>
<tr>
<td><span color="orange">«Прогони синтетический тест сценария и запиши находки»</span></td>
<td>`agent-qa`</td>
</tr>
<tr>
<td>`/release-environment` — **только руками**</td>
<td>`release-environment`</td>
</tr>
</table>
### Доводка выпущенного продукта
<table fit-page-width="true" header-row="true">
<tr>
<td>Скажи</td>
<td>Навык</td>
</tr>
<tr>
<td><span color="orange">«Продукт работает, но выглядит плоско — заведи прогон визуальной доводки»</span></td>
<td>`product-polish`</td>
</tr>
<tr>
<td><span color="orange">«Сделай русскую версию прототипа и свяжи её с сайтом»</span></td>
<td>`prototype-i18n`</td>
</tr>
<tr>
<td><span color="orange">«Обнови кейс в портфолио после доводки прототипа»</span></td>
<td>`case-refresh`</td>
</tr>
</table>
### Субагенты
Вызываются не фразой, а по задаче — когда нужен разбор без простыней в контексте.
<table fit-page-width="true" header-row="true">
<tr>
<td>Когда</td>
<td>Субагент</td>
</tr>
<tr>
<td><span color="orange">«Где </span><span color="orange">`ds/`</span><span color="orange">, код и Storybook разошлись»</span></td>
<td>`ds-parity-auditor`</td>
</tr>
<tr>
<td><span color="orange">«Какие находки открыты, что регрессировало»</span></td>
<td>`qa-findings-analyst`</td>
</tr>
</table>
---
## Как устроен каждый шаг
Одна схема на все этапы:
- **Скажи** — что сказать в чат, чтобы поднялся нужный навык
- **Навык** — какой навык за это отвечает
- **Что ещё приложить** — файлы, ссылки, скриншоты, которых у агента нет
- **Что происходит** — что делает агент
- **Результат** — какие файлы и узлы появляются
- **Зачем дальше** — как это используется потом
Порядок шагов не случаен. Пропуск не ломает цепочку формально, но обедняет всё, что идёт после.
## Четыре правила, общие для всех этапов
**1. Текст перед канвасом и перед кодом.** Структурная ошибка в `.md` правится бесплатно, в Figma или в коде — переделкой.
**2. Неизвестное остаётся неизвестным.** Открытые вопросы, ограничения покрытия, пометки «требует проверки» переносятся дальше явно, а не заполняются правдоподобным текстом.
**3. Чинится источник, а не зеркало.** При расхождении первый вопрос — не «как согласовать», а «какая сторона неверна». Патч в месте, где расхождение стало видно, прячет дефект и оставляет источник сломанным для всех ниже.
**4. Навыки — живые документы.** Найденное расхождение между навыком и реальностью дописывается в навык, а не остаётся в чате. Переиспользуемое идёт в навык, факты конкретного проекта — в проектные логи.
---
## Страницы этапов
<page url="https://app.notion.com/p/3bb2eeb7cb44818eb65dfe2da213af63">Этап 2 — System Architect: от PRD до собранных экранов</page>
<page url="https://app.notion.com/p/3bb2eeb7cb4481239b54fbf5342214f4">Этап 3 — Visual Engineer</page>
<page url="https://app.notion.com/p/3bb2eeb7cb448123a98af318dda8e2a1">Этап 4 — AI Prototyper & Agents</page>
<page url="https://app.notion.com/p/3b82eeb7cb4481b5897fdb6a1bf0d31f">Playbook: от ТЗ заказчика до PRD за один прогон</page>
<page url="https://app.notion.com/p/3d62eeb7cb4481329185ff0bdbcb81fb">Этап 5 — Product Polish</page>
