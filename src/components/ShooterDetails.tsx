// src/components/ShooterDetails.tsx
import React from 'react';
import { useGameStore } from '../game/store';
import { ShooterConfig, ShooterType } from '../game/shooterConfig';

const ShooterDetails: React.FC = () => {
  const selectedShooterType = useGameStore((state) => state.selectedShooterType);
  const removeMode = useGameStore((state) => state.removeMode);
  const gamePhase = useGameStore((state) => state.gamePhase);

  if (!selectedShooterType || removeMode || gamePhase !== 'placement') {
    return null;
  }

  const { health, damage, range, reloadTime, cost } = ShooterConfig[selectedShooterType];

  return (
    <div className="shooter-details">
      <h3>{selectedShooterType} Details</h3>
      <p>Health: {health}</p>
      <p>Damage: {damage}</p>
      <p>Range: {range}</p>
      <p>Reload Time: {reloadTime} ms</p>
      <p>Cost: {cost} gold</p>
    </div>
  );
};

export default ShooterDetails;
