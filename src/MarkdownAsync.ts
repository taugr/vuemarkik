import { defineComponent } from 'vue';
import { createVFile, getProcessor, toJsx } from './rendering';
import type {
  ComponentsProp,
  MarkdownProp,
  RehypePluginsProp,
  RemarkPluginsProp,
  VueMarkSlots,
} from './types';

export default defineComponent({
  // Disable inherit attrs to avoid external styles interfering with markdown rendering.
  inheritAttrs: false,
  props: {
    text: {
      type: String as MarkdownProp,
      required: true,
    },
    components: {
      type: Object as ComponentsProp,
      default: () => ({}),
    },
    remarkPlugins: {
      type: Array as RemarkPluginsProp,
      default: () => [],
    },
    rehypePlugins: {
      type: Array as RehypePluginsProp,
      default: () => [],
    },
  },
  slots: Object as VueMarkSlots,
  async setup(props, { slots }) {
    const processor = getProcessor(props.remarkPlugins, props.rehypePlugins);

    const file = createVFile(props.text);
    const tree = await processor.run(processor.parse(file), file);

    const jsx = toJsx(tree, {
      ...props.components,
      ...slots,
    });

    return () => jsx;
  },
});
