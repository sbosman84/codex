<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CaptainOrdersPanel from '../components/CaptainOrdersPanel.vue';
import BankDialog from '../components/BankDialog.vue';
import { useGameStore } from '../stores/gameStore.js';
import { useShipStore } from '../stores/shipStore.js';
import { useWorldStore } from '../stores/worldStore.js';

const router = useRouter();
const gameStore = useGameStore();
const shipStore = useShipStore();
const worldStore = useWorldStore();
const message = ref('Ready for orders, captain.');

function doRepair() {
  message.value = shipStore.repair() ? 'Repairs complete.' : 'Unable to repair (insufficient funds or no damage).';
  gameStore.saveGame();
}

function doRefuel() {
  message.value = shipStore.refuel() ? 'Fuel tanks topped up.' : 'Unable to refuel.';
  gameStore.saveGame();
}

function doCharter() {
  const offer = worldStore.createCharterOffer(shipStore.currentPortId);
  if (!offer) {
    message.value = 'No charter available.';
    return;
  }
  worldStore.setPendingVoyage(offer);
  router.push('/voyage');
}

function doLayUp() {
  shipStore.toggleLayUp();
  message.value = shipStore.layUp ? 'Ship is laid up.' : 'Ship resumed service.';
}

function handleBank(amount) {
  message.value = shipStore.bankTransaction(amount) ? 'Bank transaction completed.' : 'Transaction declined.';
  gameStore.closeBankDialog();
  gameStore.saveGame();
}
</script>

<template>
  <section class="view card">
    <h2>Port Dashboard — {{ shipStore.currentPortId }}</h2>
    <div class="split">
      <div>
        <p>Ship: {{ shipStore.ship.name }} · Captain: {{ shipStore.captainName }}</p>
        <p>Cash: ${{ shipStore.cash }} · Condition: {{ shipStore.ship.condition }}% · Fuel: {{ shipStore.ship.fuel }}/{{ shipStore.ship.fuelMax }}</p>
        <p>Cargo: {{ shipStore.cargoTons }}/{{ shipStore.ship.capacity }}</p>
      </div>
      <div class="postcard">Port image</div>
    </div>

    <CaptainOrdersPanel :lay-up="shipStore.layUp" @repair="doRepair" @refuel="doRefuel" @charter="doCharter" @layup="doLayUp" @load="router.push('/cargo')" />

    <p>{{ message }}</p>
    <div class="button-row">
      <button type="button" @click="router.push('/office')">OFFICE</button>
      <button type="button" @click="router.push('/broker')">SHIP BROKER</button>
      <button type="button" @click="router.push('/world')">GLOBE</button>
      <button type="button" @click="gameStore.openBankDialog">BANK</button>
    </div>

    <BankDialog
      v-model="gameStore.bankDialogOpen"
      :cash="shipStore.cash"
      :bank-balance="shipStore.bankBalance"
      :loan="shipStore.loan"
      @submit="handleBank"
    />
  </section>
</template>
