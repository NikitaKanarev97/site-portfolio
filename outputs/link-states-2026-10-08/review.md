# Ссылки и копирование · 08.10.2026

| Before | After | Why |
| --- | --- | --- |
| Внешняя стрелка TextLink неподвижна | ↗ смещается вправо/вверх на space-1; → вправо на space-1 | Направление маркера сохраняется, отклик одинаковый |
| CopyEmail action мгновенно подчёркивается через text-decoration | Линия под label раскрывается и скрывается как у TextLink arrow/nav | Одна геометрия, длительность motion-hover и характер отклика |
| Нет локального reduced-motion fallback этих CSS-состояний | Нет переходов; стрелки неподвижны, линии появляются целиком | Состояния доступны без движения |

Копирование остаётся button, переходы — a. Clipboard handler, подтверждение в подписи, aria-live, ошибка и двухсекундный возврат сохранены. Mailto address сохраняет собственное постоянное текстовое оформление. Inline-ссылки в прозе сохраняют постоянное подчёркивание. Изменены TextLink.astro, CopyEmail.astro, актуальные уточнения в ds/components.md и ds/motion-concept.md. Токены и зеркала не менялись.

## Проверка

- CUA, /ru/: 1440×900 и 360×800; /: 360×800 и стандартный 1280×720. Переполнения нет. Hero и contact targets — 48 px.
- Реальное наведение: CV transform matrix(...,4,0); LinkedIn matrix(...,4,-4). Линии CV и CopyEmail — scaleX(1). Проверен keyboard Tab/Shift+Tab: focus-visible и обе линии работают. Native context-click/Escape использован для позиционирования курсора без перехода.
- Клик CopyEmail: state=copied, видимое «Скопировано», корректное aria-live, ошибка скрыта; затем возврат адреса. EN/RU PDF href локализованы, LinkedIn URL и target=_blank сохранены. Внешний сайт отдельно не загружался.
- npm run check: 0 errors, 0 warnings, 644 hints существующего корпуса. Полный лог check.log.
- npm run build: 37 страниц, успешно. Полный лог build.log.
- npm run check:css: 0 мёртвых правил на проверяемых маршрутах. Полный лог css.log.
- git diff --check: успешно. Browser error log: пусто.
- Reduced-motion проверен по скомпилированным CSS-правилам; доступный CUA не предоставляет эмуляции media preference, отдельного runtime-прогона reduce не было.

hero-actions.png показывает hover на CV и keyboard focus на CopyEmail одновременно. Изменения локальные, публикация не выполнялась. Дополнительных запросов к владельцу нет.
