import { mount, flushPromises } from '@vue/test-utils';
import type { VNode } from 'vue';
import { defineComponent, h, Suspense } from 'vue';
import { MarkdownAsync } from '../src';
import { markdownExamples, CustomHeading, CustomParagraph } from './helpers';
import remarkGfm from 'remark-gfm';

describe('MarkdownAsync Component', () => {
  describe('Basic async rendering', () => {
    test('renders basic markdown with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.basic }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('Hello World');
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('em').exists()).toBe(true);
    });

    test('renders headings with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.heading }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('Heading 1');
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Heading 2');
      expect(wrapper.find('h3').exists()).toBe(true);
      expect(wrapper.find('h3').text()).toBe('Heading 3');
    });

    test('renders paragraphs with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.paragraph }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe(
        'This is a simple paragraph with some text.',
      );
    });

    test('renders links with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.link }),
              });
          },
        }),
      );

      await flushPromises();

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.text()).toBe('link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('renders lists with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.list }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('ul').exists()).toBe(true);
      const items = wrapper.findAll('li');
      expect(items.length).toBe(3);
      expect(items[0].text()).toBe('Item 1');
      expect(items[1].text()).toBe('Item 2');
      expect(items[2].text()).toBe('Item 3');
    });

    test('renders code blocks with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.codeBlock }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('pre').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
      expect(wrapper.find('code').text()).toContain('const x = 1;');
    });

    test('renders complex markdown with Suspense', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.complex }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.findAll('p').length).toBeGreaterThan(0);
      expect(wrapper.find('ul').exists()).toBe(true);
      expect(wrapper.find('a').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
    });
  });

  describe('Custom components prop with async rendering', () => {
    test('replaces default heading with custom component', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: '# Custom Heading',
                    components: {
                      h1: CustomHeading,
                    },
                  }),
              });
          },
        }),
      );

      await flushPromises();

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('custom-heading');
      expect(heading.text()).toBe('Custom Heading');
    });

    test('replaces default paragraph with custom component', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: 'Custom paragraph',
                    components: {
                      p: CustomParagraph,
                    },
                  }),
              });
          },
        }),
      );

      await flushPromises();

      const paragraph = wrapper.find('p');
      expect(paragraph.exists()).toBe(true);
      expect(paragraph.classes()).toContain('custom-paragraph');
      expect(paragraph.text()).toBe('Custom paragraph');
    });

    test('replaces multiple elements with custom components', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: markdownExamples.basic,
                    components: {
                      h1: CustomHeading,
                      p: CustomParagraph,
                    },
                  }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1.custom-heading').exists()).toBe(true);
      expect(wrapper.find('p.custom-paragraph').exists()).toBe(true);
    });
  });

  describe('Custom slots with async rendering', () => {
    test('uses slot template for custom heading rendering', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(
                    MarkdownAsync,
                    {
                      text: '# Slotted Heading',
                    },
                    {
                      h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
                        h('h1', { class: 'slotted-heading' }, [childMarkdown]),
                    },
                  ),
              });
          },
        }),
      );

      await flushPromises();

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('slotted-heading');
      expect(heading.text()).toBe('Slotted Heading');
    });

    test('uses multiple slot templates', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(
                    MarkdownAsync,
                    {
                      text: markdownExamples.basic,
                    },
                    {
                      h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
                        h('h1', { class: 'slotted-heading' }, [childMarkdown]),
                      p: ({ childMarkdown }: { childMarkdown: VNode }) =>
                        h('p', { class: 'slotted-paragraph' }, [childMarkdown]),
                    },
                  ),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1.slotted-heading').exists()).toBe(true);
      expect(wrapper.find('p.slotted-paragraph').exists()).toBe(true);
    });
  });

  describe('Plugins with async rendering', () => {
    test('processes markdown with remark-gfm for tables', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: markdownExamples.table,
                    remarkPlugins: [remarkGfm],
                  }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('thead').exists()).toBe(true);
      expect(wrapper.find('tbody').exists()).toBe(true);
    });

    test('processes markdown with remark-gfm for strikethrough', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: markdownExamples.strikethrough,
                    remarkPlugins: [remarkGfm],
                  }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('del').exists()).toBe(true);
      expect(wrapper.find('del').text()).toBe('strikethrough');
    });
  });

  describe('Async behavior verification', () => {
    test('works within Suspense component', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, { text: markdownExamples.basic }),
                fallback: () => h('div', { class: 'loading' }, 'Loading...'),
              });
          },
        }),
      );

      // Initially might show fallback, but after flush should show content
      await flushPromises();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('.loading').exists()).toBe(false);
    });

    test('handles multiple async markdown components', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h('div', [
                h(Suspense, null, {
                  default: () => h(MarkdownAsync, { text: '# First' }),
                }),
                h(Suspense, null, {
                  default: () => h(MarkdownAsync, { text: '## Second' }),
                }),
              ]);
          },
        }),
      );

      await flushPromises();

      expect(wrapper.find('h1').text()).toBe('First');
      expect(wrapper.find('h2').text()).toBe('Second');
    });
  });

  describe('Edge cases with async rendering', () => {
    test('handles minimal markdown', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () => h(MarkdownAsync, { text: 'a' }),
              });
          },
        }),
      );

      await flushPromises();

      expect(wrapper.text()).toBe('a');
    });

    test('handles special characters', async () => {
      const wrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(Suspense, null, {
                default: () =>
                  h(MarkdownAsync, {
                    text: 'Text with <special> & "characters"',
                  }),
              });
          },
        }),
      );

      await flushPromises();

      // HTML entities are escaped in markdown
      expect(wrapper.text()).toContain('Text with');
      expect(wrapper.text()).toContain('characters');
    });
  });
});
