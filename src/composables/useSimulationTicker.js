import { onBeforeUnmount, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore.js';

export function useSimulationTicker() {
  const gameStore = useGameStore();
  let frameId = 0;
  let previousTime = 0;

  function frameLoop(timeStamp) {
    if (!previousTime) {
      previousTime = timeStamp;
    }
    const elapsedMs = Math.min(250, timeStamp - previousTime);
    previousTime = timeStamp;
    const daysDelta = elapsedMs / 4000;
    gameStore.tickSimulation(daysDelta);
    frameId = requestAnimationFrame(frameLoop);
  }

  onMounted(() => {
    frameId = requestAnimationFrame(frameLoop);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId);
  });
}
