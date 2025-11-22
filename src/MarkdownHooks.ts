import { defineComponent, ref, watch } from 'vue';
import { computedAsync } from '@vueuse/core';
import { createVFile, getProcessor, toJsx } from './rendering';
import type {
  ComponentsProp,
  RemarkPluginsProp,
  RehypePluginsProp,
  MarkdownProp,
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
  emits: {
    'content-loaded': () => true,
  },
  slots: Object as VueMarkSlots,
  setup(props, { emit, slots }) {
    const processor = getProcessor(props.remarkPlugins, props.rehypePlugins);

    const finishedLoading = ref(false);
    const initialState = undefined;
    const renderedContent = computedAsync(
      async () => {
        const file = createVFile(props.text);
        const tree = await processor.run(processor.parse(file), file);

        return toJsx(tree, {
          ...props.components,
          ...slots,
        });
      },
      initialState,
      finishedLoading,
    );

    watch(finishedLoading, () => {
      emit('content-loaded');
    });

    return () => renderedContent.value;
  },
});
