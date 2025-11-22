import { h, markRaw } from 'vue';
import { jsx, Fragment } from 'vue/jsx-runtime';
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { PluggableList } from 'unified';
import type { Nodes } from 'hast';
import { VFile } from 'vfile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsxRender = (type: any, props: any, key: any) => {
  // Fix a bug in the vue jsx render function where slot content
  // is not passed correctly when the type is a component
  if (typeof type === 'object' || typeof type === 'function') {
    const { children } = props;
    props.key = key;
    props.childMarkdown = children;
    delete props.children;
    return h(type, props, () => children);
  }

  return jsx(type, props, key);
};

export const toJsx = (tree: Nodes, components: Partial<Components>) => {
  const output = toJsxRuntime(tree, {
    Fragment,
    jsx: jsxRender,
    jsxs: jsxRender,
    elementAttributeNameCase: 'html',
    passNode: true,
    ignoreInvalidStyle: true,
    components,
  });

  return markRaw(output);
};

export const getProcessor = (
  remarkPlugins: PluggableList,
  rehypePlugins: PluggableList,
) =>
  unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype)
    .use(rehypePlugins);

export const createVFile = (text: string) => new VFile(text);
