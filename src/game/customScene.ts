import Phaser from 'phaser';

export class CustomScene extends Phaser.Scene {
  shooters!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'CustomScene' });
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('shooter', 'assets/shooter.png');
    // this.load.image('wall', 'assets/wall.png');
    // this.load.image('moat', 'assets/moat.png');
    // this.load.image('grass', 'assets/grass.png');
  }

  create() {
    this.add.image(400, 300, 'background');

    // this.add.image(200, 200, 'wall');
    // this.add.image(300, 300, 'moat');
    // this.add.image(400, 400, 'grass');

    this.shooters = this.add.group();

    this.input.on('pointerdown', (pointer: { x: number; y: number }) => {
      const x = pointer.x;
      const y = pointer.y;

      if (this.canPlaceShooter(x, y)) {
        const shooter = this.add.sprite(x, y, 'shooter');
        this.shooters.add(shooter);
      }
    });
  }

  canPlaceShooter(x: number, y: number): boolean {
    // Add validation logic here (e.g., not on obstacles, within budget)
    return true;
  }

  update() {
    // Basic game loop logic (e.g., move attackers, check collisions)
  }
}
