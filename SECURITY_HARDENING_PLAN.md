# VueMarkik Security Hardening Plan

- Status: Implemented
- Target releases: `v1.2.2` security patch, followed by `v2.0.0`
- Scope: Rendering untrusted markdown safely through the existing unified, remark, rehype, HAST, and Vue pipeline

## Implementation Status

Updated 2026-07-24:

- `v1.2.2` is published and independently verified from the npm registry.
- The URL policy, shared renderer coverage, SSR exploit regression, empty-output
  fix, security guide, GitHub release, and deployed documentation are complete.
- The `v2` safe/trusted implementation, final-HAST sanitizer, migration guide,
  plugin compatibility suite, and bounded input regressions are complete.
- `v2.0.0-beta.1` is published under `next` and independently verified from
  the registry with runtime, TypeScript, exploit, SSR, and real plugin consumer
  checks.
- The final `v2.0.0` candidate is the same proven implementation with stable
  release metadata.

Resolved design decisions:

1. `urlTransform` receives the URL, property name, and a read-only TypeScript
   view of the current HAST element.
2. The default URL protocols are relative URLs plus `http`, `https`, `mailto`,
   and `tel`.
3. The safe schema extends `rehype-sanitize`'s GitHub-style default with `tel`
   links.
4. Custom schemas replace the default schema and are documented as
   security-sensitive configuration.
5. GFM is preserved in safe mode. Shiki, KaTeX, and Mermaid retain readable
   semantic/source output in safe mode but require trusted mode for their full
   generated presentation unless the application maintains a narrow schema.

## Objective

Make VueMarkik safe by default for untrusted markdown under a precise, documented threat model.

VueMarkik should continue to use the unified ecosystem rather than inventing its own parser or sanitizer. The missing step is to apply the safety controls that the upstream projects recommend before a HAST tree is converted into Vue VNodes.

This plan separates:

1. An immediate, narrowly scoped URL-security patch for the current `1.x` release line.
2. A breaking `2.0` release that adds final HAST sanitization by default.
3. Plugin compatibility, documentation, validation, publication, and deployment as distinct gates.

## Why This Work Is Necessary

VueMarkik currently has several useful safety properties:

- Markdown is parsed into syntax trees instead of being assigned through `v-html`.
- `remark-rehype` does not preserve raw HTML by default because `allowDangerousHtml` is not enabled.
- Vue escapes text content during rendering.

Those properties are valuable, but they do not form a complete XSS boundary. For example:

```md
[danger](<javascript:alert(1)>)
```

currently produces a link whose `href` is `javascript:alert(1)`.

This behavior matches the upstream security model:

