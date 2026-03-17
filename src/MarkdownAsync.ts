import { defineComponent, shallowRef, watch } from 'vue';
import { renderMarkdownAsync } from './rendering';
import type {
  ComponentsProp,
  MarkdownProp,
  RehypePluginsProp,
  RemarkPluginsProp,
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
    'render-error': (payload: RenderErrorPayload) => {
      void payload;
      return true;
    },
  },
  slots: Object as VueMarkSlots,
  async setup(props, { emit, slots }) {
    const renderedContent = shallowRef<VNodeChild | null>(null);
    let renderVersion = 0;
    let pendingRender: Promise<void> | null = null;

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
        return;
      }

      emit('render-error', {
        error: result.error,
        text: props.text,
      });
    };

    const queueRender = () => {
      const nextRender = renderContent();
      pendingRender = nextRender;
      return nextRender;
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
        await queueRender();
      },
    );

    await queueRender();

    while (pendingRender) {
      const currentRender = pendingRender;
      // Props can change before async setup resolves, which queues a newer render.
      // Keep Suspense pending until the latest pre-mount render has finished.
      await currentRender;

      /* v8 ignore next -- exercised by the pre-mount stale-render tests, but V8 does not attribute the false branch here */
      if (currentRender === pendingRender) {
        break;
      }
    }

    return () => renderedContent.value;
  },
});
