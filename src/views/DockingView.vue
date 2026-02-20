<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DOCKING_CONFIG, inDockZone, initialDockingState, updateDockingState } from '../services/dockingService.js';
import { useGameStore } from '../stores/gameStore.js';
import { useShipStore } from '../stores/shipStore.js';
import { useWorldStore } from '../stores/worldStore.js';

const gameStore = useGameStore();
const shipStore = useShipStore();
const worldStore = useWorldStore();
const router = useRouter();
const canvasRef = ref(null);
const state = reactive(initialDockingState());
const controls = reactive({ up: false, down: false, left: false, right: false });
let frame = 0;
let prev = 0;
const timer = ref(DOCKING_CONFIG.timerSeconds);
const zone = { x: 700, y: 230, w: 120, h: 120, angle: 0 };

const throttlePercent = computed(() => Math.round(state.throttle));

function failDocking() {
  shipStore.adjustCondition(-8);
  shipStore.cash = Math.max(0, shipStore.cash - 2000);
  timer.value = DOCKING_CONFIG.timerSeconds;
  Object.assign(state, initialDockingState());
}

function completeDocking() {
  const arrivalPortId = worldStore.pendingArrivalPortId;
  shipStore.moveToPort(arrivalPortId);
  shipStore.useFuel(1);
  worldStore.pendingArrivalPortId = null;
  worldStore.refreshMarkets();
  const payout = worldStore.resolveContractAtPort(arrivalPortId);
  if (payout > 0) {
    shipStore.completeContract(payout);
  }
  gameStore.setPhase('port');
  gameStore.saveGame();
  router.push('/port');
}

function draw() {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.fillStyle = '#1f5c7c';
  ctx.fillRect(0, 0, DOCKING_CONFIG.width, DOCKING_CONFIG.height);
  ctx.fillStyle = '#6d6650';
  ctx.fillRect(0, 0, DOCKING_CONFIG.width, 35);
  ctx.fillRect(0, 485, DOCKING_CONFIG.width, 35);
  ctx.fillRect(0, 0, 45, DOCKING_CONFIG.height);
  ctx.fillStyle = 'rgba(120,255,140,0.35)';
  ctx.fillRect(zone.x, zone.y, zone.w, zone.h);

  ctx.save();
  ctx.translate(state.x, state.y);
  ctx.rotate(state.angle);
  ctx.fillStyle = '#f5e98b';
  ctx.fillRect(-12, -30, 24, 60);
  ctx.restore();
}

function loop(ts) {
  if (!prev) {
    prev = ts;
  }
  const dt = Math.min(40, ts - prev) / 16.67;
  prev = ts;

  const next = updateDockingState(state, controls, dt);
  Object.assign(state, next);
  timer.value -= dt * 0.0167;

  const collided = state.x < 45 || state.x > 890 || state.y < 35 || state.y > 485;
  if (collided || timer.value <= 0) {
    failDocking();
  }

  if (inDockZone(state, zone)) {
    state.holdTimer += dt * 0.0167;
  } else {
    state.holdTimer = 0;
  }

  if (state.holdTimer >= DOCKING_CONFIG.holdSeconds) {
    completeDocking();
    return;
  }

  draw();
  frame = requestAnimationFrame(loop);
}

function onKey(event, pressed) {
  if (event.code === 'ArrowUp' || event.code === 'KeyW') controls.up = pressed;
  if (event.code === 'ArrowDown' || event.code === 'KeyS') controls.down = pressed;
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') controls.left = pressed;
  if (event.code === 'ArrowRight' || event.code === 'KeyD') controls.right = pressed;
}

onMounted(() => {
  window.addEventListener('keydown', (event) => onKey(event, true));
  window.addEventListener('keyup', (event) => onKey(event, false));
  frame = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
});
</script>

<template>
  <section class="view card">
    <h2>Docking Mini-Game</h2>
    <p>TIME: {{ timer.toFixed(1) }}s · throttle {{ throttlePercent }}% · hold {{ state.holdTimer.toFixed(1) }} / {{ DOCKING_CONFIG.holdSeconds }}s</p>
    <canvas ref="canvasRef" :width="DOCKING_CONFIG.width" :height="DOCKING_CONFIG.height" />
    <p>Controls: Arrows/WASD for rudder and throttle. Keep low speed and align in green zone.</p>
  </section>
</template>
