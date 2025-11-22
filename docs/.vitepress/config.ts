import { defineConfig, type Plugin } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VueMarkik',
  description: 'Markdown Rendering for Vue.js',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'vue, markdown, rendering, unified, remark, rehype',
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
    ['meta', { property: 'og:image', content: '/logo.png' }],
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
          ],
        },
        {
          text: 'API Reference',
          link: '/guide/api-reference',
        },
      ],
    },

    logo: '/logo.png',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tom-auger/vuemarkik' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Tom Auger',
    },
  },
  markdown: {
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
    ],
    languages: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin() as Plugin],
  },
});
