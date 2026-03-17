import { defineComponent, shallowRef, watch } from 'vue';
import { renderMarkdownAsync } from './rendering';
import type {
  ComponentsProp,
  RemarkPluginsProp,
  RehypePluginsProp,
  MarkdownProp,
  RenderErrorModeProp,
  RenderErrorPayload,
  VueMarkSlots,
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
    'content-loaded': () => true,
    'render-error': (payload: RenderErrorPayload) => {
      void payload;
      return true;
    },
  },
  slots: Object as VueMarkSlots,
  setup(props, { emit, slots }) {
    const renderedContent = shallowRef<VNodeChild | null>(null);
    let renderVersion = 0;

    const renderContent = async () => {
      const currentVersion = ++renderVersion;
      const result = await renderMarkdownAsync({
        text: props.text,
        components: {
          ...props.components,
          ...slots,
        },
        remarkPlugins: props.remarkPlugins,
        rehypePlugins: props.rehypePlugins,
        errorMode: props.errorMode,
      });

      if (currentVersion !== renderVersion) {
        return;
      }

      if (result.ok) {
        renderedContent.value = result.content;
        emit('content-loaded');
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
      async () => {
        await renderContent();
      },
      { immediate: true },
    );

    return () => renderedContent.value;
  },
});
