import { CustomSceneType } from "./customScene";
import { useGameStore } from "./store";

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
    } = useGameStore.getState();
    alert(
      `You lose! All shooters were destroyed.\nTotal Survival Time: ${totalTimeSurvived}s\nAttackers Destroyed by Archers: ${attackersDestroyedByArcher}\nAttackers Destroyed by Wizards: ${attackersDestroyedByWizard}\nAttackers Destroyed by Shield Wielders: ${attackersDestroyedByShieldWielder}`
    );
  } 
  // else if (allAttackersDestroyed) {
  //   // Handle game win
  //   this.scene.pause();
  //   const {
  //     totalTimeSurvived,
  //     attackersDestroyedByArcher,
  //     attackersDestroyedByWizard,
  //     attackersDestroyedByShieldWielder,
  //   } = useGameStore.getState();
  //   alert(
  //     `You win! All attackers were destroyed.\nTotal Survival Time: ${totalTimeSurvived}s\nAttackers Destroyed by Archers: ${attackersDestroyedByArcher}\nAttackers Destroyed by Wizards: ${attackersDestroyedByWizard}\nAttackers Destroyed by Shield Wielders: ${attackersDestroyedByShieldWielder}`
  //   );
  // }
}
