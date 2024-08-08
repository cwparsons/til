import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cwparsons.ca',
  base: '/til',
  integrations: [sitemap()],
  prefetch: true,
});
