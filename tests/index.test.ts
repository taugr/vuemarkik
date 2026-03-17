import * as entry from '../src/index';

describe('package entrypoint', () => {
  test('re-exports the public components', async () => {
    const markdownModule = await import('../src/Markdown');
    const markdownAsyncModule = await import('../src/MarkdownAsync');
    const markdownHooksModule = await import('../src/MarkdownHooks');
    const markdownChildNodesModule = await import('../src/MarkdownChildNodes');

    expect(entry.Markdown).toBe(markdownModule.default);
    expect(entry.MarkdownAsync).toBe(markdownAsyncModule.default);
    expect(entry.MarkdownHooks).toBe(markdownHooksModule.default);
    expect(entry.MarkdownChildNodes).toBe(markdownChildNodesModule.default);
  });
});
