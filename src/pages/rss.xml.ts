import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getCollection, render } from 'astro:content';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';

function prepareRssContent(html: string, baseUrl: string) {
  return html
    .replace(/^<!DOCTYPE html>\s*/i, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/(\s(?:href|src)=["'])\//g, `$1${baseUrl}/`);
}

export async function GET(context: APIContext) {
  let baseUrl = context.site?.href ?? 'https://cwparsons.ca';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const rawContent = await container.renderToString(Content);

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        categories: post.data.tags,
        link: `/${post.id}/`,
        content: prepareRssContent(rawContent, baseUrl),
      };
    }),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? baseUrl,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: `<language>en-us</language><atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
  });
}
