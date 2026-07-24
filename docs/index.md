---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'VueMarkik'
  text: 'Markdown rendering for Vue.js'
  tagline: Extensible and customizable, powered by unified, remark, and rehype
  image:
    src: /logo.webp
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: What is VueMarkik?
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/taugr/vuemarkik

features:
  - title: Compliant
    icon: ✅
    details: 100% support for CommonMark, with GFM and MDX supported through plugins.
  - title: Safe
    icon: 🛡️
    details: Sanitizes final HAST after plugins, builds Vue VNodes without dangerouslySetInnerHTML, and keeps raw HTML disabled.
  - title: Customizable
    icon: 🧩
    details: Create your own Vue components to customize rendering, e.g. pass your own component instead of &lt;h1&gt; for &num; hola.
  - title: Extensible
    icon: ➕
    details: Add functionality through remark and rehype plugins.
---
