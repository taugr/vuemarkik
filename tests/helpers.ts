import { defineComponent, h, markRaw } from 'vue';

// Reusable markdown examples
export const markdownExamples = {
  basic: '# Hello World\n\nThis is a **bold** text and this is *italic*.',

  heading: '# Heading 1\n## Heading 2\n### Heading 3',

  paragraph: 'This is a simple paragraph with some text.',

  bold: 'This text has **bold** in it.',

  italic: 'This text has *italic* in it.',

  link: 'This is a [link](https://example.com).',

  list: '- Item 1\n- Item 2\n- Item 3',

  orderedList: '1. First\n2. Second\n3. Third',

  codeBlock: '```js\nconst x = 1;\n```',

  inlineCode: 'This is `inline code`.',

  table:
    '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',

  strikethrough: 'This is ~~strikethrough~~ text.',

  complex: `# Main Title

This is a paragraph with **bold** and *italic* text.

## Subsection

- List item 1
- List item 2

Here's a [link](https://example.com) and some \`inline code\`.

\`\`\`js
const greeting = "Hello World";
\`\`\`
`,
};

// Custom test components - marked as raw to avoid Vue reactivity warnings
export const CustomHeading = markRaw(
  defineComponent({
    props: {
      node: Object,
    },
    setup(props, { slots }) {
      // Extract level from the node's tagName (h1, h2, h3, etc.)
      const tagName = (props.node as { tagName: string })?.tagName || 'h1';
      return () =>
        h(
          tagName,
          { class: 'custom-heading' },
          slots.default ? slots.default() : [],
        );
    },
  }),
);

export const CustomParagraph = markRaw(
  defineComponent({
    setup(_, { slots }) {
      return () =>
        h(
          'p',
          { class: 'custom-paragraph' },
          slots.default ? slots.default() : [],
        );
    },
  }),
);

export const CustomLink = markRaw(
  defineComponent({
    props: {
      href: {
        type: String,
        required: true,
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          'a',
          { class: 'custom-link', href: props.href },
          slots.default ? slots.default() : [],
        );
    },
  }),
);

export const CustomCode = markRaw(
  defineComponent({
    setup(_, { slots }) {
      return () =>
        h(
          'code',
          { class: 'custom-code' },
          slots.default ? slots.default() : [],
        );
    },
  }),
);

export const CustomStrong = markRaw(
  defineComponent({
    setup(_, { slots }) {
      return () =>
        h(
          'strong',
          { class: 'custom-strong' },
          slots.default ? slots.default() : [],
        );
    },
  }),
);

const RENDER_FAILURE_TOKEN = '[[throw]]';

export const markdownRenderFailure = {
  token: RENDER_FAILURE_TOKEN,
  text: `# ${RENDER_FAILURE_TOKEN}`,
  message: 'synthetic render failure',
};

export const throwingRemarkPlugin = () => {
  return (_tree: unknown, file: { value?: unknown }) => {
    if (String(file.value ?? '').includes(RENDER_FAILURE_TOKEN)) {
      throw new Error(markdownRenderFailure.message);
    }
  };
};

export const asyncThrowingRemarkPlugin = () => {
  return async (_tree: unknown, file: { value?: unknown }) => {
    if (String(file.value ?? '').includes(RENDER_FAILURE_TOKEN)) {
      throw new Error(markdownRenderFailure.message);
    }
  };
};
