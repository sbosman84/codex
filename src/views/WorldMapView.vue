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
  <section class="poc-globe-screen">
    <header class="poc-title-bar">Ports of Call</header>

    <div class="poc-map-frame">
      <svg class="poc-map-svg" viewBox="0 0 1200 680" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pocOcean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#24a9da" />
            <stop offset="100%" stop-color="#0687c1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="680" fill="url(#pocOcean)" />

        <ellipse cx="155" cy="220" rx="170" ry="140" fill="#1f5f4f" />
        <ellipse cx="235" cy="360" rx="120" ry="190" fill="#1f5f4f" />
        <ellipse cx="535" cy="245" rx="110" ry="80" fill="#1f5f4f" />
        <ellipse cx="640" cy="315" rx="120" ry="230" fill="#1f5f4f" />
        <ellipse cx="840" cy="225" rx="260" ry="145" fill="#1f5f4f" />
        <ellipse cx="1010" cy="465" rx="110" ry="105" fill="#1f5f4f" />

        <circle
          v-for="port in simulationStore.ports"
          :key="`poc-port-${port.id}`"
          :cx="port.x"
          :cy="port.y"
          r="7"
          class="poc-port-marker"
          @click="onPortSelect(port.id)"
        />

        <circle :cx="simulationStore.shipMarker.x" :cy="simulationStore.shipMarker.y" r="9" class="poc-ship-marker" />
      </svg>
    </div>

    <nav class="poc-side-panel" aria-label="World navigation">
      <button type="button" class="poc-nav-button poc-nav-button--active">GLOBE</button>
      <button type="button" class="poc-nav-button" @click="onOpenOffice">OFFICE</button>
      <button type="button" class="poc-nav-button" @click="onOpenShipBroker">SHIP BROKER</button>
    </nav>

    <footer class="poc-bottom-strip">
      <button type="button" class="poc-stop-button" @click="simulationStore.togglePause">
        {{ simulationStore.paused ? 'RESUME ACTION' : 'STOP ACTION' }}
      </button>

      <section class="poc-sim-panel">
        <h2>SIMULATION ELAPSED TIME</h2>
        <div class="poc-sim-grid">
          <div class="poc-dial" />
          <div class="poc-speed-boxes">
            <span v-for="speed in 7" :key="`speed-box-${speed}`" :class="['poc-speed-box', { 'poc-speed-box--active': speed === simulationStore.speedMultiplier }]">
              {{ speed }}
            </span>
          </div>
          <div class="poc-time-values">
            <span>{{ Math.floor(simulationStore.elapsedWeeks) }}</span>
            <span>WEEKS</span>
            <span>{{ simulationStore.elapsedYears }}</span>
            <span>YRS.</span>
          </div>
        </div>
      </section>

      <section class="poc-throttle-panel">
        <input
          id="sim-speed"
          class="poc-speed-slider"
          type="range"
          min="1"
          max="5"
          :value="simulationStore.speedMultiplier"
          @input="onSpeedInput"
        />
        <p>{{ simulationStore.speedMultiplier }}</p>
      </section>
    </footer>
  </section>
</template>
