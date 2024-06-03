import Phaser from "phaser";
import { useGameStore } from "./store";
import { CustomSceneType } from "./customScene";
import {
  ATTACKER_DAMAGE,
  ATTACKER_RELOAD_TIME,
  ATTACKER_SIZE,
} from "./constants";

let spawnCounter = 0; // Keep track of the spawn count
let elapsedTimeSinceLastSpawn = 0;

export function spawnAttackers(this: CustomSceneType, delta: number) {
  if (useGameStore.getState().gamePhase === "battle") {
    elapsedTimeSinceLastSpawn += delta; // Accumulate elapsed time
    // Check if enough time has passed to spawn new attackers
    if (elapsedTimeSinceLastSpawn >= 500) {
      spawnCounter++;
      const numberOfAttackersToSpawn = Math.floor(spawnCounter / 5) + 1; // Increase the number of attackers over time

      for (let i = 0; i < numberOfAttackersToSpawn; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = 0; // Spawn at the top
        spawnAttacker.call(this, x, y, "Light Infantry");
      }

      elapsedTimeSinceLastSpawn = 0; // Reset the elapsed time counter after spawning attackers
    }
  }
}

export function spawnAttacker(
  this: CustomSceneType,
  x: number,
  y: number,
  type: string
): Phaser.GameObjects.Sprite {
  const attacker = this.add.sprite(x, y, "attacker");
  this.attackers.add(attacker);
  useGameStore.getState().addAttacker(x, y, type);

  return attacker;
}

export function moveTowardsClosestShooter(
  this: CustomSceneType,
  attacker: Phaser.GameObjects.Sprite,
  delta: number
) {
  const shooters = this.shooters.getChildren();
  const attackers = this.attackers.getChildren();

  if (shooters.length === 0) return;

  let closestShooter: Phaser.GameObjects.Sprite | null =
    shooters[0] as Phaser.GameObjects.Sprite;
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

  let avoidVector = new Phaser.Math.Vector2(0, 0);

  // Collision avoidance
  attackers.forEach((otherAttacker) => {
    if (otherAttacker !== attacker) {
      const distance = Phaser.Math.Distance.Between(
        attacker.x,
        attacker.y,
        (otherAttacker as Phaser.GameObjects.Sprite).x,
        (otherAttacker as Phaser.GameObjects.Sprite).y
      );
      if (distance < ATTACKER_SIZE) {
        const avoidDirection = new Phaser.Math.Vector2(
          attacker.x - (otherAttacker as Phaser.GameObjects.Sprite).x,
          attacker.y - (otherAttacker as Phaser.GameObjects.Sprite).y
        ).normalize();
        avoidVector.add(avoidDirection);
      }
    }
  });

  // Move towards closest shooter
  const direction = new Phaser.Math.Vector2(
    closestShooter.x - attacker.x,
    closestShooter.y - attacker.y
  ).normalize();

  // Add avoidance vector to adjust direction
  direction.add(avoidVector);

  // Normalize the combined direction vector
  direction.normalize();

  // Calculate movement speed per second and adjust by delta time
  const speed = 100; // Adjust this value to control speed
  const velocity = direction.scale(speed * (delta / 1000));

  // Move the attacker
  attacker.x += velocity.x;
  attacker.y += velocity.y;

  // Rotate attacker to face closest shooter
  const angle = Phaser.Math.Angle.Between(
    attacker.x,
    attacker.y,
    closestShooter.x,
    closestShooter.y
  );
  attacker.setRotation(angle);

  // Check if the attacker is close enough to deal damage
  if (minDistance < ATTACKER_SIZE) {
    const currentTime = this.time.now;
    const lastAttack = this.lastAttackTime.get(attacker) || 0;
    if (currentTime - lastAttack >= ATTACKER_RELOAD_TIME) {
      dealDamageToShooter.call(this, closestShooter);
      this.lastAttackTime.set(attacker, currentTime);
    }
  }
}

export function dealDamageToShooter(
  this: CustomSceneType,
  shooter: Phaser.GameObjects.Sprite
) {
  const shooterIndex = this.shooters.getChildren().indexOf(shooter);
  const shooterHealth = useGameStore.getState().shooters[shooterIndex]?.health;
  const newHealth = shooterHealth - ATTACKER_DAMAGE;

  if (newHealth <= 0) {
    shooter.destroy();
    useGameStore.getState().updateShooterHealth(shooterIndex, 0);
  } else {
    useGameStore.getState().updateShooterHealth(shooterIndex, newHealth);
  }
}
