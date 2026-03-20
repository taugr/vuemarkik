import Theme from 'vitepress/theme';
import 'virtual:group-icons.css';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import MarkdownExample from '../../components/MarkdownExample.vue';
import { Markdown } from '../../../src';
import type { App } from 'vue';

export default {
  extends: Theme,
  enhanceApp({ app }: { app: App }) {
    app.use(TwoslashFloatingVue);
    app.component('MarkdownExample', MarkdownExample);
    app.component('Markdown', Markdown);
  },
};
