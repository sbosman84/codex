<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useShipStore } from '../stores/shipStore.js';
import { useWorldStore } from '../stores/worldStore.js';

const shipStore = useShipStore();
const worldStore = useWorldStore();
const router = useRouter();
const tons = ref(5);
const selected = ref(worldStore.commodities[0].id);
const message = ref('Manage your cargo hold.');

function buy() {
  const price = worldStore.markets[shipStore.currentPortId][selected.value];
  message.value = shipStore.buyCargo(selected.value, tons.value, price) ? 'Cargo purchased.' : 'Cannot buy (cash/capacity).';
}

function sell() {
  const price = Math.round(worldStore.markets[shipStore.currentPortId][selected.value] * 0.9);
  message.value = shipStore.sellCargo(selected.value, tons.value, price) ? 'Cargo sold.' : 'Cannot sell that amount.';
}
</script>

<template>
  <section class="view card">
    <h2>Cargo / Load</h2>
    <p>Used: {{ shipStore.cargoTons }} / {{ shipStore.ship.capacity }} · Ballast/empty: {{ shipStore.remainingCapacity }}</p>
    <label>
      Commodity
      <select v-model="selected">
        <option v-for="commodity in worldStore.commodities" :key="commodity.id" :value="commodity.id">
          {{ commodity.label }} (${{ worldStore.markets[shipStore.currentPortId][commodity.id] }})
        </option>
      </select>
    </label>
    <label>
      Tons
      <input v-model.number="tons" type="number" min="1" />
    </label>
    <div class="button-row">
      <button type="button" @click="buy">Buy</button>
      <button type="button" @click="sell">Sell</button>
      <button type="button" @click="router.push('/port')">Back</button>
    </div>
    <p>{{ message }}</p>
  </section>
</template>
