import { PHYSICS, THROTTLE_NOTCHES } from './constants.js';

export function pointInsideWall(x, y, walls) {
  return walls.some((wall) => x >= wall.x && x <= wall.x + wall.w && y >= wall.y && y <= wall.y + wall.h);
}

export function getShipCorners(shipState, shipSize) {
  const halfWidth = shipSize.width / 2;
  const halfLength = shipSize.length / 2;
  const cosine = Math.cos(shipState.angle);
  const sine = Math.sin(shipState.angle);

  const localPoints = [
    { localX: -halfWidth, localY: -halfLength },
    { localX: halfWidth, localY: -halfLength },
    { localX: halfWidth, localY: halfLength },
    { localX: -halfWidth, localY: halfLength },
  ];

  return localPoints.map((point) => ({
    x: shipState.x + point.localX * cosine - point.localY * sine,
    y: shipState.y + point.localX * sine + point.localY * cosine,
  }));
}

export function collidesWithWall(shipState, shipSize, walls) {
  return getShipCorners(shipState, shipSize).some((corner) => pointInsideWall(corner.x, corner.y, walls));
}

export function hasEscapedHarbor(shipState) {
  return shipState.y < 46 && shipState.x > 360 && shipState.x < 825;
}

export function shiftThrottleNotch(shipState, direction) {
  const nextState = { ...shipState };
  const nextIndex = Math.max(0, Math.min(THROTTLE_NOTCHES.length - 1, nextState.throttleIndex + direction));

  nextState.throttleIndex = nextIndex;
  nextState.throttle = THROTTLE_NOTCHES[nextIndex];

  return nextState;
}

export function createNextShipState(currentShipState, pressedKeys, deltaTime) {
  const nextShipState = { ...currentShipState };

  const desiredRudder = pressedKeys.has('ArrowLeft') ? -1 : pressedKeys.has('ArrowRight') ? 1 : 0;
  nextShipState.rudder += (desiredRudder - nextShipState.rudder) * PHYSICS.rudderResponse * deltaTime;
  if (!desiredRudder) {
    nextShipState.rudder *= Math.pow(PHYSICS.rudderDecay, deltaTime);
  }

  const targetSpeed =
    nextShipState.throttle >= 0
      ? (nextShipState.throttle / 100) * PHYSICS.maxForward
      : (nextShipState.throttle / 40) * PHYSICS.maxReverse;

  nextShipState.speed += (targetSpeed - nextShipState.speed) * PHYSICS.engineResponse * deltaTime;
  nextShipState.speed *= Math.pow(PHYSICS.waterDrag, deltaTime);

  const speedRatio = Math.min(Math.abs(nextShipState.speed) / PHYSICS.maxForward, 1);
  nextShipState.angularVelocity += nextShipState.rudder * speedRatio * PHYSICS.turnPower * deltaTime;
  nextShipState.angularVelocity *= Math.pow(PHYSICS.angularDamping, deltaTime);
  nextShipState.angle += nextShipState.angularVelocity;

  nextShipState.x += Math.sin(nextShipState.angle) * nextShipState.speed * deltaTime * 0.018;
  nextShipState.y -= Math.cos(nextShipState.angle) * nextShipState.speed * deltaTime * 0.018;

  return nextShipState;
}
