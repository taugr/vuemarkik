import type { Components } from 'hast-util-to-jsx-runtime';
import type { Element } from 'hast';
import type { PluggableList } from 'unified';
import type { PropType, SlotsType, VNode } from 'vue';

export type Markdown = string;

export type ComponentsProp = PropType<Partial<Components>>;

export type RemarkPlugins = PluggableList;

export type RehypePlugins = PluggableList;

export type RemarkPluginsProp = PropType<RemarkPlugins>;

export type RehypePluginsProp = PropType<RehypePlugins>;

export type UrlTransform = (
  url: string,
  propertyName: string,
  node: Readonly<Element>,
) => string | undefined;

export type UrlTransformProp = PropType<UrlTransform>;

export type RenderErrorMode = 'silent' | 'warn' | 'throw';

export type RenderErrorModeProp = PropType<RenderErrorMode>;

export interface RenderErrorPayload {
  error: unknown;
  text: string;
}

export interface VueMarkSlotProps {
  childMarkdown: VNode;
  [propName: string]: unknown;
}

export type VueMarkSlots = SlotsType<{
  [TagName in keyof Components]: VueMarkSlotProps;
}>;

export type MarkdownProp = PropType<Markdown>;
