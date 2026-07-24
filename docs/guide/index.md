# What is VueMarkik?

**VueMarkik** (pronounced _view-mark-eek_, IPA /vjuː mɑːrk ik/) is a mini component library for Vue.js with components that take a markdown string and render it to Vue elements without `v-html`. It is built on top of [unified](https://github.com/unifiedjs/unified), using [remark](https://github.com/remarkjs/remark) to parse markdown, and [rehype](https://github.com/rehypejs/rehype) to render it to Vue components. Raw HTML is disabled and unsafe URL protocols are filtered by default; see the [security guide](./security) for the complete trust boundary.

<div class="tip custom-block" style="padding-top: 8px">

Just want to use it? Skip to [Getting Started](./getting-started).

Working with LLM output? See [Streaming Markdown](./streaming-markdown).

</div>

<div class="info custom-block">

The name **VueMarkik** comprises the words _Vue Markdown_ with the Armenian diminutive _-ik_ (_-իկ_), which turns nouns into smaller, cuter, or familiar versions of themselves. Thus **VueMarkik** is a small friendly plugin for rendering markdown in Vue.js.

</div>

## Features

- **Markdown Extensions**

  VueMarkik can be configured with [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to change how markdown is transformed, enabling support for markdown syntax extensions such as GFM and MDX.

- **Custom Rendering**

  VueMarkik can be configured with [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to change how markdown is rendered, for example syntax highlighting with [Shiki](https://shiki.matsu.io/), diagrams with [mermaid](https://mermaid.js.org/), and math rendering with [KaTeX](https://katex.org/).

- **Custom Vue Components**

  To further customize the rendered markdown, you can provide custom Vue components that will be used instead of standard HTML elements, or use template slots for dynamic customization. For example, a custom component or slot for `<h1>` can customise the rendering of `# hola`.

- **Streaming-Friendly Recovery**

  When markdown is updated incrementally, such as from LLM output, VueMarkik can preserve the last successful render and emit `render-error` instead of flooding the console with warnings.
