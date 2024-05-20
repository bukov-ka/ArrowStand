import Phaser from "phaser";
import { useGameStore } from "./store";
import { initializeScene, preloadAssets } from "./sceneSetup";
import { handlePlacement } from "./shooterLogic";
import { spawnAttackers, spawnAttacker, moveTowardsClosestShooter, updateAttackerHealthDisplay } from "./attackerLogic";
import { checkGameEnd } from "./gameEndLogic";
import { attackNearestAttacker } from "./shooterLogic";

export interface CustomSceneType extends Phaser.Scene {
  shooters: Phaser.GameObjects.Group;
  attackers: Phaser.GameObjects.Group;
  arrows: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "pre-battle" | "battle";
}

export class CustomScene extends Phaser.Scene implements CustomSceneType {
  shooters!: Phaser.GameObjects.Group;
  attackers!: Phaser.GameObjects.Group;
  arrows!: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "pre-battle" | "battle";

  constructor() {
    super({ key: "CustomScene" });
    this.lastShotTime = new Map();
    this.gamePhase = "placement"; // Default initial value
  }

  preload() {
    preloadAssets.call(this);
  }

  create() {
    initializeScene.call(this);

    this.input.on("pointerdown", (pointer: { x: any; y: any }) => {
      if (useGameStore.getState().gamePhase === "placement") {
        handlePlacement.call(this, pointer);
      }
    });

    this.time.addEvent({
      delay: 1000,
      callback: spawnAttackers,
      callbackScope: this,
      loop: true,
    });

    this.gamePhase = useGameStore.getState().gamePhase;

    // Spawn initial attackers during the pre-battle phase
    if (this.gamePhase === "pre-battle") {
      for (let i = 0; i < 5; i++) {
        spawnAttacker.call(this, Phaser.Math.Between(50, 750), 0, "Light Infantry");
      }
    }
  }

  update() {
    if (useGameStore.getState().gamePhase === "battle") {
      this.attackers.getChildren().forEach((attacker: any, index: number) => {
        moveTowardsClosestShooter.call(this, attacker);
        if (attacker.y > 600) {
          attacker.destroy(); // Remove attacker if it moves off-screen
          useGameStore.getState().updateAttackerHealth(index, 0); // Example health update
        } else {
          updateAttackerHealthDisplay.call(this, attacker, index);
        }
      });

      this.shooters.getChildren().forEach((shooter: any) => {
        attackNearestAttacker.call(this, shooter);
      });

      // Check win/lose conditions
      checkGameEnd.call(this);
    }
  }
}
