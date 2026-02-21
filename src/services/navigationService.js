export function distanceNm(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 11);
}

export function computeTravelDays(distance, speedKnots) {
  const dayHours = 24;
  return Math.max(1, Math.ceil(distance / (speedKnots * dayHours)));
}

export function interpolateRoute(startPort, endPort, progress) {
  return {
    x: startPort.x + (endPort.x - startPort.x) * progress,
    y: startPort.y + (endPort.y - startPort.y) * progress,
  };
}
