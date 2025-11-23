<script setup lang="ts">
import { MarkdownHooks, type RehypePlugins } from '../../src';
import rehypeMermaid from 'rehype-mermaid';

const rehypePlugins: RehypePlugins = [
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
npm install rehype-mermaid
```

```sh [yarn]
yarn add rehype-mermaid
```

```sh [pnpm]
pnpm add rehype-mermaid
```

```sh [bun]
bun add rehype-mermaid
```

```sh [deno]
deno add npm:rehype-mermaid
```

:::

## Render diagrams in VueMarkik

Once the plugin is installed, pass it to `MarkdownHooks` (or `MarkdownAsync`) through the `rehypePlugins` prop. Any fenced code block with the `mermaid` language tag will be transformed into an interactive diagram.

```vue
<template>
  <MarkdownHooks :text="diagram" :rehype-plugins="rehypePlugins" />
</template>

<script setup lang="ts">
import { MarkdownHooks, type RehypePlugins } from 'vuemarkik';
import rehypeMermaid from 'rehype-mermaid';

const rehypePlugins: RehypePlugins = [[rehypeMermaid]];

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
<MarkdownHooks :text="diagram" :rehype-plugins="rehypePlugins" />
:::

</MarkdownExample>

The default configuration renders inline SVGs. You can switch strategies (`'img-png'`, `'img-svg'`, `'inline-svg'`, or `'pre-mermaid'`), add responsive dark-mode images with `dark: true`, or pass a `mermaidConfig` object for diagram-level tweaks. Refer to the `rehype-mermaid` documentation for the full list of supported options.
