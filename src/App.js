import { GameStatusPanel } from './components/GameStatusPanel.js';
import { HarborGameCanvas } from './components/HarborGameCanvas.js';
import { useHarborGame } from './composables/useHarborGame.js';

export const HarborEscapeApp = {
  name: 'HarborEscapeApp',
  components: {
    GameStatusPanel,
    HarborGameCanvas,
  },
  setup() {
    const { gameModel, statusText, resetGame, updateGame } = useHarborGame();

    let animationFrameId;

    function onAnimationFrame(timestamp) {
      if (!gameModel.previousFrameTime) {
        gameModel.previousFrameTime = timestamp;
      }

      const deltaTime = Math.min((timestamp - gameModel.previousFrameTime) / 16.67, 2.5);
      gameModel.previousFrameTime = timestamp;

      updateGame(deltaTime);
      animationFrameId = requestAnimationFrame(onAnimationFrame);
    }

    function handleKeydown(event) {
      if (event.code.startsWith('Arrow')) {
        event.preventDefault();
      }

      if (event.code === 'Space' && gameModel.gameState !== 'playing') {
        resetGame();
      }

      gameModel.pressedKeys.add(event.code);
    }

    function handleKeyup(event) {
      gameModel.pressedKeys.delete(event.code);
    }

    function startGameLoop() {
      window.addEventListener('keydown', handleKeydown);
      window.addEventListener('keyup', handleKeyup);
      animationFrameId = requestAnimationFrame(onAnimationFrame);
    }

    function stopGameLoop() {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
      cancelAnimationFrame(animationFrameId);
    }

    return {
      gameModel,
      statusText,
      resetGame,
      startGameLoop,
      stopGameLoop,
    };
  },
  mounted() {
    this.startGameLoop();
  },
  beforeUnmount() {
    this.stopGameLoop();
  },
  template: `
    <main class="game-shell">
      <h1>Harbor Escape</h1>
      <GameStatusPanel :status-text="statusText" @restart="resetGame" />
      <HarborGameCanvas
        :width="gameModel.width"
        :height="gameModel.height"
        :ship-state="gameModel.shipState"
        :harbor-walls="gameModel.harborWalls"
        :berth-outline="gameModel.berthOutline"
      />
    </main>
  `,
};
