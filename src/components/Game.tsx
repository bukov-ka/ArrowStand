import React, { useEffect } from 'react';
import Phaser from 'phaser';

const Game = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      // Load assets
      this.load.image('background', 'assets/background.png');
      this.load.image('shooter', 'assets/shooter.png');
      this.load.image('attacker', 'assets/attacker.png');
      this.load.audio('background-music', 'assets/background-music.mp3');
      this.load.audio('shoot-sound', 'assets/shoot-sound.mp3');
    }

    function create(this: Phaser.Scene) {
      // Add background
      this.add.image(400, 300, 'background');

      // Play background music
      const music = this.sound.add('background-music');
      music.play({ loop: true });

      // Add a shooter sprite
      const shooter = this.add.sprite(400, 500, 'shooter');

      // Add a simple animation or interaction (e.g., move shooter on key press)
      this.input.keyboard!.on('keydown-LEFT', () => {
        shooter.x -= 10;
      });

      this.input.keyboard!.on('keydown-RIGHT', () => {
        shooter.x += 10;
      });
    }

    function update(this: Phaser.Scene) {
      // Basic game loop logic (e.g., move attackers, check collisions)
    }
  }, []);

  return <div id="game-container" />;
};

export default Game;
