import { computed, reactive } from 'vue';
import {
  BERTH_OUTLINE,
  createStartShipState,
  GAME_HEIGHT,
  GAME_WIDTH,
  HARBOR_WALLS,
  SHIP_SIZE,
} from '../game/constants.js';
import { collidesWithWall, createNextShipState, hasEscapedHarbor } from '../game/logic.js';

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
    previousFrameTime: 0,
  });

  const statusText = computed(() => {
    if (gameModel.gameState === 'won') {
      return '🏁 You escaped the harbour. You win!';
    }

    if (gameModel.gameState === 'lost') {
      return '💥 You hit the wall. Game over!';
    }

    return 'Use ↑/↓ throttle and ←/→ steering.';
  });

  function resetGame() {
    gameModel.shipState = createStartShipState();
    gameModel.gameState = 'playing';
    gameModel.previousFrameTime = 0;
  }

  function updateGame(deltaTime) {
    if (gameModel.gameState !== 'playing') {
      return;
    }

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
    statusText,
    resetGame,
    updateGame,
  };
}
