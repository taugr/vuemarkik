<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from '../../src';
import MarkdownExample from '../components/MarkdownExample.vue';

// Sample markdown for examples
const h1ComponentExample = `\
# Custom Heading

This heading will be rendered using CustomH1 component.
`;

const codeComponentExample = 'Here is some `inline code` that will be styled.';

const h1SlotExample = `\
# Custom Heading

This heading is styled with an inline template slot.
`;

const codeSlotExample = 'Here is some `inline code` with custom styling.';

const combinedExample = `\
# Combined Approach

This uses a custom H1 component and has \`inline code\` with a slot.

## Subheading

More content to demonstrate.
`;
</script>

# Custom Vue Components

VueMarkik allows you to customize how markdown elements are rendered by providing your own Vue components. This gives you complete control over the styling and behavior of any HTML element in your rendered markdown.

There are two approaches to customize markdown rendering:

1. **Using the `components` prop** - Pass custom Vue components defined in separate files
2. **Using Vue template slots** - Define custom rendering inline with template slots

Both approaches give you full control over styling and behavior. Choose based on whether you want to reuse components across multiple places (use `components` prop) or keep customization inline (use slots).

::: tip Precedence
If you define both a custom component (via `components` prop) and a slot for the same HTML element, **the slot will take precedence**. This allows you to override component-level customizations on a per-instance basis.
:::

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

**Live Demo:**

<MarkdownExample>

::: raw
<Markdown :text="h1ComponentExample" :components="{ h1: CustomH1Component }" />
:::

</MarkdownExample>

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

**Live Demo:**

<MarkdownExample>

::: raw
<Markdown :text="codeComponentExample" :components="{ code: CustomCodeComponent }" />
:::

</MarkdownExample>

## Using Vue Template Slots

Instead of creating separate component files, you can use Vue template slots to customize rendering inline. This approach uses the `MarkdownChildNodes` component to render the element's children.

### Example: Custom H1 with Slots

```vue
<template>
  <Markdown :text="markdown">
    <template #h1="{ childMarkdown }">
      <h1 class="custom-heading">
        <MarkdownChildNodes :node="{ childMarkdown }" />
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

Slot props always include `childMarkdown`, which contains the rendered children. `MarkdownChildNodes` renders those children for you, and other element props such as `href` are passed through alongside it.

**Live Demo:**

<MarkdownExample>

::: raw
<Markdown :text="h1SlotExample">
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

**Live Demo:**

<MarkdownExample>

::: raw
<Markdown :text="codeSlotExample">
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

::: tip Precedence
If you define both a custom component (via `components` prop) and a slot for the same HTML element, **the slot will take precedence**. This allows you to override component-level customizations on a per-instance basis.
:::

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

<script setup lang="ts">
import { Markdown, MarkdownChildNodes } from 'vuemarkik';
import CustomH1 from './CustomH1.vue';

const markdown = `\
# Combined Approach

This uses a custom H1 component and has \`inline code\` with a slot.

## Subheading

More content to demonstrate.
`;
</script>

<style scoped>
.inline-custom {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #fbbf24;
}
</style>
```

**Live Demo:**

<MarkdownExample>

::: raw
<Markdown :text="combinedExample" :components="{ h1: CustomH1Component }">
<template #code="node">
<code style="background-color: #fef3c7; color: #92400e; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; border: 1px solid #fbbf24;">
<MarkdownChildNodes :node="node" />
</code>
</template>
</Markdown>
:::

</MarkdownExample>

<script lang="ts">
import { defineComponent, h } from 'vue';

// VitePress limitations mean we have to define components with render functions
// rather than with templates
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

const CustomCodeComponent = defineComponent({
  setup(_, { slots }) {
    return () => h(
      'code',
      {
        style: {
          backgroundColor: '#f3f4f6',
          color: '#e74c3c',
          padding: '0.2rem 0.4rem',
          borderRadius: '4px',
          fontFamily: "'Monaco', 'Courier New', monospace",
          fontWeight: 'bold'
        }
      },
      slots.default?.()
    );
  }
});

export default {
  components: {
    CustomH1Component,
    CustomCodeComponent
  }
};
</script>
