// @ts-check
import { defineConfig } from 'astro/config';

// Статическая сборка под Vercel. Адаптер не нужен: маршрутов SSR нет,
// весь продукт — префрендер (ds/motion-concept.md §2).
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  build: {
    // 404 и 500 отдаются хостингом настоящими HTTP-кодами (TECH-06).
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
