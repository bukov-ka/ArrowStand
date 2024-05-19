import Phaser from 'phaser';
import { useGameStore } from './store';

export class CustomScene extends Phaser.Scene {
  shooters!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'CustomScene' });
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('shooter', 'assets/shooter.png');
    this.load.image('longRangeShooter', 'assets/longRangeShooter.png');
    this.load.image('heavyCrossbowShooter', 'assets/heavyCrossbowShooter.png');
  }

  create() {
    this.add.image(400, 300, 'background');

    this.shooters = this.add.group();

    this.input.on('pointerdown', (pointer: { x: any; y: any; }) => {
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
    });
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

  update() {
    // Basic game loop logic (e.g., move attackers, check collisions)
  }
}
