import Phaser from "phaser";
import { useGameStore } from "./store";
import { initializeScene, preloadAssets } from "./sceneSetup";
import { handlePlacement } from "./shooterLogic";
import {
  spawnAttackers,
  spawnAttacker,
  moveTowardsClosestShooter,
} from "./attackerLogic";
import { checkGameEnd } from "./gameEndLogic";
import { attackNearestAttacker } from "./shooterLogic";

export interface CustomSceneType extends Phaser.Scene {
  shooters: Phaser.GameObjects.Group;
  attackers: Phaser.GameObjects.Group;
  arrows: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  lastAttackTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "pre-battle" | "battle";
}

export class CustomScene extends Phaser.Scene implements CustomSceneType {
  shooters!: Phaser.GameObjects.Group;
  attackers!: Phaser.GameObjects.Group;
  arrows!: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  lastAttackTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "pre-battle" | "battle";
  startTime: number;

  constructor() {
    super({ key: "CustomScene" });
    this.lastShotTime = new Map();
    this.lastAttackTime = new Map();
    this.gamePhase = "placement";
    this.startTime = 0;
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

    this.startTime = this.time.now;
  }

  update() {
    if (useGameStore.getState().gamePhase === "battle") {
      this.attackers.getChildren().forEach((attacker: any, index: number) => {
        moveTowardsClosestShooter.call(this, attacker);
      });

      this.shooters.getChildren().forEach((shooter: any) => {
        attackNearestAttacker.call(this, shooter);
      });

      // Check win/lose conditions
      checkGameEnd.call(this);
    }

    const currentTime = this.time.now;
    const survivedTime = Math.floor((currentTime - this.startTime) / 1000);
    useGameStore.getState().updateTimeSurvived(survivedTime);
  }
}
