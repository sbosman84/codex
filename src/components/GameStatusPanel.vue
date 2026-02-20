<script setup>
defineProps({
  statusText: {
    type: String,
    required: true,
  },
  hud: {
    type: Object,
    required: true,
  },
});

defineEmits(['restart']);
</script>

<template>
  <section class="status-panel">
    <p class="status">{{ statusText }}</p>

    <div class="hud-grid">
      <p>Speed: <strong>{{ hud.speed }}</strong></p>
      <p>Throttle: <strong>{{ hud.throttle }}</strong></p>
      <p>Rudder: <strong>{{ hud.rudder }}%</strong></p>
      <p>Time: <strong>{{ hud.timer }}s</strong></p>
    </div>

    <div class="throttle-bar">
      <span
        v-for="(notch, index) in hud.throttleNotches"
        :key="notch"
        :class="['notch', { active: index === hud.throttleIndex }]"
      >
        {{ notch }}
      </span>
    </div>

    <p class="hint">Tap ↑/↓ for engine notches, hold ←/→ to steer. Space to restart.</p>
    <button type="button" @click="$emit('restart')">Restart</button>
  </section>
</template>
