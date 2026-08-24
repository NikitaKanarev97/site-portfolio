// @ts-check
import { defineConfig } from 'astro/config';
import customMedia from 'postcss-custom-media';
import breakpoints from './scripts/postcss-breakpoints.mjs';

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

  // Брейкпоинты одним источником. @media не читает var(), поэтому условия
  // запросов живут в ds/tokens.css блоком @custom-media, а сюда приходят
  // через зеркало src/styles/tokens.css — тем же путём и по той же причине,
  // что и в src/lib/tokens.ts: в бандле исходников ds/ нет.
  //
  // breakpoints раздаёт объявления во все файлы, включая scoped <style>
  // внутри .astro: postcss обрабатывает каждый блок отдельно и объявления
  // из соседнего файла сам не видит. customMedia разворачивает их в числа.
  // Порядок плагинов обязателен: сначала раздать, потом развернуть.
  // Почему не готовый postcss-global-data — в шапке плагина.
  vite: {
    css: {
      postcss: {
        plugins: [
          breakpoints(),
          customMedia(),
        ],
      },
    },
  },
});
