# H3 · Before / After / Why

Source 7e2ae63c80008977f6974fdb6d4c985231ea3e8c. H2 owner feedback supersedes its self-assessment.

| Before | After | Why |
|---|---|---|
| Текст и вес 4,9 кг прижаты к краю захвата; углы маскируются | Целый native снимок, белые поля 16/24 px; скруглена внешняя оболочка | Исходный текст, действия и родная обводка не срезаются |
| Portal/Learn Home имеют острые углы на desktop | Все пять FeaturedCase, CasePlate и медиапанели используют radius-lg =16 px | Одна геометрия оболочки EN/RU и всех ширин |
| У CaseScreen нет общего работающего увеличения | Один MediaZoom в BaseLayout: полный текущий источник, прокрутка, отдельное описание, Escape/возврат фокуса | Плотный UI и низ длинного снимка можно прочитать; mobile открывает свой currentSrc |
| Карточка Home целиком является ссылкой | Article: ссылка названия/CTA и отдельное увеличение каждого снимка | Открытие снимка и переход в кейс не конфликтуют |
| Обзор Agent переполняет закреплённую сцену после добавления полей | При расчёте масштаба оставлено место всей рамке и строке открытия | Полный контейнер помещается в stage |
| Галерея отдаёт голые файлы при увеличении | Её собственный лайтбокс показывает полный снимок с текстовым блоком | Приёмочные изображения тоже не режутся рамкой |

144 профиля: Home +5 кейсов ×EN/RU ×1440/1024/390/360 ×full/reduce/no-JS. 314 открытий лайтбокса: источник совпадает с currentSrc, описание отдельно, целые пропорции, конец длинного изображения достигается клавиатурой, Escape возвращает фокус, маршрут сохраняется. 24 финальных профиля подтверждают непрерывное белое поле лайтбокса после цветовой доводки; эти PNG находятся в final-lightboxes/. 4 lifecycle проверки Home→Agent→Back, resize и live preference; 11 follow-up (RU360 float-геометрия, Portal alpha-окружение, /kit); 16 окончательных full-motion кадров Agent EN/RU1440/1024; 4 manual-film проверки Pawly EN/RU1440/390 после удаления двойных полей. Галерея: 24 комбинации, отсутствующих файлов0; её лайтбокс открыт/закрыт. Build36 routes; check118 files:0 errors/0 warnings/101 hints; CSS35 routes:0 dead rules; harmony48 profiles +8 целевых Pawly после финального CSS:0 нарушений. 113 актуальных PNG в final/, focus-final/ и final-lightboxes/; прежние24 кадра с серой подложкой не входят в актуальный manifest.

Native UI pixels, facts and fixtures unchanged. Current proof: h-art-03/final and focus-final. Executor verification complete; independent owner/controller acceptance pending.
