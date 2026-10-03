# CaseStory — frozen Common A interface

**G-01 · 04.10.2026:** actual specimen captures имеют прозрачный фон и bleed 2 CSS px для полной обводки. CaseSpecimen передаёт `CaseScreen native`, который сохраняет alpha-контур продукта без дополнительной рамки/маски портфолио. `nativeWidth` включает capture bleed. Story/schema, ID и EN/RU-структура не менялись. Владение общим слоем после приёмки A передано G; запросы — в integration/common-requests.md.

04.10.2026. Рабочая база B–E. Типы — `src/copy/cases/story.ts`, исполняемая композиция — `src/components/CaseStory.astro`. Этот контракт заменяет фиксированные 10 секций. Исторический kit fixture `LegacyKitStory` остаётся только демонстрацией старых модулей; нового legacy story renderer нет.

## Story и ответственность

```ts
CaseStory = { theme, plate, cover, facts, blocks: CaseBlock[], prototype? }
CaseBlock = { id, type, payload, evidenceId?, mediaId?, motion? }
```

Cover/facts до blocks. Порядок средних модулей выбирается по доказательной ценности; число не фиксировано. `next: { href, title, theme, label }` приходит извне в renderer, не хранится в story. Все ссылки нативные. Cover/facts/theme/prototype и Shot/Callout/Thesis сохраняют свои прежние сигнатуры. `ShotItem.nativeWidth?` — документальная ширина CSS capture, чтобы маленький настоящий контрол не увеличивался на всю колонку.

ID — kebab-case, стабильный между локалями/итерациями. `defineStory()` ловит повторы и неразрешённое движение. `assertStoryPair(en, ru)` проверяет порядок, IDs/types, evidence/media, motion и IDs состояний specimen. Использовать обе функции в case data. Строки локализуются, media и geometry share. Поддержка EN/RU не означает выдуманный перевод UI внутри кадров: язык источника сохраняется и называется.

| type | payload | motion |
|---|---|---|
| thesis | Thesis | reveal / static |
| numbers | thesis, items, note? | count / static |
| artifact | thesis?, artifact: data + caption + source | draw / static |
| comparison | thesis, issue: Callout, after?: Shot | reveal / static |
| process | thesis, slides, captions | reveal / static |
| steps | label, items, composition?, gate? | focus / pin-swap / static |
| shot | thesis?, shot | reveal / static |
| detail | thesis, callout | reveal / static |
| specimen | thesis?, specimen | reveal / static |
| outcome | result: Thesis, evidence, tradeoff, nextEvidence?, cards?, quote? | count / static |

Outcome требует `evidenceId`, evidence.text и tradeoff.text. Качественный result полноценен. Optional cards/quote сохраняют старые возможности CaseImpact; без карточек пустой grid не появляется. Продуктовая ценность и версия доказательства — задача автора case data и evidence.md. `TODO(owner)`/неподтверждённые проценты не публикуются.

Motion — только варианты реестра; в data нет GSAP callbacks/vars/selectors/timing. Defaults отдельных модулей сохраняются; `static` отключает исполнение для всего блока и оставляет текст видимым при JS. Checkpoint — opt-in Agent Ops, не универсальный центральный сюжет. CaseNext: без ручной/hover/focus паузы; видимость и reduced motion сохранены.

## Схема на mobile

`GraphDiagram.mobile` содержит другую `size`, placements тех же node IDs (`id,at,w?,h?`) и edge geometry по стабильным edge IDs (`id,exit?,enter?,via?,bend?,hotspot?`). Labels/types/actions/answers не копируются: `mobileDiagram()` выводит их из одного desktop data. `defineDiagram()` требует все те же node/edge IDs; существенную ветвь нельзя потерять. Координаты в клетках ДС, не px.

