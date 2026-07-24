import { flushPromises, mount } from '@vue/test-utils';
import type { Root } from 'hast';
import { createSSRApp, defineComponent, h, nextTick, Suspense } from 'vue';
import { renderToString } from 'vue/server-renderer';
import {
  defaultUrlTransform,
  Markdown,
  MarkdownAsync,
  MarkdownHooks,
} from '../src';

const unsafeUrls = [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  ' javascript:alert(1)',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>',
];

const safeUrls = [
  'https://example.com/path',
  'http://example.com',
  'mailto:person@example.com',
  'tel:+441234567890',
  '/relative/path',
  './relative/path',
  '../relative/path',
  '#fragment',
  '#fragment:with-colon',
  '?query=value',
  '?query=custom:value',
  './folder:name/file',
];

const addUnsafeUrlAttributes = () => (tree: Root) => {
  tree.children.push(
    {
      type: 'element',
      tagName: 'form',
      properties: { action: 'javascript:alert(1)' },
      children: [],
    },
    {
      type: 'element',
      tagName: 'video',
      properties: {
        poster: 'data:text/html,<script>alert(1)</script>',
        src: 'https://example.com/video.mp4',
      },
      children: [],
    },
  );
};

describe('URL security', () => {
  test.each(safeUrls)('allows a safe URL: %s', (url) => {
    expect(defaultUrlTransform(url)).toBe(url);
  });

  test.each(unsafeUrls)('rejects an unsafe URL: %s', (url) => {
    expect(defaultUrlTransform(url)).toBeUndefined();
  });

  test('removes unsafe markdown link and image destinations', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: [
          '[danger](javascript:alert(1))',
          '![tracking](data:image/svg+xml,<svg/onload=alert(1)>)',
        ].join('\n\n'),
      },
    });

    expect(wrapper.get('a').attributes('href')).toBeUndefined();
    expect(wrapper.get('img').attributes('src')).toBeUndefined();
  });

  test('rejects a character-reference-obfuscated protocol', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: '[danger](jav&#x61;script:alert(1))',
      },
    });

    expect(wrapper.get('a').attributes('href')).toBeUndefined();
  });

  test('applies the URL policy to URL-bearing properties from plugins', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeUrlAttributes],
      },
    });

    expect(wrapper.get('form').attributes('action')).toBeUndefined();
    expect(wrapper.get('video').attributes('poster')).toBeUndefined();
    expect(wrapper.get('video').attributes('src')).toBe(
      'https://example.com/video.mp4',
    );
  });

  test('supports a custom URL transform with element context', () => {
    const seen: Array<[string, string, string]> = [];
    const wrapper = mount(Markdown, {
      props: {
        text: '[example](https://example.com)',
        urlTransform: (url, propertyName, node) => {
          seen.push([url, propertyName, node.tagName]);
          return `${url}?source=vuemarkik`;
        },
      },
    });

    expect(wrapper.get('a').attributes('href')).toBe(
      'https://example.com?source=vuemarkik',
    );
    expect(seen).toEqual([['https://example.com', 'href', 'a']]);
  });

  test('rerenders when the URL transform changes', async () => {
    const wrapper = mount(Markdown, {
      props: {
        text: '[example](https://example.com)',
        urlTransform: () => undefined,
      },
    });

    expect(wrapper.get('a').attributes('href')).toBeUndefined();

    await wrapper.setProps({
      urlTransform: (url: string) => url,
    });

    expect(wrapper.get('a').attributes('href')).toBe('https://example.com');
  });

  test('uses the same URL policy in MarkdownAsync', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Suspense, null, {
              default: () =>
                h(MarkdownAsync, {
                  text: '[danger](javascript:alert(1))',
                }),
            });
        },
      }),
    );

    await flushPromises();

    expect(wrapper.get('a').attributes('href')).toBeUndefined();
  });

  test('uses the same URL policy in MarkdownHooks', async () => {
    const wrapper = mount(MarkdownHooks, {
      props: {
        text: '[danger](javascript:alert(1))',
      },
    });

    await flushPromises();
    await nextTick();

    expect(wrapper.get('a').attributes('href')).toBeUndefined();
  });

  test('removes unsafe URLs from SSR output', async () => {
    const html = await renderToString(
      createSSRApp(Markdown, {
        text: '[danger](javascript:alert(1))',
      }),
    );

    expect(html).not.toContain('javascript:');
    expect(html).toContain('<a>danger</a>');
  });
});

describe('empty markdown rendering', () => {
  test.each(['', ' ', '\n\n'])(
    'renders empty synchronous input during SSR: %j',
    async (text) => {
      const html = await renderToString(createSSRApp(Markdown, { text }));

      expect(html).toBe('<!---->');
    },
  );

  test('renders empty asynchronous input during SSR', async () => {
    const html = await renderToString(
      createSSRApp(MarkdownAsync, { text: '' }),
    );

    expect(html).toBe('<!---->');
  });
});
