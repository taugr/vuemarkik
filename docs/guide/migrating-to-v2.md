# Migrating to v2

VueMarkik v2 makes final-HAST sanitization the default. Normal CommonMark and
GitHub Flavored Markdown continue to render, while plugin-created elements,
properties, classes, and styles outside the safe schema are removed.

## Upgrade and run your tests

Install VueMarkik v2:

```sh
pnpm add vuemarkik@^2
```

Exercise every markdown source, plugin, custom component, slot, browser-rendered
surface, and SSR surface in your application. Pay particular attention to
syntax highlighting, math, diagrams, custom classes, inline styles, SVG, and
embedded content.

## Choose a migration path

### Keep safe mode

No prop is required:

```vue
<Markdown :text="untrustedMarkdown" />
```

Prefer this path for user content, LLM output, comments, documentation input,
and any markdown crossing a trust boundary.

If a plugin loses nonessential presentation, keep safe mode and style the
remaining semantic markup yourself. If specific properties are essential,
extend `defaultSanitizeSchema` with the smallest tested allowlist.

### Temporarily use trusted mode

To preserve VueMarkik 1.x plugin output:

```vue
<Markdown :text="trustedMarkdown" security-mode="trusted" />
```

Only use this with content and plugins you trust. Record each trusted-mode use
as a security exception and test a path back to safe mode.

Current compatibility:

- GFM works with the default safe schema.
- Shiki highlighting requires trusted mode unless you maintain a narrow custom
  schema for its generated output.
- KaTeX typesetting requires trusted mode unless you maintain a narrow custom
  schema.
- Mermaid rendering requires trusted mode; its SVG and data-URL strategies are
  intentionally outside the default schema.

## Review custom URL transforms

The default URL policy allows relative URLs and the `http`, `https`, `mailto`,
and `tel` protocols. A custom `urlTransform` replaces that policy. Call
`defaultUrlTransform` inside your custom callback unless you deliberately own a
different security policy.

## Review custom components and slots

In safe mode, custom components and slots receive sanitized HAST nodes and
element properties. Their own Vue code remains trusted and can still create
unsafe behavior, so review code that forwards URLs, creates HTML, loads remote
resources, or executes content.

## Verify before removing trusted mode

Before declaring an application migrated:

1. Test representative and adversarial markdown in the browser and under SSR.
2. Verify unsafe elements, event properties, styles, and protocols are absent.
3. Confirm documented plugin output remains usable.
4. Confirm custom components receive only the expected sanitized properties.
5. Remove temporary trusted-mode exceptions where possible.

See [Security](./security) for the full threat model and schema guidance.
