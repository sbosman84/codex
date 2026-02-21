<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSimulationStore } from '../stores/simulationStore.js';

const emit = defineEmits(['open-office', 'open-ship-broker']);

const router = useRouter();
const simulationStore = useSimulationStore();

function onPortSelect(portId) {
  simulationStore.selectDestination(portId);
}

function onOpenOffice() {
  emit('open-office');
  router.push('/office');
}

function onOpenShipBroker() {
  emit('open-ship-broker');
  router.push('/broker');
}

function onOpenGlobe() {
  router.push('/world');
}

function onSpeedInput(event) {
  simulationStore.setSpeedMultiplier(Number(event.target.value));
}

function handleKeydown(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    simulationStore.togglePause();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <section class="world-map-view">
    <div class="world-map-area">
      <svg class="world-map-svg" viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f7db1" />
            <stop offset="100%" stop-color="#0b4f84" />
          </linearGradient>
        </defs>
        <rect width="1200" height="680" fill="url(#oceanGradient)" />
        <ellipse cx="220" cy="240" rx="160" ry="180" fill="#2b6f4f" opacity="0.85" />
        <ellipse cx="380" cy="430" rx="110" ry="170" fill="#2b6f4f" opacity="0.85" />
        <ellipse cx="620" cy="250" rx="170" ry="120" fill="#2b6f4f" opacity="0.85" />
        <ellipse cx="660" cy="380" rx="120" ry="180" fill="#2b6f4f" opacity="0.85" />
        <ellipse cx="900" cy="250" rx="210" ry="140" fill="#2b6f4f" opacity="0.85" />
        <ellipse cx="1010" cy="460" rx="120" ry="100" fill="#2b6f4f" opacity="0.85" />

        <g>
          <circle
            v-for="port in simulationStore.ports"
            :key="`port-${port.id}`"
            :cx="port.x"
            :cy="port.y"
            r="8"
            fill="#f6ec79"
            stroke="#101820"
            stroke-width="2"
            class="port-marker"
            @click="onPortSelect(port.id)"
          />
        </g>

        <circle :cx="simulationStore.shipMarker.x" :cy="simulationStore.shipMarker.y" r="11" fill="#ff5f52" class="ship-marker" />
      </svg>
    </div>

    <nav class="world-right-panel" aria-label="World navigation">
      <button type="button" @click="onOpenGlobe">GLOBE</button>
      <button type="button" @click="onOpenOffice">OFFICE</button>
      <button type="button" @click="onOpenShipBroker">SHIP BROKER</button>
    </nav>

    <footer class="world-bottom-controls">
      <button type="button" class="stop-action-button" @click="simulationStore.togglePause">
        {{ simulationStore.paused ? 'RESUME ACTION' : 'STOP ACTION' }}
      </button>
      <div class="speed-control-block">
        <label for="sim-speed">SPEED {{ simulationStore.speedMultiplier }}x</label>
        <input id="sim-speed" type="range" min="1" max="5" :value="simulationStore.speedMultiplier" @input="onSpeedInput" />
      </div>
      <p class="elapsed-time">SIMULATION ELAPSED TIME: {{ simulationStore.elapsedWeeks.toFixed(1) }} WEEKS · {{ simulationStore.elapsedYears }} YEARS</p>
    </footer>
  </section>
</template>
