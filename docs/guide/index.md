# What is VueMarkik?

**VueMarkik** is a mini component library for Vue.js with components that take a markdown string and safely render it to Vue elements. It is built on top of [unified](https://github.com/unifiedjs/unified), using [remark](https://github.com/remarkjs/remark) to parse markdown, and [rehype](https://github.com/rehypejs/rehype) to render it to Vue components.

<div class="tip custom-block" style="padding-top: 8px">

Just want to use it? Skip to [Getting Started](./getting-started).

</div>

## Features

- **Markdown Extensions**

  VueMarkik can be configured with [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to change how markdown is transformed, enabling support for markdown syntax extensions such as GFM and MDX.

- **Custom Rendering**

  VueMarkik can be configured with [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to change how markdown is rendered, for example syntax highlighting with [Shiki](https://shiki.matsu.io/), diagrams with [mermaid](https://mermaid.js.org/), and math rendering with [KaTeX](https://katex.org/).

- **Custom Vue Components**

  To further customize the rendered markdown, you can provide custom Vue components that will be used instead of standard HTML elements, or use template slots for dynamic customization. For example, a custom component or slot for `<h1>` can customise the rendering of `# hola`.
