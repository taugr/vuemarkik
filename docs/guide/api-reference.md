# API Reference

Complete reference for vuemarkik components, props, events, and slots.

## Components

### Markdown

Synchronous markdown renderer. Processes markdown immediately during component setup.

If a render fails, `Markdown` preserves the last successful render by default. This is useful when the markdown source is updated incrementally, for example while streaming output from an LLM.

**Props:**

| Prop             | Type              | Required | Default                 | Description                               |
| ---------------- | ----------------- | -------- | ----------------------- | ----------------------------------------- |
| `text`           | `string`          | Yes      | -                       | Markdown content to render                |
| `components`     | `object`          | No       | `{}`                    | Custom Vue components for HTML elements   |
| `remarkPlugins`  | `RemarkPlugins`   | No       | `[]`                    | Remark plugins to process markdown        |
| `rehypePlugins`  | `RehypePlugins`   | No       | `[]`                    | Rehype plugins to transform HTML          |
| `securityMode`   | `SecurityMode`    | No       | `'safe'`                | Selects safe or trusted plugin output     |
| `sanitizeSchema` | `SanitizeSchema`  | No       | `defaultSanitizeSchema` | Configures final-HAST sanitization        |
| `urlTransform`   | `UrlTransform`    | No       | `defaultUrlTransform`   | Filters or rewrites URL properties        |
| `errorMode`      | `RenderErrorMode` | No       | `'silent'`              | Controls how render failures are surfaced |

**Events:**

| Event          | Payload              | Description                                                          |
| -------------- | -------------------- | -------------------------------------------------------------------- |
| `render-error` | `RenderErrorPayload` | Emitted when markdown rendering fails in `'silent'` or `'warn'` mode |

**Slots:**

All HTML element names (e.g., `h1`, `p`, `code`, `a`) can be used as slots. Each slot receives `childMarkdown` plus the normal props for that element, such as `href` on links.

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

If an updated render fails, `MarkdownAsync` keeps the previous successful output unless `errorMode` is set to `'throw'`.

**Props:**

| Prop             | Type              | Required | Default                 | Description                               |
| ---------------- | ----------------- | -------- | ----------------------- | ----------------------------------------- |
| `text`           | `string`          | Yes      | -                       | Markdown content to render                |
| `components`     | `object`          | No       | `{}`                    | Custom Vue components for HTML elements   |
| `remarkPlugins`  | `RemarkPlugins`   | No       | `[]`                    | Remark plugins to process markdown        |
| `rehypePlugins`  | `RehypePlugins`   | No       | `[]`                    | Rehype plugins to transform HTML          |
| `securityMode`   | `SecurityMode`    | No       | `'safe'`                | Selects safe or trusted plugin output     |
| `sanitizeSchema` | `SanitizeSchema`  | No       | `defaultSanitizeSchema` | Configures final-HAST sanitization        |
| `urlTransform`   | `UrlTransform`    | No       | `defaultUrlTransform`   | Filters or rewrites URL properties        |
| `errorMode`      | `RenderErrorMode` | No       | `'silent'`              | Controls how render failures are surfaced |

**Events:**

| Event          | Payload              | Description                                                          |
| -------------- | -------------------- | -------------------------------------------------------------------- |
| `render-error` | `RenderErrorPayload` | Emitted when markdown rendering fails in `'silent'` or `'warn'` mode |

**Slots:**

All HTML element names can be used as slots. Each slot receives `childMarkdown` plus the normal props for that element, such as `href` on links.

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

`MarkdownHooks` is the best fit for LLM-style streaming updates. When an intermediate update fails to render, the component preserves the last successful output and waits for the next valid update.

**Props:**

