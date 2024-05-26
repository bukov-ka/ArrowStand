// src/components/App.tsx
import React from "react";
import Game from "./Game";
import { useGameStore } from "../game/store";
import { ShooterConfig, ShooterType } from "../game/shooterConfig";

const App = () => {
  const gold = useGameStore((state) => state.gold);
  const score = useGameStore((state) => state.score); // Get the score from the store
  const setSelectedShooterType = useGameStore(
    (state) => state.setSelectedShooterType
  );
  const startPreBattle = useGameStore((state) => state.startPreBattle);
  const gamePhase = useGameStore((state) => state.gamePhase);

  return (
    <div>
      <h1>Arrow Stand</h1>
      <div>
        <h2>Gold: {gold}</h2>
        <h2>Score: {score}</h2> {/* Display the score */}
        <ul>
          {Object.keys(ShooterConfig).map((type) => {
            const shooterType = type as ShooterType;
            const { cost } = ShooterConfig[shooterType];
            return (
              <li key={shooterType}>
                <button onClick={() => setSelectedShooterType(shooterType)}>
                  {shooterType} - {cost} gold
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {gamePhase === "placement" && (
        <button onClick={startPreBattle}>Start Pre-Battle</button>
      )}
      {gamePhase === "pre-battle" && (
        <button onClick={() => useGameStore.getState().startBattle()}>
          Start Battle
        </button>
      )}
      <Game />
    </div>
  );
};

export default App;
