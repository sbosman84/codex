<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore.js';

const router = useRouter();
const gameStore = useGameStore();

function startNew() {
  gameStore.newGame();
  router.push('/port');
}

function continueGame() {
  if (gameStore.loadGame()) {
    router.push(gameStore.phase === 'start' ? '/port' : `/${gameStore.phase}`);
  }
}
</script>

<template>
  <section class="view card centered">
    <h1>Ports of Call — Browser Edition</h1>
    <button type="button" @click="startNew">New Game</button>
    <button type="button" :disabled="!gameStore.loadReady" @click="continueGame">Continue</button>
  </section>
</template>
