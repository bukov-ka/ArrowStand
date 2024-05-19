import React from 'react';
import Game from './Game';
import { useGameStore } from '../game/store';

const App = () => {
  const gold = useGameStore((state) => state.gold);
  const setSelectedShooterType = useGameStore((state) => state.setSelectedShooterType);
  const startPreBattle = useGameStore((state) => state.startPreBattle);
  const gamePhase = useGameStore((state) => state.gamePhase);

  const shooters = [
    { type: 'Usual Shooter', cost: 100 },
    { type: 'Long-Range Shooter', cost: 150 },
    { type: 'Heavy Crossbow Shooter', cost: 200 },
  ];

  return (
    <div>
      <h1>Arrow Stand</h1>
      <div>
        <h2>Gold: {gold}</h2>
        <ul>
          {shooters.map((shooter) => (
            <li key={shooter.type}>
              <button onClick={() => setSelectedShooterType(shooter.type)}>
                {shooter.type} - {shooter.cost} gold
              </button>
            </li>
          ))}
        </ul>
      </div>
      {gamePhase === 'placement' && (
        <button onClick={startPreBattle}>Start Pre-Battle</button>
      )}
      {gamePhase === 'pre-battle' && (
        <button onClick={() => useGameStore.getState().startBattle()}>Start Battle</button>
      )}
      <Game />
    </div>
  );
};

export default App;
