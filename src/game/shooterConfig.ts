export const ShooterConfig = {
    Archer: {
      health: 100,
      damage: 100,
      range: 500,
      reloadTime: 3000,
      cost: 100,
    },
    Wizard: {
      health: 50,
      damage: 25,
      range: 500,
      reloadTime: 3000,
      aoeRadius: 100,
      cost: 200,
    },
    ShieldWielder: {
      health: 300,
      damage: 50,
      range: 100,
      reloadTime: 7000,
      cost: 100,
    },
  };
  
  export type ShooterType = keyof typeof ShooterConfig;
  