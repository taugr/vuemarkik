<template>
  <Markdown :text="notes" :remark-plugins="remarkPlugins" />
</template>

<script setup lang="ts">
import { Markdown, type RemarkPlugins } from 'vuemarkik';
import remarkGfm from 'remark-gfm';

const remarkPlugins: RemarkPlugins = [remarkGfm];

const notes = `\
## GitHub Flavored Markdown (GFM) Example

### Shopping List

- [ ] bananas
- [x] apricots
- [x] pomegranates
- [ ] grapes
- [ ] nectarines

### Character table for the symmetric group S₃

| Class         | () | (12) (13) (23) | (123) (132) |
|:-------------:|:--:|:--------------:|:-----------:|
| χ₁ (trivial)  |  1 |       1        |      1      |
| χ₂ (sign)     |  1 |      -1        |      1      |
| χ₃ (standard) |  2 |       0        |     -1      |
`;
</script>
