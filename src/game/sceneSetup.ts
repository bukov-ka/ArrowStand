import Phaser from "phaser";
import { CustomSceneType } from "./customScene";

export function initializeScene(this: CustomSceneType) {
  const coef = 600 / 1024; // Scale the background image to the size
  const background = this.add
    .tileSprite(0, 0, 1024, 3000 / coef, "background")
    .setOrigin(0, 0);
  background.setScale(coef, coef);
  this.shooters = this.add.group();
  this.attackers = this.add.group();
  this.arrows = this.add.group();
}

export function preloadAssets(this: CustomSceneType) {
  this.load.image("background", "assets/background.png");
  this.load.image("shooter", "assets/shooter.png");
  this.load.image("longRangeShooter", "assets/longRangeShooter.png");
  this.load.image("heavyCrossbowShooter", "assets/heavyCrossbowShooter.png");
  this.load.image("attacker", "assets/attacker.png");
  this.load.image("arrow", "assets/arrow.png");
}
