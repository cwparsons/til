import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import pagefind from 'astro-pagefind';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import playformCompress from '@playform/compress';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';

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
    processor: unified({
      gfm: true,
      smartypants: true,
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
        [
          remarkToc,
          {
            maxDepth: 2,
          },
        ],
      ],
    }),
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
  vite: {
    plugins: [yaml()],
  },
});
