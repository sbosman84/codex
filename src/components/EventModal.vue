<script setup>
defineProps({
  eventItem: { type: Object, default: null },
});

const emit = defineEmits(['resolve']);
</script>

<template>
  <div v-if="eventItem" class="modal-backdrop">
    <div class="modal">
      <h3>{{ eventItem.title }}</h3>
      <p>{{ eventItem.description }}</p>
      <div class="button-row">
        <button type="button" @click="emit('resolve', 'pass')">Pass Through</button>
        <button type="button" @click="emit('resolve', 'round')">Round Storm</button>
      </div>
    </div>
  </div>
</template>
