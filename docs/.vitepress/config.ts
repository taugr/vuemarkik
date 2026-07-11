import { defineConfig } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pkg from '../../package.json';
import llmstxt from 'vitepress-plugin-llms';

const __dirname = dirname(fileURLToPath(import.meta.url));
type VitePlugins = NonNullable<
  NonNullable<Parameters<typeof defineConfig>[0]['vite']>['plugins']
>;
type CodeTransformers = NonNullable<
  NonNullable<
    Parameters<typeof defineConfig>[0]['markdown']
  >['codeTransformers']
>;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VueMarkik',
  description: 'Markdown Rendering for Vue.js',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicon-48.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96.png',
      },
    ],
    [
      'meta',
      {
        name: 'keywords',
        content: 'vue, markdown, rendering, unified, remark, rehype',
      },
    ],
    [
      'meta',
      {
        name: 'description',
        content:
          'Markdown rendering for Vue.js - extensible and customizable, powered by unified, remark, and rehype',
      },
    ],
    ['meta', { name: 'author', content: 'Tom Auger' }],
    ['meta', { property: 'og:title', content: 'VueMarkik' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Markdown rendering for Vue.js - extensible and customizable, powered by unified, remark, and rehype',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://vuemarkik.dev' }],
    ['meta', { property: 'og:image', content: '/logo.webp' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Guide',
        items: [
          { text: 'What is VueMarkik?', link: '/guide' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Customization', link: '/guide/remark-rehype-plugins' },
          { text: 'Examples', link: '/guide/github-flavored-markdown' },
        ],
      },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: `v${pkg.version}`,
            link: 'https://www.npmjs.com/package/vuemarkik',
          },
          {
            text: 'Changelog',
            link: 'https://github.com/tom-auger/vuemarkik/releases',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/tom-auger/vuemarkik/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    sidebar: {
      '/guide': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: 'What is VueMarkik?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
        {
          text: 'Customization',
          collapsed: false,
          items: [
            {
              text: 'Remark and Rehype Plugins',
              link: '/guide/remark-rehype-plugins',
            },
            {
              text: 'Custom Vue Components',
              link: '/guide/custom-vue-components',
            },
          ],
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            {
              text: 'Github Flavored Markdown',
              link: '/guide/github-flavored-markdown',
            },
            { text: 'Syntax Highlighting', link: '/guide/syntax-highlighting' },
            { text: 'Mermaid Diagrams', link: '/guide/mermaid' },
            { text: 'KaTeX Math', link: '/guide/katex' },
            { text: 'Streaming Markdown', link: '/guide/streaming-markdown' },
          ],
        },
        {
          text: 'API Reference',
          link: '/guide/api-reference',
        },
      ],
    },

    logo: '/logo.webp',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tom-auger/vuemarkik' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Tom Auger',
    },
  },
  markdown: {
    // VitePress alpha.17 bundles Shiki 3 types while the latest Twoslash
    // transformer uses Shiki 4; the runtime contract remains compatible.
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            baseUrl: resolve(__dirname, '../..'),
            paths: {
              vuemarkik: ['src/index.ts'],
            },
          },
        },
      }),
    ] as unknown as CodeTransformers,
    languages: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    // VitePress currently resolves against a different Vite version than some plugins.
    // The docs build is valid at runtime, so narrow the config to VitePress's expected plugin type here.
    plugins: [groupIconVitePlugin(), llmstxt()] as unknown as VitePlugins,
  },
});
