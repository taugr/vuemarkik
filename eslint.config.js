import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.pnpm-store/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
    ],
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],

    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
  },
  {
    files: ['{src,docs,playground}/**/*.{ts,vue}'],

    extends: [...eslintPluginVue.configs['flat/recommended']],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },

    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
);
