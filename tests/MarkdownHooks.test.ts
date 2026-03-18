import { mount, flushPromises } from '@vue/test-utils';
import type { VNode } from 'vue';
import { defineComponent, h, nextTick, onErrorCaptured, ref } from 'vue';
import { MarkdownHooks } from '../src';
import {
  markdownExamples,
  CustomHeading,
  CustomParagraph,
  markdownRenderFailure,
  asyncThrowingRemarkPlugin,
} from './helpers';
import remarkGfm from 'remark-gfm';

const slowRemarkPlugin = () => {
  return async (_tree: unknown, file: { value?: unknown }) => {
    const text = String(file.value ?? '');
    const delay = text.includes('Initial') ? 30 : 0;
    await new Promise((resolve) => setTimeout(resolve, delay));
  };
};

describe('MarkdownHooks Component', () => {
  describe('Basic async rendering without Suspense', () => {
    test('renders basic markdown', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.basic },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('Hello World');
      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('em').exists()).toBe(true);
    });

    test('renders headings', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.heading },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('Heading 1');
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Heading 2');
      expect(wrapper.find('h3').exists()).toBe(true);
      expect(wrapper.find('h3').text()).toBe('Heading 3');
    });

    test('renders paragraphs', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.paragraph },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe(
        'This is a simple paragraph with some text.',
      );
    });

    test('renders links', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.link },
      });

      await flushPromises();
      await nextTick();

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.text()).toBe('link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('renders lists', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.list },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('ul').exists()).toBe(true);
      const items = wrapper.findAll('li');
      expect(items.length).toBe(3);
      expect(items[0].text()).toBe('Item 1');
      expect(items[1].text()).toBe('Item 2');
      expect(items[2].text()).toBe('Item 3');
    });

    test('renders code blocks', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.codeBlock },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('pre').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
      expect(wrapper.find('code').text()).toContain('const x = 1;');
    });

    test('renders complex markdown', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.complex },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.findAll('p').length).toBeGreaterThan(0);
      expect(wrapper.find('ul').exists()).toBe(true);
      expect(wrapper.find('a').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
    });
  });

  describe('content-loaded event emission', () => {
    test('emits content-loaded event after rendering', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.basic },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('content-loaded')).toBeTruthy();
      // Rendering may emit more than once if a newer async pass supersedes an older one.
      expect(wrapper.emitted('content-loaded')!.length).toBeGreaterThanOrEqual(
        1,
      );
    });

    test('emits content-loaded event for simple markdown', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.paragraph },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('content-loaded')).toBeTruthy();
    });

    test('emits content-loaded event for complex markdown', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.complex },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('content-loaded')).toBeTruthy();
    });

    test('can listen to content-loaded event', async () => {
      const onContentLoaded = vi.fn();

      mount(MarkdownHooks, {
        props: {
          text: markdownExamples.basic,
          onContentLoaded,
        },
      });

      await flushPromises();
      await nextTick();

      expect(onContentLoaded).toHaveBeenCalled();
      expect(onContentLoaded).toHaveBeenCalled();
    });

    test('emits content-loaded event when text changes', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: markdownExamples.basic },
      });

      await flushPromises();
      await nextTick();

      const initialEmissions = wrapper.emitted('content-loaded')?.length || 0;
      expect(initialEmissions).toBeGreaterThanOrEqual(1);

      await wrapper.setProps({ text: markdownExamples.paragraph });
      await flushPromises();
      await nextTick();

      const finalEmissions = wrapper.emitted('content-loaded')?.length || 0;
      expect(finalEmissions).toBeGreaterThan(initialEmissions);
    });
  });

  describe('Custom components with MarkdownHooks', () => {
    test('replaces default heading with custom component', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: '# Custom Heading',
          components: {
            h1: CustomHeading,
          },
        },
      });

      await flushPromises();
      await nextTick();

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('custom-heading');
      expect(heading.text()).toBe('Custom Heading');
    });

    test('replaces default paragraph with custom component', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: 'Custom paragraph',
          components: {
            p: CustomParagraph,
          },
        },
      });

      await flushPromises();
      await nextTick();

      const paragraph = wrapper.find('p');
      expect(paragraph.exists()).toBe(true);
      expect(paragraph.classes()).toContain('custom-paragraph');
      expect(paragraph.text()).toBe('Custom paragraph');
    });

    test('replaces multiple elements with custom components', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.basic,
          components: {
            h1: CustomHeading,
            p: CustomParagraph,
          },
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1.custom-heading').exists()).toBe(true);
      expect(wrapper.find('p.custom-paragraph').exists()).toBe(true);
    });
  });

  describe('Custom slots with MarkdownHooks', () => {
    test('uses slot template for custom heading rendering', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: '# Slotted Heading',
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'slotted-heading' }, [childMarkdown]),
        },
      });

      await flushPromises();
      await nextTick();

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('slotted-heading');
      expect(heading.text()).toBe('Slotted Heading');
    });

    test('uses multiple slot templates', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.basic,
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'slotted-heading' }, [childMarkdown]),
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('p', { class: 'slotted-paragraph' }, [childMarkdown]),
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1.slotted-heading').exists()).toBe(true);
      expect(wrapper.find('p.slotted-paragraph').exists()).toBe(true);
    });

    test('emits content-loaded event when using slots', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.basic,
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'slotted-heading' }, [childMarkdown]),
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('content-loaded')).toBeTruthy();
    });
  });

  describe('Plugins with MarkdownHooks', () => {
    test('processes markdown with remark-gfm for tables', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.table,
          remarkPlugins: [remarkGfm],
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('thead').exists()).toBe(true);
      expect(wrapper.find('tbody').exists()).toBe(true);
    });

    test('processes markdown with remark-gfm for strikethrough', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.strikethrough,
          remarkPlugins: [remarkGfm],
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('del').exists()).toBe(true);
      expect(wrapper.find('del').text()).toBe('strikethrough');
    });

    test('emits content-loaded event when using plugins', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: markdownExamples.table,
          remarkPlugins: [remarkGfm],
        },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('content-loaded')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    test('handles empty markdown', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: '' },
      });

      await flushPromises();
      await nextTick();

      // Empty markdown returns empty content
      expect(wrapper.html()).toBeDefined();
      expect(wrapper.emitted('content-loaded')).toBeTruthy();
    });

    test('handles special characters', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: 'Text with <special> & "characters"' },
      });

      await flushPromises();
      await nextTick();

      // HTML entities are escaped in markdown
      expect(wrapper.text()).toContain('Text with');
      expect(wrapper.text()).toContain('characters');
    });

    test('handles reactive text updates', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: { text: '# Initial' },
      });

      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').text()).toBe('Initial');

      await wrapper.setProps({ text: '# Updated' });
      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').text()).toBe('Updated');
    });

    test('ignores stale async renders when text changes before the prior render completes', async () => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: '# Initial',
          remarkPlugins: [slowRemarkPlugin],
        },
      });

      await wrapper.setProps({ text: '# Updated' });
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 40));
      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').text()).toBe('Updated');
    });
  });

  describe('Render error handling', () => {
    test('keeps the last successful render and emits render-error on failed updates', async () => {
      const onRenderError = vi.fn();

      const wrapper = mount(MarkdownHooks, {
        props: {
          text: '# Stable heading',
          remarkPlugins: [asyncThrowingRemarkPlugin],
          onRenderError,
        },
      });

      await flushPromises();
      await nextTick();
      expect(wrapper.find('h1').text()).toBe('Stable heading');

      await wrapper.setProps({
        text: markdownRenderFailure.text,
      });
      await flushPromises();
      await nextTick();

      expect(wrapper.find('h1').text()).toBe('Stable heading');
      expect(onRenderError).toHaveBeenCalledTimes(1);
      expect(onRenderError.mock.calls[0][0].text).toBe(
        markdownRenderFailure.text,
      );
    });

    test('throw mode surfaces update failures to error boundaries', async () => {
      const Host = defineComponent({
        props: {
          text: {
            type: String,
            required: true,
          },
        },
        setup(props) {
          const capturedMessage = ref<string | null>(null);

          onErrorCaptured((error) => {
            capturedMessage.value =
              error instanceof Error ? error.message : String(error);
            return false;
          });

          return () =>
            h('div', [
              h(
                'span',
                { 'data-test': 'captured' },
                capturedMessage.value ?? '',
              ),
              h(MarkdownHooks, {
                text: props.text,
                remarkPlugins: [asyncThrowingRemarkPlugin],
                errorMode: 'throw',
              }),
            ]);
        },
      });

      const wrapper = mount(Host, {
        props: {
          text: '# Stable heading',
        },
      });

      await flushPromises();
      await nextTick();

      await wrapper.setProps({
        text: markdownRenderFailure.text,
      });
      await flushPromises();
      await nextTick();

      expect(wrapper.get('[data-test="captured"]').text()).toBe(
        markdownRenderFailure.message,
      );
    });
  });
});
