# Security

VueMarkik builds Vue VNodes from markdown without using `v-html` or
`dangerouslySetInnerHTML`. Raw HTML in markdown is disabled, and URL-bearing
properties pass through a protocol policy immediately before the HAST tree is
converted to Vue output.

Those protections reduce the attack surface, but they are not the same as
sanitizing every element and property. This page defines the security boundary
for VueMarkik 1.x.

## Default protections

The default renderer:

- Parses CommonMark without enabling raw HTML.
- Does not evaluate scripts from the markdown source.
- Converts HAST to Vue VNodes instead of injecting an HTML string.
- Filters URL-bearing HAST properties after user-configured remark and rehype
  plugins have run.
- Allows relative URLs, fragment URLs, query URLs, and the `http`, `https`,
  `mailto`, and `tel` protocols.
- Removes URL properties using other explicit protocols, including
  `javascript`, `vbscript`, and `data`.

The same policy is used by `Markdown`, `MarkdownAsync`, and `MarkdownHooks`, in
browser and server rendering.

For example, this content renders a link without an `href`:

```md
[do not run](<javascript:alert(1)>)
```

## Trusted application code

The following inputs are code or configuration supplied by the host
application and must be trusted:

- Remark and rehype plugins.
- Custom Vue components and named slots.
- A custom `urlTransform`.

VueMarkik 1.x filters known URL-bearing properties after plugins run, but it
does not fully sanitize arbitrary elements, event properties, embedded content,
CSS, or other HAST a plugin may introduce. A plugin can therefore expand the
security boundary even when the markdown string itself is untrusted.

Review plugin security guidance and keep plugins current. If a plugin accepts
its own HTML, template, diagram, or configuration language, apply that plugin's
security controls too.

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
TypeScript view of the HAST element. Return a string to keep or rewrite the
property. Return `undefined` to remove it.

A custom transform replaces the default policy. If you want to extend the
default instead, call it first:

```ts
import { defaultUrlTransform, type UrlTransform } from 'vuemarkik';

const transformUrl: UrlTransform = (url) => {
  const safeUrl = defaultUrlTransform(url);
  return safeUrl ? addApplicationTracking(safeUrl) : undefined;
};
```

Treat a custom transform as security-sensitive configuration. Do not return a
URL rejected by `defaultUrlTransform` unless the content and destination are
trusted.

## What the 1.x boundary does not cover

The default policy does not promise:

- Complete sanitization of arbitrary HAST produced by plugins.
- Safety of custom component or slot behavior.
- Privacy or safety of remote resources reached through allowed URLs.
- Protection from denial of service caused by extremely large or pathological
  markdown or expensive plugins.

Apply application-level input-size limits when content is attacker-controlled.
Move expensive or untrusted processing into an appropriately isolated worker
when availability is important.

## Upstream security model

VueMarkik follows the unified ecosystem's guidance instead of assuming that
parsing alone makes output safe:

- [remark security](https://github.com/remarkjs/remark#security)
- [remark-rehype security](https://github.com/remarkjs/remark-rehype#security)
- [rehype security](https://github.com/rehypejs/rehype#security)
- [hast-util-to-jsx-runtime security](https://github.com/syntax-tree/hast-util-to-jsx-runtime#security)
- [rehype-sanitize security](https://github.com/rehypejs/rehype-sanitize#security)

These projects recommend sanitizing untrusted HAST before rendering it.
VueMarkik 1.x provides a non-breaking URL-policy patch; a future major release
can make full final-HAST sanitization the default without silently changing
existing plugin output in a patch release.

## Reporting a vulnerability

Please use
[GitHub private vulnerability reporting](https://github.com/taugr/vuemarkik/security)
instead of opening a public issue.
