// src/components/GameStats.tsx
import React from 'react';
import { useGameStore } from '../game/store';

const GameStats: React.FC = () => {
  const totalTimeSurvived = useGameStore((state) => state.totalTimeSurvived);
  const attackersDestroyedByArcher = useGameStore((state) => state.attackersDestroyedByArcher);
  const attackersDestroyedByWizard = useGameStore((state) => state.attackersDestroyedByWizard);
  const attackersDestroyedByShieldWielder = useGameStore((state) => state.attackersDestroyedByShieldWielder);

  return (
    <div className="game-stats">
      <h2>Game Statistics</h2>
      <p>Total Survival Time: {totalTimeSurvived}s</p>
      <p>Attackers Destroyed by Archers: {attackersDestroyedByArcher}</p>
      <p>Attackers Destroyed by Wizards: {attackersDestroyedByWizard}</p>
      <p>Attackers Destroyed by Shield Wielders: {attackersDestroyedByShieldWielder}</p>
    </div>
  );
};

export default GameStats;
