import { h, markRaw } from 'vue';
import { jsx, Fragment } from 'vue/jsx-runtime';
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import { urlAttributes } from 'html-url-attributes';
import rehypeSanitize, {
  defaultSchema as rehypeDefaultSchema,
} from 'rehype-sanitize';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { PluggableList } from 'unified';
import type { Element, Nodes } from 'hast';
import { VFile } from 'vfile';
import type {
  RenderErrorMode,
  SanitizeSchema,
  SecurityMode,
  UrlTransform,
} from './types';

const safeProtocol = /^(https?|mailto|tel)$/i;

export const defaultSanitizeSchema: SanitizeSchema = {
  ...rehypeDefaultSchema,
  protocols: {
    ...rehypeDefaultSchema.protocols,
    href: [...(rehypeDefaultSchema.protocols!.href as Array<string>), 'tel'],
  },
};

export const defaultUrlTransform = (url: string): string | undefined => {
  const colon = url.indexOf(':');
  const questionMark = url.indexOf('?');
  const numberSign = url.indexOf('#');
  const slash = url.indexOf('/');

  if (
    colon === -1 ||
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    safeProtocol.test(url.slice(0, colon))
  ) {
    return url;
  }

  return undefined;
};

const transformUrls = (tree: Nodes, urlTransform: UrlTransform) => {
  visit(tree, 'element', (node: Element) => {
    for (const [propertyName, allowedTagNames] of Object.entries(
      urlAttributes,
    )) {
      if (
        allowedTagNames &&
        !(allowedTagNames as readonly string[]).includes(node.tagName)
      ) {
        continue;
      }

      const value = node.properties[propertyName];

      if (value === null || value === undefined) {
        continue;
      }

      node.properties[propertyName] = urlTransform(
        String(value),
        propertyName,
        node,
      );
    }
  });
};

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
  if (tree.type === 'root' && tree.children.length === 0) {
    return null;
  }

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
) => {
  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype)
    .use(rehypePlugins);
};

const getSecureProcessor = (
  remarkPlugins: PluggableList,
  rehypePlugins: PluggableList,
  securityMode: SecurityMode,
  sanitizeSchema: SanitizeSchema,
) => {
  const processor = getProcessor(remarkPlugins, rehypePlugins);

  if (securityMode === 'safe') {
    processor.use(rehypeSanitize, sanitizeSchema);
  }

  return processor;
};

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
  securityMode: SecurityMode;
  sanitizeSchema: SanitizeSchema;
  urlTransform: UrlTransform;
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
  securityMode,
  sanitizeSchema,
  urlTransform,
  errorMode,
}: RenderMarkdownOptions): RenderResult => {
  try {
    const processor = getSecureProcessor(
      remarkPlugins,
      rehypePlugins,
      securityMode,
      sanitizeSchema,
    );
    const file = createVFile(text);
    const tree = processor.runSync(processor.parse(file), file);
    transformUrls(tree, urlTransform);

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
  securityMode,
  sanitizeSchema,
  urlTransform,
  errorMode,
}: RenderMarkdownOptions): Promise<RenderResult> => {
  try {
    const processor = getSecureProcessor(
      remarkPlugins,
      rehypePlugins,
      securityMode,
      sanitizeSchema,
    );
    const file = createVFile(text);
    const tree = await processor.run(processor.parse(file), file);
    transformUrls(tree, urlTransform);

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
