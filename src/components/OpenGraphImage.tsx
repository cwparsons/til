import type { JSX } from 'astro/jsx-runtime';

import fs from 'fs/promises';
import satori from 'satori';
import sharp from 'sharp';

// @see https://og-playground.vercel.app/?share=VZHfS8MwEMf_lXAgU6hYdYqE6ctU9E2YsJe9pM2tzUyTkqTOWvq_m9sPuwYSct_73F0u10FuJQKHmVTfK8OYD63Gx66jOy2hVWHeA1aes8la48-lD8KFSXIEMpF_Fc42Rs6tti5SrsjOb-4Stt8XA5qfArfkPRwnjFS-1qI9FBt0sp6Vwzwoa6I35moqc-K3JryKSmkKXdjG5cgWwnj24eyYWqhf5Ox-OhKXqIoyRDlN__VaSKlMMWLLAze5TtOzIe-m8UGt23nMhIbcu59CIwdkq2Qoj4Ek9v3KPNHlDbW2CVtap-XKzK7iJKIOCdiamvXAO9hFA3-Iz4P9G4BPyZCYNQXwtdAeE8DKbtRnW9NEw3ZnxTzU4EuVoQQeXIN9AkFkkSip8JbKQv8H

export function OpenGraphImage({ title }: { title: string }) {
  return {
    type: 'div',
    props: {
      style: {
        alignItems: 'flex-start',
        backgroundColor: 'rgb(25, 25, 25)',
        color: 'rgb(235, 235, 235)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Source Sans Pro',
        gap: 32,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 64,
        width: '100%',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: 32,
              fontWeight: 600,
            },
            children: 'cwparsons.ca/TIL',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: 88,
              fontWeight: 600,
            },
            children: title,
          },
        },
      ],
    },
  };
}

export async function SVG(component: JSX.Element) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Source Sans Pro',
        weight: 400,
        style: 'normal',
        data: await fs.readFile(
          './node_modules/@fontsource/source-sans-pro/files/source-sans-pro-latin-400-normal.woff',
        ),
      },
      {
        name: 'Source Sans Pro',
        weight: 600,
        style: 'normal',
        data: await fs.readFile(
          './node_modules/@fontsource/source-sans-pro/files/source-sans-pro-latin-600-normal.woff',
        ),
      },
    ],
  });
}

export async function PNG(title: string) {
  const svg = await SVG(OpenGraphImage({ title }));

  return sharp(Buffer.from(svg)).png().toBuffer();
}
