import Phaser from "phaser";
import { useGameStore } from "./store";
import { CustomSceneType } from "./customScene";

export function handlePlacement(
  this: CustomSceneType,
  pointer: { x: number; y: number }
) {
  const x = pointer.x;
  const y = pointer.y;
  const selectedShooterType = useGameStore.getState().selectedShooterType;
  const placeShooter = useGameStore.getState().placeShooter;

  if (selectedShooterType && canPlaceShooter(x, y)) {
    const shooterCost = getShooterCost(selectedShooterType);

    if (useGameStore.getState().gold >= shooterCost) {
      placeShooter(x, y, selectedShooterType, shooterCost);
      const shooter = this.add.sprite(
        x,
        y,
        getShooterImage(selectedShooterType)
      );
      this.shooters.add(shooter);
      this.lastShotTime.set(shooter, 0); // Initialize last shot time
    }
  }
}

export function canPlaceShooter(x: number, y: number): boolean {
  // Add validation logic here (e.g., not on obstacles, within budget)
  return true;
}

export function getShooterCost(type: string): number {
  switch (type) {
    case "Usual Shooter":
      return 100;
    case "Long-Range Shooter":
      return 150;
    case "Heavy Crossbow Shooter":
      return 200;
    default:
      return 0;
  }
}

export function getShooterImage(type: string): string {
  switch (type) {
    case "Usual Shooter":
      return "shooter";
    case "Long-Range Shooter":
      return "longRangeShooter";
    case "Heavy Crossbow Shooter":
      return "heavyCrossbowShooter";
    default:
      return "shooter";
  }
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
  if (
    nearestAttacker &&
    minDistance <= getShooterRange(shooter.texture.key) &&
    currentTime - lastShot >= 3000 // 3 seconds reload time
  ) {
    // Rotate shooter to face nearest attacker
    const angle = Phaser.Math.Angle.Between(
      shooter.x,
      shooter.y,
      (nearestAttacker as Phaser.GameObjects.Sprite).x,
      (nearestAttacker as Phaser.GameObjects.Sprite).y
    );
    shooter.setRotation(angle);

    // Shoot an arrow towards the nearest attacker
    shootArrow.call(this, shooter, nearestAttacker);
    this.lastShotTime.set(shooter, currentTime); // Update last shot time
  }
}

function getShooterRange(type: string): number {
  switch (type) {
    case "shooter":
      return 200; // Example range
    case "longRangeShooter":
      return 300; // Example range
    case "heavyCrossbowShooter":
      return 250; // Example range
    default:
      return 200;
  }
}

function shootArrow(
  this: CustomSceneType,
  shooter: Phaser.GameObjects.Sprite,
  target: Phaser.GameObjects.Sprite
) {
  const arrow = this.add.sprite(shooter.x, shooter.y, "arrow");
  this.arrows.add(arrow);

  // Calculate angle and rotate arrow
  const angle = Phaser.Math.Angle.Between(
    shooter.x,
    shooter.y,
    target.x,
    target.y
  );
  arrow.setRotation(angle);

  // Move the arrow to the target instantly
  this.tweens.add({
    targets: arrow,
    x: target.x,
    y: target.y,
    duration: 100, // Arrow reaches the target quickly
    onComplete: () => {
      dealDamageToAttacker.call(this, target);
      arrow.destroy();
    },
  });
}

function dealDamageToAttacker(
  this: CustomSceneType,
  attacker: Phaser.GameObjects.Sprite
) {
  const attackerIndex = this.attackers.getChildren().indexOf(attacker);
  const attackerHealth =
    useGameStore.getState().attackers[attackerIndex]?.health;
  if (!attackerHealth) {
    return;
  }
  const newHealth = attackerHealth - 100; // Example damage

  if (newHealth <= 0) {
    attacker.destroy();
    useGameStore.getState().updateAttackerHealth(attackerIndex, 0);
  } else {
    useGameStore.getState().updateAttackerHealth(attackerIndex, newHealth);
  }
}
