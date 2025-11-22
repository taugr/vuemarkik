import { defineComponent, markRaw, type VNode, type PropType } from 'vue';

export default defineComponent({
  props: {
    node: {
      type: Object as PropType<{ childMarkdown: VNode }>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const childMarkdown = props.node?.childMarkdown;
      // Return null if there's no childMarkdown to avoid markRaw errors
      if (!childMarkdown) {
        return null;
      }
      return markRaw(childMarkdown);
    };
  },
});
