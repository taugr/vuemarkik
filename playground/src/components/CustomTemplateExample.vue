<template>
  <Markdown :text="markdownCustomTemplateExample">
    <template #h2="node">
      <div class="custom-h2">
        <MarkdownChildNodes :node="node" />
      </div>
    </template>
  </Markdown>
</template>

<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdownCustomTemplateExample = `
## Markdown rendered with custom Vue template

This example renders markdown but swapping out the default \`h2\` component with a custom Vue template.
`;
</script>

<style scoped>
.custom-h2 {
  color: red;
  font-size: 1.5em;
}
</style>
