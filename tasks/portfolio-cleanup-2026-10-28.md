# Portfolio cleanup — 28.10.2026

## Изменения

- Главная EN: Armenia (UTC+4). About, контактные блоки, SEO/OG проверены: устаревшей локации в них нет; About уже содержит Armenia (UTC+4). JSON-LD на проверенных страницах отсутствует.
- CV EN/RU, ATS и редактируемые источники: актуальная локация; четыре Webflow-работы описаны как опубликованные демосборки и перенесены из оплачиваемого опыта в собственные проекты. Общая дата этой подборки убрана, чтобы не приписывать Webflow-работам неподтверждённый год. Генераторы корректно обрабатывают отсутствие даты.
- Обновлены документы подготовки CV и все три отслеживаемых PDF, включая прежнюю копию в cv/. Старые записи change-log и историческое описание телефонного номера сохранены.
- Главная EN/RU: точное позиционирование Webflow, нейтральное описание Bloomlex без неподтверждённых клиентских результатов.
- В локальном превью Scrib3 было MARKEING. Оно заменено свежим снимком живого сайта с правильным MARKETING штатным способом съёмки: 2000 × 1125, WebP quality 82. Остальные изображения не изменены.

## Внешние ошибки, которые остаются

Эти страницы прочитаны в браузере; их исходники не входят в текущий репозиторий. Внешние проекты не редактировались.

| Страница / элемент | Подтверждённая ошибка | Нужная правка вне репозитория |
|---|---|---|
| [Scrib3](https://scrib3-prod.webflow.io/), `.hello-track-list`, четыре текстовых узла `meat` | Повторяющаяся строка команды содержит MEAT вместо MEET | Заменить все четыре `meat` на `meet`. В живом hero `.section-1-wrapper-middle h1` уже стоит `marketing`; старое локальное изображение исправлено. |
| [Common](https://common---digital-design-studio.webflow.io/), `.c-project-intro` | `Branding and communication is a skill for marek to make a branding scheme.` | Это оборванный текст. Короткая замена по контексту: `Branding and communication that give each project a clear, consistent voice.` |
| [Bloomlex](https://bloomblex-prod.webflow.io/), `.faq_dropdown:nth-child(3)` | `Do you offer ongoing support after launch?` → ответ о заполнении формы и получении PDF | Существующий ответ соответствует `How do I get started?`. Условия поддержки не подтверждены, придумывать их нельзя. |
| Bloomlex, `.faq_dropdown:nth-child(4)` | `How do we get started?` → ответ о бесплатном первом документе и цене 299₽ (~$5) | Существующий ответ соответствует `How much does it cost?`. |

Bloomlex: первые две пары FAQ тематически соответствуют вопросам. Все четыре dropdown проверены нажатием: раскрываются, показывают связанный ответ, `aria-expanded=true`, закрываются. Техническая логика работает; проблема в содержимом последних двух пар. Юридические обещания и актуальность цен не оценивались.

## Проверки

- `npm run cv:build`, `npm run cv:build:ru`: успешно. Кратковременная ошибка копирования RU устранена; финальный повтор `cv:build:ru` завершился с кодом 0. Проверены содержимое и доступность PDF.
- `npm run check`: 0 errors, 0 warnings; 644 существующих hints.
- `npm run build`: успешно, 37 страниц. После обновления изображения выполнена финальная сборка.
- `npm run check:content`: 0 находок; `npm run check:css`: успешно.
- Локальный браузер: `/`, `/about/`, `/ru/`, `/ru/about/` на 1440 и 360 px; 16 открытий диалогов проектов, закрытие Escape и возврат фокуса. Переполнения страницы/диалогов, ошибки JS и сломанные загруженные изображения не обнаружены.
- 175 внутренних ссылок/якорей проверены с главных, About и десяти EN/RU страниц кейсов; ошибок нет. Обе ссылки скачивания PDF возвращают 200 и PDF content-type.
- EN/RU CV и ATS: по одной странице A4; текст извлечён, Armenia/Армения и UTC+4 подтверждены, Kazakhstan/UTC+5 отсутствуют; рендеры просмотрены, обрезки и наложений нет.
- `git diff --check`: успешно. Изменения дизайн-системы, CSS, компонентов и зависимостей отсутствуют. Изначальные посторонние untracked-файлы в outputs/ сохранены.

Проверка исправленного портфолио проведена локально на `http://127.0.0.1:4407/`. Главная production и четыре внешние сборки прочитаны для сверки; изменения не опубликованы на kanarev.com. Это не приёмка нового production-деплоя.

Полные логи, JSON и снимки сохранены локально в `.tmp/cleanup-qa/` (игнорируется Git).

## Изменённые файлы

- `src/copy/home.ts`, `src/copy/ru/home.ts`
- `public/media/development/scrib3.webp`
- `cv/resume-data.json`, `cv/resume-data-ru.json`
- `cv/build.mjs`, `cv/build-ru.mjs`
- `cv/cv.html`, `cv/cv-ru.html`, `cv/ats.html`
- `cv/Nikita_Kanarev_Product_Designer_Master.md`
- `cv/application-adaptation-guide.md`, `cv/fact-sheet.md`, `cv/cross-document-consistency.md`
- `cv/Nikita-Kanarev-Product-Designer-CV.pdf`, `public/cv.pdf`, `public/cv-ru.pdf`
- `tasks/portfolio-cleanup-2026-10-28.md`
