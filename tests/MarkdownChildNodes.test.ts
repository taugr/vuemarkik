import { mount } from '@vue/test-utils';
import type { VNode } from 'vue';
import { h } from 'vue';
import { Markdown, MarkdownChildNodes } from '../src';
import { markdownExamples } from './helpers';

describe('MarkdownChildNodes Component', () => {
  describe('Node rendering', () => {
    test('renders child markdown nodes', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# Test Heading',
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'wrapper' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('.wrapper').exists()).toBe(true);
      expect(wrapper.text()).toContain('Test Heading');
    });

    test('renders child nodes from paragraph', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: 'This is a **bold** paragraph',
        },
        slots: {
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'custom-p' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('.custom-p').exists()).toBe(true);
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('strong').text()).toBe('bold');
    });

    test('renders child nodes from list items', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.list,
        },
        slots: {
          li: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('li', { class: 'custom-li' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      const customListItems = wrapper.findAll('.custom-li');
      expect(customListItems.length).toBe(3);
      expect(customListItems[0].text()).toBe('Item 1');
      expect(customListItems[1].text()).toBe('Item 2');
      expect(customListItems[2].text()).toBe('Item 3');
    });
  });

  describe('Integration with custom slots', () => {
    test('works with custom heading slot', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# Custom Heading',
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'heading-wrapper' }, [
              h('span', { class: 'icon' }, '📝'),
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('.heading-wrapper').exists()).toBe(true);
      expect(wrapper.find('.icon').text()).toBe('📝');
      expect(wrapper.text()).toContain('Custom Heading');
    });

    test('works with custom paragraph slot wrapping content', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: 'Paragraph with *emphasis*',
        },
        slots: {
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'p-container' }, [
              h('span', { class: 'prefix' }, '→ '),
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('.p-container').exists()).toBe(true);
      expect(wrapper.find('.prefix').text()).toBe('→');
      expect(wrapper.find('em').exists()).toBe(true);
      expect(wrapper.find('em').text()).toBe('emphasis');
    });

    test('works with custom link slot', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.link,
        },
        slots: {
          a: ({
            childMarkdown,
            href,
          }: {
            childMarkdown: VNode;
            href?: string;
          }) =>
            h('a', { class: 'custom-link', href }, [
              h('span', { class: 'link-icon' }, '🔗'),
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      const link = wrapper.find('.custom-link');
      expect(link.exists()).toBe(true);
      expect(link.find('.link-icon').text()).toBe('🔗');
      expect(link.text()).toContain('link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('works with nested markdown elements', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: 'Text with **bold** and *italic*',
        },
        slots: {
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'wrapper' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('.wrapper').exists()).toBe(true);
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('strong').text()).toBe('bold');
      expect(wrapper.find('em').exists()).toBe(true);
      expect(wrapper.find('em').text()).toBe('italic');
    });
  });

  describe('Complex slot scenarios', () => {
    test('works with multiple slot types using MarkdownChildNodes', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.basic,
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'custom-h1' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('p', { class: 'custom-p' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
          strong: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('strong', { class: 'custom-strong' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('h1.custom-h1').exists()).toBe(true);
      expect(wrapper.find('p.custom-p').exists()).toBe(true);
      expect(wrapper.find('strong.custom-strong').exists()).toBe(true);
    });

    test('preserves markdown structure through MarkdownChildNodes', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# Title\n\nParagraph with **bold** and [link](https://example.com)',
        },
        slots: {
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'paragraph-container' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      const container = wrapper.find('.paragraph-container');
      expect(container.exists()).toBe(true);
      expect(container.find('strong').text()).toBe('bold');
      expect(container.find('a').text()).toBe('link');
      expect(container.find('a').attributes('href')).toBe(
        'https://example.com',
      );
    });

    test('handles code blocks with MarkdownChildNodes', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.codeBlock,
        },
        slots: {
          pre: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'code-wrapper' }, [
              h('div', { class: 'code-header' }, 'Code:'),
              h('pre', {}, [
                h(MarkdownChildNodes, { node: { childMarkdown } }),
              ]),
            ]),
        },
      });

      expect(wrapper.find('.code-wrapper').exists()).toBe(true);
      expect(wrapper.find('.code-header').text()).toBe('Code:');
      expect(wrapper.find('code').text()).toContain('const x = 1;');
    });

    test('handles list with custom wrapper', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.list,
        },
        slots: {
          ul: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('div', { class: 'list-container' }, [
              h('div', { class: 'list-title' }, 'Items:'),
              h('ul', { class: 'custom-ul' }, [
                h(MarkdownChildNodes, { node: { childMarkdown } }),
              ]),
            ]),
        },
      });

      expect(wrapper.find('.list-container').exists()).toBe(true);
      expect(wrapper.find('.list-title').text()).toBe('Items:');
      expect(wrapper.find('ul.custom-ul').exists()).toBe(true);
      expect(wrapper.findAll('li').length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    test('handles node with no children gracefully', () => {
      const wrapper = mount(MarkdownChildNodes, {
        props: {
          node: undefined as unknown as { childMarkdown: VNode },
        },
      });

      // When node is undefined, component returns null/empty
      expect(wrapper.html()).toBeDefined();
    });

    test('handles empty childMarkdown', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# ',
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'empty' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      expect(wrapper.find('h1.empty').exists()).toBe(true);
    });

    test('works with deeply nested structures', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '- Item with **bold** and *italic* and [link](https://example.com)',
        },
        slots: {
          li: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('li', { class: 'nested-li' }, [
              h(MarkdownChildNodes, { node: { childMarkdown } }),
            ]),
        },
      });

      const listItem = wrapper.find('.nested-li');
      expect(listItem.exists()).toBe(true);
      expect(listItem.find('strong').exists()).toBe(true);
      expect(listItem.find('em').exists()).toBe(true);
      expect(listItem.find('a').exists()).toBe(true);
    });
  });
});
