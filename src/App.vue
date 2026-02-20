<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import GameStatusPanel from './components/GameStatusPanel.vue';
import HarborGameCanvas from './components/HarborGameCanvas.vue';
import { useHarborGame } from './composables/useHarborGame.js';

const { gameModel, hud, statusText, resetGame, adjustThrottle, updateGame } = useHarborGame();

let animationFrameId;

function onAnimationFrame(timestamp) {
  if (!gameModel.previousFrameTime) {
    gameModel.previousFrameTime = timestamp;
  }

  const deltaTime = Math.min((timestamp - gameModel.previousFrameTime) / 16.67, 2.5);
  gameModel.previousFrameTime = timestamp;

  updateGame(deltaTime);
  animationFrameId = requestAnimationFrame(onAnimationFrame);
}

function handleKeydown(event) {
  if (event.code.startsWith('Arrow')) {
    event.preventDefault();
  }

  if (event.code === 'ArrowUp' && !event.repeat) {
    adjustThrottle(1);
  }

  if (event.code === 'ArrowDown' && !event.repeat) {
    adjustThrottle(-1);
  }

  if (event.code === 'Space' && gameModel.gameState !== 'playing') {
    resetGame();
    return;
  }

  gameModel.pressedKeys.add(event.code);
}

function handleKeyup(event) {
  gameModel.pressedKeys.delete(event.code);
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
  animationFrameId = requestAnimationFrame(onAnimationFrame);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <main class="game-shell">
    <h1>Harbor Escape</h1>
    <GameStatusPanel :status-text="statusText" :hud="hud" @restart="resetGame" />
    <HarborGameCanvas
      :width="gameModel.width"
      :height="gameModel.height"
      :ship-state="gameModel.shipState"
      :ship-size="gameModel.shipSize"
      :harbor-walls="gameModel.harborWalls"
      :berth-outline="gameModel.berthOutline"
    />
  </main>
</template>
