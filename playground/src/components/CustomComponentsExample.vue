<template>
  <Markdown :text="markdownCustomComponentsExample" :components="components" />
</template>

<script setup lang="ts">
import { Markdown } from 'vuemarkik';
import CustomH2 from './CustomH2.vue';

const components = {
  h2: CustomH2,
};

const markdownCustomComponentsExample = `
## Markdown rendered with a custom Vue component

This example renders markdown by swapping out the default \`h2\` component with a custom Vue component.
`;
</script>
