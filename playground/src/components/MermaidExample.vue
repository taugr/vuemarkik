<template>
  <MarkdownHooks :text="diagram" :rehype-plugins="rehypePlugins" />
</template>

<script setup lang="ts">
import { MarkdownHooks, type RehypePlugins } from 'vuemarkik';
import rehypeMermaid from 'rehype-mermaid';

const rehypePlugins: RehypePlugins = [[rehypeMermaid]];

const diagram = `\
## Mermaid Diagrams Example

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
