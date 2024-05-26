// src/game/shooterConfig.ts

export const ShooterConfig = {
    UsualShooter: {
      health: 100,
      damage: 100,
      range: 200,
      reloadTime: 3000,
      cost: 100,
    },
    LongRangeShooter: {
      health: 50,
      damage: 75,
      range: 500,
      reloadTime: 3000,
      aoeRadius: 100, // AOE radius for Long-Range Shooter
      cost: 150,
    },
    HeavyCrossbowShooter: {
      health: 300,
      damage: 10,
      range: 100,
      reloadTime: 7000,
      cost: 200,
    },
  };
  
  export type ShooterType = keyof typeof ShooterConfig;
  