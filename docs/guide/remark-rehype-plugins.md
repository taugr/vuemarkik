# Plugins

VueMarkik utilizes _remark_ and _rehype_ to parse and process markdown to Vue components. Both of these projects have a rich ecosystem of plugins, enabling support of a variety of markdown formats and extensions, and the ability to transform the rendered output in any desired way.

## Remark Plugins

Remark plugins can inspect and transform Markdown. Their most common use is to support extensions to the CommonMark syntax, such as GitHub Flavored Markdown (GFM) and MDX.

The remark repo maintains [lists of available plugins](https://github.com/remarkjs/remark?tab=readme-ov-file#plugins).

### Examples

- [GitHub Flavored Markdown](./github-flavored-markdown.md)

## Rehype Plugins

Rehype plugins change the HTML that is rendered from markdown. Common scenarios include code syntax highlighting, diagram rendering, and math typesetting.

The rehype repo maintains [lists of available plugins](https://github.com/rehypejs/rehype?tab=readme-ov-file#plugins).

### Examples

- [Syntax Highlighting](./syntax-highlighting.md)
- [Mermaid Diagrams](./mermaid.md)
- [KaTeX Math](./katex.md)
