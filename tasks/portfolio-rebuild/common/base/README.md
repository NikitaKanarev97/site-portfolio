# Тематическая база Common A

Подготовлена для визуальной приёмки и последующей фиксации координатором. Этот overlay не является принятой веткой или коммитом.

Git base: `62304d8e555193a26926b673a56ba13f631ecd7e`. Архив [common-theme.zip](D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/common/base/common-theme.zip) содержит только выбранные файлы, которые накладываются на checkout этого HEAD. Принятые до A pilot/DS support включены намеренно: исходный HEAD ещё не содержит всего checkpoint. Индекс и текущая ветка исходного проекта не менялись.

`manifest.json` перечисляет каждый payload file, назначение, bytes и SHA256. `files.txt` — точный список архива. Метаданные списка/manifest входят в ZIP отдельно; архивный SHA256 записан рядом в `archive-sha256.txt`. Четыре HA references находятся в research, никогда не в public.

Восстановление выполняется координатором в чистом отдельном checkout базового HEAD после визуальной приёмки. Сначала проверить HEAD и отсутствие нужных несохранённых правок в целевом checkout, затем распаковать ZIP в его корень. Не накладывать archive вслепую поверх чужого грязного checkout. Проверить содержимое:

```powershell
node tasks/portfolio-rebuild/common/base/verify-base.mjs --root=D:/path/to/checkout
npm ci
npm run build
npm run check -- --minimumFailingSeverity error --minimumSeverity error
npm run check:css
npm run preview -- --host 127.0.0.1 --port 4340
```

После этого `/preview/common/` и `/kit/#common-contract` показывают те же материалы. Product build использует обычные package-lock зависимости, готовые captures и шрифты; соседний продукт для сборки не нужен.

Для browser verification в текущем окружении используется Playwright из read-only `D:/Claude-projects/b2b-dssl/package.json` (harmony fallback — Agent-ops-console) и Chromium по пути, записанному в scripts. `COMMON_CHROME` переопределяет browser у основных проверок. При переносе на другой компьютер пути к тестовому runtime задаются отдельно; это проверочный инструмент, а не JS-зависимость портфолио. Новый capture требует того же accepted каталога; повторно снимать его для просмотра базы не нужно.

Full motion diagnostics проверяются на dev 4341; после production build dev при необходимости перезапускают, чтобы не использовать Vite Outdated Optimize Dep. Static/harmony/support/navigation — production 4340. CPU probe выполняют после завершения всех captures, кодирования и других browser runs. Зафиксированный локальный результат не заменяет тест физического устройства.

Основные proof scripts — `verify-static.mjs`, `verify-motion.mjs`, `verify-support.mjs`, `verify-navigation.mjs`, `verify-sources.mjs`, `measure-production.mjs`, `record-central.mjs` в common/. Sources/captures/evidence, актуальные logs, desktop/mobile кадры и фильм включены в список. Несвязанные изменения HHH, LinkedIn, letters, CV и другие материалы грязного исходного checkout не включены.

Координатор после приёмки выбирает тематический набор из manifest и фиксирует одну базу для B–F/G. Чаты не запускались автоматически. Frozen интерфейсы — ds/story-contract.md; порядок кейсов и их полные истории не закрепляются этим overlay.
