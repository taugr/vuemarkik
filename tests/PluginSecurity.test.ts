import rehypeShiki from '@shikijs/rehype';
import { flushPromises, mount } from '@vue/test-utils';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { nextTick } from 'vue';
import { Markdown, MarkdownHooks } from '../src';

describe('plugin security compatibility', () => {
  test('preserves GFM output in safe mode', () => {
    const wrapper = mount(Markdown, {
      props: {
        text: [
          '| Feature | Status |',
          '| --- | --- |',
          '| sanitizer | enabled |',
          '',
          '- [x] tested',
        ].join('\n'),
        remarkPlugins: [remarkGfm],
      },
    });

    expect(wrapper.get('table').text()).toContain('sanitizer');
    expect(wrapper.get('input').attributes('type')).toBe('checkbox');
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
  });

  test.each([
    { securityMode: 'safe' as const, highlighted: false },
    { securityMode: 'trusted' as const, highlighted: true },
  ])(
    'renders Shiki content with highlighting=$highlighted in $securityMode mode',
    async ({ securityMode, highlighted }) => {
      const wrapper = mount(MarkdownHooks, {
        props: {
          text: '```javascript\nconst answer = 42;\n```',
          rehypePlugins: [
            [
              rehypeShiki,
              {
                addLanguageClass: true,
                langs: ['javascript'],
                lazy: true,
                themes: {
                  light: 'github-light',
                  dark: 'github-dark',
                },
              },
            ],
          ],
          securityMode,
        },
      });

      await flushPromises();
      await vi.waitFor(
        async () => {
          await nextTick();
          expect(wrapper.find('code').exists()).toBe(true);
        },
        { timeout: 10_000 },
      );

      expect(wrapper.get('code').text()).toContain('const answer = 42');
      expect(wrapper.find('pre.shiki').exists()).toBe(highlighted);
    },
  );

  test.each([
    { securityMode: 'safe' as const, typeset: false },
    { securityMode: 'trusted' as const, typeset: true },
  ])(
    'renders KaTeX content with typesetting=$typeset in $securityMode mode',
    ({ securityMode, typeset }) => {
      const wrapper = mount(Markdown, {
        props: {
          text: '$E = mc^2$',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          securityMode,
        },
      });

      expect(wrapper.text()).toContain('E');
      expect(wrapper.find('.katex').exists()).toBe(typeset);
    },
  );

  test.each([
    { securityMode: 'safe' as const, enhanced: false },
    { securityMode: 'trusted' as const, enhanced: true },
  ])(
    'renders Mermaid source with enhancement=$enhanced in $securityMode mode',
    ({ securityMode, enhanced }) => {
      const wrapper = mount(Markdown, {
        props: {
          text: '```mermaid\ngraph TD;\nA-->B;\n```',
          rehypePlugins: [[rehypeMermaid, { strategy: 'pre-mermaid' }]],
          securityMode,
        },
      });

      expect(wrapper.get('pre').text()).toContain('graph TD');
      expect(wrapper.find('pre.mermaid').exists()).toBe(enhanced);
    },
  );
});
