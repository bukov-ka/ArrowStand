// src/components/Leaderboard.tsx
import React from 'react';
import { useGameStore } from '../game/store';

const Leaderboard: React.FC = () => {
  const leaderboard = useGameStore((state) => state.leaderboard);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>A</th>
            <th>W</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((entry, index) => (
              <tr key={index}>
                <td>{entry.score}</td>
                <td>{entry.archers}</td>
                <td>{entry.wizards}</td>
                <td>{entry.shieldWielders}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
