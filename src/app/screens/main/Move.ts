import { Point } from "pixi.js";
import Player from "./Player";

export default class Move {
  public readonly player: Player;
  public readonly startPoint: Point;
  public readonly endPoint: Point;

  constructor(player: Player, startPoint: Point, endPoint: Point) {
    this.player = player;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
}
