<div align="center">
  <img src="docs/public/logo.webp" alt="VueMarkik Logo" width="200" />
  <h1>VueMarkik</h1>
  <p>Markdown rendering for Vue.js - extensible and customizable, powered by unified, remark, and rehype</p>

[![npm version](https://img.shields.io/npm/v/vuemarkik.svg)](https://www.npmjs.com/package/vuemarkik)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

## Features

✨ **Safe by Default** - Sanitizes final HAST, builds Vue VNodes without `v-html`, and keeps raw HTML disabled<br>
🎨 **Custom Components** - Replace any markdown element with your own Vue components  
🔌 **Plugin Support** - Full support for remark and rehype plugins  
📝 **GFM & More** - GitHub Flavored Markdown, math (KaTeX), diagrams (Mermaid), and syntax highlighting  
⚡ **Async Support** - Built-in async components for Suspense and reactive updates  
🧠 **Streaming-Friendly** - Preserve the last successful render during invalid intermediate LLM or streamed markdown updates  
🎯 **TypeScript** - Fully typed with comprehensive type definitions

## Quick Start

### Installation

```bash
npm install vuemarkik
# or
pnpm add vuemarkik
# or
yarn add vuemarkik
```

### Basic Usage

```vue
<script setup>
import { Markdown } from 'vuemarkik';
</script>

<template>
  <Markdown text="# Hello World" />
</template>
```

## Async Rendering

Use `MarkdownAsync` when your markdown pipeline depends on async remark/rehype plugins and you already use Vue Suspense:

```vue
<script setup>
import { MarkdownAsync } from 'vuemarkik';
</script>

<template>
  <Suspense>
    <MarkdownAsync :text="markdown" :rehype-plugins="rehypePlugins" />
  </Suspense>
</template>
```

Use `MarkdownHooks` when the markdown changes reactively over time, especially for streamed or incrementally generated content:

```vue
<script setup>
import { MarkdownHooks } from 'vuemarkik';
</script>

<template>
  <MarkdownHooks
    :text="llmOutput"
    error-mode="silent"
    @render-error="reportMarkdownIssue"
  />
</template>
```

## Custom Rendering

You can replace markdown tags with your own Vue components:

```vue
<script setup>
import { Markdown } from 'vuemarkik';
import CustomHeading from './CustomHeading.vue';
</script>

<template>
  <Markdown :text="markdown" :components="{ h1: CustomHeading }" />
</template>
```

## Error Handling

All rendering components support the `errorMode` prop:

- `'silent'` keeps the last successful render and emits `render-error`
- `'warn'` keeps the last successful render, emits `render-error`, and logs a warning
- `'throw'` rethrows render failures

This is especially useful for streamed markdown where intermediate output may be temporarily invalid.

## Security

VueMarkik sanitizes the final HAST after remark and rehype plugins run, renders
the result as Vue VNodes without `v-html`, keeps raw HTML disabled, and filters
unsafe URL protocols. This is the default `securityMode="safe"` behavior.

Use `securityMode="trusted"` only for trusted content when a plugin needs output
that the safe schema removes. Plugins, custom components, slots, custom schemas,
and custom URL transforms remain trusted application configuration. Read the
[security guide](https://vuemarkik.dev/guide/security) before rendering
untrusted content with extensions, and see
[Migrating to v2](https://vuemarkik.dev/guide/migrating-to-v2) when upgrading.

## Components

VueMarkik exports four rendering helpers:

- `Markdown` for synchronous rendering
- `MarkdownAsync` for async rendering inside Vue `<Suspense>`
- `MarkdownHooks` for reactive async rendering without Suspense
- `MarkdownChildNodes` for rendering nested markdown inside custom slots or components

## Documentation

📚 **[Full Documentation](https://vuemarkik.dev)**

### Getting Started

- [Installation & Basic Usage](https://vuemarkik.dev/guide/getting-started) - Get up and running with VueMarkik

### Features & Examples

- [Syntax Highlighting](https://vuemarkik.dev/guide/syntax-highlighting) - Code block highlighting with Shiki
- [GitHub Flavored Markdown](https://vuemarkik.dev/guide/github-flavored-markdown) - Tables, task lists, and more
- [KaTeX Math](https://vuemarkik.dev/guide/katex) - Render mathematical equations
- [Mermaid Diagrams](https://vuemarkik.dev/guide/mermaid) - Create diagrams and flowcharts

### Advanced Usage

- [Custom Vue Components](https://vuemarkik.dev/guide/custom-vue-components) - Replace markdown elements with your components
- [Streaming Markdown](https://vuemarkik.dev/guide/streaming-markdown) - Handle incremental and LLM-style markdown updates
- [Remark & Rehype Plugins](https://vuemarkik.dev/guide/remark-rehype-plugins) - Extend markdown processing
- [Security](https://vuemarkik.dev/guide/security) - Understand the URL policy, plugin trust boundary, and threat model
- [Migrating to v2](https://vuemarkik.dev/guide/migrating-to-v2) - Adopt the new safe default and audit plugin output
- [API Reference](https://vuemarkik.dev/guide/api-reference) - Complete API documentation

## Development

> For contribution guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md)

### Install dependencies

```bash
pnpm install
```

### Run the playground

```bash
pnpm playground
```

### Run tests

```bash
pnpm test
```

### Build the library

```bash
pnpm build
```

## License

MIT © 2025-present [Tom Auger](https://github.com/taugr)
