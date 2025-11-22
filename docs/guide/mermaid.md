<script setup lang="ts">
import { MarkdownHooks } from '../../src';
import rehypeMermaid from 'rehype-mermaid';

const rehypePlugins = [
  [rehypeMermaid],
];

const diagram = `\
\`\`\`mermaid
mindmap
  root((Fish))
    Saltwater
      Tuna
      Clownfish
      Anglerfish
    Freshwater
      Trout
      Catfish
      Betta
    Cartilaginous
      Shark
      Ray
    Primitive
      Lamprey
\`\`\`
`;
</script>

# Mermaid Diagrams

Mermaid lets you describe flow charts, sequence diagrams, mind maps, and more using a compact text syntax. VueMarkik can render these diagrams by adding the `rehype-mermaid` plugin to your Markdown pipeline.

## Install rehype-mermaid

::: code-group

```sh [npm]
npm i -D rehype-mermaid
```

```sh [yarn]
yarn add -D rehype-mermaid
```

```sh [pnpm]
pnpm add -D rehype-mermaid
```

```sh [bun]
bun add -D rehype-mermaid
```

```sh [deno]
deno add npm:rehype-mermaid
```

:::

## Render diagrams in VueMarkik

Once the plugin is installed, pass it to `MarkdownHooks` (or `MarkdownAsync`) through the `rehypePlugins` prop. Any fenced code block with the `mermaid` language tag will be transformed into an interactive diagram.

```vue
<template>
  <MarkdownHooks :text="diagram" :rehypePlugins="rehypePlugins" />
</template>

<script setup lang="ts">
import { MarkdownHooks } from 'vuemarkik';
import rehypeMermaid from 'rehype-mermaid';

const rehypePlugins = [[rehypeMermaid]];

const diagram = `\
\`\`\`mermaid
mindmap
  root((Fish))
    Saltwater
      Tuna
      Clownfish
      Anglerfish
    Freshwater
      Trout
      Catfish
      Betta
    Cartilaginous
      Shark
      Ray
    Primitive
      Lamprey
\`\`\`
`;
</script>
```

This renders as:

<MarkdownExample>

::: raw
<MarkdownHooks :text="diagram" :rehypePlugins="rehypePlugins" />
:::

</MarkdownExample>

The default configuration renders inline SVGs. You can switch strategies (`'img-png'`, `'img-svg'`, `'inline-svg'`, or `'pre-mermaid'`), add responsive dark-mode images with `dark: true`, or pass a `mermaidConfig` object for diagram-level tweaks. Refer to the `rehype-mermaid` documentation for the full list of supported options.
