import create from 'zustand';

interface GameState {
  gold: number;
  shooters: { x: number; y: number; type: string }[];
  placeShooter: (x: number, y: number, type: string, cost: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gold: 10000,
  shooters: [],
  placeShooter: (x, y, type, cost) =>
    set((state) => {
      if (state.gold >= cost) {
        return {
          gold: state.gold - cost,
          shooters: [...state.shooters, { x, y, type }],
        };
      }
      return state;
    }),
}));
