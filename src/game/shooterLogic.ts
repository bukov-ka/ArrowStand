import Phaser from "phaser";
import { useGameStore } from "./store";
import { CustomSceneType } from "./customScene";

export function handlePlacement(this: CustomSceneType, pointer: { x: number; y: number }) {
  const x = pointer.x;
  const y = pointer.y;
  const selectedShooterType = useGameStore.getState().selectedShooterType;
  const placeShooter = useGameStore.getState().placeShooter;

  if (selectedShooterType && canPlaceShooter(x, y)) {
    const shooterCost = getShooterCost(selectedShooterType);

    if (useGameStore.getState().gold >= shooterCost) {
      placeShooter(x, y, selectedShooterType, shooterCost);
      const shooter = this.add.sprite(x, y, getShooterImage(selectedShooterType));
      this.shooters.add(shooter);
      this.lastShotTime.set(shooter, 0); // Initialize last shot time
    }
  }
}

export function canPlaceShooter(x: number, y: number): boolean {
  // Add validation logic here (e.g., not on obstacles, within budget)
  return true;
}

export function getShooterCost(type: string): number {
  switch (type) {
    case "Usual Shooter":
      return 100;
    case "Long-Range Shooter":
      return 150;
    case "Heavy Crossbow Shooter":
      return 200;
    default:
      return 0;
  }
}

export function getShooterImage(type: string): string {
  switch (type) {
    case "Usual Shooter":
      return "shooter";
    case "Long-Range Shooter":
      return "longRangeShooter";
    case "Heavy Crossbow Shooter":
      return "heavyCrossbowShooter";
    default:
      return "shooter";
  }
}

