# AGENTS.md

This file provides guidance to Codex and other coding agents working in this repository.

## Project Overview

VueMarkik is a Vue 3 library for rendering markdown safely without `v-html` or `dangerouslySetInnerHTML`. It uses the unified/remark/rehype pipeline and converts the resulting HAST tree into Vue VNodes with `hast-util-to-jsx-runtime`.

## Technology Stack

- Framework: Vue 3
- Language: TypeScript with `strict: true` and `verbatimModuleSyntax: true`
- Package manager: pnpm only
- Build tool: tsdown
- Testing: Vitest, Vue Test Utils, happy-dom
- Docs: VitePress 2 alpha

## Commands

### Development

```bash
pnpm install
pnpm dev
pnpm playground
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm typecheck
pnpm check
pnpm check:fix
pnpm fmt
pnpm fmt:fix
pnpm quality
pnpm quality:check
pnpm quality:typecheck
pnpm quality:test
pnpm quality:fmt
```

### Docs and release

```bash
pnpm build
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
pnpm release
```

### Targeted tests

```bash
pnpm vitest tests/Markdown.test.ts
pnpm vitest tests/Markdown.test.ts --watch
```

## Architecture

### Public exports

`src/index.ts` exports:

- `Markdown`
- `MarkdownAsync`
- `MarkdownHooks`
- `MarkdownChildNodes`
- `RemarkPlugins`
- `RehypePlugins`
- `SecurityMode`
- `SanitizeSchema`
- `UrlTransform`
- `RenderErrorMode`
- `RenderErrorPayload`
- `defaultSanitizeSchema`
- `defaultUrlTransform`

### Core components

1. `src/Markdown.ts`
   Synchronous renderer. Uses `renderMarkdownSync()` and watches props for rerendering.

2. `src/MarkdownAsync.ts`
   Async renderer intended for async plugin pipelines. Uses `async setup()` and keeps Suspense pending until the latest pre-mount render finishes.

3. `src/MarkdownHooks.ts`
   Reactive async renderer without Suspense. Uses `watch()` plus `shallowRef()` and emits `content-loaded` after successful async renders.

4. `src/MarkdownChildNodes.ts`
   Helper for custom components that need to render nested markdown content passed through `childMarkdown`.

### Rendering pipeline

The main flow in `src/rendering.ts` is:

```text
markdown text
  -> VFile
  -> remark-parse
  -> remark plugins
  -> remark-rehype
  -> rehype plugins
  -> HAST
  -> final HAST sanitization in safe mode
  -> URL transformation
  -> toJsxRuntime()
  -> Vue VNodes
```

Key functions:

- `getProcessor()` builds the unified processor from remark and rehype plugin lists.
- `createVFile()` wraps the input text in a `VFile`.
- `toJsx()` converts HAST to Vue-renderable output and wraps it in `markRaw()`.
- `renderMarkdownSync()` and `renderMarkdownAsync()` centralize rendering and error handling.

### Component customization

Rendering customization is supported through:

1. `components` prop
2. named slots keyed by tag name
3. `remarkPlugins`
4. `rehypePlugins`
5. `securityMode`, `sanitizeSchema`, and `urlTransform`

Slots and `components` are merged at render time, with slots passed into the JSX runtime as component replacements.

### Custom component contract

Important details from `src/rendering.ts`:

- `passNode: true` is enabled, so custom components receive the original HAST `node` prop.
- For component replacements, `children` is renamed to `childMarkdown`.
- The Vue-specific `jsxRender` helper calls `h()` for component types so slot content is preserved correctly.

If a custom component needs to render nested markdown content, use `MarkdownChildNodes` with the provided `childMarkdown` value.

### Error handling

All three renderer components support `errorMode`:

- `'silent'`: swallow render failures and emit `render-error`
- `'warn'`: log a warning and emit `render-error`
- `'throw'`: rethrow the rendering error

`Markdown`, `MarkdownAsync`, and `MarkdownHooks` all emit `render-error` with `{ error, text }`. `MarkdownHooks` also emits `content-loaded` after a successful async render.

## Types

Types live in `src/types.ts`.

- `Markdown` is the source markdown string type.
- `RemarkPlugins` and `RehypePlugins` are `PluggableList`.
- `RenderErrorMode` is `'silent' | 'warn' | 'throw'`.
- `SecurityMode` is `'safe' | 'trusted'`.
- `SanitizeSchema` configures final-HAST sanitization.
- `UrlTransform` filters or rewrites URL-bearing properties.
- `VueMarkSlots` maps HTML tag names to slot props that include `childMarkdown`.

Prefer `import type` for type-only imports.

## Testing

Tests live in `tests/` and use Vitest with `globals: true` and the `happy-dom` environment.

Key patterns:

- Use `mount()` from `@vue/test-utils`.
- Reuse fixtures and helper plugins from `tests/helpers.ts`.
- Coverage is configured with V8 and enforced at 100% for included `src/**/*.ts` files except `src/index.ts` and `src/types.ts`.

After code changes, run the most relevant checks. For broad changes, prefer `pnpm quality`.

## Documentation

Documentation source lives in `docs/` and `docs/.vitepress/`.

Important repo detail:

- `docs/.vitepress/dist/` and `docs/.vitepress/cache/` are generated artifacts.
- Do not hand-edit generated docs output unless the user explicitly asks for that.
- Prefer editing source docs and config, then rebuilding if needed.

## Build Configuration

- `tsdown.config.ts`: library build config, DTS generation enabled for Vue.
- `vite.config.ts`: playground Vite config, rooted at `./playground`.
- `vitest.config.ts`: happy-dom test environment and strict coverage thresholds.
- `docs/.vitepress/config.ts`: docs site config, Twoslash setup, group-icons plugin, llms plugin.

## Code Style and Implementation Notes

- Always use pnpm, never npm or yarn.
- Keep TypeScript explicit and compatible with strict mode.
- Linting uses `oxlint` via `pnpm check`; autofixes use `pnpm check:fix`.
- Formatting uses `oxfmt` via `pnpm fmt`; autofixes use `pnpm fmt:fix`.
- `pnpm quality` runs `quality:check`, `quality:typecheck`, `quality:test`, and `quality:fmt` in parallel.
- `lint-staged` runs `oxfmt --no-error-on-unmatched-pattern` on staged files.
- Use `defineComponent()` for library components.
- Wrapper renderer components intentionally set `inheritAttrs: false`.
- Use `markRaw()` for rendered vnode trees and raw custom test components where needed.
- Preserve the async stale-render protections in `MarkdownAsync` and `MarkdownHooks` when changing rerender logic.
- Prefer updating source files over generated output.
