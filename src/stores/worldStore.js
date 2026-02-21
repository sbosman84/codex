import { defineStore } from 'pinia';
import { COMMODITIES, computeContractPayout, createPortMarkets, tickPortMarkets } from '../services/economyService.js';
import { computeTravelDays, distanceNm, interpolateRoute } from '../services/navigationService.js';

const PORTS = Object.freeze([
  { id: 'rotterdam', name: 'Rotterdam', x: 130, y: 120, seed: 12 },
  { id: 'hamburg', name: 'Hamburg', x: 185, y: 80, seed: 33 },
  { id: 'lisbon', name: 'Lisbon', x: 95, y: 230, seed: 21 },
  { id: 'newyork', name: 'New York', x: 310, y: 145, seed: 49 },
  { id: 'rio', name: 'Rio', x: 330, y: 320, seed: 55 },
  { id: 'cape', name: 'Cape Town', x: 470, y: 380, seed: 65 },
  { id: 'mumbai', name: 'Mumbai', x: 590, y: 220, seed: 38 },
  { id: 'singapore', name: 'Singapore', x: 670, y: 255, seed: 82 },
  { id: 'tokyo', name: 'Tokyo', x: 760, y: 130, seed: 44 },
  { id: 'sydney', name: 'Sydney', x: 780, y: 380, seed: 75 },
]);

export const useWorldStore = defineStore('world', {
  state: () => ({
    ports: PORTS,
    commodities: COMMODITIES,
    markets: createPortMarkets(PORTS),
    selectedDestinationId: null,
    activeContract: null,
    pendingVoyage: null,
    travel: null,
    pendingArrivalPortId: null,
    charterOffer: null,
  }),
  getters: {
    selectedDestination(state) {
      return state.ports.find((port) => port.id === state.selectedDestinationId) ?? null;
    },
    pendingArrivalPort(state) {
      return state.ports.find((port) => port.id === state.pendingArrivalPortId) ?? null;
    },
  },
  actions: {
    selectDestination(portId) {
      this.selectedDestinationId = portId;
    },
    refreshMarkets() {
      this.markets = tickPortMarkets(this.markets);
    },
    createContract(originId, destinationId, commodityId) {
      const origin = this.ports.find((port) => port.id === originId);
      const destination = this.ports.find((port) => port.id === destinationId);
      const commodity = this.commodities.find((entry) => entry.id === commodityId);
      if (!origin || !destination || !commodity || origin.id === destination.id) {
        return null;
      }
      const distance = distanceNm(origin, destination);
      const days = computeTravelDays(distance, 15);
      const payout = computeContractPayout(distance, commodity.risk);
      return {
        id: `contract-${Date.now()}`,
        originId,
        destinationId,
        commodityId,
        distance,
        days,
        payout,
        deadlineWeeks: null,
      };
    },
    setPendingVoyage(contract) {
      this.pendingVoyage = contract;
      this.activeContract = contract;
    },
    startTravel(speedKnots, currentPortId) {
      if (!this.pendingVoyage) {
        return null;
      }
      const origin = this.ports.find((port) => port.id === currentPortId);
      const destination = this.ports.find((port) => port.id === this.pendingVoyage.destinationId);
      if (!origin || !destination) {
        return null;
      }
      const totalDays = computeTravelDays(this.pendingVoyage.distance, speedKnots);
      this.travel = {
        originId: origin.id,
        destinationId: destination.id,
        elapsedDays: 0,
        totalDays,
        marker: { x: origin.x, y: origin.y },
      };
      this.pendingVoyage = null;
      return this.travel;
    },
    advanceTravel(daysDelta) {
      if (!this.travel) {
        return null;
      }
      this.travel.elapsedDays = Math.min(this.travel.totalDays, this.travel.elapsedDays + daysDelta);
      const origin = this.ports.find((port) => port.id === this.travel.originId);
      const destination = this.ports.find((port) => port.id === this.travel.destinationId);
      const progress = Math.min(1, this.travel.elapsedDays / this.travel.totalDays);
      this.travel.marker = interpolateRoute(origin, destination, progress);
      if (progress >= 1) {
        this.pendingArrivalPortId = destination.id;
        this.travel = null;
        return 'arrived';
      }
      return null;
    },
    resolveContractAtPort(portId) {
      if (!this.activeContract || this.activeContract.destinationId !== portId) {
        return 0;
      }
      const payout = this.activeContract.payout;
      this.activeContract = null;
      return payout;
    },
    createCharterOffer(currentPortId) {
      const otherPorts = this.ports.filter((port) => port.id !== currentPortId);
      const destination = otherPorts[Math.floor(Math.random() * otherPorts.length)];
      const commodity = this.commodities[Math.floor(Math.random() * this.commodities.length)];
      const offer = this.createContract(currentPortId, destination.id, commodity.id);
      this.charterOffer = offer;
      return offer;
    },
    clearCharter() {
      this.charterOffer = null;
    },
  },
});
