<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import RightSideMenu from '../components/RightSideMenu.vue';
import SimulationControls from '../components/SimulationControls.vue';
import { useGameStore } from '../stores/gameStore.js';
import { useWorldStore } from '../stores/worldStore.js';
import { useShipStore } from '../stores/shipStore.js';

const gameStore = useGameStore();
const worldStore = useWorldStore();
const shipStore = useShipStore();
const router = useRouter();

const markerPosition = computed(() => {
  if (worldStore.travel?.marker) {
    return worldStore.travel.marker;
  }
  return worldStore.ports.find((port) => port.id === shipStore.currentPortId);
});

function onPortClick(portId) {
  if (worldStore.travel) {
    return;
  }
  worldStore.selectDestination(portId);
}

watch(
  () => gameStore.phase,
  (phase) => {
    if (phase === 'docking') {
      router.push('/docking');
    }
  },
);

function navigate(target) {
  router.push(`/${target}`);
}
</script>

<template>
  <section class="view world-layout">
    <div class="card map-panel">
      <h2>World Map</h2>
      <svg viewBox="0 0 900 500" class="map-svg">
        <rect x="0" y="0" width="900" height="500" fill="#123a5b" />
        <rect x="50" y="90" width="180" height="100" fill="#2d6d4a" opacity="0.5" />
        <rect x="260" y="80" width="140" height="110" fill="#2d6d4a" opacity="0.5" />
        <rect x="420" y="140" width="260" height="150" fill="#2d6d4a" opacity="0.45" />
        <circle
          v-for="port in worldStore.ports"
          :key="port.id"
          :cx="port.x"
          :cy="port.y"
          r="6"
          fill="#f5e563"
          @click="onPortClick(port.id)"
        />
        <circle :cx="markerPosition.x" :cy="markerPosition.y" r="8" fill="#ff7d52" />
      </svg>
      <p>
        Status: {{ worldStore.travel ? `At sea to ${worldStore.travel.destinationId}` : `At port (${shipStore.currentPortId})` }}
      </p>
      <p>Selected destination: {{ worldStore.selectedDestinationId ?? 'none' }}</p>
      <button v-if="!worldStore.travel" type="button" @click="router.push('/office')">Open Office</button>
    </div>

    <RightSideMenu @navigate="navigate" />
    <SimulationControls
      :paused="gameStore.paused"
      :elapsed-weeks="gameStore.elapsedWeeks"
      :elapsed-years="gameStore.elapsedYears"
      :speed-step="gameStore.speedStep"
      @toggle-pause="gameStore.togglePause"
      @speed-change="gameStore.speedStep = $event"
    />
  </section>
</template>
