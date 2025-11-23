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
## Syntax Highlighting Example

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
