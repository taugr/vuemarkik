<template>
  <Suspense>
    <template #fallback>
      <div>Loading...</div>
    </template>
    <MarkdownAsync :text="markdownAsyncExample" />
  </Suspense>
</template>

<script setup lang="ts">
import { MarkdownAsync } from 'vuemarkik';

const markdownAsyncExample = `
## Markdown Rendered Async with \`MarkdownAsync\`

This component allows markdown to be rendered asyncronously, but requires the experimental [Suspense component](https://vuejs.org/guide/built-ins/suspense) to be used.
`;
</script>
