/**
 * Рендер карточек превью — Site-portfolio, маршруты /og/<card>.png
 *
 * Спека содержимого — `src/copy/og.ts`, здесь только отрисовка. Карточки
 * собираются на билде: `output: 'static'`, значит эндпоинт префрендерится
 * и в `dist/og/` ложатся готовые PNG. Рантайма у них нет.
 *
 * **Почему рендер, а не картинки в `public/`.** `TECH-05` требует, чтобы
 * на карточке кейса стояло его название. Название живёт в `src/copy/`, и
 * картинка, нарисованная руками, разошлась бы с ним при первой же правке
 * текста — молча, потому что превью не видно из браузера. Рендер из того
 * же источника расхождение исключает.
 *
 * **Цвета и кегли берутся из токенов** (`src/lib/tokens.ts`). Satori не
 * исполняет CSS, но прибивать значения нельзя: карточка — поверхность
 * продукта, а `ds/CONTRACT.md` §«Что запрещено» распространяется на все
 * поверхности. Типографика задаётся ролью `.ds-display-6xl` / `.ds-meta-xs`,
 * не числами; ступень кегля — тоже токен из шкалы.
 *
 * **Одно отступление от страничных ступеней, и оно осознанное.** Роль
 * `.ds-meta-xs` на странице — 12 px. Полотно 1200×630 показывается в ленте
 * примерно вдвое меньше, и 12 px там превращаются в 5 px нечитаемых.
 * Поэтому от роли берётся форма — семейство, начертание, трекинг, капс, —
 * а ступень кегля подставляется явно из той же шкалы токенов.
 *
 * **Шрифты — статические TTF в `scripts/og-fonts/`.** Не woff2 из
 * `public/fonts/`: их Satori не читает. Не вариативные: парсер Satori
 * падает на таблице `fvar`. Файлы — инстансы Google Fonts тех же двух
 * семейств, лицензии OFL лежат рядом. В браузер они не уезжают, это
 * билд-ассет.
 *
 * Путь к ним считается от корня проекта (`process.cwd()`), а не от
 * `import.meta.url`: на билде модуль уезжает в бандл, и относительный путь
 * указывал бы на выходную папку. Билд запускается из корня — там же лежит
 * `package.json`.
 *
 * **PNG растрит sharp.** Satori отдаёт SVG, в котором глифы уже
 * превращены в контуры, — системные шрифты растеризатору не нужны.
 * Отдельная нативная зависимость под растр (@resvg/resvg-js) не заводится:
 * sharp и так стоит в дереве Astro.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { OG_CARDS, OG_HEIGHT, OG_WIDTH, ogCard } from '../../copy/og.ts';
import { px, role, token } from '../../lib/tokens.ts';

const fontFile = (name: string) => fs.readFileSync(path.join(process.cwd(), 'scripts', 'og-fonts', name));

const fonts = [
  { name: 'Manrope', data: fontFile('Manrope-400.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Manrope', data: fontFile('Manrope-800.ttf'), weight: 800 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: fontFile('JetBrainsMono-500.ttf'), weight: 500 as const, style: 'normal' as const },
];

/**
 * Ступень заголовка по длине строки.
 *
 * Три ступени шкалы, не плавная интерполяция: карточка должна попадать
 * в те же кегли, что и страница. Границы посчитаны от меры строки —
 * при 1040 px рабочей ширины и Manrope 800 в строку 96 px входит около
 * девятнадцати знаков, то есть три строки — это 55. Дальше ступень вниз.
 */
function titleSize(title: string): number {
  if (title.length <= 55) return px('size-6xl');
  if (title.length <= 110) return px('size-5xl');
  return px('size-4xl');
}

export function getStaticPaths() {
  return OG_CARDS.map((card) => ({ params: { card: card.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const card = ogCard(params.card!);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: px('margin-lg'),
          backgroundColor: token('surface-default'),
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                // Акцентная риска. Единственное цветное пятно карточки:
                // узнаваемость без логотипа, которого у продукта нет.
                {
                  type: 'div',
                  props: {
                    style: {
                      width: px('space-16'),
                      height: px('space-1'),
                      backgroundColor: token('accent-500'),
                      marginBottom: px('space-6'),
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      ...role('ds-meta-xs', px('size-2xl')),
                      color: token('text-meta'),
                    },
                    children: card.eyebrow,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                ...role('ds-display-6xl', titleSize(card.title)),
                color: token('text-default'),
              },
              children: card.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                paddingTop: px('space-6'),
                borderTop: `1px solid ${token('border-default')}`,
                ...role('ds-body-lg', px('size-2xl')),
                color: token('text-subtle'),
              },
              children: card.footnote,
            },
          },
        ],
      },
    },
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