- [remark](https://github.com/remarkjs/remark#security) says that rendering markdown as HTML can be unsafe and recommends `rehype-sanitize`.
- [remark-rehype](https://github.com/remarkjs/remark-rehype#security) warns that embedded HAST properties, custom handlers, and raw HTML can create XSS openings.
- [rehype](https://github.com/rehypejs/rehype#security) says that using rehype can be unsafe and recommends `rehype-sanitize`.
- [hast-util-to-jsx-runtime](https://github.com/syntax-tree/hast-util-to-jsx-runtime#security) says to sanitize user-controlled HAST before converting it into framework elements.
- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize#security) provides safe defaults but warns that later unsafe operations or an unsafe custom schema can reintroduce vulnerabilities.

VueMarkik can therefore build a strong safety claim on the unified ecosystem, but it cannot inherit that claim without adding the recommended sanitization boundary.

## Security Contract

### Protected input

In safe mode, the markdown string may be fully untrusted.

VueMarkik will:

- Keep raw HTML disabled.
- Remove unsafe elements and properties from the final HAST.
- Remove dangerous URL protocols.
- Prevent user rehype plugins from running after the final sanitizer.
- Pass only sanitized nodes and properties to Vue intrinsic elements and custom components.
- Preserve normal CommonMark output and explicitly supported plugin output.

### Trusted application code

The following remain trusted:

- VueMarkik itself and its dependencies.
- Remark and rehype plugin implementations and configuration.
- Custom Vue components and slots.
- Custom URL transforms.
- Custom sanitization schemas.

Sanitization protects the data produced by these extensions before rendering, but it cannot sandbox arbitrary JavaScript executed by a plugin or component.

### Explicitly out of scope

The safe-rendering claim will not promise:

- Protection from malicious plugin or component code executing during processing.
- Protection from every denial-of-service or resource-exhaustion payload.
- Safe behavior after a consumer deliberately selects trusted mode or supplies a permissive schema.
- Network privacy or safety for remote resources referenced by otherwise allowed URLs.

Input-size limits and worker isolation should be documented as application-level defenses against pathological markdown. A future opt-in `maxInputLength` API may be considered separately.

## Design Principles

1. Safe behavior must be the default in the next major release.
2. The final safety boundary must be owned by VueMarkik, not left to plugin ordering chosen by each consumer.
3. Escape hatches must be explicit and clearly named.
4. Security fixes must not depend on `v-html` or HTML-string serialization.
5. All three renderers must use the same security implementation.
6. Plugin compatibility must be proven with tests rather than broad allowlists.
7. Documentation must state the threat model instead of making unconditional claims such as “No XSS attacks.”

## Proposed Public API

### URL transformation

Add and export:

```ts
export type UrlTransform = (
  url: string,
  property: string,
  node: Element,
) => string | undefined;

export function defaultUrlTransform(
  url: string,
  property: string,
  node: Element,
): string | undefined;
```

Add a `urlTransform` prop to `Markdown`, `MarkdownAsync`, and `MarkdownHooks`.

Returning `undefined` removes the URL-bearing property. The default transform should allow:

- Relative URLs
- Fragment identifiers
- `http:`
- `https:`
- `mailto:`
- `tel:`

It should reject at least:

- `javascript:`
- `vbscript:`
- `data:`
- Obfuscated or mixed-case representations of unsafe protocols

The implementation must not rely on a simple case-sensitive prefix check. Its behavior should be covered by adversarial tests for whitespace, control characters, character references, percent encoding, and mixed case where browser URL parsing could interpret the result as an executable protocol.

### Security mode

Add and export in `v2`:

```ts
export type SecurityMode = 'safe' | 'trusted';
```

Add a `securityMode` prop to all three renderers:

```vue
<!-- v2 default -->
<Markdown :text="untrustedMarkdown" />

<!-- Explicit compatibility escape hatch -->
<Markdown :text="trustedMarkdown" security-mode="trusted" />
```

Behavior:

- `safe`: sanitize the final HAST and apply the URL transform.
- `trusted`: retain the current unsanitized HAST behavior, while keeping raw HTML disabled unless a future API explicitly changes that rule.

The `v2` default must be `safe`.

### Sanitization schema

Add a `sanitizeSchema` prop for advanced consumers:

```vue
<Markdown :text="markdown" :sanitize-schema="applicationSchema" />
```

Export the schema type used by the selected sanitizer. A custom schema changes the security boundary and must be documented as trusted configuration.

The initial implementation should prefer `hast-util-sanitize` directly in the centralized rendering layer. VueMarkik already holds the completed HAST immediately before `toJsxRuntime()`, so applying the utility there makes it unambiguously the final tree transformation. `rehype-sanitize` may still be used internally if it provides a cleaner integration without allowing later user plugins.

## Rendering Pipeline

The `v2` safe-mode pipeline should be:

```text
markdown text
  -> remark-parse
  -> user remark plugins
  -> remark-rehype
  -> user rehype plugins
  -> VueMarkik final HAST sanitizer
  -> VueMarkik URL policy
  -> toJsxRuntime()
  -> Vue VNodes
```

The sanitizer and URL policy must be implemented once in `src/rendering.ts` or a dedicated internal security module called by both `renderMarkdownSync()` and `renderMarkdownAsync()`.

Custom components and slots must receive the sanitized node and sanitized element properties. Security behavior must not differ between component replacements and intrinsic Vue elements.

## Phase 1: Immediate `v1.2.2` URL-Security Patch

### Implementation

- Add `defaultUrlTransform`.
- Add the `urlTransform` prop to all three renderers.
- Apply URL transformation immediately before `toJsxRuntime()`.
- Export `UrlTransform` and the default implementation.
- Preserve current behavior for normal links and images.
- Keep full HAST sanitization out of `1.x` because silently stripping plugin output would be a broad breaking change.

### Tests

Create a shared URL-security contract and run it against:

- `Markdown`
- `MarkdownAsync`
- `MarkdownHooks`

Cover:

- Safe relative, fragment, HTTP, HTTPS, email, and telephone URLs.
- `javascript:`, `vbscript:`, and `data:` URLs.
- Mixed-case protocols.
- Leading whitespace and control characters.
- Encoded or otherwise obfuscated dangerous protocols.
- Link and image URL properties.
- URLs introduced by remark or rehype plugins.
- Custom `urlTransform` behavior.
- Rerendering after a safe or rejected URL update.
- SSR output as well as browser-mounted output.

### Documentation

- Replace “No XSS attacks” with a scoped description of current protection.
- Explain that `v1.2.2` filters dangerous URLs and keeps raw HTML disabled.
- State that arbitrary plugin output is not fully sanitized until `v2`.
- Link to the upstream unified ecosystem security guidance.
- Add a short migration preview for the future safe/trusted modes.

### Acceptance criteria

- The known `javascript:` reproduction no longer emits an executable `href`.
- Safe URLs render unchanged.
- A consumer can supply a custom URL transform deliberately.
- Existing GFM, Shiki, KaTeX, Mermaid, custom-component, async, and streaming tests continue to pass.
- Library, declarations, docs, and packed-package validation pass.

## Phase 2: `v2.0` Safe-by-Default Sanitization

### Implementation

- Add `SecurityMode` and `securityMode`.
- Add `sanitizeSchema`.
- Add final HAST sanitization in safe mode.
- Make safe mode the `v2` default.
- Keep trusted mode as an explicit compatibility path.
- Ensure the URL transform still runs after sanitization as defense in depth.
- Ensure error handling remains consistent with `errorMode`.
- Avoid mutating user-provided plugin arrays or sanitizer schemas.

### Sanitizer behavior

Start from the upstream GitHub-style default schema rather than constructing a new broad schema from scratch.

The default safe schema should:

- Allow semantic CommonMark elements and properties.
- Preserve accessible properties required by supported markdown features.
- Remove scripting, event handlers, embedded browsing contexts, and unsafe metadata.
- Restrict URL-bearing properties to safe protocols.
- Restrict IDs and names in ways that avoid DOM clobbering.
- Reject styles unless explicitly required by a tested integration schema.
- Reject SVG and MathML unless explicitly enabled by a tested integration schema.

### Compatibility and migration

- Document trusted mode as a temporary migration tool rather than the recommended default.
- Include before-and-after examples for content that is intentionally removed.
- Explain that existing custom rehype plugins may require a schema extension.
- Treat the safe-default switch as a breaking change and release it only as `v2`.

### Acceptance criteria

- Unsafe elements and event properties introduced by markdown or plugins are absent from the rendered VNodes and SSR output.
- Sanitization is always the final HAST transformation in safe mode.
- Custom components cannot receive unsanitized HAST properties in safe mode.
- Trusted mode reproduces current `1.x` tree behavior.
- The default safe schema preserves normal CommonMark and GFM rendering.
- Every documented plugin integration either passes in safe mode with a tested schema or is explicitly documented as requiring trusted mode.

## Plugin Compatibility Matrix

Each documented integration must be evaluated separately:

| Integration       | Expected sanitizer pressure                                 | Required outcome                                                       |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| CommonMark        | Semantic HTML and standard properties                       | Works with the default safe schema                                     |
| GFM               | Tables, task-list classes/properties, footnote IDs and ARIA | Works with a narrowly extended default schema if necessary             |
| Shiki             | Token classes, inline styles, generated markup              | Provide and test a minimal schema recipe                               |
| KaTeX             | Classes, inline styles, MathML                              | Provide and test a minimal schema recipe                               |
| Mermaid           | SVG, classes, IDs, links, and presentation properties       | Audit carefully; provide a constrained schema or document trusted mode |
| Custom components | Sanitized element props and HAST node                       | Demonstrate safe component and slot examples                           |

For each integration:

1. Inventory the generated HAST.
2. Identify the minimum elements, properties, protocols, and class patterns required.
3. Add only those requirements to the recipe.
4. Add malicious neighboring properties to prove the recipe does not become a broad bypass.
5. Test browser and SSR output.

Do not add every plugin’s allowances to the core default schema. The base installation should remain narrow.

## Security Test Matrix

### URL attacks

- Dangerous protocols on links, images, and plugin-generated nodes.
- Mixed case, whitespace, control characters, encoding, and parser-normalization edge cases.
- Safe relative, fragment, HTTP, HTTPS, email, and telephone URLs.

### HAST property attacks

- `onclick`, `onerror`, and other event-like properties.
- Dangerous `style` content.
- Plugin-injected `hName`, `hProperties`, and `hChildren`.
- IDs and names associated with DOM clobbering.

### Element attacks

- `script`
- `iframe`
- `object`
- `embed`
- `style`
- SVG and MathML payloads
- Raw HTML combined with `rehype-raw`

### Renderer coverage

- Synchronous client rendering.
- Suspense-based async rendering.
- Hook-based async rendering.
- Stale async render suppression.
- Failed-render recovery.
- Server rendering.
- Hydration where practical.
- Empty and HTML-only input, including the existing SSR empty-root regression.

### Plugin and component coverage

- Malicious remark plugin output.
- Malicious rehype plugin output.
- Custom Vue component props.
- Named slot props.
- Safe schema extensions for documented integrations.
- Explicit trusted-mode behavior.

### Resource-exhaustion coverage

Do not treat performance tests as a complete denial-of-service guarantee. Add bounded regression tests for:

- Deeply nested constructs.
- Very large link or list counts.
- Maximum documented test input.
- Async plugin work during frequent streamed updates.

Document recommended application-level input limits and worker isolation.

## Documentation Work

Create `docs/guide/security.md` with:

- The precise threat model.
- Safe and trusted modes.
- Raw HTML behavior.
- Default allowed URL protocols.
- Custom URL transforms.
- Custom sanitization schemas.
- Plugin trust and ordering.
- GFM, Shiki, KaTeX, and Mermaid recipes.
- Resource-exhaustion guidance.
- Reporting security vulnerabilities.
- Links to the upstream security guidance.

Update:

- `README.md`
- `docs/index.md`
- `docs/guide/index.md`
- `docs/guide/getting-started.md`
- `docs/guide/api-reference.md`
- `docs/guide/remark-rehype-plugins.md`
- `docs/.vitepress/config.ts`
- `SECURITY.md`

Add a `v2` migration guide covering:

- The new safe default.
- Content and plugin output that may be removed.
- How to extend a schema safely.
- When trusted mode is appropriate.
- How to test an application before removing trusted mode.

## Validation Gates

Implementation and publication are separate decisions. Completing one gate does not authorize the next.

### Local implementation gate

- Requested source, tests, types, and documentation are complete.
- No unrelated files are changed.
- New dependencies and public API additions are justified.

### Local validation gate

Run at minimum:

```bash
pnpm quality
pnpm exec tsc --noEmit --declaration false --emitDeclarationOnly false
pnpm build
pnpm docs:build
pnpm pack --dry-run
```

Also validate:

- Browser and SSR security suites.
- Packed-package consumer behavior.
- Supported plugin recipes.
- Minimum and latest supported Vue consumer typings.
- Clean `git diff --check`.

Unavailable checks must be reported rather than inferred.

### Commit gate

- Review the complete diff and staged scope.
- Keep the `v1.2.2` patch and `v2` breaking work in separate commits or branches.
- Use conventional commit messages.
- Do not include unrelated dependency maintenance.

### Push and pull-request gate

- Push only after explicit approval.
- Report the exact branch and commit.
- Treat remote CI as separate from local validation.
- Address security-sensitive review feedback before merge.

### Release gate

- Release only after explicit approval.
- Publish from a clean, validated commit.
- Verify the packed artifact, npm metadata, tag, GitHub release, and authoritative remote SHA.
- Use a prerelease such as `2.0.0-beta.1` before the final `2.0.0`.
- Do not describe the safe-default contract as released until the published package has been verified.

### Documentation deployment gate

- Deploy only after explicit approval or the repository’s approved main-branch workflow.
- Verify the deployed security guide and migration guide.
- Confirm that the public wording matches the actually published package version.

## Recommended Work Packages

### Work package A: Baseline and adversarial fixtures

- Add failing tests for the current dangerous URL behavior.
- Add reusable security fixtures and renderer contract helpers.
- Add SSR coverage for the security cases and empty-output regression.

### Work package B: `v1.2.2` URL patch

- Implement and export URL transformation.
- Add component props and types.
- Update current-version security wording.
- Complete local validation.

### Work package C: `v2` sanitization core

- Add safe/trusted modes.
- Add final HAST sanitization and schema support.
- Prove that custom components receive sanitized props.
- Add migration tests for trusted mode.

### Work package D: Plugin schemas and documentation

- Audit GFM, Shiki, KaTeX, and Mermaid output.
- Add minimal tested schema recipes.
- Write the security and migration guides.

### Work package E: Prerelease and consumer verification

- Validate the packed package against supported Vue versions.
- Publish a beta only after explicit approval.
- Gather compatibility feedback.
- Resolve regressions before the final major release.

## Open Design Decisions

Resolve these during implementation before stabilizing the public `v2` API:

1. Whether `urlTransform` receives the entire HAST node or a narrower immutable context object.
2. Whether URL transformation should run for all URL-bearing HAST properties or a documented fixed set.
3. Whether `sanitizeSchema` accepts the upstream schema object directly or a VueMarkik-owned extension format.
4. Whether small schema recipes belong in the core package or only in documentation and tests.
5. Whether Mermaid can be supported safely with a constrained schema or should require trusted mode initially.
6. Whether resource limits should remain guidance or become an optional future prop.

These decisions must not delay the immediate dangerous-URL patch.

## Definition of Done

This initiative is complete when:

- The current dangerous URL reproduction is fixed in the published `1.x` patch.
- VueMarkik `v2` sanitizes untrusted markdown by default.
- Safe and trusted modes have explicit, tested behavior.
- The final sanitizer cannot be bypassed by user plugin ordering in safe mode.
- CommonMark and GFM work under the default safe schema.
- Every documented complex plugin has a tested safe recipe or a clear trusted-mode requirement.
- Browser, SSR, async, streaming, custom-component, and packed-consumer tests pass.
- Public documentation accurately states both the guarantee and its limits.
- The verified npm package, Git tag, GitHub release, and public documentation all describe the same security contract.
