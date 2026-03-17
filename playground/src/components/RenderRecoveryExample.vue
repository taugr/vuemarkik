<template>
  <section class="streaming-demo-shell">
    <h2>Streaming Markdown</h2>
    <p>
      This example rotates through valid and broken markdown snapshots on a
      timer. Switch error modes to compare how VueMarkik behaves when an
      intermediate update fails.
    </p>

    <div class="streaming-demo-mode">
      <h3>Error mode</h3>
      <ul>
        <li>
          <code>silent</code> keeps the last good render with no console output.
        </li>
        <li>
          <code>warn</code> keeps the last good render and logs each failure.
        </li>
        <li>
          <code>throw</code> surfaces the failure through the local error
          boundary.
        </li>
      </ul>

      <fieldset class="streaming-demo-radios">
        <legend>Error mode</legend>

        <label>
          <input v-model="selectedErrorMode" type="radio" value="silent" />
          <span>silent</span>
        </label>

        <label>
          <input v-model="selectedErrorMode" type="radio" value="warn" />
          <span>warn</span>
        </label>

        <label>
          <input v-model="selectedErrorMode" type="radio" value="throw" />
          <span>throw</span>
        </label>
      </fieldset>
    </div>

    <div class="streaming-demo-comparison">
      <div class="streaming-demo-grid">
        <div class="streaming-demo-grid-header">
          <h3>Incoming snapshot</h3>
          <p>
            Step {{ currentStepIndex + 1 }} of {{ streamSteps.length }}:
            <strong>{{ currentStep.label }}</strong>
          </p>
        </div>

        <div class="streaming-demo-grid-header">
          <h3>Rendered preview</h3>
          <p>
            The preview uses the real markdown component with the selected
            <code>errorMode</code>.
          </p>
        </div>

        <div class="streaming-demo-column">
          <pre
            class="streaming-demo-panel streaming-demo-code"
          ><code>{{ currentStep.text }}</code></pre>
        </div>

        <div class="streaming-demo-column">
          <StreamingPreview
            :text="currentStep.text"
            :error-mode="selectedErrorMode"
            @captured-error="onCapturedError"
            @render-error="onRenderError"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onErrorCaptured,
  ref,
  watch,
} from 'vue';
import {
  Markdown,
  type RemarkPlugins,
  type RenderErrorMode,
  type RenderErrorPayload,
} from 'vuemarkik';

const failureToken = '[[throw]]';
const renderFailureMessage = 'Synthetic playground render failure';
const timerMs = 1800;

const streamSteps = [
  {
    label: 'Valid introduction',
    text: `### Streaming output

The model started with a valid chunk.

It is about to generate a code example and a short summary.
`,
  },
  {
    label: 'Broken intermediate state',
    text: `### Streaming output

The model started with a valid chunk.

It is about to generate a code example and a short summary.

\`\`\`ts
const answer = "rea
<!-- ${failureToken} -->
`,
  },
  {
    label: 'Recovered valid output',
    text: `### Streaming output

The model started with a valid chunk.

It is about to generate a code example and a short summary.

\`\`\`ts
const answer = "ready";
\`\`\`

- Recovery completed with a valid snapshot.
`,
  },
] as const;

const throwingRemarkPlugin = () => {
  return (_tree: unknown, file: { value?: unknown }) => {
    if (String(file.value ?? '').includes(failureToken)) {
      throw new Error(renderFailureMessage);
    }
  };
};

const remarkPlugins: RemarkPlugins = [throwingRemarkPlugin];

