import { PHYSICS } from './constants.js';

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

export function createNextShipState(currentShipState, pressedKeys, deltaTime) {
  const nextShipState = { ...currentShipState };

  if (pressedKeys.has('ArrowUp')) {
    nextShipState.throttle = Math.min(nextShipState.throttle + PHYSICS.throttleStep * deltaTime, 100);
  }

  if (pressedKeys.has('ArrowDown')) {
    nextShipState.throttle = Math.max(nextShipState.throttle - PHYSICS.throttleStep * deltaTime, -40);
  }

  const targetForwardSpeed = (nextShipState.throttle / 100) * PHYSICS.maxForward;
  const targetReverseSpeed = (nextShipState.throttle / 40) * PHYSICS.maxReverse;

  if (nextShipState.throttle >= 0) {
    nextShipState.speed += (targetForwardSpeed - nextShipState.speed) * 0.03 * deltaTime;
  } else {
    nextShipState.speed += (targetReverseSpeed - nextShipState.speed) * 0.03 * deltaTime;
  }

  nextShipState.speed *= Math.pow(PHYSICS.drag, deltaTime);

  if (Math.abs(nextShipState.speed) > 2) {
    if (pressedKeys.has('ArrowLeft')) {
      nextShipState.angle -= PHYSICS.turnRate * deltaTime * (nextShipState.speed / PHYSICS.maxForward);
    }

    if (pressedKeys.has('ArrowRight')) {
      nextShipState.angle += PHYSICS.turnRate * deltaTime * (nextShipState.speed / PHYSICS.maxForward);
    }
  }

  nextShipState.x += Math.sin(nextShipState.angle) * nextShipState.speed * deltaTime * 0.018;
  nextShipState.y -= Math.cos(nextShipState.angle) * nextShipState.speed * deltaTime * 0.018;

  return nextShipState;
}
