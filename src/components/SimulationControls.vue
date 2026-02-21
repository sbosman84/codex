<script setup>
defineProps({
  paused: { type: Boolean, required: true },
  elapsedWeeks: { type: Number, required: true },
  elapsedYears: { type: Number, required: true },
  speedStep: { type: Number, required: true },
});

const emit = defineEmits(['toggle-pause', 'speed-change']);
</script>

<template>
  <section class="sim-controls">
    <button type="button" class="stop" @click="emit('toggle-pause')">{{ paused ? 'RESUME ACTION' : 'STOP ACTION' }}</button>
    <div>
      <label for="sim-speed">Speed</label>
      <input id="sim-speed" type="range" min="1" max="4" :value="speedStep" @input="emit('speed-change', Number($event.target.value))" />
    </div>
    <p>SIMULATION ELAPSED TIME: week {{ elapsedWeeks.toFixed(1) }} · year {{ elapsedYears }}</p>
  </section>
</template>
