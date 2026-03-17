import { defineComponent, shallowRef, watch } from 'vue';
import { renderMarkdownSync } from './rendering';
import type {
  ComponentsProp,
  RehypePluginsProp,
  RemarkPluginsProp,
  VueMarkSlots,
  MarkdownProp,
  RenderErrorModeProp,
  RenderErrorPayload,
} from './types';
import type { VNodeChild } from 'vue';

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
    errorMode: {
      type: String as RenderErrorModeProp,
      default: 'silent',
    },
  },
  emits: {
    'render-error': (payload: RenderErrorPayload) => {
      void payload;
      return true;
    },
  },
  slots: Object as VueMarkSlots,
  setup(props, { emit, slots }) {
    const renderedContent = shallowRef<VNodeChild | null>(null);

    const renderContent = () => {
      const result = renderMarkdownSync({
        text: props.text,
        components: {
          ...props.components,
          ...slots,
        },
        remarkPlugins: props.remarkPlugins,
        rehypePlugins: props.rehypePlugins,
        errorMode: props.errorMode,
      });

      if (result.ok) {
        renderedContent.value = result.content;
        return;
      }

      emit('render-error', {
        error: result.error,
        text: props.text,
      });
    };

    watch(
      () => [
        props.text,
        props.components,
        props.remarkPlugins,
        props.rehypePlugins,
        props.errorMode,
      ],
      renderContent,
      { immediate: true },
    );

    return () => renderedContent.value;
  },
});
