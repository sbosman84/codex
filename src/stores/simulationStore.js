import { defineStore } from 'pinia';
import { useGameStore } from './gameStore.js';
import { useShipStore } from './shipStore.js';
import { useWorldStore } from './worldStore.js';

export const useSimulationStore = defineStore('simulation', {
  getters: {
    gameStore() {
      return useGameStore();
    },
    shipStore() {
      return useShipStore();
    },
    worldStore() {
      return useWorldStore();
    },
    paused() {
      return this.gameStore.paused;
    },
    speedMultiplier() {
      return this.gameStore.speedStep;
    },
    elapsedWeeks() {
      return this.gameStore.elapsedWeeks;
    },
    elapsedYears() {
      return this.gameStore.elapsedYears;
    },
    ports() {
      return this.worldStore.ports;
    },
    shipMarker() {
      if (this.worldStore.travel?.marker) {
        return this.worldStore.travel.marker;
      }
      return this.worldStore.ports.find((port) => port.id === this.shipStore.currentPortId) ?? { x: 0, y: 0 };
    },
    isTraveling() {
      return Boolean(this.worldStore.travel);
    },
  },
  actions: {
    togglePause() {
      this.gameStore.togglePause();
    },
    setSpeedMultiplier(multiplier) {
      this.gameStore.speedStep = Math.max(1, Math.min(5, multiplier));
    },
    selectDestination(portId) {
      if (!this.worldStore.travel) {
        this.worldStore.selectDestination(portId);
      }
    },
    advanceTime(daysDelta) {
      this.gameStore.tickSimulation(daysDelta);
    },
  },
});
