import type { APIRoute } from 'astro';

import { getCollection } from 'astro:content';

import { PNG } from '@/components/OpenGraphImage';

export async function getStaticPaths() {
  const posts = await getCollection('posts');

  return posts.map((post) => ({
    params: { id: post.id },
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
