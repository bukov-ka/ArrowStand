// src/components/App.tsx
import './App.css';
import React from "react";
import Game from "./Game";
import { useGameStore } from "../game/store";
import { ShooterConfig, ShooterType } from "../game/shooterConfig";
import ShooterDetails from "./ShooterDetails"; // Import the ShooterDetails component

const App = () => {
  const gold = useGameStore((state) => state.gold);
  const score = useGameStore((state) => state.score); // Get the score from the store
  const setSelectedShooterType = useGameStore((state) => state.setSelectedShooterType);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const setRemoveMode = useGameStore((state) => state.setRemoveMode); // Add this line

  return (
    <div>
      <h1>Arrow Stand</h1>
      <div>
        <h2>Gold: {gold}</h2>
        <h2>Score: {score}</h2> {/* Display the score */}
      </div>
      <div className="controls-container">
        <div className="buttons-container">
          <ul>
            {Object.keys(ShooterConfig).map((type) => {
              const shooterType = type as ShooterType;
              const { cost } = ShooterConfig[shooterType];
              return (
                <li key={shooterType}>
                  <button onClick={() => { setSelectedShooterType(shooterType); setRemoveMode(false); }}>
                    {shooterType} - {cost} gold
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => setRemoveMode(true)}>Remove Shooters</button>
        </div>
        <ShooterDetails /> {/* Add the ShooterDetails component */}
      </div>
      {gamePhase === "placement" && (
        <button onClick={() => useGameStore.getState().startBattle()}>
          Start Battle
        </button>
      )}
      <Game />
    </div>
  );
};

export default App;
