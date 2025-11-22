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

The main power of **VueMarkik** is extensilibity to support markdown syntax extensions, and modify how markdown is rendered.

Take a look at the following examples:

1. Render GitHub Flavored Markdown
1. Code Syntax Highlighting with Shiki
1. Render Mermaid diagrams
1. Display math with KaTeX
