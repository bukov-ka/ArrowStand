// src/game/shooterLogic.ts
import Phaser from "phaser";
import { useGameStore } from "./store";
import { CustomSceneType } from "./customScene";
import { ShooterConfig, ShooterType } from "./shooterConfig";

export function handlePlacement(
  this: CustomSceneType,
  pointer: { x: number; y: number }
) {
  const x = pointer.x;
  const y = pointer.y;
  const selectedShooterType = useGameStore.getState().selectedShooterType;
  const placeShooter = useGameStore.getState().placeShooter;

  if (selectedShooterType && canPlaceShooter(x, y)) {
    const { cost } = ShooterConfig[selectedShooterType];

    if (useGameStore.getState().gold >= cost) {
      placeShooter(x, y, selectedShooterType, cost);
      const shooter = this.add.sprite(x, y, getShooterImage(selectedShooterType));
      shooter.setRotation(Phaser.Math.DegToRad(-90));
      this.shooters.add(shooter);
      this.lastShotTime.set(shooter, 0);
    }
  }
}

function canPlaceShooter(x: number, y: number): boolean {
  return true;
}

export function attackNearestAttacker(
  this: CustomSceneType,
  shooter: Phaser.GameObjects.Sprite
) {
  const attackers = this.attackers.getChildren();
  let nearestAttacker: Phaser.GameObjects.Sprite | null = null;
  let minDistance = Infinity;

  attackers.forEach((attacker) => {
    const attackerSprite = attacker as Phaser.GameObjects.Sprite;
    const distance = Phaser.Math.Distance.Between(
      shooter.x,
      shooter.y,
      attackerSprite.x,
      attackerSprite.y
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestAttacker = attackerSprite;
    }
  });

  const currentTime = this.time.now;
  const lastShot = this.lastShotTime.get(shooter) || 0;
  const shooterType = getShooterTypeBySprite(shooter);
  if (
    nearestAttacker &&
    minDistance <= ShooterConfig[shooterType].range &&
    currentTime - lastShot >= ShooterConfig[shooterType].reloadTime
  ) {
    const angle = Phaser.Math.Angle.Between(
      shooter.x,
      shooter.y,
      (nearestAttacker as Phaser.GameObjects.Sprite).x,
      (nearestAttacker as Phaser.GameObjects.Sprite).y
    );
    shooter.setRotation(angle);
    shootArrow.call(this, shooter, nearestAttacker);
    this.lastShotTime.set(shooter, currentTime);
  }
}

function getShooterTypeBySprite(shooter: Phaser.GameObjects.Sprite): ShooterType {
  switch (shooter.texture.key) {
    case "archer":
      return "Archer";
    case "wizard":
      return "Wizard";
    case "shieldWielder":
      return "ShieldWielder";
    default:
      return "Archer";
  }
}

export function getShooterImage(type: ShooterType): string {
  switch (type) {
    case "Archer":
      return "archer";
    case "Wizard":
      return "wizard";
    case "ShieldWielder":
      return "shieldWielder";
    default:
      return "archer";
  }
}

function getArrowImage(shooterType: ShooterType): string {
  switch (shooterType) {
    case "Archer":
      return "archerArrow";
    case "Wizard":
      return "wizardArrow";
    case "ShieldWielder":
      return "shieldWielderArrow";
    default:
      return "archerArrow";
  }
}

function shootArrow(
  this: CustomSceneType,
  shooter: Phaser.GameObjects.Sprite,
  target: Phaser.GameObjects.Sprite
) {
  const shooterType = getShooterTypeBySprite(shooter); // Get shooter type
  const arrowImage = getArrowImage(shooterType); // Get appropriate arrow image
  const arrow = this.add.sprite(shooter.x, shooter.y, arrowImage); // Use the correct arrow image
  this.arrows.add(arrow);
  const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
  arrow.setRotation(angle);
  this.tweens.add({
    targets: arrow,
    x: target.x,
    y: target.y,
    duration: 100,
    onComplete: () => {
      if (shooterType === "Wizard") {
        drawDamageRadius.call(this, target.x, target.y, ShooterConfig[shooterType].aoeRadius);
        dealAOEDamage.call(this, target, ShooterConfig[shooterType].damage, ShooterConfig[shooterType].aoeRadius);
      } else {
        dealDamageToAttacker.call(this, target, ShooterConfig[shooterType].damage, shooterType); // Pass shooterType
      }
      arrow.destroy();
    },
  });
}

function dealDamageToAttacker(
  this: CustomSceneType,
  attacker: Phaser.GameObjects.Sprite,
  damage: number,
  shooterType: ShooterType
) {
  const attackerIndex = this.attackers.getChildren().indexOf(attacker);
  const attackerHealth = useGameStore.getState().attackers[attackerIndex]?.health;
  const newHealth = attackerHealth - damage;

  if (newHealth <= 0) {
    attacker.destroy();
    useGameStore.getState().updateAttackerHealth(attackerIndex, 0);
    useGameStore.getState().increaseScore(shooterType);
  } else {
    useGameStore.getState().updateAttackerHealth(attackerIndex, newHealth);
  }
}

function dealAOEDamage(
  this: CustomSceneType,
  center: Phaser.GameObjects.Sprite,
  damage: number,
  radius: number
) {
  const attackers = this.attackers.getChildren();
  attackers.forEach((attacker) => {
    const attackerSprite = attacker as Phaser.GameObjects.Sprite;
    const distance = Phaser.Math.Distance.Between(center.x, center.y, attackerSprite.x, attackerSprite.y);
    if (distance <= radius) {
      dealDamageToAttacker.call(this, attackerSprite, damage, "Wizard");
    }
  });
}

function drawDamageRadius(this: CustomSceneType, x: number, y: number, radius: number) {
  const circle = this.add.circle(x, y, radius, 0xff0000, 0.3);
  this.time.addEvent({
    delay: 500, // Adjust the duration the circle is visible as needed
    callback: () => {
      circle.destroy();
    },
  });
}

export function removeShootersInRadius(
  this: CustomSceneType,
  x: number,
  y: number,
  radius: number
) {
  const shooters = this.shooters.getChildren();
  shooters.forEach((shooter) => {
    const shooterSprite = shooter as Phaser.GameObjects.Sprite;
    const distance = Phaser.Math.Distance.Between(x, y, shooterSprite.x, shooterSprite.y);
    if (distance <= radius) {
      shooterSprite.destroy();
      const shooterIndex = this.shooters.getChildren().indexOf(shooterSprite);
      useGameStore.getState().updateShooterHealth(shooterIndex, 0); // Ensure shooter is removed from store
    }
  });
}
