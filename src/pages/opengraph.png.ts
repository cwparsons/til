import type { APIRoute } from 'astro';

import { PNG } from '@/components/OpenGraphImage';
import { SITE_TITLE } from '@/consts';

export const GET: APIRoute = async function get() {
  const png = await PNG(SITE_TITLE);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
