export const DOCKING_CONFIG = Object.freeze({
  width: 900,
  height: 520,
  timerSeconds: 90,
  safeSpeed: 22,
  safeAngleRadians: 0.38,
  holdSeconds: 2.5,
});

export function initialDockingState() {
  return {
    x: 120,
    y: 420,
    angle: -Math.PI / 2,
    speed: 0,
    rudder: 0,
    throttle: 0,
    holdTimer: 0,
  };
}

export function updateDockingState(state, controls, deltaTime) {
  const next = { ...state };
  const rudderTarget = controls.left ? -0.7 : controls.right ? 0.7 : 0;
  next.rudder += (rudderTarget - next.rudder) * 0.08 * deltaTime;

  if (controls.up) {
    next.throttle = Math.min(100, next.throttle + 1.4 * deltaTime);
  }
  if (controls.down) {
    next.throttle = Math.max(-60, next.throttle - 1.8 * deltaTime);
  }

  const targetSpeed = next.throttle >= 0 ? (next.throttle / 100) * 70 : (next.throttle / 60) * 30;
  next.speed += (targetSpeed - next.speed) * 0.03 * deltaTime;
  next.speed *= Math.pow(0.988, deltaTime);

  const speedFactor = Math.min(Math.abs(next.speed) / 70, 1);
  const angularVelocity = next.rudder * speedFactor * 0.012 * deltaTime;
  next.angle += angularVelocity;

  next.x += Math.cos(next.angle) * next.speed * 0.018 * deltaTime;
  next.y += Math.sin(next.angle) * next.speed * 0.018 * deltaTime;

  return next;
}

export function inDockZone(ship, zone) {
  const withinBounds = ship.x > zone.x && ship.x < zone.x + zone.w && ship.y > zone.y && ship.y < zone.y + zone.h;
  const angleDelta = Math.abs(ship.angle - zone.angle);
  return withinBounds && Math.abs(ship.speed) <= DOCKING_CONFIG.safeSpeed && angleDelta <= DOCKING_CONFIG.safeAngleRadians;
}
