<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  shipState: {
    type: Object,
    required: true,
  },
  shipSize: {
    type: Object,
    required: true,
  },
  harborWalls: {
    type: Array,
    required: true,
  },
  berthOutline: {
    type: Array,
    required: true,
  },
});

const canvasElement = ref(null);

function drawScene() {
  if (!canvasElement.value) {
    return;
  }

  const ctx = canvasElement.value.getContext('2d');

  ctx.clearRect(0, 0, props.width, props.height);
  ctx.fillStyle = '#0b15b8';
  ctx.fillRect(0, 0, props.width, props.height);

  ctx.fillStyle = '#978a7b';
  props.harborWalls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  });

  ctx.strokeStyle = '#1ae51a';
  ctx.lineWidth = 3;
  ctx.beginPath();

  props.berthOutline.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }

    ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
  ctx.stroke();

  ctx.save();
  ctx.translate(props.shipState.x, props.shipState.y);
  ctx.rotate(props.shipState.angle);

  const halfWidth = props.shipSize.width / 2;
  const halfLength = props.shipSize.length / 2;

  ctx.fillStyle = '#afafaf';
  ctx.fillRect(-halfWidth, -halfLength, props.shipSize.width, props.shipSize.length);
  ctx.fillStyle = '#ca3939';
  ctx.fillRect(-props.shipSize.width * 0.2, -halfLength + 10, props.shipSize.width * 0.4, props.shipSize.length - 20);
  ctx.strokeStyle = '#efefef';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-halfWidth, -halfLength, props.shipSize.width, props.shipSize.length);
  ctx.restore();
}

onMounted(drawScene);
watch(() => [props.shipState, props.harborWalls, props.berthOutline], drawScene, { deep: true });
</script>

<template>
  <canvas ref="canvasElement" :width="width" :height="height" />
</template>
