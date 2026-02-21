export const COMMODITIES = Object.freeze([
  { id: 'textiles', label: 'Textiles', risk: 1.1, basePrice: 130 },
  { id: 'food', label: 'Food', risk: 0.8, basePrice: 70 },
  { id: 'machinery', label: 'Machinery', risk: 1.3, basePrice: 190 },
  { id: 'arms', label: 'Arms', risk: 1.9, basePrice: 320 },
  { id: 'timber', label: 'Timber', risk: 0.9, basePrice: 90 },
  { id: 'electronics', label: 'Electronics', risk: 1.5, basePrice: 240 },
  { id: 'oil', label: 'Oil', risk: 1.2, basePrice: 150 },
  { id: 'grain', label: 'Grain', risk: 0.7, basePrice: 55 },
]);

export function createPortMarkets(ports) {
  return Object.fromEntries(
    ports.map((port) => [
      port.id,
      Object.fromEntries(
        COMMODITIES.map((commodity) => {
          const bias = 0.85 + ((port.seed + commodity.basePrice) % 35) / 100;
          return [commodity.id, Math.round(commodity.basePrice * bias)];
        }),
      ),
    ]),
  );
}

export function tickPortMarkets(markets) {
  const next = structuredClone(markets);
  Object.values(next).forEach((prices) => {
    Object.keys(prices).forEach((commodityId) => {
      const change = Math.round((Math.random() * 10 - 5) * 0.8);
      prices[commodityId] = Math.max(20, prices[commodityId] + change);
    });
  });
  return next;
}

export function computeContractPayout(distance, commodityRisk) {
  return Math.round(distance * 10 * commodityRisk + 800);
}
