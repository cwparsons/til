import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/', 'src/content/', 'src/env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
);
