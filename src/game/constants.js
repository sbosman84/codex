export const GAME_WIDTH = 980;
export const GAME_HEIGHT = 620;

export const BERTH_BOUNDS = Object.freeze({
  left: 58,
  right: 106,
  top: 180,
  bottom: 455,
  margin: 10,
});

export const SHIP_SIZE = Object.freeze({
  width: BERTH_BOUNDS.right - BERTH_BOUNDS.left - BERTH_BOUNDS.margin * 2,
  length: BERTH_BOUNDS.bottom - BERTH_BOUNDS.top - BERTH_BOUNDS.margin * 2,
});

export const THROTTLE_NOTCHES = Object.freeze([-40, -20, 0, 20, 45, 70, 100]);
export const NEUTRAL_THROTTLE_INDEX = 2;

export const START_SHIP_STATE = Object.freeze({
  x: BERTH_BOUNDS.left + BERTH_BOUNDS.margin + SHIP_SIZE.width / 2,
  y: BERTH_BOUNDS.top + BERTH_BOUNDS.margin + SHIP_SIZE.length / 2,
  angle: 0,
  speed: 0,
  throttle: THROTTLE_NOTCHES[NEUTRAL_THROTTLE_INDEX],
  throttleIndex: NEUTRAL_THROTTLE_INDEX,
  rudder: 0,
  angularVelocity: 0,
});

export const PHYSICS = Object.freeze({
  maxForward: 155,
  maxReverse: 62,
  engineResponse: 0.017,
  waterDrag: 0.992,
  rudderResponse: 0.12,
  rudderDecay: 0.9,
  turnPower: 0.028,
  angularDamping: 0.93,
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
  { x: BERTH_BOUNDS.left, y: BERTH_BOUNDS.top },
  { x: BERTH_BOUNDS.right, y: BERTH_BOUNDS.top },
  { x: BERTH_BOUNDS.right, y: BERTH_BOUNDS.bottom },
  { x: (BERTH_BOUNDS.left + BERTH_BOUNDS.right) / 2, y: BERTH_BOUNDS.bottom + 15 },
  { x: BERTH_BOUNDS.left, y: BERTH_BOUNDS.bottom },
]);

export function createStartShipState() {
  return { ...START_SHIP_STATE };
}
