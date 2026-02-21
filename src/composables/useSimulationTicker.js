import { onBeforeUnmount, onMounted } from 'vue';
import { useSimulationStore } from '../stores/simulationStore.js';

export function useSimulationTicker() {
  const simulationStore = useSimulationStore();
  let frameId = 0;
  let previousTime = 0;

  function frameLoop(timeStamp) {
    if (!previousTime) {
      previousTime = timeStamp;
    }
    const elapsedMs = Math.min(250, timeStamp - previousTime);
    previousTime = timeStamp;
    const daysDelta = elapsedMs / 4000;
    simulationStore.advanceTime(daysDelta);
    frameId = requestAnimationFrame(frameLoop);
  }

  onMounted(() => {
    frameId = requestAnimationFrame(frameLoop);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId);
  });
}
