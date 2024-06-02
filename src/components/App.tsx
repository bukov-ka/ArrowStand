// src/components/App.tsx
import './App.css';
import React from "react";
import Game from "./Game";
import { useGameStore } from "../game/store";
import { ShooterConfig, ShooterType } from "../game/shooterConfig";
import ShooterDetails from "./ShooterDetails";
import GameStats from "./GameStats";
import Leaderboard from "./Leaderboard";
import WelcomeScreen from "./WelcomeScreen";  // Import the WelcomeScreen component

const App = () => {
  const gold = useGameStore((state) => state.gold);
  const score = useGameStore((state) => state.score);
  const setSelectedShooterType = useGameStore((state) => state.setSelectedShooterType);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const setRemoveMode = useGameStore((state) => state.setRemoveMode);

  const shooters = useGameStore((state) => state.shooters);

  return (
    <div>
      <WelcomeScreen /> {/* Add the WelcomeScreen component */}
      <h1>Arrow Stand</h1>
      <div>
        <h2>Gold left: {gold}</h2>
        <h2>Score: {score}</h2>
      </div>
      <div className="main-container">
        <div className="controls-container">
          <div className="buttons-container">
            <ul>
              {Object.keys(ShooterConfig).map((type) => {
                const shooterType = type as ShooterType;
                const { cost } = ShooterConfig[shooterType];
                const numberOfShooters = shooters.filter(s => s.type === shooterType).length;
                return (
                  <li key={shooterType}>
                    <button onClick={() => { setSelectedShooterType(shooterType); setRemoveMode(false); }}>
                      {shooterType} - {cost} gold ({numberOfShooters})
                    </button>
                  </li>
                );
              })}
              <li><button onClick={() => setRemoveMode(true)}>Remove Shooters</button></li>
            </ul>
          </div>
          <ShooterDetails />
        </div>
        <div id="game-container">
          <Game />
        </div>
        <Leaderboard />
      </div>
      {gamePhase === "placement" && (
        <button onClick={() => useGameStore.getState().startBattle()}>
          Start Battle
        </button>
      )}
      {gamePhase === "battle" && <GameStats />}
    </div>
  );
};

export default App;
