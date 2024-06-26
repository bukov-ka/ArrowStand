// src/game/gameEndLogic.ts
import { CustomSceneType } from "./customScene";
import { useGameStore } from "./store";
import { saveToLeaderboard } from "../utils/leaderboard";

export function checkGameEnd(this: CustomSceneType) {
  const allShootersDestroyed = this.shooters.getChildren().length === 0;
  const totalAttackersDestroyed = useGameStore.getState().score;

  if (allShootersDestroyed || totalAttackersDestroyed >= 2000) {
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
    const shieldWielders = shooters.filter(
      (s) => s.type === "ShieldWielder"
    ).length;

    saveToLeaderboard({ score, archers, wizards, shieldWielders });

    useGameStore.getState().updateLeaderboard();

    const gameResult = totalAttackersDestroyed >= 2000 ? "win" : "lose";
    const gameResultMessage =
      gameResult === "win"
        ? "You win! All 2000 attackers were destroyed."
        : "You lose! All shooters were destroyed.";

    const gameOverMessage = `
      ${gameResultMessage}
      Total Survival Time: ${totalTimeSurvived}s
      Attackers Destroyed by Archers: ${attackersDestroyedByArcher}
      Attackers Destroyed by Wizards: ${attackersDestroyedByWizard}
      Attackers Destroyed by Shield Wielders: ${attackersDestroyedByShieldWielder}
      Final Score: ${score}
    `;

    const gameOverDiv = document.createElement("div");
    gameOverDiv.innerHTML = `
      <img src="assets/${
        totalAttackersDestroyed >= 2000 ? "won" : "lost"
      }.png" alt="${
      totalAttackersDestroyed >= 2000 ? "You Win" : "You Lose"
    }" />
      <p>${gameOverMessage.replace(/\n/g, "<br>")}</p>
      <button id="new-game-button">New Game</button>
    `;
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '20px';
    gameOverDiv.style.transform = 'translateY(-50%)'; // Center vertically
    gameOverDiv.style.backgroundColor = 'black';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.border = '2px solid white';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.color = 'white';
    gameOverDiv.style.fontFamily = 'MedievalSharp, cursive';

    document.body.appendChild(gameOverDiv);

    const newGameButton = document.getElementById("new-game-button");
    if (newGameButton) {
      newGameButton.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }
}
