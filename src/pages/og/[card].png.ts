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
 * падает на таблице `fvar`. Файлы — инстансы Google Fonts семейства Onest,
 * лицензия OFL лежит рядом. В браузер они не уезжают, это
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
import { OG_CARDS, OG_FEATURES, OG_HEIGHT, OG_WIDTH, ogCard } from '../../copy/og.ts';
import { px, role, token } from '../../lib/tokens.ts';

const fontFile = (name: string) => fs.readFileSync(path.join(process.cwd(), 'scripts', 'og-fonts', name));

const fonts = [
  { name: 'Onest', data: fontFile('Onest-400.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Onest', data: fontFile('Onest-800.ttf'), weight: 800 as const, style: 'normal' as const },
  { name: 'Onest', data: fontFile('Onest-500.ttf'), weight: 500 as const, style: 'normal' as const },
];

/**
 * Ступень заголовка по длине строки.
 *
 * Три ступени шкалы, не плавная интерполяция: карточка должна попадать
 * в те же кегли, что и страница. Границы посчитаны от меры строки —
 * при 1040 px рабочей ширины и Onest 800 в строку 96 px входит около
 * девятнадцати знаков, то есть три строки — это 55. Дальше ступень вниз.
 */
function titleSize(title: string): number {
  if (title.length <= 55) return px('size-6xl');
  if (title.length <= 110) return px('size-5xl');
  return px('size-4xl');
}

export function getStaticPaths() {
  return OG_CARDS.flatMap((card) => [card.id, `${card.id}-onest`].map((id) => ({ params: { card: id } })));
}

export const GET: APIRoute = async ({ params }) => {
  const card = ogCard(params.card!.replace(/-onest$/, ''));
  const feature = OG_FEATURES[card.id];

  if (feature) {
    // Preserve the documentary half of the accepted LinkedIn artwork exactly.
    // Only site typography is replaced; no native UI colors or glyphs change.
    const half = OG_WIDTH / 2;
    const source = path.join(process.cwd(), 'public', 'media', 'linkedin', 'og', `${card.id}.png`);
    const documentary = await sharp(source).extract({ left: half, top: 0, width: half, height: OG_HEIGHT }).png().toBuffer();
    const svg = await satori({
      type: 'div',
      props: {
        style: { width: OG_WIDTH, height: OG_HEIGHT, display: 'flex', backgroundColor: token('surface-subtle') },
        children: [
          {
            type: 'div',
            props: {
              style: { width: half, height: OG_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: px('space-16'), gap: px('space-6') },
              children: [
                { type: 'div', props: { style: { width: px('space-16'), height: px('space-1'), backgroundColor: token('text-link') } } },
                { type: 'div', props: { style: { display: 'flex', ...role('ds-display-6xl', px('size-hero-lg')), color: token('text-default') }, children: feature.title } },
                { type: 'div', props: { style: { display: 'flex', ...role('ds-body-base', px('size-3xl')), color: token('text-subtle') }, children: feature.description } },
                ...(feature.status ? [{ type: 'div', props: { style: { display: 'flex', alignSelf: 'flex-start', ...role('ds-meta-xs', px('size-2xl')), color: token('text-default'), border: `${token('border-width')} solid ${token('border-strong')}`, padding: px('space-3') }, children: feature.status } }] : []),
              ],
            },
          },
          { type: 'img', props: { src: `data:image/png;base64,${documentary.toString('base64')}`, width: half, height: OG_HEIGHT } },
        ],
      },
    }, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
    // Reapply the original half after rasterizing, retaining exact native pixels.
    const png = await sharp(Buffer.from(svg)).composite([{ input: documentary, left: half, top: 0 }]).png().toBuffer();
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  }

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
                      backgroundColor: token('text-link'),
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
                flexDirection: 'column',
                ...role('ds-display-6xl', titleSize(card.title + (card.accent ?? ''))),
                color: token('text-default'),
              },
              children: card.accent
                ? [
                    { type: 'div', props: { style: { display: 'flex' }, children: card.title } },
                    { type: 'div', props: { style: { display: 'flex', color: token('text-link') }, children: card.accent } },
                  ]
                : card.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                paddingTop: px('space-6'),
                borderTop: `${token('border-width')} solid ${token('border-default')}`,
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
