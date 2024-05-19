import create from "zustand";

interface Attacker {
  x: number;
  y: number;
  type: string;
  health: number;
}

interface GameState {
  gold: number;
  shooters: { x: number; y: number; type: string }[];
  attackers: Attacker[];
  selectedShooterType: string | null;
  gamePhase: "placement" | "pre-battle" | "battle";
  setSelectedShooterType: (type: string) => void;
  placeShooter: (x: number, y: number, type: string, cost: number) => void;
  startPreBattle: () => void;
  startBattle: () => void;
  addAttacker: (x: number, y: number, type: string) => void;
  updateAttackerHealth: (index: number, health: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gold: 10000,
  shooters: [],
  attackers: [],
  selectedShooterType: null,
  gamePhase: "placement",
  setSelectedShooterType: (type) => set({ selectedShooterType: type }),
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
  startPreBattle: () => set({ gamePhase: "pre-battle" }),
  startBattle: () => set({ gamePhase: "battle" }),
  addAttacker: (x, y, type) =>
    set((state) => ({
      attackers: [...state.attackers, { x, y, type, health: 100 }], // Default health for simplicity
    })),
  updateAttackerHealth: (index, health) =>
    set((state) => {
      const attackers = [...state.attackers];
      if (attackers[index]) {
        attackers[index].health = health;
      }
      return { attackers };
    }),
}));
