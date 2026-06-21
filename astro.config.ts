import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import pagefind from 'astro-pagefind';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import playformCompress from '@playform/compress';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkSmartypants from 'remark-smartypants';

// https://astro.build/config
export default defineConfig({
  site: 'https://cwparsons.ca',
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    service: {
      entrypoint: './src/image-service.ts',
    },
  },
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
        },
      ],
    ],
    remarkPlugins: [
      remarkGfm,
      [
        remarkToc,
        {
          maxDepth: 2,
        },
      ],
      // @ts-expect-error remarkSmartypants's plugin type doesn't line up with Astro's RemarkPlugin signature
      remarkSmartypants,
    ],
    shikiConfig: {
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
      transformers: [
        {
          preprocess(code) {
            if (code.endsWith('\n')) {
              code = code.slice(0, -1);
            }
            return code;
          },
        },
      ],
    },
  },
  integrations: [
    pagefind(),
    sitemap(),
    mdx(),
    playformCompress({
      HTML: false,
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [yaml()],
  },
});