| Prop             | Type              | Required | Default                 | Description                               |
| ---------------- | ----------------- | -------- | ----------------------- | ----------------------------------------- |
| `text`           | `string`          | Yes      | -                       | Markdown content to render                |
| `components`     | `object`          | No       | `{}`                    | Custom Vue components for HTML elements   |
| `remarkPlugins`  | `RemarkPlugins`   | No       | `[]`                    | Remark plugins to process markdown        |
| `rehypePlugins`  | `RehypePlugins`   | No       | `[]`                    | Rehype plugins to transform HTML          |
| `securityMode`   | `SecurityMode`    | No       | `'safe'`                | Selects safe or trusted plugin output     |
| `sanitizeSchema` | `SanitizeSchema`  | No       | `defaultSanitizeSchema` | Configures final-HAST sanitization        |
| `urlTransform`   | `UrlTransform`    | No       | `defaultUrlTransform`   | Filters or rewrites URL properties        |
| `errorMode`      | `RenderErrorMode` | No       | `'silent'`              | Controls how render failures are surfaced |

**Events:**

| Event            | Payload              | Description                                                          |
| ---------------- | -------------------- | -------------------------------------------------------------------- |
| `content-loaded` | None                 | Emitted when markdown processing completes successfully              |
| `render-error`   | `RenderErrorPayload` | Emitted when markdown rendering fails in `'silent'` or `'warn'` mode |

**Slots:**

All HTML element names can be used as slots. Each slot receives `childMarkdown` plus the normal props for that element, such as `href` on links.

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

**Note:** `MarkdownHooks` uses reactive async rendering to update content as the `text` prop changes.

**LLM Streaming Example:**

```vue
<script setup lang="ts">
import { MarkdownHooks } from 'vuemarkik';
import { ref } from 'vue';

const llmOutput = ref('### First chunk');

function reportMarkdownIssue(payload: { error: unknown; text: string }) {
  console.debug('Intermediate markdown could not be rendered.', payload);
}
</script>

<template>
  <MarkdownHooks
    :text="llmOutput"
    error-mode="silent"
    @render-error="reportMarkdownIssue"
  />
</template>
```

---

### MarkdownChildNodes

Utility component for rendering child nodes within custom slots.

**Props:**

| Prop   | Type     | Required | Default | Description                                 |
| ------ | -------- | -------- | ------- | ------------------------------------------- |
| `node` | `object` | Yes      | -       | Object containing the `childMarkdown` VNode |

**Usage:**

