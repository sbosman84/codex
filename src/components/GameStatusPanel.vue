<script setup>
defineProps({
  statusText: {
    type: String,
    required: true,
  },
});

defineEmits(['restart']);
</script>

<template>
  <section class="status-panel">
    <p class="status">{{ statusText }}</p>
    <p class="hint">Use arrow keys to throttle and steer. Press space to restart.</p>
    <button type="button" @click="$emit('restart')">Restart</button>
  </section>
</template>
