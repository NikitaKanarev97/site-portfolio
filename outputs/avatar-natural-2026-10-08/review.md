# Avatar natural edit · 08.10.2026

Запрос: подготовить более естественную версию текущей аватарки.

Источник: public/media/about/portrait.webp. Инструмент: встроенный image_gen, identity-preserve. Отдельные проходы от одного исходника; второй не перерисовывает результат первого.

Выбранный вариант: portrait-natural-v2.png. Волосы менее глянцевые и регулярные, свет с мягким перепадом, фон менее стерильный. Во втором проходе снижено усиление фактуры кожи относительно v1. Сходство, выражение, одежда и композиция визуально проверены; генеративная обработка не гарантирует пиксельное сохранение лица. Это обработанный вариант, не новый камерный оригинал.

Сохранены PNG и WebP desktop/mobile с размерами прежних медиа. Исходные изображения и публичный сайт не заменены: подготовлен вариант для визуального сравнения. Вёрстка, CSS, copy и ДС не менялись; сборка не требуется.

## Установка на главную · 08.10.2026

По последующей команде владельца новый портрет подключён в src/copy/home.ts. RU наследует оба пути из EN. Public media: /media/about/portrait-natural-v2.webp (768×1024), /media/about/portrait-natural-v2-mobile.webp (384×512). Проверены декодирование файлов, пропорции 3:4 и наследование RU. Исходный портрет и About сохранены. Публикация не выполнялась.

## Final prompt (built-in tool)

Use case: identity-preserve. Edit the attached existing portrait conservatively, as a photographic retoucher working on the same photograph. This is the exact same person, not a replacement or another similar face.
Keep the exact recognizable identity, facial proportions, age, blue-gray eyes, closed-mouth small smile, gaze, pose, original neat side-swept haircut and hair volume, beige zip sweater over white T-shirt, plain neutral off-white wall, and 3:4 head-and-shoulders composition.
The goal is to reduce the overly perfect AI-looking photographic treatment. Concentrate the change on the hair and lighting: replace the unnaturally uniform glossy ribbon-like hair rendering with soft naturally overlapping irregular strands, a few fine stray hairs, and more subdued sheen, keeping the hairstyle neatly groomed. Make the light feel like gentle everyday window daylight with mild realistic shadow falloff on the wall. Use neutral color balance, restrained contrast and ordinary natural lens softness.
Facial skin should remain CLOSE TO THE SOURCE IMAGE, retaining the smoothness expected at this age, with just a hint of irregular tonal variation. Skin details must be subtle at normal portrait viewing distance. Absolutely do not amplify pores, etched micro-wrinkles, flaky or cracked skin, speckling, blemishes, or under-eye bags. No extra facial hair or stubble. Preserve the original flattering but believable skin, without plastic smoothing or extra sharpening. Eyes have small understated real reflections. No dramatic relighting, no aging or beautifying, no exaggerated film grain or filter, no geometry changes, no added objects or text. A single restrained naturally photographed portrait of the same young man.

