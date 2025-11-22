import Theme from 'vitepress/theme';
import 'virtual:group-icons.css';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import MarkdownExample from '../../components/MarkdownExample.vue';
import { Markdown } from '../../../src';

export default {
  extends: Theme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component('MarkdownExample', MarkdownExample);
    app.component('Markdown', Markdown);
  },
};
