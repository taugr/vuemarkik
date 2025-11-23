<template>
  <Markdown :text="markdownSyncExample" />
</template>

<script setup lang="ts">
import { Markdown } from 'vuemarkik';

const markdownSyncExample = `
## Markdown Rendered Synchronously with \`Markdown\`

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
</script>
