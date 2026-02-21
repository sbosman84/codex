<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EventModal from './components/EventModal.vue';
import { useSimulationTicker } from './composables/useSimulationTicker.js';
import { useGameStore } from './stores/gameStore.js';

const gameStore = useGameStore();
const router = useRouter();

useSimulationTicker();

function onKeydown(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    gameStore.togglePause();
  }
  if (event.code === 'Equal') {
    gameStore.adjustSpeed(1);
  }
  if (event.code === 'Minus') {
    gameStore.adjustSpeed(-1);
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  if (gameStore.phase !== 'start') {
    router.push(`/${gameStore.phase}`);
  }
});
</script>

<template>
  <main class="app-shell">
    <router-view />
    <EventModal :event-item="gameStore.activeEvent" @resolve="gameStore.resolveEvent" />
  </main>
</template>
