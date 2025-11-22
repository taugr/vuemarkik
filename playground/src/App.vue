<template>
  <h1>VueMarkik Examples</h1>

  <hr />

  <Markdown :text="markdownSyncExample" />

  <hr />

  <Suspense>
    <template #fallback>
      <div>Loading...</div>
    </template>
    <MarkdownAsync :text="markdownAsyncExample" />
  </Suspense>

  <hr />

  <MarkdownHooks
    :text="markdownHooksExample"
    @content-loaded="onContentLoaded"
  />

  <hr />

  <Markdown :text="markdownCustomComponentsExample" :components="components" />

  <hr />

  <Markdown :text="markdownCustomTemplateExample">
    <template #h2="node">
      <div class="custom-h2">
        <MarkdownChildNodes :node="node" />
      </div>
    </template>
  </Markdown>
</template>

<script setup lang="ts">
import {
  MarkdownHooks,
  Markdown,
  MarkdownAsync,
  MarkdownChildNodes,
} from '../../src';
import CustomH2 from './CustomH2.vue';

function onContentLoaded() {
  console.log('Markdown rendered!');
}

const components = {
  h2: CustomH2,
};

const markdownSyncExample = `
## 1. Markdown Rendered Synchronously with \`Markdown\`

This component renders markdown synchronously.

1. This is a list item
1. This is *another* list item

* This is a bullet point
* This is *another* bullet point

**This is a bold text**

_This is an italicized text_

\`\`\`
console.log("this is some code");
\`\`\`

[This is a link](https://www.tau.gr)
`;

const markdownAsyncExample = `
## 2. Markdown Rendered Async with \`MarkdownAsync\`

This component allows markdown to be rendered asyncronously, but requires the experimental [Suspense component](https://vuejs.org/guide/built-ins/suspense) to be used.
`;

const markdownHooksExample = `
## 3. Markdown Rendered Async with \`MarkdownHooks\`

This component allows markdown to be rendered asyncronously, without requiring an async setup function, thus not requiring a Suspense component.
`;

const markdownCustomComponentsExample = `
## 4. Markdown rendered with a custom Vue component

This example renders markdown by swapping out the default \`h2\` component with a custom Vue component.
`;

const markdownCustomTemplateExample = `
## 5. Markdown rendered with custom Vue template

This example renders markdown but swapping out the default \`h2\` component with a custom Vue template.
`;
</script>

<style scoped>
.custom-h2 {
  color: red;
  font-size: 1.5em;
}

hr {
  margin: 2em 0;
}
</style>
