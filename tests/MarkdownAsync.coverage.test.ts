import { effectScope, reactive } from 'vue';
import MarkdownAsync from '../src/MarkdownAsync';

const slowUpdatedRemarkPlugin = () => {
  return async (_tree: unknown, file: { value?: unknown }) => {
    const text = String(file.value ?? '');
    const delay = text.includes('Initial') ? 30 : 50;
    await new Promise((resolve) => setTimeout(resolve, delay));
  };
};

describe('MarkdownAsync coverage', () => {
  test('retries when a newer render is queued before setup resolves', async () => {
    const scope = effectScope();
    type SetupProps = {
      text: string;
      components: Record<string, never>;
      remarkPlugins: [typeof slowUpdatedRemarkPlugin];
      rehypePlugins: [];
      errorMode: 'silent';
    };

    try {
      await scope.run(async () => {
        const props = reactive<SetupProps>({
          text: '# Initial',
          components: {},
          remarkPlugins: [slowUpdatedRemarkPlugin],
          rehypePlugins: [],
          errorMode: 'silent' as const,
        });
        const setup = MarkdownAsync.setup as unknown as (
          props: SetupProps,
          context: {
            emit: ReturnType<typeof vi.fn>;
            attrs: Record<string, never>;
            expose: ReturnType<typeof vi.fn>;
            slots: Record<string, never>;
          },
        ) => Promise<() => unknown>;

        const setupPromise = setup(props, {
          emit: vi.fn(),
          attrs: {},
          expose: vi.fn(),
          slots: {},
        });

        expect(setupPromise).toBeTruthy();

        await Promise.resolve();
        props.text = '# Updated';

        const render = await setupPromise!;
        expect(JSON.stringify(render())).toContain('Updated');
      });
    } finally {
      scope.stop();
    }
  });
});
