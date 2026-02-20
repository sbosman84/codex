<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useShipStore } from '../stores/shipStore.js';
import { useWorldStore } from '../stores/worldStore.js';

const router = useRouter();
const shipStore = useShipStore();
const worldStore = useWorldStore();

const selectedPort = ref(worldStore.selectedDestinationId ?? worldStore.ports.find((port) => port.id !== shipStore.currentPortId)?.id);
const selectedCommodity = ref(worldStore.commodities[0].id);

const contractPreview = computed(() => worldStore.createContract(shipStore.currentPortId, selectedPort.value, selectedCommodity.value));

function acceptContract() {
  if (!contractPreview.value) {
    return;
  }
  worldStore.setPendingVoyage(contractPreview.value);
  router.push('/voyage');
}
</script>

<template>
  <section class="view card">
    <h2>Office — Contracts</h2>
    <div class="split">
      <label>
        Available Ports
        <select v-model="selectedPort">
          <option v-for="port in worldStore.ports.filter((entry) => entry.id !== shipStore.currentPortId)" :key="port.id" :value="port.id">{{ port.name }}</option>
        </select>
      </label>
      <label>
        Freight
        <select v-model="selectedCommodity">
          <option v-for="commodity in worldStore.commodities" :key="commodity.id" :value="commodity.id">{{ commodity.label }}</option>
        </select>
      </label>
    </div>
    <p>Distance: {{ contractPreview?.distance ?? 0 }} nm</p>
    <p>Travel Time: {{ contractPreview?.days ?? 0 }} days</p>
    <p>Rate/Payout: ${{ contractPreview?.payout ?? 0 }}</p>
    <div class="button-row">
      <button type="button" @click="acceptContract">OK / ACCEPT</button>
      <button type="button" @click="router.push('/port')">CANCEL</button>
    </div>
  </section>
</template>
