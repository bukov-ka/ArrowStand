// src/game/gameEndLogic.ts
import { CustomSceneType } from "./customScene";
import { useGameStore } from "./store";
import { saveToLeaderboard } from "../utils/leaderboard";

export function checkGameEnd(this: CustomSceneType) {
  const allShootersDestroyed = this.shooters.getChildren().length === 0;
  const allAttackersDestroyed = this.attackers.getChildren().length === 0;

  if (allShootersDestroyed) {
    // Handle game loss
    this.scene.pause();
    const {
      totalTimeSurvived,
      attackersDestroyedByArcher,
      attackersDestroyedByWizard,
      attackersDestroyedByShieldWielder,
      score,
      shooters,
    } = useGameStore.getState();

    const archers = shooters.filter((s) => s.type === "Archer").length;
    const wizards = shooters.filter((s) => s.type === "Wizard").length;
    const shieldWielders = shooters.filter((s) => s.type === "ShieldWielder").length;

    saveToLeaderboard({ score, archers, wizards, shieldWielders });

    // Trigger the leaderboard update
    useGameStore.getState().updateLeaderboard();

    // Display the final score and new game button
    const gameOverMessage = `
      You lose! All shooters were destroyed.
      Total Survival Time: ${totalTimeSurvived}s
      Attackers Destroyed by Archers: ${attackersDestroyedByArcher}
      Attackers Destroyed by Wizards: ${attackersDestroyedByWizard}
      Attackers Destroyed by Shield Wielders: ${attackersDestroyedByShieldWielder}
      Final Score: ${score}
    `;

    const gameOverDiv = document.createElement('div');
    gameOverDiv.innerHTML = `
      <p>${gameOverMessage.replace(/\n/g, '<br>')}</p>
      <button id="new-game-button">New Game</button>
    `;
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.backgroundColor = 'black';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.border = '2px solid white';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.color = 'white';
    gameOverDiv.style.fontFamily = 'MedievalSharp, cursive';

    document.body.appendChild(gameOverDiv);

    const newGameButton = document.getElementById('new-game-button');
    if (newGameButton) {
      newGameButton.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}
