import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';
import sitemap from '@astrojs/sitemap';

// NOTE for organizers: update `site` to your live URL before going public.
// If serving from https://<user>.github.io/btug-website set `base: '/btug-website'`.
// If using a custom domain (CNAME) leave `base` unset.
export default defineConfig({
  site: 'https://ankurnapa.github.io',
  base: '/btug-website',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [yaml()],
  },
});
