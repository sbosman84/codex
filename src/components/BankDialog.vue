<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  cash: { type: Number, required: true },
  bankBalance: { type: Number, required: true },
  loan: { type: Number, required: true },
});

const emit = defineEmits(['update:modelValue', 'submit']);
const amount = ref(0);
</script>

<template>
  <div v-if="modelValue" class="modal-backdrop">
    <div class="modal">
      <h3>Welcome shipowner</h3>
      <p>Cash: ${{ cash }} · Deposit: ${{ bankBalance }} · Mortgage: ${{ loan }}</p>
      <label>
        Deposit (+) / Withdraw (-)
        <input v-model.number="amount" type="number" />
      </label>
      <div class="button-row">
        <button type="button" @click="emit('submit', amount)">Confirm</button>
        <button type="button" @click="emit('update:modelValue', false)">Close</button>
      </div>
    </div>
  </div>
</template>
