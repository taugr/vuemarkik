import { h, markRaw } from 'vue';
import { jsx, Fragment } from 'vue/jsx-runtime';
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { PluggableList } from 'unified';
import type { Nodes } from 'hast';
import { VFile } from 'vfile';
import type { RenderErrorMode } from './types';

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

const handleRenderError = (
  error: unknown,
  text: string,
  errorMode: RenderErrorMode,
) => {
  if (errorMode === 'throw') {
    throw error;
  }

  if (errorMode === 'warn') {
    console.warn('[vuemarkik] Failed to render markdown.', {
      error,
      text,
    });
  }
};

interface RenderMarkdownOptions {
  text: string;
  components: Partial<Components>;
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
  errorMode: RenderErrorMode;
}

export interface RenderSuccess {
  ok: true;
  content: ReturnType<typeof toJsx>;
}

export interface RenderFailure {
  ok: false;
  error: unknown;
}

export type RenderResult = RenderSuccess | RenderFailure;

export const renderMarkdownSync = ({
  text,
  components,
  remarkPlugins,
  rehypePlugins,
  errorMode,
}: RenderMarkdownOptions): RenderResult => {
  try {
    const processor = getProcessor(remarkPlugins, rehypePlugins);
    const file = createVFile(text);
    const tree = processor.runSync(processor.parse(file), file);

    return {
      ok: true,
      content: toJsx(tree, components),
    };
  } catch (error) {
    handleRenderError(error, text, errorMode);

    return {
      ok: false,
      error,
    };
  }
};

export const renderMarkdownAsync = async ({
  text,
  components,
  remarkPlugins,
  rehypePlugins,
  errorMode,
}: RenderMarkdownOptions): Promise<RenderResult> => {
  try {
    const processor = getProcessor(remarkPlugins, rehypePlugins);
    const file = createVFile(text);
    const tree = await processor.run(processor.parse(file), file);

    return {
      ok: true,
      content: toJsx(tree, components),
    };
  } catch (error) {
    handleRenderError(error, text, errorMode);

    return {
      ok: false,
      error,
    };
  }
};
