import Phaser from "phaser";
import { CustomSceneType } from "./customScene";

export function checkGameEnd(this: CustomSceneType) {
  const allShootersDestroyed = this.shooters.getChildren().length === 0;
  const allAttackersDestroyed = this.attackers.getChildren().length === 0;

  if (allShootersDestroyed) {
    // Handle game loss
    this.scene.pause();
    alert("You lose! All shooters were destroyed.");
  } else if (allAttackersDestroyed) {
    // Handle game win
    // this.scene.pause();
    // alert("You win! All attackers were destroyed.");
  }
}

