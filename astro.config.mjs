import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import pagefind from 'astro-pagefind';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkSmartypants from 'remark-smartypants';

// @see https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://cwparsons.ca',
  markdown: {
    rehypePlugins: [rehypeHeadingIds, [rehypeAutolinkHeadings, {
      behavior: 'wrap'
    }]],
    remarkPlugins: [remarkGfm, [remarkToc, {
      maxDepth: 2
    }], remarkSmartypants],
    shikiConfig: {
      themes: {
        dark: 'github-dark',
        light: 'github-light'
      },
      transformers: [{
        preprocess(code) {
          if (code.endsWith('\n')) {
            code = code.slice(0, -1);
          }
          return code;
        }
      }]
    }
  },
  integrations: [pagefind(), sitemap(), mdx()],
  prefetch: true,
  vite: {
    plugins: [yaml()]
  }
});