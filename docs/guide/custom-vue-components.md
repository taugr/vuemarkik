<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from '../../src';

const exampleMarkdown = `\
# Custom Heading

This is a paragraph with some \`inline code\` to demonstrate customization.

## Another Heading

More content here.
`;

const componentsExampleMarkdown = `\
# Styled with Custom Component

This heading uses a separate Vue component file.

Here's some \`inline code\` that's also customized.
`;

const slotsExampleMarkdown = `\
# Styled with Custom Template

This heading uses an inline Vue template slot.

Here's some \`inline code\` customized with a slot too.
`;
</script>

# Custom Vue Components

VueMarkik allows you to customize how markdown elements are rendered by providing your own Vue components. This gives you complete control over the styling and behavior of any HTML element in your rendered markdown.

There are two approaches to customize markdown rendering:

1. **Using the `components` prop** - Pass custom Vue components defined in separate files
2. **Using Vue template slots** - Define custom rendering inline with template slots

Both approaches give you full control over styling and behavior. Choose based on whether you want to reuse components across multiple places (use `components` prop) or keep customization inline (use slots).

## Using Custom Vue Components

The `components` prop accepts an object mapping HTML element names to Vue components. This is ideal when you want to reuse the same custom styling across multiple markdown instances.

### Example: Custom H1 Component

First, create a Vue component for your custom element:

```vue
<template>
  <h1 class="custom-heading">
    <slot />
  </h1>
</template>

<style scoped>
.custom-heading {
  color: #42b883;
  font-weight: bold;
  border-bottom: 3px solid #35495e;
  padding-bottom: 0.5rem;
}
</style>
```

::: tip
The `<slot />` element is required to render the child nodes (text content, nested elements, etc.) of the markdown element. Without it, your custom component would be empty.
:::

Then use it by passing it to the `components` prop:

```vue
<template>
  <Markdown :text="markdown" :components="components" />
</template>

<script setup lang="ts">
import { Markdown } from 'vuemarkik';
import CustomH1 from './CustomH1.vue';

const components = {
  h1: CustomH1,
};

const markdown = `\
# Custom Heading

This heading will be rendered using CustomH1 component.
`;
</script>
```

### Example: Custom Code Component

You can customize any HTML element, including inline code:

```vue
<template>
  <code class="custom-code">
    <slot />
  </code>
</template>

<style scoped>
.custom-code {
  background-color: #f3f4f6;
  color: #e74c3c;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: bold;
}
</style>
```

Use it the same way:

```vue
<script setup lang="ts">
import { Markdown } from 'vuemarkik';
import CustomCode from './CustomCode.vue';

const components = {
  code: CustomCode,
};

const markdown = 'Here is some `inline code` that will be styled.';
</script>

<template>
  <Markdown :text="markdown" :components="components" />
</template>
```

### Live Example

Here's a live demonstration using a custom H1 component:

<MarkdownExample>

::: raw
<Markdown :text="componentsExampleMarkdown" :components="{ h1: CustomH1Component }" />
:::

</MarkdownExample>

## Using Vue Template Slots

Instead of creating separate component files, you can use Vue template slots to customize rendering inline. This approach uses the `MarkdownChildNodes` component to render the element's children.

### Example: Custom H1 with Slots

```vue
<template>
  <Markdown :text="markdown">
    <template #h1="node">
      <h1 class="custom-heading">
        <MarkdownChildNodes :node="node" />
      </h1>
    </template>
  </Markdown>
</template>

<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdown = `\
# Custom Heading

This heading is styled with an inline template slot.
`;
</script>

<style scoped>
.custom-heading {
  color: #42b883;
  font-weight: bold;
  border-bottom: 3px solid #35495e;
  padding-bottom: 0.5rem;
}
</style>
```

The `node` parameter contains the element's data, including `childMarkdown` which holds the rendered children. The `MarkdownChildNodes` component renders these children for you.

### Live Example

Here's a live demonstration using a custom H1 slot:

<MarkdownExample>

::: raw
<Markdown :text="slotsExampleMarkdown">
<template #h1="node">

<h1 style="color: #9333ea; font-weight: bold; border-left: 4px solid #9333ea; padding-left: 1rem;">
<MarkdownChildNodes :node="node" />
</h1>
</template>
</Markdown>
:::

</MarkdownExample>

### Example: Custom Code with Slots

```vue
<template>
  <Markdown :text="markdown">
    <template #code="node">
      <code class="custom-code">
        <MarkdownChildNodes :node="node" />
      </code>
    </template>
  </Markdown>
</template>

<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';

const markdown = 'Here is some `inline code` with custom styling.';
</script>

<style scoped>
.custom-code {
  background-color: #f3f4f6;
  color: #e74c3c;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: bold;
}
</style>
```

### Live Example

Here's a live demonstration using a custom code slot:

<MarkdownExample>

::: raw
<Markdown :text="slotsExampleMarkdown">
<template #code="node">
<code style="background-color: #fef3c7; color: #92400e; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; border: 1px solid #fbbf24;">
<MarkdownChildNodes :node="node" />
</code>
</template>
</Markdown>
:::

</MarkdownExample>

## Combining Both Approaches

You can mix both approaches - use the `components` prop for some elements and slots for others:

```vue
<template>
  <Markdown :text="markdown" :components="{ h1: CustomH1 }">
    <template #code="node">
      <code class="inline-custom">
        <MarkdownChildNodes :node="node" />
      </code>
    </template>
  </Markdown>
</template>
```

<script lang="ts">
import { defineComponent, h } from 'vue';

// Vitepress limitations mean we have to define a component with a render function
// rather than with a template
const CustomH1Component = defineComponent({
  setup(_, { slots }) {
    return () => h(
      'h1',
      {
        style: {
          color: '#42b883',
          fontWeight: 'bold',
          borderBottom: '3px solid #35495e',
          paddingBottom: '0.5rem'
        }
      },
      slots.default?.()
    );
  }
});

export default {
  components: {
    CustomH1Component
  }
};
</script>
