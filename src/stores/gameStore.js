import { defineStore } from 'pinia';
import { useShipStore } from './shipStore.js';
import { useWorldStore } from './worldStore.js';

const SAVE_KEY = 'ports-of-call-lite-save';

export const useGameStore = defineStore('game', {
  state: () => ({
    phase: 'start',
    paused: true,
    speedStep: 1,
    elapsedWeeks: 0,
    elapsedYears: 0,
    activeEvent: null,
    bankDialogOpen: false,
    loadReady: false,
  }),
  getters: {
    speedMultiplier(state) {
      return [0, 1, 2, 3, 4, 5][state.speedStep] ?? 1;
    },
  },
  actions: {
    setPhase(nextPhase) {
      this.phase = nextPhase;
    },
    togglePause() {
      this.paused = !this.paused;
    },
    adjustSpeed(delta) {
      this.speedStep = Math.max(1, Math.min(5, this.speedStep + delta));
    },
    tickSimulation(daysDelta) {
      const ship = useShipStore();
      const world = useWorldStore();
      if (this.paused || this.phase !== 'world') {
        return;
      }

      const scaledDays = daysDelta * this.speedMultiplier;
      this.elapsedWeeks += scaledDays / 7;
      this.elapsedYears = Math.floor(this.elapsedWeeks / 52);

      if (Math.random() < 0.0025 * this.speedMultiplier && world.travel && !this.activeEvent) {
        this.activeEvent = {
          id: `storm-${Date.now()}`,
          type: 'storm',
          title: 'Storm Front Ahead',
          description: 'A heavy storm blocks your route. Pass through or sail around?',
        };
        this.paused = true;
        return;
      }

      ship.applyWeeklyFinance();
      const arrived = world.advanceTravel(scaledDays);
      if (arrived === 'arrived') {
        this.phase = 'docking';
        this.paused = true;
      }
    },
    resolveEvent(choice) {
      const ship = useShipStore();
      const world = useWorldStore();
      if (!this.activeEvent || this.activeEvent.type !== 'storm') {
        return;
      }
      if (choice === 'pass') {
        ship.adjustCondition(-12);
        ship.useFuel(1.5);
      } else {
        world.advanceTravel(-0.7);
      }
      this.activeEvent = null;
      this.paused = false;
      this.saveGame();
    },
    openBankDialog() {
      this.bankDialogOpen = true;
    },
    closeBankDialog() {
      this.bankDialogOpen = false;
    },
    newGame() {
      const ship = useShipStore();
      const world = useWorldStore();
      ship.$reset();
      world.$reset();
      this.$reset();
      this.phase = 'port';
      this.paused = true;
      this.loadReady = true;
      this.saveGame();
    },
    saveGame() {
      const ship = useShipStore();
      const world = useWorldStore();
      const snapshot = {
        game: {
          phase: this.phase,
          paused: this.paused,
          speedStep: this.speedStep,
          elapsedWeeks: this.elapsedWeeks,
          elapsedYears: this.elapsedYears,
        },
        ship: ship.$state,
        world: world.$state,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
      this.loadReady = true;
    },
    loadGame() {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        return false;
      }
      const ship = useShipStore();
      const world = useWorldStore();
      const snapshot = JSON.parse(raw);
      this.phase = snapshot.game.phase;
      this.paused = snapshot.game.paused;
      this.speedStep = snapshot.game.speedStep;
      this.elapsedWeeks = snapshot.game.elapsedWeeks;
      this.elapsedYears = snapshot.game.elapsedYears;
      ship.$patch(snapshot.ship);
      world.$patch(snapshot.world);
      this.loadReady = true;
      return true;
    },
  },
});
