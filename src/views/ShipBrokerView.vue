<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { SHIP_CATALOG, useShipStore } from '../stores/shipStore.js';

const router = useRouter();
const shipStore = useShipStore();
const category = ref('High-Tech Ships');
const categories = ['High-Tech Ships', 'Pre-owned Ships', 'Low Cost Ships', 'Sellers Market', 'Consulting Division'];
const message = ref('Browse vessels.');

const ships = computed(() => SHIP_CATALOG.filter((ship) => ship.category === category.value));

function buyShip(ship) {
  message.value = shipStore.purchaseShip(ship) ? `Purchased ${ship.name}.` : 'Not enough cash.';
}
</script>

<template>
  <section class="view card">
    <h2>Ship Broker</h2>
    <div class="button-row">
      <button v-for="item in categories" :key="item" type="button" @click="category = item">{{ item }}</button>
      <button type="button" @click="router.push('/port')">Exit</button>
    </div>
    <article v-for="ship in ships" :key="ship.id" class="ship-card">
      <p>{{ ship.name }} — ${{ ship.price }}</p>
      <p>speed {{ ship.speedKnots }} kn · cap {{ ship.capacity }} · condition {{ ship.condition }}%</p>
      <button type="button" @click="buyShip(ship)">Purchase</button>
    </article>
    <p>{{ message }}</p>
  </section>
</template>
