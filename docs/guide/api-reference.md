# API Reference

Complete reference for vuemarkik components, props, and slots.

## Components

### Markdown

Synchronous markdown renderer. Processes markdown immediately during component setup.

**Props:**

| Prop            | Type     | Required | Default | Description                             |
| --------------- | -------- | -------- | ------- | --------------------------------------- |
| `text`          | `string` | Yes      | -       | Markdown content to render              |
| `components`    | `object` | No       | `{}`    | Custom Vue components for HTML elements |
| `remarkPlugins` | `array`  | No       | `[]`    | Remark plugins to process markdown      |
| `rehypePlugins` | `array`  | No       | `[]`    | Rehype plugins to transform HTML        |

**Slots:**

All HTML element names (e.g., `h1`, `p`, `code`, `a`) can be used as slots. Each slot receives a `node` object containing `childMarkdown`.

**Usage:**

```vue twoslash
<script setup lang="ts">
import { Markdown } from 'vuemarkik';

const markdown = '# Hello World\n\nThis is **bold** text.';
</script>

<template>
  <Markdown :text="markdown" />
</template>
```

**With Custom Components:**

```vue twoslash
<script setup lang="ts">
import { Markdown } from 'vuemarkik';
import { defineComponent } from 'vue';

const CustomH1 = defineComponent({
  template: '<h1 class="custom"><slot /></h1>',
});

const markdown = '# Custom Heading';
</script>

<template>
  <Markdown :text="markdown" :components="{ h1: CustomH1 }" />
</template>
```

---

### MarkdownAsync

Asynchronous markdown renderer. Uses async setup for processing markdown. Requires wrapping in `<Suspense>`. Use this when using rehype or remark plugins that need to run asynchronously.

**Props:**

| Prop            | Type     | Required | Default | Description                             |
| --------------- | -------- | -------- | ------- | --------------------------------------- |
| `text`          | `string` | Yes      | -       | Markdown content to render              |
| `components`    | `object` | No       | `{}`    | Custom Vue components for HTML elements |
| `remarkPlugins` | `array`  | No       | `[]`    | Remark plugins to process markdown      |
| `rehypePlugins` | `array`  | No       | `[]`    | Rehype plugins to transform HTML        |

**Slots:**

All HTML element names can be used as slots. Each slot receives a `node` object containing `childMarkdown`.

**Usage:**

```vue twoslash
<script setup lang="ts">
import { MarkdownAsync } from 'vuemarkik';

const markdown = '# Async Processing\n\nContent loaded asynchronously.';
</script>

<template>
  <Suspense>
    <MarkdownAsync :text="markdown" />
  </Suspense>
</template>
```

**Note:** `MarkdownAsync` is ideal when using plugins with async operations or when you need non-blocking rendering.

---

### MarkdownHooks

Reactive markdown renderer using Vue composables. Provides reactive updates and emits events. Use this when using rehype or remark plugins that run asynchronously.

**Props:**

| Prop            | Type     | Required | Default | Description                             |
| --------------- | -------- | -------- | ------- | --------------------------------------- |
| `text`          | `string` | Yes      | -       | Markdown content to render              |
| `components`    | `object` | No       | `{}`    | Custom Vue components for HTML elements |
| `remarkPlugins` | `array`  | No       | `[]`    | Remark plugins to process markdown      |
| `rehypePlugins` | `array`  | No       | `[]`    | Rehype plugins to transform HTML        |

**Events:**

| Event            | Payload | Description                                |
| ---------------- | ------- | ------------------------------------------ |
| `content-loaded` | None    | Emitted when markdown processing completes |

**Slots:**

All HTML element names can be used as slots. Each slot receives a `node` object containing `childMarkdown`.

**Usage:**

```vue
<script setup lang="ts">
import { MarkdownHooks } from 'vuemarkik';
import { ref } from 'vue';

const markdown = ref('# Initial Content');

function onContentLoaded() {
  console.log('Markdown rendered!');
}
</script>

<template>
  <MarkdownHooks :text="markdown" @content-loaded="onContentLoaded" />
</template>
```

**Note:** `MarkdownHooks` uses VueUse's `computedAsync` for reactive markdown processing.

