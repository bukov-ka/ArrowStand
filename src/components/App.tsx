import React, { useState } from 'react';
import Game from './Game';

const App = () => {
  const [gold, setGold] = useState(10000);
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
              {shooter.type} - {shooter.cost} gold
            </li>
          ))}
        </ul>
      </div>
      <Game />
    </div>
  );
};

export default App;