```vue twoslash
<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdown = '# Custom Styled Heading\n\nWith custom `code` too.';
</script>

<template>
  <Markdown :text="markdown">
    <template #h1="{ childMarkdown }">
      <h1 class="custom-heading">
        <MarkdownChildNodes :node="{ childMarkdown }" />
      </h1>
    </template>
    <template #code="{ childMarkdown }">
      <code class="custom-code">
        <MarkdownChildNodes :node="{ childMarkdown }" />
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

If you provide both `components` and a same-named slot for the same tag, the slot takes precedence.

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

- **Type:** `RemarkPlugins`
- **Required:** No
- **Default:** `[]`
- **Description:** Array of remark plugins to process markdown AST

```ts twoslash
import type { RemarkPlugins } from 'vuemarkik';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
// ---cut---
const plugins: RemarkPlugins = [remarkGfm, remarkMath];
```

#### rehypePlugins

- **Type:** `RehypePlugins`
- **Required:** No
- **Default:** `[]`
- **Description:** Array of rehype plugins to transform HTML AST

```ts twoslash
import type { RehypePlugins } from 'vuemarkik';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
// ---cut---
const plugins: RehypePlugins = [rehypeKatex, rehypeMermaid];
```

#### securityMode

- **Type:** `'safe' | 'trusted'`
- **Required:** No
- **Default:** `'safe'`
- **Description:** Controls whether final HAST is sanitized after plugins run

Safe mode owns the final sanitization boundary. Trusted mode preserves legacy
plugin output and should only be used with trusted markdown and plugins.

```ts twoslash
import type { SecurityMode } from 'vuemarkik';
// ---cut---
const securityMode: SecurityMode = 'safe';
```

#### sanitizeSchema

- **Type:** `SanitizeSchema`
- **Required:** No
- **Default:** `defaultSanitizeSchema`
- **Description:** Configures the allowlist used by final-HAST sanitization

The prop is only used in safe mode. Extend the exported default rather than
starting from an empty object:

```ts twoslash
import { defaultSanitizeSchema, type SanitizeSchema } from 'vuemarkik';
// ---cut---
const sanitizeSchema: SanitizeSchema = {
  ...defaultSanitizeSchema,
  attributes: {
    ...defaultSanitizeSchema.attributes,
    code: [
      ...(defaultSanitizeSchema.attributes?.code ?? []),
      ['className', 'language-javascript'],
    ],
  },
};
```

Custom schemas change the security boundary. See [Security](./security).

#### urlTransform

- **Type:** `UrlTransform`
- **Required:** No
- **Default:** `defaultUrlTransform`
- **Description:** Filters or rewrites URL-bearing HAST properties after
  plugins run

The default allows relative, fragment, query, HTTP, HTTPS, email, and telephone
URLs. It removes properties that use other explicit protocols. Return
`undefined` from a custom transform to remove a property.

```ts twoslash
import { defaultUrlTransform, type UrlTransform } from 'vuemarkik';
// ---cut---
const urlTransform: UrlTransform = (url) => {
  const safeUrl = defaultUrlTransform(url);
  return safeUrl?.replace('https://old.example/', 'https://new.example/');
};
```

See [Security](./security) before replacing the default policy.

#### errorMode

- **Type:** `'silent' | 'warn' | 'throw'`
- **Required:** No
- **Default:** `'silent'`
- **Description:** Controls how rendering failures are surfaced

Use `'silent'` when rendering markdown that may be temporarily invalid, such as streamed LLM output. The component keeps the last successful render and emits `render-error` without writing to the console.

Use `'warn'` while debugging to log a warning for each failed render. Use `'throw'` when you want failures to surface immediately, for example in tests.

```ts twoslash
import type { RenderErrorMode } from 'vuemarkik';
// ---cut---
const errorMode: RenderErrorMode = 'silent';
```

### Common Events

#### render-error

- **Payload:** `RenderErrorPayload`
- **Description:** Fired when a markdown render attempt fails in `'silent'` or `'warn'` mode. In `'throw'` mode the error is rethrown instead.

```ts twoslash
import type { RenderErrorPayload } from 'vuemarkik';
// ---cut---
function onRenderError(payload: RenderErrorPayload) {
  console.debug(payload.error, payload.text);
}
```

### MarkdownHooks Events

#### content-loaded

- **Payload:** None
- **Description:** Fired after `MarkdownHooks` completes a successful async render

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

Each slot receives a props object. `childMarkdown` is always present, and element-specific props are passed through as well:

```ts twoslash
import { VNode } from 'vue';
// ---cut---
type SlotProps = {
  childMarkdown: VNode;
  [propName: string]: unknown;
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
    <template #h1="{ childMarkdown }">
      <h1 class="title">
        <MarkdownChildNodes :node="{ childMarkdown }" />
      </h1>
    </template>

    <!-- Custom link -->
    <template #a="{ childMarkdown, href }">
      <a
        class="link"
        :href="typeof href === 'string' ? href : undefined"
        target="_blank"
      >
        <MarkdownChildNodes :node="{ childMarkdown }" />
      </a>
    </template>
  </Markdown>
</template>
```

---

## Component Selection Guide

Choose the right component for your use case:

| Component              | Use When                                                    |
| ---------------------- | ----------------------------------------------------------- |
| **Markdown**           | Default choice for most cases. Fast, synchronous rendering. |
| **MarkdownAsync**      | Using plugins with async operations. Requires `<Suspense>`. |
| **MarkdownHooks**      | Async plugins, reactive updates, or streamed LLM output.    |
| **MarkdownChildNodes** | Rendering children in custom slots. Not used standalone.    |

::: tip Recommendation
If you are not using asynchronous plugins use with `Markdown`. If you need async support `MarkdownHooks` is recommended unless you are already using `Suspense` in your applications.
:::

::: tip Streaming Markdown
For LLM-generated markdown, prefer `MarkdownHooks` with `error-mode="silent"`. If an intermediate chunk is temporarily invalid, VueMarkik keeps the last successful render and emits `render-error` so you can observe failures without flooding the console.
:::

See also: [Streaming Markdown](./streaming-markdown)
