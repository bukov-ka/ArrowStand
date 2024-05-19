import Phaser from "phaser";
import { useGameStore } from "./store";
import { CustomSceneType } from "./customScene";

export function spawnAttackers(this: CustomSceneType) {
  if (useGameStore.getState().gamePhase === "pre-battle") {
    const x = Phaser.Math.Between(50, 750);
    const y = 0; // Spawn at the top
    spawnAttacker.call(this, x, y, "Light Infantry"); // Example type
  }
}

export function spawnAttacker(this: CustomSceneType, x: number, y: number, type: string) {
  const attacker = this.add.sprite(x, y, "attacker");
  this.attackers.add(attacker);
  useGameStore.getState().addAttacker(x, y, type);
}

export function moveTowardsClosestShooter(this: CustomSceneType, attacker: Phaser.GameObjects.Sprite) {
  const shooters = this.shooters.getChildren();
  if (shooters.length === 0) return;

  let closestShooter: Phaser.GameObjects.Sprite | null = shooters[0] as Phaser.GameObjects.Sprite;
  let minDistance = Phaser.Math.Distance.Between(
    attacker.x,
    attacker.y,
    closestShooter.x,
    closestShooter.y
  );

  shooters.forEach((shooter) => {
    const shooterSprite = shooter as Phaser.GameObjects.Sprite;
    const distance = Phaser.Math.Distance.Between(
      attacker.x,
      attacker.y,
      shooterSprite.x,
      shooterSprite.y
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestShooter = shooterSprite;
    }
  });

  const direction = new Phaser.Math.Vector2(
    closestShooter.x - attacker.x,
    closestShooter.y - attacker.y
  ).normalize();
  attacker.x += direction.x;
  attacker.y += direction.y;

  // Rotate attacker to face closest shooter
  const angle = Phaser.Math.Angle.Between(attacker.x, attacker.y, closestShooter.x, closestShooter.y);
  attacker.setRotation(angle);
}

export function updateAttackerHealthDisplay(this: CustomSceneType, attacker: Phaser.GameObjects.Sprite, index: number) {
  const health = useGameStore.getState().attackers[index].health;
  const healthText = this.add.text(
    attacker.x,
    attacker.y - 20,
    `HP: ${health}`,
    { fontSize: "12px", color: "#ff0000" }
  );
  this.time.delayedCall(500, () => healthText.destroy(), [], this); // Remove health text after a short duration
}

