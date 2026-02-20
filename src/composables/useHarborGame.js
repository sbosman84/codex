import { computed, reactive } from 'vue';
import {
  BERTH_OUTLINE,
  createStartShipState,
  GAME_HEIGHT,
  GAME_WIDTH,
  HARBOR_WALLS,
  SHIP_SIZE,
  THROTTLE_NOTCHES,
} from '../game/constants.js';
import { collidesWithWall, createNextShipState, hasEscapedHarbor, shiftThrottleNotch } from '../game/logic.js';

export function useHarborGame() {
  const gameModel = reactive({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    gameState: 'playing',
    shipState: createStartShipState(),
    shipSize: SHIP_SIZE,
    pressedKeys: new Set(),
    harborWalls: HARBOR_WALLS,
    berthOutline: BERTH_OUTLINE,
    elapsedMs: 0,
    previousFrameTime: 0,
  });

  const statusText = computed(() => {
    if (gameModel.gameState === 'won') {
      return '🏁 You escaped the harbour. You win!';
    }

    if (gameModel.gameState === 'lost') {
      return '💥 You hit the wall. Game over!';
    }

    return 'ArrowUp/ArrowDown: throttle notch · ArrowLeft/ArrowRight: rudder';
  });

  const hud = computed(() => ({
    speed: Math.abs(gameModel.shipState.speed).toFixed(1),
    throttle: `${gameModel.shipState.throttle > 0 ? '+' : ''}${gameModel.shipState.throttle}%`,
    throttleIndex: gameModel.shipState.throttleIndex,
    throttleNotches: THROTTLE_NOTCHES,
    rudder: Math.round(gameModel.shipState.rudder * 100),
    timer: (gameModel.elapsedMs / 1000).toFixed(1),
  }));

  function resetGame() {
    gameModel.shipState = createStartShipState();
    gameModel.gameState = 'playing';
    gameModel.elapsedMs = 0;
    gameModel.previousFrameTime = 0;
    gameModel.pressedKeys.clear();
  }

  function adjustThrottle(direction) {
    if (gameModel.gameState !== 'playing') {
      return;
    }

    gameModel.shipState = shiftThrottleNotch(gameModel.shipState, direction);
  }

  function updateGame(deltaTime) {
    if (gameModel.gameState !== 'playing') {
      return;
    }

    gameModel.elapsedMs += deltaTime * 16.67;

    const nextShipState = createNextShipState(gameModel.shipState, gameModel.pressedKeys, deltaTime);

    if (collidesWithWall(nextShipState, gameModel.shipSize, gameModel.harborWalls)) {
      gameModel.gameState = 'lost';
      return;
    }

    gameModel.shipState = nextShipState;

    if (hasEscapedHarbor(nextShipState)) {
      gameModel.gameState = 'won';
    }
  }

  return {
    gameModel,
    hud,
    statusText,
    resetGame,
    adjustThrottle,
    updateGame,
  };
}
