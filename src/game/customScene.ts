import Phaser from 'phaser';
import { useGameStore } from './store';

export class CustomScene extends Phaser.Scene {
  shooters!: Phaser.GameObjects.Group;
  attackers!: Phaser.GameObjects.Group;
  gamePhase!: 'placement' | 'pre-battle' | 'battle';

  constructor() {
    super({ key: 'CustomScene' });
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('shooter', 'assets/shooter.png');
    this.load.image('longRangeShooter', 'assets/longRangeShooter.png');
    this.load.image('heavyCrossbowShooter', 'assets/heavyCrossbowShooter.png');
    this.load.image('attacker', 'assets/attacker.png');
  }

  create() {
    this.add.image(400, 300, 'background');

    this.shooters = this.add.group();
    this.attackers = this.add.group();

    this.input.on('pointerdown', (pointer: { x: any; y: any; }) => {
      if (useGameStore.getState().gamePhase === 'placement') {
        this.handlePlacement(pointer);
      }
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnAttackers,
      callbackScope: this,
      loop: true,
    });

    this.gamePhase = useGameStore.getState().gamePhase;

    // Spawn initial attackers during the pre-battle phase
    if (this.gamePhase === 'pre-battle') {
      for (let i = 0; i < 5; i++) {
        this.spawnAttacker(Phaser.Math.Between(50, 750), 0, 'Light Infantry');
      }
    }
  }

  handlePlacement(pointer: { x: number; y: number }) {
    const x = pointer.x;
    const y = pointer.y;
    const selectedShooterType = useGameStore.getState().selectedShooterType;
    const placeShooter = useGameStore.getState().placeShooter;

    if (selectedShooterType && this.canPlaceShooter(x, y)) {
      const shooterCost = this.getShooterCost(selectedShooterType);

      if (useGameStore.getState().gold >= shooterCost) {
        placeShooter(x, y, selectedShooterType, shooterCost);
        const shooter = this.add.sprite(x, y, this.getShooterImage(selectedShooterType));
        this.shooters.add(shooter);
      }
    }
  }

  canPlaceShooter(x: number, y: number): boolean {
    // Add validation logic here (e.g., not on obstacles, within budget)
    return true;
  }

  getShooterCost(type: string): number {
    switch (type) {
      case 'Usual Shooter':
        return 100;
      case 'Long-Range Shooter':
        return 150;
      case 'Heavy Crossbow Shooter':
        return 200;
      default:
        return 0;
    }
  }

  getShooterImage(type: string): string {
    switch (type) {
      case 'Usual Shooter':
        return 'shooter';
      case 'Long-Range Shooter':
        return 'longRangeShooter';
      case 'Heavy Crossbow Shooter':
        return 'heavyCrossbowShooter';
      default:
        return 'shooter';
    }
  }

  spawnAttackers() {
    if (useGameStore.getState().gamePhase === 'pre-battle') {
      const x = Phaser.Math.Between(50, 750);
      const y = 0; // Spawn at the top
      this.spawnAttacker(x, y, 'Light Infantry'); // Example type
    }
  }

  spawnAttacker(x: number, y: number, type: string) {
    const attacker = this.add.sprite(x, y, 'attacker');
    this.attackers.add(attacker);
    useGameStore.getState().addAttacker(x, y, type);
  }

  update() {
    if (useGameStore.getState().gamePhase === 'battle') {
      this.attackers.getChildren().forEach((attacker: any, index: number) => {
        this.moveTowardsClosestShooter(attacker);
        if (attacker.y > 600) {
          attacker.destroy(); // Remove attacker if it moves off-screen
          useGameStore.getState().updateAttackerHealth(index, 0); // Example health update
        } else {
          this.updateAttackerHealthDisplay(attacker, index);
        }
      });

      this.shooters.getChildren().forEach((shooter: any) => {
        this.attackNearestAttacker(shooter);
      });

      // Check win/lose conditions
      this.checkGameEnd();
    }
  }

  moveTowardsClosestShooter(attacker: Phaser.GameObjects.Sprite) {
    const shooters = this.shooters.getChildren();
    if (shooters.length === 0) return;

    let closestShooter = shooters[0] as Phaser.GameObjects.Sprite;
    let minDistance = Phaser.Math.Distance.Between(attacker.x, attacker.y, closestShooter.x, closestShooter.y);

    shooters.forEach((shooter) => {
      const shooterSprite = shooter as Phaser.GameObjects.Sprite;
      const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, shooterSprite.x, shooterSprite.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestShooter = shooterSprite;
      }
    });

    const direction = new Phaser.Math.Vector2(closestShooter.x - attacker.x, closestShooter.y - attacker.y).normalize();
    attacker.x += direction.x;
    attacker.y += direction.y;
  }

  updateAttackerHealthDisplay(attacker: Phaser.GameObjects.Sprite, index: number) {
    const health = useGameStore.getState().attackers[index].health;
    const healthText = this.add.text(attacker.x, attacker.y - 20, `HP: ${health}`, { fontSize: '12px', color: '#ff0000' });
    this.time.delayedCall(500, () => healthText.destroy(), [], this); // Remove health text after a short duration
  }

  attackNearestAttacker(shooter: Phaser.GameObjects.Sprite) {
    const attackers = this.attackers.getChildren();
    let nearestAttacker = null;
    let minDistance = Infinity;

    attackers.forEach((attacker) => {
      const attackerSprite = attacker as Phaser.GameObjects.Sprite;
      const distance = Phaser.Math.Distance.Between(shooter.x, shooter.y, attackerSprite.x, attackerSprite.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearestAttacker = attackerSprite;
      }
    });

    if (nearestAttacker && minDistance <= this.getShooterRange(shooter.texture.key)) {
      // Attack the nearest attacker
      this.dealDamageToAttacker(nearestAttacker);
    }
  }

  getShooterRange(type: string): number {
    switch (type) {
      case 'shooter':
        return 200; // Example range
      case 'longRangeShooter':
        return 300; // Example range
      case 'heavyCrossbowShooter':
        return 250; // Example range
      default:
        return 200;
    }
  }

  dealDamageToAttacker(attacker: Phaser.GameObjects.Sprite) {
    const attackerIndex = this.attackers.getChildren().indexOf(attacker);
    const attackerHealth = useGameStore.getState().attackers[attackerIndex].health;
    const newHealth = attackerHealth - 1; // Example damage
    // Debug logs
    console.log('attackerHealth', attackerHealth);
    console.log('attacker', attacker);

    if (newHealth <= 0) {
      attacker.destroy();
      useGameStore.getState().updateAttackerHealth(attackerIndex, 0);
    } else {
      useGameStore.getState().updateAttackerHealth(attackerIndex, newHealth);
    }
  }

  checkGameEnd() {
    const allShootersDestroyed = this.shooters.getChildren().length === 0;
    const allAttackersDestroyed = this.attackers.getChildren().length === 0;

    if (allShootersDestroyed) {
      // Handle game loss
      this.scene.pause();
      alert('You lose! All shooters were destroyed.');
    } else if (allAttackersDestroyed) {
      // Handle game win
      this.scene.pause();
      alert('You win! All attackers were destroyed.');
    }
  }
}
