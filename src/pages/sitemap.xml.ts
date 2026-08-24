/**
 * /sitemap.xml — Site-portfolio
 *
 * Маршрут, а не пакет @astrojs/sitemap: карта обязана сходиться с
 * hreflang в BaseLayout и с robots.txt до символа, а значит должна расти
 * из того же реестра — src/copy/routes.ts. Пакет собрал бы её из файлов
 * в src/pages и включил бы туда витрину /kit и служебные страницы, то
 * есть ровно то, чего в карте быть не должно.
 *
 * Что сюда не входит и почему:
 *   — /404 и /500: страницы ошибок в карте сайта не публикуются;
 *   — /kit: витрина компонентов, не страница продукта;
 *   — /ru/: пока RU_PUBLISHED === false, непереведённый каркас поиску
 *     не рекламируется. Флаг снимается вместе с переводом, и тогда же
 *     у EN-строк появляются xhtml:link alternates — правки здесь не нужно;
 *   — /cv.pdf: файл, а не страница. Ссылка на него стоит на всех
 *     маршрутах, робот дойдёт по ней.
 *
 * lastmod намеренно не проставляется. Дата сборки — не дата изменения
 * страницы, а поисковик, поймав расхождение однажды, перестаёт верить
 * полю вовсе. Пустое поле честнее неверного.
 */
import type { APIRoute } from 'astro';
import { sitemapEntries } from '../copy/routes.ts';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs без site — sitemap.xml собрать не из чего');

  const urls = sitemapEntries()
    .map((entry) => {
      const alternates = entry.alternates
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${new URL(alternate.path, site).href}" />`,
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${new URL(entry.path, site).href}</loc>`,
        alternates,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
