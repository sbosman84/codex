<script setup>
const emit = defineEmits(['navigate']);
</script>

<template>
  <aside class="right-menu">
    <button type="button" @click="emit('navigate', 'world')">GLOBE</button>
    <button type="button" @click="emit('navigate', 'office')">OFFICE</button>
    <button type="button" @click="emit('navigate', 'broker')">SHIP BROKER</button>
  </aside>
</template>
