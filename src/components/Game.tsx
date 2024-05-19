import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { CustomScene } from '../game/customScene';

const Game = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: CustomScene,
    };

    new Phaser.Game(config);
  }, []);

  return <div id="game-container" />;
};

export default Game;
