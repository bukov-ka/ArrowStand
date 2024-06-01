import React, { useEffect } from "react";
import Phaser from "phaser";
import { CustomScene } from "../game/customScene";

const Game = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      scene: CustomScene,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER,
      },
    };

    const game = new Phaser.Game(config);

    // Allow default scrolling behavior on the canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Remove existing wheel listeners from the canvas
      canvas.onwheel = (event) => {
        window.scrollBy(0, event.deltaY);
        return true; // Allow the event to continue propagating to the window
      };
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default Game;
