<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore.js';
import { useShipStore } from '../stores/shipStore.js';
import { useWorldStore } from '../stores/worldStore.js';

const gameStore = useGameStore();
const shipStore = useShipStore();
const worldStore = useWorldStore();
const router = useRouter();

const contract = computed(() => worldStore.pendingVoyage);

function setSail() {
  worldStore.startTravel(shipStore.ship.speedKnots, shipStore.currentPortId);
  gameStore.setPhase('world');
  gameStore.paused = false;
  gameStore.saveGame();
  router.push('/world');
}
</script>

<template>
  <section class="view card">
    <h2>Voyage Summary</h2>
    <p>{{ contract?.originId }} → {{ contract?.destinationId }}</p>
    <p>freight: {{ contract?.commodityId }}</p>
    <p>distance: {{ contract?.distance }} nm</p>
    <p>time: {{ contract?.days }} days</p>
    <p>no time-limit</p>
    <p>using: {{ shipStore.ship.fuelUsePerDay }} fuel/day</p>
    <p>speed: {{ shipStore.ship.speedKnots }} kn</p>
    <button type="button" :disabled="!contract" @click="setSail">Set Sail</button>
  </section>
</template>
