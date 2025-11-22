import type { Components } from 'hast-util-to-jsx-runtime';
import type { PluggableList } from 'unified';
import type { PropType, SlotsType, VNode } from 'vue';

export type Markdown = string;

export type ComponentsProp = PropType<Partial<Components>>;

export type RemarkPluginsProp = PropType<PluggableList>;

export type RehypePluginsProp = PropType<PluggableList>;

export type VueMarkSlots = SlotsType<{
  [TagName in keyof Components]: { childMarkdown: VNode };
}>;

export type MarkdownProp = PropType<Markdown>;
