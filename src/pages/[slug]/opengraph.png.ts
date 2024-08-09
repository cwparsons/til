import type { APIRoute } from 'astro';

import { getCollection } from 'astro:content';

import { PNG } from '../../components/OpenGraphImage';

export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

export const GET: APIRoute = async function get({ props }) {
  const png = await PNG(props.data.title);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
