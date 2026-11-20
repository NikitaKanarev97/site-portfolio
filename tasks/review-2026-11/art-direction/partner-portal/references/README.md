# references — где лежат кадры, атрибуция, статус Git

Кадры третьих лиц (сайты и приложения) в этот **публичный** репозиторий не кладутся: права на их публикацию не проверялись. Здесь — адреса, атрибуция и где лежат кадры. Сами кадры — в **приватном** репозитории `NikitaKanarev97/b2b-partner-portal`, ветка `stage-2-art-direction`, папка `audit/stage-2-art-direction/`. PNG в `audit/` по умолчанию исключены `.gitignore` проекта; кадры пакета добавлены принудительно (`git add -f`) и **закоммичены**.

| ID | Продукт | Адрес кадра | Тип | Дата кадра | Файл в `audit/stage-2-art-direction/references/` |
|---|---|---|---|---|---|
| R1 | Octopart | web.archive.org/web/20200908222652/https://octopart.com/search?q=LM358 | архив Wayback | 08.09.2020 | `raw/wb-octopart-1440*.png` |
| R2 | McMaster-Carr | web.archive.org/web/20200919164149/https://www.mcmaster.com/socket-head-screws | архив Wayback | 19.09.2020 | `raw/wb-mcmaster-1440*.png` |
| R3 | Finviz | finviz.com/screener/stocks?v=111 | живой сайт | 20.11.2026 | `raw/finviz-screener-1440*.png` |
| R4 | TradingView | tradingview.com/screener/ | живой сайт | 20.11.2026 | `raw/tradingview-screener-1440*.png` |
| R5 | ЧИП и ДИП | chipdip.ru/search?searchtext=poe коммутатор | живой сайт | 20.11.2026 | `raw/chipdip-search-1440*.png` |
| R6 | Farnell UK | web.archive.org/web/20240121223310/https://uk.farnell.com/search/prl/results?…st=pcb+connectors+and+terminals; web.archive.org/web/20240214214459/https://uk.farnell.com/search/prl/results?gs=true&sort=adf_f1002159_bv&st=vna | архив Wayback | 21.01.2024; 14.02.2024 | `raw/wb-farnell-results-1440*.png`, `raw/wb-farnell-vna-1440*.png` |
| R7 | Промэлектроника | promelec.ru/search/?query=LM358 | живой сайт | 20.11.2026 | `raw/promelec-search-1440*.png` |
| A1 | ТИНКО | tinko.ru/catalog/category/1/ | живой сайт | 20.11.2026 | `raw/tinko-cameras-1440*.png`, `raw/tinko-list-1440*.png` |
| A2 | ЭТМ iPRO | etm.ru/catalog/9010_ohranno_pozharnaja_signalizacija_ops | живой сайт | 20.11.2026 | `raw/etm-security-1440*.png` |
| M1 | Лемана ПРО | scrn.gallery/app/lemana-pro?screen=6a0cbbc53fb2b5f9bcf80d1a, …80d27, …80d28 | SCRN | каталог SCRN | `scrn/lemana-*.webp` |
| M2 | METRO | scrn.gallery/app/metro?screen=6a3d206b90f57f0cb4e8a493, …a4fc | SCRN | каталог SCRN | `scrn/metro-product-price-*.webp`, `scrn/metro-stores-sheet-*.webp` |
| M3 | METRO | scrn.gallery/app/metro?screen=6a3d1caeb9c6417248ceebb0 | SCRN | каталог SCRN | `scrn/metro-category-grid-*.webp` |

Неудачные попытки (403, Cloudflare, обрыв HTTP/2, пустые архивные страницы) сохранены в `raw/` и в журналах `raw/capture-log-*.json`: адрес, финальный URL, HTTP-статус, время. Это доказательство, что источник открывался, а не выдуман.

Базовое состояние экрана (кандидат A) — `audit/stage-2-art-direction/before/base-A-catalog-ipcams-{1440,390}.png` и `-toast.png`, данные — `before/base-A-catalog-ipcams.json`, сводка — `before/base-states.json`.

## Git — фактическое состояние

Проверено 20.11.2026 (`git ls-remote` и `git log`).

| Репозиторий | Видимость | Ветка | На GitHub |
|---|---|---|---|
| `NikitaKanarev97/site-portfolio` | публичный | `stage-2-art-direction` | ревизия 2.2.1 запушена 20.11.2026; актуальный SHA — `git log -1` ветки, совпадает с `git ls-remote` |
| `NikitaKanarev97/b2b-partner-portal` | приватный | `stage-2-art-direction` | `b707833` (кадры 2.2.1), запушен 20.11.2026 |
