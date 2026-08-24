/**
 * /robots.txt — Site-portfolio
 *
 * Маршрут, а не статический файл в public/: текст зависит от PREVIEW_NOINDEX,
 * и снятие превью-режима должно быть одной правкой в одном месте.
 *
 * Пока превью — Disallow всему. В боевом деплое (PLAYBOOK §5 Чат 10) флаг
 * снимается, и сюда же Чат 5 (П3) допишет строку Sitemap.
 */
import type { APIRoute } from 'astro';
import { PREVIEW_NOINDEX } from '../copy/site';

const body = PREVIEW_NOINDEX
  ? 'User-agent: *\nDisallow: /\n'
  : 'User-agent: *\nAllow: /\n';

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