Diagram → DiagramCanvas — один notation renderer для обеих композиций. Ниже bp-md активен mobile, выше — desktop. На mobile предпочтительна вертикальная геометрия 5–8 смысловых узлов, все существенные условия/возвраты сохранены. Если источник слишком большой, выбранный фрагмент задаётся отдельным честно подписанным artifact, а не удалением ветви из mobile. Старые diagrams без mobile поддерживают контейнерную прокрутку; страницу не прокручивают.

SVG скрыт от скринридера, region фокусируется и имеет имя; summary и список связей доступны. Неактивный variant скрыт целиком CSS и не создаёт draw timelines. Resize пересоздаёт только нужный контекст, уже завершённая схема остаётся полной. Map — без стрелок; синий квадрат внутри верхнего правого угла через tokens. Flow — черта старта, прямоугольник, ромб, параллелограмм, ответы на связях. Существующие клипы/реальные wireframes не заменяются серыми условными формами без подписи происхождения.

Artifact `source: {kind:'original'|'reconstruction'|'editorial',ref}` хранит происхождение, caption показывает его человеку, evidence.md раскрывает версию и границы. Summary в данных обязательно.

## Actual specimen

`Specimen = {title,fontFamily,type,colors,groups,sets,caption}`. Groups: `id,title`; sets: `id,title,group:string,wide?,states[]`; states: `id,label,mediaId,shot`. Порядок и локализованные имена групп задаются данными. Set ссылается на существующую группу; Portal использует intake/commerce, другие продукты задают свои смысловые области без нового renderer. Renderer не рисует продуктовые controls.

Desktop от bp-xl: foundation слева, матрицы справа 35:65; внутри правой области две колонки, `wide` занимает обе при реальной необходимости. Tablet: foundation вверху, две читаемые колонки. Mobile: foundation → первая группа → вторая группа, реальные narrow captures. Все выбранные состояния доступны в статике, не спрятаны за JS-каруселью. Foundation native table: четыре колонки; на mobile каждая строка становится отдельной записью с образцом. Палитра ниже. Шрифт продукта грузится отдельно в `specimen-fonts.css`; источник/лицензия — media.md.

Данные типографики/свотчей — реальные values продукта. Внешняя оболочка/поля/рамки берутся из DS портфолио. Десктопный постер не уменьшается до 360 px. Если UI требует широкий контекст, используйте CaseShot/CaseCarousel и отдельную деталь; новый общий variant запрашивается в common-requests.md, а не копируется локально.

## Frozen files для B–E

`ds/CONTRACT.md`, `ds/story-contract.md`, `ds/{tokens.css,motion.js,foundation.md,components.md,patterns.md,motion-concept.md}`; `src/copy/cases/story.ts`; `src/components/Case*.astro`, Diagram/DiagramCanvas; `src/lib/diagram.ts`; `src/data/diagrams/schema.ts`; `src/scripts/{animations.js,motion.js}`; `src/styles/{tokens.css,specimen-fonts.css}`; harmony/CSS checks. Общие правки — интегратору, с конкретным example/need. Case-чаты владеют своим copy, diagrams data, media, individual case map и tasks, как в пакетах.

Preview: noindex, canonical disabled, вне реестра/sitemap; `/preview/common/{en|ru}/{agent-ops|partner-portal}/`. `PageShell.localePaths?: Partial<Record<'en'|'ru',string>>` передаёт `BaseLayout` обычные ссылки парного preview в navbar, без изменения публичного реестра. Публичные `[slug]`/RU-маршруты сохраняют существующий fallback. A не подключает массово новые story в public.

CSS check автоматически находит собранные `/preview/**/index.html`; дополнительные маршруты передаются `npm run check:css -- /my-route/`. Case-чаты не меняют список в скрипте. Harmony принимает любой маршрут и `--base`, `--widths`, `--height`; полный editorial budget новых историй включает facts, labels и outcome, исключает документальные specimen/diagram values и навигацию. Это потолок, без минимума слов или числа секций.
