<template>
  <h1>VueMarkik Examples</h1>

  <template v-for="(example, index) in examples" :key="index">
    <hr />
    <component :is="example" />
  </template>
</template>

<script setup lang="ts">
import MarkdownSyncExample from './MarkdownSyncExample.vue';
import MarkdownAsyncExample from './MarkdownAsyncExample.vue';
import MarkdownHooksExample from './MarkdownHooksExample.vue';
import CustomComponentsExample from './CustomComponentsExample.vue';
import CustomTemplateExample from './CustomTemplateExample.vue';
import CodeHighlightingExample from './CodeHighlightingExample.vue';
import MermaidExample from './MermaidExample.vue';
import GfmExample from './GfmExample.vue';
import KatexExample from './KatexExample.vue';

const examples = [
  MarkdownSyncExample,
  MarkdownAsyncExample,
  MarkdownHooksExample,
  CustomComponentsExample,
  CustomTemplateExample,
  GfmExample,
  CodeHighlightingExample,
  MermaidExample,
  KatexExample,
];
</script>
