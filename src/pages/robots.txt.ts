/**
 * /robots.txt — Site-portfolio
 *
 * Маршрут, а не статический файл в public/: текст зависит от PREVIEW_NOINDEX,
 * и снятие превью-режима должно быть одной правкой в одном месте.
 *
 * Пока превью — Disallow всему, и строки Sitemap нет: карта сайта, отданная
 * роботу вместе с запретом обхода, — противоречивое указание. В боевом
 * деплое (PLAYBOOK §5 Чат 10) флаг снимается, и появляются обе строки сразу.
 *
 * Витрина /kit закрыта отдельной строкой и после запуска: она не страница
 * продукта. Собственный noindex у неё тоже стоит — robots.txt запрещает
 * обход, meta запрещает индексацию, и одно другое не заменяет.
 */
import type { APIRoute } from 'astro';
import { PREVIEW_NOINDEX } from '../copy/site';

export const GET: APIRoute = ({ site }) => {
  const body = PREVIEW_NOINDEX
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /kit',
        '',
        `Sitemap: ${new URL('/sitemap.xml', site).href}`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
