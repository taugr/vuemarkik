<div align="center">
  <img src="docs/public/logo.png" alt="VueMarkik Logo" width="200" />
  <h1>VueMarkik</h1>
  <p>Markdown rendering for Vue.js - extensible and customizable, powered by unified, remark, and rehype</p>

[![npm version](https://img.shields.io/npm/v/vuemarkik.svg)](https://www.npmjs.com/package/vuemarkik)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

## Features

✨ **Safe Rendering** - No `dangerouslySetInnerHTML`, all content is rendered through Vue components  
🎨 **Custom Components** - Replace any markdown element with your own Vue components  
🔌 **Plugin Support** - Full support for remark and rehype plugins  
📝 **GFM & More** - GitHub Flavored Markdown, math (KaTeX), diagrams (Mermaid), and syntax highlighting  
⚡ **Async Support** - Built-in async component for loading plugins on demand  
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

## Documentation

📚 **[Full Documentation](https://vuemarkik.dev)**

- [Getting Started](https://vuemarkik.dev/guide/getting-started) - Installation and basic usage
- [Custom Vue Components](https://vuemarkik.dev/guide/custom-vue-components) - Replace markdown elements with your components
- [Syntax Highlighting](https://vuemarkik.dev/guide/syntax-highlighting) - Code block highlighting with Shiki
- [GitHub Flavored Markdown](https://vuemarkik.dev/guide/github-flavored-markdown) - Tables, task lists, and more
- [KaTeX Math](https://vuemarkik.dev/guide/katex) - Render mathematical equations
- [Mermaid Diagrams](https://vuemarkik.dev/guide/mermaid) - Create diagrams and flowcharts
- [Remark & Rehype Plugins](https://vuemarkik.dev/guide/remark-rehype-plugins) - Extend markdown processing
- [API Reference](https://vuemarkik.dev/guide/api-reference) - Complete API documentation

## Development

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

MIT © [Tom Auger](https://github.com/tom-auger)