const StreamingPreview = defineComponent({
  name: 'StreamingPreview',
  props: {
    text: {
      type: String,
      required: true,
    },
    errorMode: {
      type: String as () => RenderErrorMode,
      required: true,
    },
  },
  emits: {
    'captured-error': (_error: unknown) => true,
    'render-error': (_payload: RenderErrorPayload) => true,
  },
  setup(props, { emit }) {
    const capturedMessage = ref<string | null>(null);

    onErrorCaptured((error) => {
      capturedMessage.value =
        error instanceof Error ? error.message : 'Unknown render failure';
      emit('captured-error', error);
      return false;
    });

    watch(
      () => [props.text, props.errorMode],
      () => {
        capturedMessage.value = null;
      },
    );

    return () => {
      if (capturedMessage.value) {
        return h(
          'div',
          { class: 'streaming-demo-panel streaming-demo-throw' },
          [
            h('strong', 'Throw mode surfaced an error'),
            h('p', capturedMessage.value),
          ],
        );
      }

      return h(
        'div',
        { class: 'streaming-demo-panel streaming-demo-preview' },
        [
          h(Markdown, {
            text: props.text,
            remarkPlugins,
            errorMode: props.errorMode,
            onRenderError: (payload: RenderErrorPayload) =>
              emit('render-error', payload),
          }),
        ],
      );
    };
  },
});

const currentStepIndex = ref(0);
const selectedErrorMode = ref<RenderErrorMode>('silent');
let timerId: ReturnType<typeof setInterval> | null = null;

const currentStep = computed(() => streamSteps[currentStepIndex.value]);

function advanceStep() {
  currentStepIndex.value = (currentStepIndex.value + 1) % streamSteps.length;
}

function startTimer() {
  if (timerId) {
    return;
  }

  timerId = setInterval(() => {
    advanceStep();
  }, timerMs);
}

function stopTimer() {
  if (!timerId) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
}

function onRenderError(_payload: RenderErrorPayload) {}

function onCapturedError(_error: unknown) {}

startTimer();

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped>
.streaming-demo-shell {
  --streaming-panel-border: var(--vp-c-divider, #d6d9e4);
  --streaming-panel-bg: var(--vp-c-bg-soft, #fcfcfe);
  --streaming-code-bg: var(--vp-c-default-soft, #f6f6f7);
  --streaming-preview-bg: var(--vp-c-brand-soft, #f0f7ff);
  --streaming-throw-bg: var(--vp-c-danger-soft, #fff1f0);
  --streaming-code-text: var(--vp-c-text-1, #213547);
  --streaming-panel-text: var(--vp-c-text-1, #213547);
  --streaming-muted-text: var(--vp-c-text-2, #476582);
  --streaming-throw-text: var(--vp-c-danger-1, #b8272c);
  display: grid;
  gap: 1rem;
  padding: 0.25rem 0 1rem;
}

.streaming-demo-shell h2,
.streaming-demo-shell > p,
.streaming-demo-mode h3,
.streaming-demo-grid h3,
.streaming-demo-grid p {
  margin: 0;
}

.streaming-demo-mode ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  color: var(--streaming-muted-text);
}

.streaming-demo-radios {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
  padding: 0;
  border: 0;
  min-width: 0;
  color: var(--streaming-muted-text);
}

.streaming-demo-radios legend {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--streaming-panel-text);
}

.streaming-demo-radios label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.streaming-demo-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
}

.streaming-demo-comparison {
  padding: 1rem;
  border: 1px solid var(--streaming-panel-border);
  border-radius: 14px;
  background: var(--streaming-panel-bg);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.streaming-demo-grid-header p {
  color: var(--streaming-muted-text);
}

.streaming-demo-column {
  display: flex;
  flex-direction: column;
}

.streaming-demo-panel {
  overflow: auto;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--streaming-panel-border);
  min-height: 25rem;
  box-sizing: border-box;
  background: var(--streaming-panel-bg);
  color: var(--streaming-panel-text);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.streaming-demo-code {
  margin: 0;
  background: var(--streaming-code-bg);
  color: var(--streaming-code-text);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.streaming-demo-preview {
  background: var(--streaming-preview-bg);
  color: var(--streaming-panel-text);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.streaming-demo-throw {
  background: var(--streaming-throw-bg);
  color: var(--streaming-throw-text);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.streaming-demo-throw p {
  margin-bottom: 0;
}

.streaming-demo-shell :deep(h1),
.streaming-demo-shell :deep(h2),
.streaming-demo-shell :deep(h3),
.streaming-demo-shell :deep(p),
.streaming-demo-shell :deep(li),
.streaming-demo-shell :deep(code),
.streaming-demo-shell :deep(pre) {
  color: inherit;
}

@media (max-width: 720px) {
  .streaming-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
