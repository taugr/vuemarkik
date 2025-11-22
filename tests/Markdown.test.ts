import { mount } from '@vue/test-utils';
import type { VNode } from 'vue';
import { h } from 'vue';
import type { Element } from 'hast';
import { Markdown } from '../src';
import {
  markdownExamples,
  CustomHeading,
  CustomParagraph,
  CustomLink,
  CustomStrong,
} from './helpers';
import remarkGfm from 'remark-gfm';

describe('Markdown Component', () => {
  describe('Basic rendering', () => {
    test('renders headings', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.heading },
      });

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toBe('Heading 1');
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Heading 2');
      expect(wrapper.find('h3').exists()).toBe(true);
      expect(wrapper.find('h3').text()).toBe('Heading 3');
    });

    test('renders paragraphs', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.paragraph },
      });

      expect(wrapper.find('p').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe(
        'This is a simple paragraph with some text.',
      );
    });

    test('renders bold text', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.bold },
      });

      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('strong').text()).toBe('bold');
    });

    test('renders italic text', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.italic },
      });

      expect(wrapper.find('em').exists()).toBe(true);
      expect(wrapper.find('em').text()).toBe('italic');
    });

    test('renders links', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.link },
      });

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.text()).toBe('link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('renders unordered lists', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.list },
      });

      expect(wrapper.find('ul').exists()).toBe(true);
      const items = wrapper.findAll('li');
      expect(items.length).toBe(3);
      expect(items[0].text()).toBe('Item 1');
      expect(items[1].text()).toBe('Item 2');
      expect(items[2].text()).toBe('Item 3');
    });

    test('renders ordered lists', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.orderedList },
      });

      expect(wrapper.find('ol').exists()).toBe(true);
      const items = wrapper.findAll('li');
      expect(items.length).toBe(3);
      expect(items[0].text()).toBe('First');
      expect(items[1].text()).toBe('Second');
      expect(items[2].text()).toBe('Third');
    });

    test('renders code blocks', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.codeBlock },
      });

      expect(wrapper.find('pre').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
      expect(wrapper.find('code').text()).toContain('const x = 1;');
    });

    test('renders inline code', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.inlineCode },
      });

      expect(wrapper.find('code').exists()).toBe(true);
      expect(wrapper.find('code').text()).toBe('inline code');
    });

    test('renders complex markdown', () => {
      const wrapper = mount(Markdown, {
        props: { text: markdownExamples.complex },
      });

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.findAll('p').length).toBeGreaterThan(0);
      expect(wrapper.find('ul').exists()).toBe(true);
      expect(wrapper.find('a').exists()).toBe(true);
      expect(wrapper.find('code').exists()).toBe(true);
      expect(wrapper.find('pre').exists()).toBe(true);
    });
  });

  describe('Custom components prop', () => {
    test('replaces default heading with custom component', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# Custom Heading',
          components: {
            h1: CustomHeading,
          },
        },
      });

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('custom-heading');
      expect(heading.text()).toBe('Custom Heading');
    });

    test('replaces default paragraph with custom component', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: 'Custom paragraph',
          components: {
            p: CustomParagraph,
          },
        },
      });

      const paragraph = wrapper.find('p');
      expect(paragraph.exists()).toBe(true);
      expect(paragraph.classes()).toContain('custom-paragraph');
      expect(paragraph.text()).toBe('Custom paragraph');
    });

    test('replaces default link with custom component', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.link,
          components: {
            a: CustomLink,
          },
        },
      });

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.classes()).toContain('custom-link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('replaces multiple elements with custom components', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.basic,
          components: {
            h1: CustomHeading,
            p: CustomParagraph,
            strong: CustomStrong,
          },
        },
      });

      expect(wrapper.find('h1.custom-heading').exists()).toBe(true);
      expect(wrapper.find('p.custom-paragraph').exists()).toBe(true);
      expect(wrapper.find('strong.custom-strong').exists()).toBe(true);
    });
  });

  describe('Custom slots', () => {
    test('uses slot template for custom heading rendering', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: '# Slotted Heading',
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'slotted-heading' }, [childMarkdown]),
        },
      });

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain('slotted-heading');
      expect(heading.text()).toBe('Slotted Heading');
    });

    test('uses slot template for custom paragraph rendering', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: 'Slotted paragraph',
        },
        slots: {
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('p', { class: 'slotted-paragraph' }, [childMarkdown]),
        },
      });

      const paragraph = wrapper.find('p');
      expect(paragraph.exists()).toBe(true);
      expect(paragraph.classes()).toContain('slotted-paragraph');
      expect(paragraph.text()).toBe('Slotted paragraph');
    });

    test('uses slot template for custom link rendering', () => {
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
          }) => h('a', { class: 'slotted-link', href }, [childMarkdown]),
        },
      });

      const link = wrapper.find('a');
      expect(link.exists()).toBe(true);
      expect(link.classes()).toContain('slotted-link');
      expect(link.attributes('href')).toBe('https://example.com');
    });

    test('uses multiple slot templates', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.basic,
        },
        slots: {
          h1: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('h1', { class: 'slotted-heading' }, [childMarkdown]),
          p: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('p', { class: 'slotted-paragraph' }, [childMarkdown]),
          strong: ({ childMarkdown }: { childMarkdown: VNode }) =>
            h('strong', { class: 'slotted-strong' }, [childMarkdown]),
        },
      });

      expect(wrapper.find('h1.slotted-heading').exists()).toBe(true);
      expect(wrapper.find('p.slotted-paragraph').exists()).toBe(true);
      expect(wrapper.find('strong.slotted-strong').exists()).toBe(true);
    });
  });

  describe('remarkPlugins prop', () => {
    test('processes markdown with remark-gfm for tables', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.table,
          remarkPlugins: [remarkGfm],
        },
      });

      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('thead').exists()).toBe(true);
      expect(wrapper.find('tbody').exists()).toBe(true);
      expect(wrapper.findAll('th').length).toBe(2);
      expect(wrapper.findAll('td').length).toBe(2);
    });

    test('processes markdown with remark-gfm for strikethrough', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.strikethrough,
          remarkPlugins: [remarkGfm],
        },
      });

      expect(wrapper.find('del').exists()).toBe(true);
      expect(wrapper.find('del').text()).toBe('strikethrough');
    });

    test('works without plugins for basic markdown', () => {
      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.basic,
          remarkPlugins: [],
        },
      });

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('p').exists()).toBe(true);
    });
  });

  describe('rehypePlugins prop', () => {
    test('processes markdown with custom rehype plugin', () => {
      // Simple rehype plugin that adds a class to all paragraphs
      const rehypeAddClass = () => {
        return (tree: Element) => {
          const visit = (node: Element | Element['children'][number]): void => {
            if (node.type === 'element' && node.tagName === 'p') {
              node.properties = node.properties || {};
              node.properties.className = ['rehype-modified'];
            }
            if ('children' in node && node.children) {
              node.children.forEach(visit);
            }
          };
          visit(tree);
        };
      };

      const wrapper = mount(Markdown, {
        props: {
          text: markdownExamples.paragraph,
          rehypePlugins: [rehypeAddClass],
        },
      });

      const paragraph = wrapper.find('p');
      expect(paragraph.exists()).toBe(true);
      expect(paragraph.classes()).toContain('rehype-modified');
    });
  });

  describe('Edge cases', () => {
    test('handles empty markdown', () => {
      const wrapper = mount(Markdown, {
        props: { text: '' },
      });

      // Empty markdown returns empty content
      expect(wrapper.html()).toBeDefined();
    });

    test('handles markdown with only whitespace', () => {
      const wrapper = mount(Markdown, {
        props: { text: '   \n\n   ' },
      });

      expect(wrapper.html()).toBeDefined();
    });

    test('handles special characters', () => {
      const wrapper = mount(Markdown, {
        props: { text: 'Text with <special> & "characters"' },
      });

      // HTML entities are escaped in markdown
      expect(wrapper.text()).toContain('Text with');
      expect(wrapper.text()).toContain('characters');
    });
  });
});
