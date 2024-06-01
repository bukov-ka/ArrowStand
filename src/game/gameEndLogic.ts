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

    alert(
      `You lose! All shooters were destroyed.\nTotal Survival Time: ${totalTimeSurvived}s\nAttackers Destroyed by Archers: ${attackersDestroyedByArcher}\nAttackers Destroyed by Wizards: ${attackersDestroyedByWizard}\nAttackers Destroyed by Shield Wielders: ${attackersDestroyedByShieldWielder}`
    );
  }
}
