# Security

VueMarkik is safe by default for untrusted markdown under the boundary
documented here. It keeps raw HTML disabled, runs user-configured remark and
rehype plugins, sanitizes their final HAST output, applies a URL policy, and
only then converts the tree to Vue VNodes without `v-html` or
`dangerouslySetInnerHTML`.

## Safe mode

`securityMode="safe"` is the default for `Markdown`, `MarkdownAsync`, and
`MarkdownHooks`.

The rendering pipeline is:

```text
markdown
  -> remark parser and plugins
  -> remark-rehype
  -> rehype plugins
  -> final HAST sanitizer
  -> URL transform
  -> Vue VNodes
```

The final sanitizer uses `rehype-sanitize` with a GitHub-style allowlist. It:

- Allows normal CommonMark and GFM elements and properties.
- Removes scripting, embedded browsing contexts, event properties, inline
  styles, and unknown metadata.
- Prefixes DOM-clobbering `id` and `name` values.
- Restricts URL protocols.
- Sanitizes the HAST node and properties passed to custom components and slots.

The default URL policy allows relative, fragment, query, `http`, `https`,
`mailto`, and `tel` URLs. Other explicit protocols, including `javascript`,
`vbscript`, and `data`, are removed.

## Trusted mode

Use trusted mode only when both the markdown and the configured plugins are
trusted:

```vue
<Markdown :text="trustedMarkdown" security-mode="trusted" />
```

Trusted mode skips final-HAST sanitization and preserves legacy plugin output.
The URL policy still runs, and raw HTML in markdown remains disabled.

This mode exists for compatibility with plugins such as Shiki, KaTeX, and
Mermaid that generate broad classes, inline styles, SVG, or data URLs. It is
not a safe fallback for arbitrary user content.

## Plugin compatibility

| Integration              | Safe mode                                                              | Trusted mode            |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------- |
| CommonMark               | Preserved                                                              | Preserved               |
| GitHub Flavored Markdown | Preserved by the default schema                                        | Preserved               |
| Shiki                    | Code remains readable; highlighting classes and styles are removed     | Full highlighted output |
| KaTeX                    | Math text remains readable; typesetting classes and styles are removed | Full typeset output     |
| Mermaid                  | Diagram source remains; rendered/enhanced output is removed            | Full plugin output      |

Plugin code always executes with the host application's privileges. Final-HAST
sanitization controls its rendered output; it does not sandbox the plugin
itself.

## Custom schemas

All renderers accept `sanitizeSchema`. Start from the exported default rather
than replacing it accidentally:

```ts
import { defaultSanitizeSchema, type SanitizeSchema } from 'vuemarkik';

const schema: SanitizeSchema = {
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

```vue
<Markdown :text="markdown" :sanitize-schema="schema" />
```

A custom schema changes the security boundary. In particular, do not broadly
allow `style`, event properties, scripts, embedded browsing contexts, SVG, or
data URLs merely to preserve a plugin's appearance. Prefer a narrowly tested
allowlist or trusted mode for content that is genuinely trusted.

## Custom URL policies

All rendering components accept `urlTransform`:

```vue
<script setup lang="ts">
import { Markdown, type UrlTransform } from 'vuemarkik';

const allowOnlyLocalUrls: UrlTransform = (url) => {
  if (url.startsWith('/') || url.startsWith('#')) {
    return url;
  }

  return undefined;
};
</script>

<template>
  <Markdown :text="markdown" :url-transform="allowOnlyLocalUrls" />
</template>
```

The callback receives the URL value, HAST property name, and a read-only
TypeScript view of the current HAST element, which has been sanitized in safe
mode. Return a string to keep or rewrite the property, or `undefined` to remove
it.

A custom transform replaces the default URL policy and therefore changes the
security boundary. To extend the default safely, call it first:

```ts
import { defaultUrlTransform, type UrlTransform } from 'vuemarkik';

const transformUrl: UrlTransform = (url) => {
  const safeUrl = defaultUrlTransform(url);
  return safeUrl ? addApplicationTracking(safeUrl) : undefined;
};
```

## Remaining trust boundary

Safe mode does not promise:

- Safety of the JavaScript executed by plugins, custom components, or slots.
- Safety after a custom schema or URL transform broadens the defaults.
- Privacy or safety of remote resources reached through allowed URLs.
- Protection from denial of service caused by extremely large or pathological
  markdown or expensive plugins.

Apply application-level input-size and update-rate limits when content is
attacker-controlled. Move expensive processing into an appropriately isolated
worker when availability is important.

## Upstream security model

VueMarkik follows the unified ecosystem's guidance:

- [remark security](https://github.com/remarkjs/remark#security)
- [remark-rehype security](https://github.com/remarkjs/remark-rehype#security)
- [rehype security](https://github.com/rehypejs/rehype#security)
- [hast-util-to-jsx-runtime security](https://github.com/syntax-tree/hast-util-to-jsx-runtime#security)
- [rehype-sanitize security](https://github.com/rehypejs/rehype-sanitize#security)

These projects recommend sanitizing user-controlled HAST after the last unsafe
operation. VueMarkik owns that final boundary in safe mode so consumer plugin
ordering cannot bypass it.

## Reporting a vulnerability

Please use
[GitHub private vulnerability reporting](https://github.com/taugr/vuemarkik/security)
instead of opening a public issue.
