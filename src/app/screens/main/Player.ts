import { Point } from "pixi.js";

export default class Player {
  public readonly id: number;
  public currentPosition: Point;
  public previousPosition: Point;
  public readonly color: string;

  constructor(id: number, currentPosition: Point, color: string) {
    this.id = id;
    this.currentPosition = currentPosition;
    this.previousPosition = currentPosition;
    this.color = color;
  }

  updatePosition(position: Point) {
    this.previousPosition = this.currentPosition;
    this.currentPosition = position;
  }

  hasMovedLastRound(): boolean {
    return !this.currentPosition.equals(this.previousPosition);
  }
}
