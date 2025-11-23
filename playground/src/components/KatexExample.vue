<template>
  <MarkdownHooks
    :text="proof"
    :remark-plugins="remarkPlugins"
    :rehype-plugins="rehypePlugins"
  />
</template>

<script setup lang="ts">
import {
  MarkdownHooks,
  type RemarkPlugins,
  type RehypePlugins,
} from 'vuemarkik';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const remarkPlugins: RemarkPlugins = [remarkMath];
const rehypePlugins: RehypePlugins = [rehypeKatex];

const proof = String.raw`
## KaTeX Math Example

### Cayley’s Theorem

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
</script>