---

### MarkdownChildNodes

Utility component for rendering child nodes within custom slots.

**Props:**

| Prop   | Type     | Required | Default | Description                                  |
| ------ | -------- | -------- | ------- | -------------------------------------------- |
| `node` | `object` | No       | -       | Node object containing `childMarkdown` VNode |

**Usage:**

```vue twoslash
<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdown = '# Custom Styled Heading\n\nWith custom `code` too.';
</script>

<template>
  <Markdown :text="markdown">
    <template #h1="node">
      <h1 class="custom-heading">
        <MarkdownChildNodes :node="node" />
      </h1>
    </template>
    <template #code="node">
      <code class="custom-code">
        <MarkdownChildNodes :node="node" />
      </code>
    </template>
  </Markdown>
</template>

<style scoped>
.custom-heading {
  color: #42b883;
  border-bottom: 2px solid currentColor;
}
.custom-code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}
</style>
```

---

## Props Reference

### Common Props

All markdown rendering components (`Markdown`, `MarkdownAsync`, `MarkdownHooks`) share the same props:

#### text

- **Type:** `string`
- **Required:** Yes
- **Description:** The markdown content to render

```ts twoslash
import { Markdown } from 'vuemarkik';
// ---cut---
const markdown: string = '# Hello\n\nThis is markdown.';
```

#### components

- **Type:** `Partial<Components>`
- **Required:** No
- **Default:** `{}`
- **Description:** Object mapping HTML element names to custom Vue components

```ts twoslash
import { Markdown } from 'vuemarkik';
import { defineComponent } from 'vue';
// ---cut---
const CustomLink = defineComponent({
  template: '<a class="custom-link"><slot /></a>',
});

const components = {
  a: CustomLink,
  code: defineComponent({ template: '<code class="code"><slot /></code>' }),
};
```

#### remarkPlugins

- **Type:** `PluggableList`
- **Required:** No
- **Default:** `[]`
- **Description:** Array of remark plugins to process markdown AST

```ts twoslash
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
// ---cut---
const plugins = [remarkGfm, remarkMath];
```

#### rehypePlugins

- **Type:** `PluggableList`
- **Required:** No
- **Default:** `[]`
- **Description:** Array of rehype plugins to transform HTML AST

```ts twoslash
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
// ---cut---
const plugins = [rehypeKatex, rehypeMermaid];
```

## Slots Reference

### Dynamic Slots

VueMarkik components support dynamic slots for any HTML element. The slot name corresponds to the HTML tag name.

**Available Slot Names:**

Any valid HTML element name can be used as a slot:

- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Text: `p`, `span`, `strong`, `em`, `code`
- Lists: `ul`, `ol`, `li`
- Links: `a`
- Structure: `div`, `section`, `article`
- And many more...

**Slot Props:**

Each slot receives a single prop `node`:

```ts twoslash
import { VNode } from 'vue';
// ---cut---
type SlotProps = {
  node: {
    childMarkdown: VNode;
  };
};
```

**Example:**

```vue twoslash
<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdown = '# Title\n\nA [link](https://example.com) here.';
</script>

<template>
  <Markdown :text="markdown">
    <!-- Custom heading -->
    <template #h1="node">
      <h1 class="title">
        <MarkdownChildNodes :node="node" />
      </h1>
    </template>

    <!-- Custom link -->
    <template #a="node">
      <a class="link" target="_blank">
        <MarkdownChildNodes :node="node" />
      </a>
    </template>
  </Markdown>
</template>
```

---

## Component Selection Guide

Choose the right component for your use case:

| Component              | Use When                                                               |
| ---------------------- | ---------------------------------------------------------------------- |
| **Markdown**           | Default choice for most cases. Fast, synchronous rendering.            |
| **MarkdownAsync**      | Using plugins with async operations. Requires `<Suspense>`.            |
| **MarkdownHooks**      | Using plugins with async operations without depending on `<Suspense>`. |
| **MarkdownChildNodes** | Rendering children in custom slots. Not used standalone.               |

**Recommendation:** If you are not using asynchronous plugins use with `Markdown`. If you need async support `MarkdownHooks` is recommended unless you are already using `Suspense` in your applications.
