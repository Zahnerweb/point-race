import { Point, Sprite, Texture } from "pixi.js";

export class RacePoint extends Sprite {
  public readonly point: Point;
  public readonly isStartingPoint: boolean;

  get left() {
    return -this.width * 0.5;
  }

  get right() {
    return this.width * 0.5;
  }

  get top() {
    return -this.height * 0.5;
  }

  get bottom() {
    return this.height * 0.5;
  }

  constructor(point: Point, isStartingPoint: boolean) {
    const texture = isStartingPoint ? "dot-red.svg" : "dot-white.svg";
    super({ texture: Texture.from(texture), anchor: 0.5, scale: 0.25 });
    this.point = point;
    this.isStartingPoint = isStartingPoint;
  }

  setActive() {
    this.texture = Texture.from("dot-green.svg");
  }

  setAvailable() {
    this.texture = Texture.from("dot-blue.svg");
  }

  setDefault() {
    this.texture = this.isStartingPoint
      ? Texture.from("dot-red.svg")
      : Texture.from("dot-white.svg");
  }
}
