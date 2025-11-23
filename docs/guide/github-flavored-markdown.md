<script setup lang="ts">
import { Markdown, type RemarkPlugins } from 'vuemarkik';
import remarkGfm from 'remark-gfm';

const remarkPlugins: RemarkPlugins = [
  remarkGfm
];

const notes = `\
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

# GitHub Flavoured Markdown (GFM)

GFM includes a variety of markdown syntax extensions including strike-through, tables, tasklists, and more. To extend VueMarkik with GFM first install the `remark-gfm` plugin:

::: code-group

```sh [npm]
npm install remark-gfm
```

```sh [yarn]
yarn add remark-gfm
```

```sh [pnpm]
pnpm add remark-gfm
```

```sh [bun]
bun add remark-gfm
```

```sh [deno]
deno add npm:remark-gfm
```

:::

You can then provide it to the `remark-plugins` prop as in the following example:

```vue
<template>
  <Markdown :text="notes" :remark-plugins="remarkPlugins" />
</template>

<script setup lang="ts">
import { Markdown, type RemarkPlugins } from 'vuemarkik';
import remarkGfm from 'remark-gfm';

const remarkPlugins: RemarkPlugins = [remarkGfm];

const notes = `\
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
```

This renders the following output:

<MarkdownExample>

:::raw
<Markdown :text="notes" :remark-plugins="remarkPlugins" />
:::

</MarkdownExample>
