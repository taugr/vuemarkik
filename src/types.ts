import type { Components } from 'hast-util-to-jsx-runtime';
import type { PluggableList } from 'unified';
import type { PropType, SlotsType, VNode } from 'vue';

export type Markdown = string;

export type ComponentsProp = PropType<Partial<Components>>;

export type RemarkPlugins = PluggableList;

export type RehypePlugins = PluggableList;

export type RemarkPluginsProp = PropType<RemarkPlugins>;

export type RehypePluginsProp = PropType<RehypePlugins>;

export type VueMarkSlots = SlotsType<{
  [TagName in keyof Components]: { childMarkdown: VNode };
}>;

export type MarkdownProp = PropType<Markdown>;
