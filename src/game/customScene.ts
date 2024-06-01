// src/game/customScene.ts
import Phaser from "phaser";
import { useGameStore } from "./store";
import { initializeScene, preloadAssets } from "./sceneSetup";
import { handlePlacement, removeShootersInRadius } from "./shooterLogic";
import { spawnAttackers, moveTowardsClosestShooter } from "./attackerLogic";
import { checkGameEnd } from "./gameEndLogic";
import { attackNearestAttacker } from "./shooterLogic";
import { ShooterType, getShooterImage } from "./shooterConfig";

export interface CustomSceneType extends Phaser.Scene {
  shooters: Phaser.GameObjects.Group;
  attackers: Phaser.GameObjects.Group;
  arrows: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  lastAttackTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "battle";
  cursorSprite: Phaser.GameObjects.Sprite | null;
}

export class CustomScene extends Phaser.Scene implements CustomSceneType {
  shooters!: Phaser.GameObjects.Group;
  attackers!: Phaser.GameObjects.Group;
  arrows!: Phaser.GameObjects.Group;
  lastShotTime: Map<Phaser.GameObjects.Sprite, number>;
  lastAttackTime: Map<Phaser.GameObjects.Sprite, number>;
  gamePhase: "placement" | "battle";
  startTime: number;
  cursorSprite: Phaser.GameObjects.Sprite | null;

  constructor() {
    super({ key: "CustomScene" });
    this.lastShotTime = new Map();
    this.lastAttackTime = new Map();
    this.gamePhase = "placement";
    this.startTime = 0;
    this.cursorSprite = null;
  }

  preload() {
    preloadAssets.call(this);
  }

  create() {
    initializeScene.call(this);

    this.input.on("pointerdown", (pointer: { x: any; y: any }) => {
      if (
        useGameStore.getState().gamePhase === "placement" &&
        !useGameStore.getState().removeMode
      ) {
        handlePlacement.call(this, pointer);
      } else if (useGameStore.getState().removeMode) {
        // Workaround to remove shooters
        // Single call does not remove all of them
        for (var i = 0; i < 5; i++) {
          removeShootersInRadius.call(this, pointer.x, pointer.y, 100);
        }
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (useGameStore.getState().removeMode) {
        if (
          !this.cursorSprite ||
          this.cursorSprite.texture.key !== "removeCursor"
        ) {
          if (this.cursorSprite) {
            this.cursorSprite.destroy();
          }
          this.cursorSprite = this.add.sprite(
            pointer.x,
            pointer.y,
            "removeCursor"
          );
          const removeCursorImage = this.textures
            .get("removeCursor")
            .getSourceImage();
          this.cursorSprite.setDisplaySize(
            removeCursorImage.width,
            removeCursorImage.height
          );
        } else {
          this.cursorSprite.setPosition(pointer.x, pointer.y);
        }
      } else {
        const selectedShooterType = useGameStore.getState().selectedShooterType;
        if (selectedShooterType) {
          const shooterImage = getShooterImage(selectedShooterType);
          if (
            !this.cursorSprite ||
            this.cursorSprite.texture.key !== shooterImage
          ) {
            if (this.cursorSprite) {
              this.cursorSprite.destroy();
            }
            this.cursorSprite = this.add.sprite(
              pointer.x,
              pointer.y,
              shooterImage
            );
            const shooterImageSource = this.textures
              .get(shooterImage)
              .getSourceImage();
            this.cursorSprite.setDisplaySize(
              shooterImageSource.width,
              shooterImageSource.height
            );
            this.cursorSprite.setRotation(Phaser.Math.DegToRad(-90));
          } else {
            this.cursorSprite.setPosition(pointer.x, pointer.y);
          }
        } else if (this.cursorSprite) {
          this.cursorSprite.destroy();
          this.cursorSprite = null;
        }
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

    // Listen for changes in game phase to reset cursor
    useGameStore.subscribe((state) => {
      if (state.gamePhase !== "placement" && this.cursorSprite) {
        this.cursorSprite.destroy();
        this.cursorSprite = null;
        this.input.setDefaultCursor("default");
      }
    });
  }

  update() {
    if (useGameStore.getState().gamePhase === "battle") {
      this.attackers.getChildren().forEach((attacker: any) => {
        moveTowardsClosestShooter.call(this, attacker);
      });

      this.shooters.getChildren().forEach((shooter: any) => {
        attackNearestAttacker.call(this, shooter);
      });

      checkGameEnd.call(this);
    }

    const currentTime = this.time.now;
    const survivedTime = Math.floor((currentTime - this.startTime) / 1000);
    useGameStore.getState().updateTimeSurvived(survivedTime);
  }
}
