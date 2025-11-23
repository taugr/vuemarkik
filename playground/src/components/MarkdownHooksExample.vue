<template>
  <MarkdownHooks
    :text="markdownHooksExample"
    @content-loaded="onContentLoaded"
  />

  <p>Markdown rendered: {{ markdownRendered }}</p>
</template>

<script setup lang="ts">
import { MarkdownHooks } from 'vuemarkik';
import { ref } from 'vue';

const markdownRendered = ref(false);

function onContentLoaded() {
  markdownRendered.value = true;
}

const markdownHooksExample = `
## Markdown Rendered Async with \`MarkdownHooks\`

This component allows markdown to be rendered asyncronously, without requiring an async setup function, thus not requiring a Suspense component.
`;
</script>
