<script setup>
defineProps({
  layUp: { type: Boolean, required: true },
});

const emit = defineEmits(['repair', 'refuel', 'charter', 'layup', 'load']);
</script>

<template>
  <section class="panel">
    <h3>Captain's Orders</h3>
    <div class="button-grid">
      <button type="button" @click="emit('repair')">REPAIR</button>
      <button type="button" @click="emit('refuel')">REFUEL</button>
      <button type="button" @click="emit('charter')">CHARTER</button>
      <button type="button" @click="emit('layup')">{{ layUp ? 'RESUME SERVICE' : 'LAY UP' }}</button>
      <button type="button" @click="emit('load')">LOAD</button>
    </div>
  </section>
</template>
