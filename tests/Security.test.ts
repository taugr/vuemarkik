import { flushPromises, mount } from '@vue/test-utils';
import type { Root } from 'hast';
import {
  createSSRApp,
  defineComponent,
  h,
  markRaw,
  nextTick,
  Suspense,
} from 'vue';
import { renderToString } from 'vue/server-renderer';
import {
  defaultSanitizeSchema,
  defaultUrlTransform,
  Markdown,
  MarkdownAsync,
  MarkdownHooks,
  type SanitizeSchema,
  type SecurityMode,
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

const addUnsafeHast = () => (tree: Root) => {
  tree.children.push(
    {
      type: 'element',
      tagName: 'iframe',
      properties: { src: 'https://example.com/embed' },
      children: [],
    },
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: 'https://example.com',
        onClick: 'alert(1)',
        style: 'background-image: url(javascript:alert(1))',
      },
      children: [{ type: 'text', value: 'plugin link' }],
    },
  );
};

const addClobberingId = () => (tree: Root) => {
  tree.children.push({
    type: 'element',
    tagName: 'h2',
    properties: { id: 'location' },
    children: [{ type: 'text', value: 'Location' }],
  });
};

const iframeSchema: SanitizeSchema = {
  ...defaultSanitizeSchema,
  tagNames: [...(defaultSanitizeSchema.tagNames ?? []), 'iframe'],
  attributes: {
    ...defaultSanitizeSchema.attributes,
    iframe: ['src'],
  },
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
        securityMode: 'trusted',
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

describe('final HAST sanitization', () => {
  test('uses safe mode by default after user plugins run', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
      },
    });

    expect(wrapper.find('iframe').exists()).toBe(false);
    expect(wrapper.get('a').attributes('href')).toBe('https://example.com');
    expect(wrapper.get('a').attributes('onclick')).toBeUndefined();
    expect(wrapper.get('a').attributes('style')).toBeUndefined();
  });

  test('passes sanitized properties and nodes to custom components', () => {
    let receivedNode: unknown;
    const CapturingLink = markRaw(
      defineComponent({
        props: {
          node: Object,
          href: String,
        },
        setup(props) {
          receivedNode = props.node;
          return () => h('a', { href: props.href }, 'plugin link');
        },
      }),
    );

    mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
        components: { a: CapturingLink },
      },
    });

    expect(receivedNode).toMatchObject({
      tagName: 'a',
      properties: {
        href: 'https://example.com',
      },
    });
    expect(receivedNode).not.toMatchObject({
      properties: {
        onClick: expect.anything(),
        style: expect.anything(),
      },
    });
  });

  test('supports an explicit trusted mode for existing plugin output', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
        securityMode: 'trusted',
      },
    });

    expect(wrapper.get('iframe').attributes('src')).toBe(
      'https://example.com/embed',
    );
    expect(wrapper.get('a').attributes('href')).toBe('https://example.com');
  });

  test('supports a custom schema in safe mode', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
        sanitizeSchema: iframeSchema,
      },
    });

    expect(wrapper.get('iframe').attributes('src')).toBe(
      'https://example.com/embed',
    );
    expect(wrapper.get('a').attributes('onclick')).toBeUndefined();
  });

  test('rerenders when security mode changes', async () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
      },
    });

    expect(wrapper.find('iframe').exists()).toBe(false);

    await wrapper.setProps({ securityMode: 'trusted' });

    expect(wrapper.find('iframe').exists()).toBe(true);
  });

  test('rerenders when the sanitization schema changes', async () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
      },
    });

    expect(wrapper.find('iframe').exists()).toBe(false);

    await wrapper.setProps({ sanitizeSchema: iframeSchema });

    expect(wrapper.find('iframe').exists()).toBe(true);
  });

  test('allows telephone links in the default safe schema', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: '[telephone](tel:+441234567890)',
      },
    });

    expect(wrapper.get('a').attributes('href')).toBe('tel:+441234567890');
  });

  test('prefixes DOM-clobbering identifiers', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: 'Content',
        rehypePlugins: [addClobberingId],
      },
    });

    expect(wrapper.get('h2').attributes('id')).toBe('user-content-location');
  });

  test.each<SecurityMode>(['safe', 'trusted'])(
    'keeps raw HTML disabled in %s mode',
    (securityMode) => {
      const wrapper = mount(Markdown, {
        props: {
          text: '<script>alert(1)</script>',
          securityMode,
        },
      });

      expect(wrapper.find('script').exists()).toBe(false);
      expect(wrapper.text()).not.toContain('alert(1)');
    },
  );

  test('sanitizes plugin output in MarkdownAsync', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Suspense, null, {
              default: () =>
                h(MarkdownAsync, {
                  text: 'Content',
                  rehypePlugins: [addUnsafeHast],
                }),
            });
        },
      }),
    );

    await flushPromises();

    expect(wrapper.find('iframe').exists()).toBe(false);
  });

  test('sanitizes plugin output in MarkdownHooks', async () => {
    const wrapper = mount(MarkdownHooks, {
      props: {
        text: 'Content',
        rehypePlugins: [addUnsafeHast],
      },
    });

    await flushPromises();
    await nextTick();

    expect(wrapper.find('iframe').exists()).toBe(false);
  });

  test('handles a bounded large set of links in safe mode', () => {
    const linkCount = 500;
    const text = Array.from(
      { length: linkCount },
      (_, index) => `[link ${index}](https://example.com/${index})`,
    ).join('\n\n');
    const wrapper = mount(Markdown, {
      props: { text },
    });

    expect(wrapper.findAll('a')).toHaveLength(linkCount);
  });

  test('handles bounded deeply nested markdown in safe mode', () => {
    const nestingDepth = 100;
    const text = `${'> '.repeat(nestingDepth)}deep content`;
    const wrapper = mount(Markdown, {
      props: { text },
    });

    expect(wrapper.text()).toContain('deep content');
    expect(wrapper.findAll('blockquote').length).toBeGreaterThan(0);
  });
});
