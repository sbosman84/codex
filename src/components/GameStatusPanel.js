export const GameStatusPanel = {
  name: 'GameStatusPanel',
  props: {
    statusText: {
      type: String,
      required: true,
    },
  },
  emits: {
    restart: null,
  },
  template: `
    <section class="status-panel">
      <p class="status">{{ statusText }}</p>
      <p class="hint">Use arrow keys to throttle and steer. Press space to restart.</p>
      <button type="button" @click="$emit('restart')">Restart</button>
    </section>
  `,
};
