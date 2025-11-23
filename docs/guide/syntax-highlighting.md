<script setup lang="ts">
import { MarkdownHooks, type RehypePlugins } from 'vuemarkik';
import rehypeShiki from '@shikijs/rehype';

const rehypePlugins: RehypePlugins = [
  [
    rehypeShiki,
    {
      inline: false,
      addLanguageClass: true,
      defaultLanguage: 'markdown',
      fallbackLanguage: 'markdown',
      langs: ['javascript', 'html', 'markdown', 'haskell'],
      lazy: true,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  ],
];

const code = `\
\`\`\`javascript
// Generate prime numbers up to a limit
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function generatePrimes(limit) {
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

// Example: primes up to 50
console.log(generatePrimes(50));
\`\`\`

\`\`\`haskell
-- Infinite list of Fibonacci numbers
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- Print the first 20 Fibonacci numbers
main :: IO ()
main = print (take 20 fibs)
\`\`\`
`;
</script>

# Syntax Highlighting

Syntax highlighting for code blocks can be added through rehype plugins such as shiki, prism, and highlight.js. See the respective documentation pages for configuration and settings for each of these plugins.

## Shiki

To illustrate how to add syntax highlighting the following example shows how to install and configure shiki with VueMarkik. The steps for other syntax highlighting plugins is similar.

First install the shiki rehype plugin:

::: code-group

```sh [npm]
npm install @shikijs/rehype
```

```sh [yarn]
yarn add @shikijs/rehype
```

```sh [pnpm]
pnpm add @shikijs/rehype
```

```sh [bun]
bun add @shikijs/rehype
```

```sh [deno]
deno add npm:@shikijs/rehype
```

:::

By default Shiki runs asyncronously as it loads stylesheets dynamically based on which programming language it needs to render for. VueMarkik provides two components to support async rendering: the `MarkdownAsync` component uses the experimental suspense feature in Vue, and `MarkdownHooks` which uses a callback to render markdown without depending on the suspense feature.

In this example we use the `MarkdownHooks` component to render code blocks for multiple languages.

```vue
<template>
  <MarkdownHooks :text="code" :rehype-plugins="rehypePlugins" />
</template>

<script setup lang="ts">
import { MarkdownHooks, type RehypePlugins } from 'vuemarkik';
import rehypeShiki from '@shikijs/rehype';

const rehypePlugins: RehypePlugins = [
  [
    rehypeShiki,
    {
      inline: false,
      addLanguageClass: true,
      defaultLanguage: 'markdown',
      fallbackLanguage: 'markdown',
      langs: ['javascript', 'html', 'markdown', 'haskell'],
      lazy: true,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  ],
];

const code = `\
\`\`\`javascript
// Generate prime numbers up to a limit
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function generatePrimes(limit) {
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

// Example: primes up to 50
console.log(generatePrimes(50));
\`\`\`

\`\`\`haskell
-- Infinite list of Fibonacci numbers
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- Print the first 20 Fibonacci numbers
main :: IO ()
main = print (take 20 fibs)
\`\`\`
`;
</script>
```

This renders as:

<MarkdownExample>

::: raw
<MarkdownHooks :text="code" :rehype-plugins="rehypePlugins" />
:::

</MarkdownExample>

The configuration above lets Shiki lazily load the languages you specify, apply GitHub light and dark themes automatically, and fall back to Markdown highlighting when a language is unknown. Adjust the `langs`, `themes`, or other options to match the languages and styling needs of your project.
