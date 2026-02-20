export const GAME_WIDTH = 980;
export const GAME_HEIGHT = 620;

export const START_SHIP_STATE = Object.freeze({
  x: 108,
  y: 375,
  angle: -Math.PI / 2,
  speed: 0,
  throttle: 0,
});

export const PHYSICS = Object.freeze({
  maxForward: 180,
  maxReverse: -70,
  throttleStep: 0.95,
  drag: 0.985,
  turnRate: 1.7,
});

export const HARBOR_WALLS = Object.freeze([
  { x: 0, y: 0, w: 980, h: 52 },
  { x: 0, y: 52, w: 40, h: 568 },
  { x: 0, y: 520, w: 250, h: 100 },
  { x: 215, y: 180, w: 150, h: 130 },
  { x: 840, y: 52, w: 140, h: 220 },
  { x: 840, y: 330, w: 140, h: 290 },
  { x: 620, y: 310, w: 50, h: 190 },
  { x: 600, y: 500, w: 70, h: 120 },
  { x: 495, y: 530, w: 170, h: 90 },
]);

export const BERTH_OUTLINE = Object.freeze([
  { x: 58, y: 180 },
  { x: 106, y: 180 },
  { x: 106, y: 455 },
  { x: 82, y: 470 },
  { x: 58, y: 455 },
]);

export function createStartShipState() {
  return { ...START_SHIP_STATE };
}
