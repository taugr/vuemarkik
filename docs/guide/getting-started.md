<script setup lang="ts">
const poetry = `\
### Poetry Corner

> "You are old, Father William," the young man said,  
> "And your hair has become very white;  
> And yet you incessantly stand on your head -  
> Do you think, at your age, it is right?"

*Excerpt from __You Are Old, Father William__ by Lewis Carroll*
`;
</script>

# Getting Started

## Installation

Install using your package manager:

::: code-group

```sh [npm]
npm install vuemarkik
```

```sh [yarn]
yarn add vuemarkik
```

```sh [pnpm]
pnpm add vuemarkik
```

```sh [bun]
bun add vuemarkik
```

```sh [deno]
deno add npm:vuemarkik
```

:::

## Simple Rendering

To render a markdown string, import the `Markdown` component and pass the string to the `text` prop:

```html
<template>
  <Markdown :text="poetry" />
</template>

<script setup>
  import { Markdown } from 'vuemarkik';

  const poetry = `\
### Poetry Corner

> "You are old, Father William," the young man said,  
> "And your hair has become very white;  
> And yet you incessantly stand on your head -  
> Do you think, at your age, it is right?"

*Excerpt from __You Are Old, Father William__ by Lewis Carroll*
`;
</script>
```

This renders the following:

<MarkdownExample>

::: raw
<Markdown :text="poetry" />
:::

</MarkdownExample>

## What's Next?

Learn how to customize and extend VueMarkik:

- **[Custom Vue Components](./custom-vue-components)** - Use your own components or slots for rendering
- **[Remark & Rehype Plugins](./remark-rehype-plugins)** - Extend markdown syntax and rendering
- **[Streaming Markdown](./streaming-markdown)** - Handle incremental LLM output without console spam

Or explore specific examples:

- **[GitHub Flavored Markdown](./github-flavored-markdown)** - Tables, task lists, strikethrough, and more
- **[Syntax Highlighting](./syntax-highlighting)** - Code highlighting with Shiki
- **[Mermaid Diagrams](./mermaid)** - Render diagrams and flowcharts
- **[Math with KaTeX](./katex)** - Display mathematical equations
