# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VueMarkik is a Vue 3 library for rendering markdown content safely without `dangerouslySetInnerHTML`. It uses the unified/remark/rehype ecosystem for markdown processing and renders output as Vue components using JSX runtime.

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript (strict mode with `verbatimModuleSyntax: true`)
- **Package Manager**: pnpm (required - never use npm or yarn)
- **Build Tool**: tsdown (library bundler with DTS generation)
- **Testing**: Vitest with Vue Test Utils and happy-dom
- **Documentation**: VitePress 2.0 alpha

## Common Commands

### Development

```bash
pnpm install           # Install dependencies (use pnpm only)
pnpm playground        # Run the playground with Vite for component testing
pnpm dev               # Watch mode for building library
pnpm test              # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm typecheck         # Type check without emitting files
pnpm lint              # Lint codebase
pnpm lint:fix          # Fix lint errors
```

### Building & Publishing

```bash
pnpm build             # Build library to dist/
pnpm docs:dev          # Start VitePress dev server for documentation
pnpm docs:build        # Build documentation for production
pnpm release           # Bump version and publish to npm
```

### Testing Single Files

```bash
pnpm vitest tests/Markdown.test.ts          # Run specific test file
pnpm vitest tests/Markdown.test.ts --watch  # Run in watch mode
```

## Architecture

### Core Components

VueMarkik exports four main components from [src/index.ts](src/index.ts):

1. **Markdown** ([src/Markdown.ts](src/Markdown.ts)) - Synchronous markdown renderer
   - Uses `processor.runSync()` for immediate rendering
   - Best for static content or when plugins are synchronous

2. **MarkdownAsync** ([src/MarkdownAsync.ts](src/MarkdownAsync.ts)) - Async markdown renderer with Suspense support
   - Uses `async setup()` with `await processor.run()`
   - Required for async plugins like rehype-mermaid
   - Works with Vue's `<Suspense>` boundary

3. **MarkdownHooks** ([src/MarkdownHooks.ts](src/MarkdownHooks.ts)) - Reactive async renderer with lifecycle hooks
   - Uses `computedAsync` from @vueuse/core
   - Emits `content-loaded` event when rendering completes
   - Reactively updates when `text` prop changes

4. **MarkdownChildNodes** ([src/MarkdownChildNodes.ts](src/MarkdownChildNodes.ts)) - Helper for rendering child nodes in custom components
   - Used when custom components need to render markdown children
   - Receives `node` prop with `childMarkdown` VNode

### Rendering Pipeline

The markdown processing pipeline ([src/rendering.ts](src/rendering.ts)):

```
Input Text → VFile → remark-parse → remark plugins → remark-rehype → rehype plugins → HAST → toJsx() → Vue components
```

Key functions:

- **getProcessor()** - Creates unified processor with plugins
- **createVFile()** - Wraps markdown text in VFile
- **toJsx()** - Converts HAST to Vue JSX using `hast-util-to-jsx-runtime`
  - Custom jsxRender function handles Vue component slot passing
  - Renames `children` prop to `childMarkdown` for custom components
  - Uses `markRaw()` to prevent Vue reactivity on static content

### Type System

All types are defined in [src/types.ts](src/types.ts):

- **ComponentsProp** - Type for `components` prop (Partial<Components> from hast-util-to-jsx-runtime)
- **RemarkPluginsProp** - Type for `remarkPlugins` prop (PluggableList from unified)
- **RehypePluginsProp** - Type for `rehypePlugins` prop (PluggableList from unified)
- **VueMarkSlots** - Typed slots for custom element rendering
- **MarkdownProp** - Alias for string markdown content

### Customization System

Users can customize rendering in three ways:

1. **components prop** - Pass Vue components to replace HTML elements

   ```vue
   <Markdown :text="md" :components="{ h1: CustomHeading }" />
   ```

2. **slots** - Use Vue slots for inline customization

   ```vue
   <Markdown :text="md">
     <template #h1="{ childMarkdown }">
       <h1 class="custom">{{ childMarkdown }}</h1>
     </template>
   </Markdown>
   ```

3. **plugins** - Extend processing with remark/rehype plugins
   ```vue
   <Markdown
     :text="md"
     :remark-plugins="[remarkGfm]"
     :rehype-plugins="[rehypeKatex]"
   />
   ```

## Important Patterns

### Using Async Plugins

When plugins need async operations (like rehype-mermaid for generating SVGs):

- Use `MarkdownAsync` (requires `<Suspense>` wrapper)
- OR use `MarkdownHooks` (no Suspense needed, shows loading state)
- Never use synchronous `Markdown` component with async plugins

### Custom Components with Children

When creating custom components that need to render markdown children:

```vue
<script setup>
import { MarkdownChildNodes } from 'vuemarkik';
const props = defineProps(['node', 'childMarkdown']);
</script>

<template>
  <div class="custom-wrapper">
    <MarkdownChildNodes :node="{ childMarkdown }" />
  </div>
</template>
```

### Vue JSX Rendering Fix

The `jsxRender` function in [src/rendering.ts](src/rendering.ts:12-24) works around a Vue JSX limitation where slot content isn't passed correctly to components. It:

1. Detects component types (object/function)
2. Extracts children and passes as `childMarkdown` prop
3. Returns h() with slot function instead of jsx() for components

## Testing

Tests use Vitest with Vue Test Utils. Key patterns:

- Test files in [tests/](tests/) directory
- Helper utilities and fixtures in [tests/helpers.ts](tests/helpers.ts)
- Mount components with `mount()` from @vue/test-utils
- Test environment is happy-dom (not jsdom)
- All tests run with `globals: true` so no need to import describe/test/expect

## Documentation

Documentation uses VitePress 2.0 alpha:

- Guide pages in [docs/guide/](docs/guide/)
- API examples in [docs/api-examples.md](docs/api-examples.md)
- Supports Shiki Twoslash for TypeScript code examples
- Uses vitepress-plugin-group-icons for component documentation

## Build Configuration

- **tsdown.config.ts** - Library build with DTS generation, Vue support, platform-neutral output
- **vite.config.ts** - Used by playground for development
- **vitest.config.ts** - Test configuration with Vue plugin
- **tsconfig.json** - Strict TypeScript with verbatimModuleSyntax

## Code Style

- Always use pnpm for package management
- TypeScript strict mode - all types must be explicit
- Prefer `import type` for type-only imports
- Use `defineComponent` with setup function (not script setup for library components)
- Set `inheritAttrs: false` on wrapper components to prevent style conflicts
- Use `markRaw()` for static JSX output to prevent unnecessary reactivity
