<script setup lang="ts">
import { MarkdownHooks } from '../../src';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const remarkPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex];

const proof = String.raw`
# Cayley’s Theorem

**Theorem.** Every group $G$ is isomorphic to a subgroup of the symmetric group on $G$.

**Proof.** Let $X = G$. For each $g \in G$ define the left-translation map
$$
L_g : X \to X, \quad L_g(x) = gx.
$$
Each $L_g$ is a bijection with inverse $L_{g^{-1}}$, so $L_g \in \mathrm{Sym}(X)$.
Define the map
$$
\rho : G \to \mathrm{Sym}(X), \quad \rho(g) = L_g.
$$
For all $g, h \in G$,
$$
\rho(gh) = L_{gh} = L_g \circ L_h = \rho(g)\rho(h),
$$
so $\rho$ is a homomorphism.  
If $\rho(g) = \mathrm{id}_X$, then $gx = x$ for all $x \in G$.  
Taking $x = e$ gives $g = e$.  
Hence $\ker \rho = \{e\}$ and $\rho$ is injective. Therefore $G \cong \rho(G) \le \mathrm{Sym}(X)$.

If $|G| = n$, then $\mathrm{Sym}(X) \cong S_n$, so $G$ embeds in $S_n$.
$$
\square
$$
`;
</script>

# KaTeX Math

Use KaTeX to typeset inline math (`$...$`) and display math (`$$...$$`) inside your VueMarkik content. The pipeline combines two plugins:

- `remark-math` parses inline and block level LaTeX expressions.
- `rehype-katex` renders those nodes into HTML markup using KaTeX.

## Install the math plugins

::: code-group

```sh [npm]
npm i -D remark-math rehype-katex katex
```

```sh [yarn]
yarn add -D remark-math rehype-katex katex
```

```sh [pnpm]
pnpm add -D remark-math rehype-katex katex
```

```sh [bun]
bun add -D remark-math rehype-katex katex
```

```sh [deno]
deno add npm:remark-math npm:rehype-katex npm:katex
```

:::

Import KaTeX’s stylesheet once in your app entry point (for example `main.ts`) so the rendered math picks up the correct fonts:

```ts
import 'katex/dist/katex.min.css';
```

## Render math in VueMarkik

Pass both plugins to VueMarkik through the `remarkPlugins` and `rehypePlugins` props. Math enclosed in dollar signs will be transformed automatically. The example below uses `String.raw` so LaTeX backslashes can be written exactly once.

```vue
<template>
  <MarkdownHooks :text="mathNotes" :remarkPlugins="remarkPlugins" :rehypePlugins="rehypePlugins" />
</template>

<script setup lang="ts">
import { MarkdownHooks } from 'vuemarkik';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const remarkPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex];

const proof = String.raw`
# Cayley’s Theorem

**Theorem.** Every group $G$ is isomorphic to a subgroup of the symmetric group on $G$.

**Proof.** Let $X = G$. For each $g \in G$ define the left-translation map
$$
L_g : X \to X, \quad L_g(x) = gx.
$$
Each $L_g$ is a bijection with inverse $L_{g^{-1}}$, so $L_g \in \mathrm{Sym}(X)$.
Define the map
$$
\rho : G \to \mathrm{Sym}(X), \quad \rho(g) = L_g.
$$
For all $g, h \in G$,
$$
\rho(gh) = L_{gh} = L_g \circ L_h = \rho(g)\rho(h),
$$
so $\rho$ is a homomorphism.
If $\rho(g) = \mathrm{id}_X$, then $gx = x$ for all $x \in G$.
Taking $x = e$ gives $g = e$.
Hence $\ker \rho = \{e\}$ and $\rho$ is injective. Therefore $G \cong \rho(G) \le \mathrm{Sym}(X)$.

If $|G| = n$, then $\mathrm{Sym}(X) \cong S_n$, so $G$ embeds in $S_n$.
$$
\square
$$`;
```

This renders as:

<MarkdownExample>

::: raw
<MarkdownHooks :text="proof" :remarkPlugins="remarkPlugins" :rehypePlugins="rehypePlugins" />
:::

</MarkdownExample>

## Configure KaTeX output

`rehype-katex` accepts any of the [KaTeX options](https://katex.org/docs/options.html). Pass them as the second item in the plugin tuple to enable features such as custom macros, error reporting, or `trust` mode for user-supplied HTML.

```ts
const rehypePlugins = [
  [rehypeKatex, { throwOnError: false, macros: { '\\RR': '\\mathbb{R}' } }],
];
```

Refer to the `remark-math` and `rehype-katex` documentation for additional capabilities like equation numbering or custom renderers.
