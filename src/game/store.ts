import create from "zustand";
import { ShooterConfig, ShooterType } from "./shooterConfig";

interface Attacker {
  x: number;
  y: number;
  type: string;
  health: number;
}

interface Shooter {
  x: number;
  y: number;
  type: ShooterType;
  health: number;
}

interface GameState {
  gold: number;
  shooters: Shooter[];
  attackers: Attacker[];
  selectedShooterType: ShooterType | null;
  gamePhase: "placement" | "pre-battle" | "battle";
  score: number;
  setSelectedShooterType: (type: ShooterType) => void;
  placeShooter: (x: number, y: number, type: ShooterType, cost: number) => void;
  startPreBattle: () => void;
  startBattle: () => void;
  addAttacker: (x: number, y: number, type: string) => void;
  updateAttackerHealth: (index: number, health: number) => void;
  updateShooterHealth: (index: number, health: number) => void;
  increaseScore: () => void; // Add increaseScore method
}

export const useGameStore = create<GameState>((set) => ({
  gold: 10000,
  shooters: [],
  attackers: [],
  selectedShooterType: null,
  gamePhase: "placement",
  score: 0, // Initialize score
  setSelectedShooterType: (type) => set({ selectedShooterType: type }),
  placeShooter: (x, y, type, cost) =>
    set((state) => {
      if (state.gold >= cost) {
        const { health } = ShooterConfig[type];
        return {
          gold: state.gold - cost,
          shooters: [...state.shooters, { x, y, type, health }],
        };
      }
      return state;
    }),
  startPreBattle: () => set({ gamePhase: "pre-battle" }),
  startBattle: () => set({ gamePhase: "battle" }),
  addAttacker: (x, y, type) =>
    set((state) => ({
      attackers: [...state.attackers, { x, y, type, health: 100 }],
    })),
  updateAttackerHealth: (index, health) =>
    set((state) => {
      const attackers = [...state.attackers];
      if (attackers[index]) {
        attackers[index].health = health;
      }
      return { attackers };
    }),
  updateShooterHealth: (index, health) =>
    set((state) => {
      const shooters = [...state.shooters];
      if (shooters[index]) {
        shooters[index].health = health;
      }
      return { shooters };
    }),
  increaseScore: () =>
    set((state) => ({
      score: state.score + 1,
    })),
}));
