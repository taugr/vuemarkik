# AGENTS.md

This file provides guidance to Codex and other coding agents working in this repository.

## Codex workflow

Codex uses `gpt-6-astra` with medium reasoning in `.codex/config.toml`. Preserve that effort and explicit user model choices. This workflow applies the [Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).

- Carry action requests through the authorized implementation and verification. Resolve routine choices from the project; ask only when the answer changes the result materially, and continue independent work while waiting. Keep the original goal when the user adds corrections or side questions.
- Preserve unrelated edits and the user's boundaries for commits, publishing, and deployment. Reuse authorization already given; prepare the reviewable result before requesting any additional permission.
- Read applicable project skills for the affected area. User instructions take precedence over skill guidelines, subject to system and developer rules. If a skill blocks progress, link to the skill, quote the exact instruction, and explain whether the restriction is explicit or inferred.
- Report the outcome, evidence, and remaining limits in concise, plain prose. Use lists for steps or comparisons; avoid stock summaries and unnecessary jargon.
- Run checks proportional to the change and required project gates. Once they pass, repeat or broaden them only for new edits, failures, or unresolved concerns. Add tests for meaningful behavior, not to mirror low-impact documentation or configuration edits.
- Delegate only when the user or governing instructions authorize it. Then assign independent, bounded work with clear ownership and readable handoffs; avoid duplicate investigation.
- Preserve safe-mode sanitization, URL filtering, component/slot contracts, and stale-render protection across the synchronous and asynchronous renderers. Define success for the affected public behavior before choosing checks.
- Use the Testing section to select checks. Add tests for observable rendering behavior; instruction edits need formatting and a diff review, without a library or docs-site rebuild.

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
pnpm lint
pnpm lint:eslint
pnpm lint:eslint:fix
pnpm lint:oxlint
pnpm lint:oxlint:fix
pnpm fmt
pnpm fmt:fix
pnpm quality
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

After code changes, run the most relevant checks. For broad changes, run `pnpm quality` (lint and coverage tests) and `pnpm fmt`. Run `pnpm build` for library output and declaration changes, and `pnpm docs:build` for docs-site source or configuration changes. Instruction-only changes need a diff and formatting check.

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
- Linting uses ESLint and oxlint via `pnpm lint`; targeted autofixes use `pnpm lint:eslint:fix` and `pnpm lint:oxlint:fix`.
- Formatting uses `oxfmt` via `pnpm fmt`; autofixes use `pnpm fmt:fix`.
- `pnpm quality` runs `lint` and `test:coverage` in parallel; formatting is checked separately with `pnpm fmt`.
- `lint-staged` runs `oxfmt --no-error-on-unmatched-pattern` on staged files.
- Use `defineComponent()` for library components.
- Wrapper renderer components intentionally set `inheritAttrs: false`.
- Use `markRaw()` for rendered vnode trees and raw custom test components where needed.
- Preserve the async stale-render protections in `MarkdownAsync` and `MarkdownHooks` when changing rerender logic.
- Prefer updating source files over generated output.
