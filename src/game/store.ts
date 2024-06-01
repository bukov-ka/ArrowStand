// src/game/store.ts
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
  gamePhase: "placement" | "battle";
  score: number;
  totalTimeSurvived: number;
  attackersDestroyedByArcher: number;
  attackersDestroyedByWizard: number;
  attackersDestroyedByShieldWielder: number;
  removeMode: boolean;
  setSelectedShooterType: (type: ShooterType) => void;
  placeShooter: (x: number, y: number, type: ShooterType, cost: number) => void;
  startBattle: () => void;
  addAttacker: (x, y, type) => void;
  updateAttackerHealth: (index, health) => void;
  updateShooterHealth: (index, health) => void;
  increaseScore: (shooterType: ShooterType) => void;
  updateTimeSurvived: (time: number) => void;
  setRemoveMode: (mode: boolean) => void;
  resetCursor: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gold: 10000,
  shooters: [],
  attackers: [],
  selectedShooterType: null,
  gamePhase: "placement",
  score: 0,
  totalTimeSurvived: 0,
  attackersDestroyedByArcher: 0,
  attackersDestroyedByWizard: 0,
  attackersDestroyedByShieldWielder: 0,
  removeMode: false,
  setSelectedShooterType: (type) =>
    set({ selectedShooterType: type, removeMode: false }),
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
  increaseScore: (shooterType) =>
    set((state) => {
      const newState: Partial<GameState> = { score: state.score + 1 };
      if (shooterType === "Archer") {
        newState.attackersDestroyedByArcher =
          state.attackersDestroyedByArcher + 1;
      } else if (shooterType === "Wizard") {
        newState.attackersDestroyedByWizard =
          state.attackersDestroyedByWizard + 1;
      } else if (shooterType === "ShieldWielder") {
        newState.attackersDestroyedByShieldWielder =
          state.attackersDestroyedByShieldWielder + 1;
      }
      return newState;
    }),
  updateTimeSurvived: (time) => set({ totalTimeSurvived: time }),
  setRemoveMode: (mode) => set({ removeMode: mode }),
  resetCursor: () => set({ selectedShooterType: null, removeMode: false }),
}));
