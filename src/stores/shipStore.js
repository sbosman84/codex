import { defineStore } from 'pinia';

const START_SHIP = Object.freeze({
  id: 'starter',
  name: 'MV Northwind',
  speedKnots: 15,
  capacity: 120,
  condition: 85,
  fuelMax: 100,
  fuelUsePerDay: 6,
});

export const SHIP_CATALOG = Object.freeze([
  { id: 'atlas', name: 'Atlas Runner', category: 'High-Tech Ships', price: 210000, speedKnots: 19, capacity: 145, condition: 92, fuelMax: 120, fuelUsePerDay: 8 },
  { id: 'pelican', name: 'Pelican II', category: 'Pre-owned Ships', price: 108000, speedKnots: 16, capacity: 132, condition: 74, fuelMax: 108, fuelUsePerDay: 7 },
  { id: 'dockbee', name: 'Dock Bee', category: 'Low Cost Ships', price: 64000, speedKnots: 13, capacity: 115, condition: 69, fuelMax: 92, fuelUsePerDay: 5 },
  { id: 'starlift', name: 'Starlift', category: 'Sellers Market', price: 165000, speedKnots: 17, capacity: 138, condition: 80, fuelMax: 112, fuelUsePerDay: 7 },
  { id: 'advisor', name: 'Consulting Demo', category: 'Consulting Division', price: 145000, speedKnots: 14, capacity: 155, condition: 88, fuelMax: 115, fuelUsePerDay: 6 },
]);

export const useShipStore = defineStore('ship', {
  state: () => ({
    captainName: 'Captain Mira',
    currentPortId: 'rotterdam',
    layUp: false,
    cash: 90000,
    bankBalance: 15000,
    loan: 50000,
    cargo: {},
    ship: { ...START_SHIP, fuel: 78 },
  }),
  getters: {
    cargoTons(state) {
      return Object.values(state.cargo).reduce((sum, qty) => sum + qty, 0);
    },
    remainingCapacity() {
      return Math.max(0, this.ship.capacity - this.cargoTons);
    },
  },
  actions: {
    moveToPort(portId) {
      this.currentPortId = portId;
    },
    applyWeeklyFinance() {
      const interest = Math.round(this.loan * 0.004);
      this.loan += interest;
      this.cash -= 450;
    },
    useFuel(days) {
      this.ship.fuel = Math.max(0, this.ship.fuel - days * this.ship.fuelUsePerDay);
    },
    refuel() {
      const missing = this.ship.fuelMax - this.ship.fuel;
      const cost = missing * 45;
      if (missing <= 0 || this.cash < cost) {
        return false;
      }
      this.cash -= cost;
      this.ship.fuel = this.ship.fuelMax;
      return true;
    },
    repair() {
      const missing = 100 - this.ship.condition;
      const cost = missing * 80;
      if (missing <= 0 || this.cash < cost) {
        return false;
      }
      this.cash -= cost;
      this.ship.condition = 100;
      return true;
    },
    adjustCondition(delta) {
      this.ship.condition = Math.max(0, Math.min(100, this.ship.condition + delta));
    },
    toggleLayUp() {
      this.layUp = !this.layUp;
    },
    buyCargo(commodityId, tons, unitPrice) {
      const totalCost = tons * unitPrice;
      if (tons <= 0 || this.remainingCapacity < tons || this.cash < totalCost) {
        return false;
      }
      this.cash -= totalCost;
      this.cargo[commodityId] = (this.cargo[commodityId] ?? 0) + tons;
      return true;
    },
    sellCargo(commodityId, tons, unitPrice) {
      const owned = this.cargo[commodityId] ?? 0;
      if (tons <= 0 || owned < tons) {
        return false;
      }
      this.cargo[commodityId] = owned - tons;
      if (this.cargo[commodityId] === 0) {
        delete this.cargo[commodityId];
      }
      this.cash += tons * unitPrice;
      return true;
    },
    completeContract(payout) {
      this.cash += payout;
    },
    setShipFromBroker(newShip) {
      this.ship = { ...newShip, fuel: newShip.fuelMax };
    },
    purchaseShip(shipSpec) {
      if (this.cash < shipSpec.price) {
        return false;
      }
      this.cash -= shipSpec.price;
      this.setShipFromBroker(shipSpec);
      return true;
    },
    bankTransaction(amount) {
      if (amount > 0) {
        if (this.cash < amount) {
          return false;
        }
        this.cash -= amount;
        this.bankBalance += amount;
        return true;
      }

      const withdrawal = Math.abs(amount);
      if (this.bankBalance < withdrawal) {
        return false;
      }
      this.bankBalance -= withdrawal;
      this.cash += withdrawal;
      return true;
    },
  },
});
