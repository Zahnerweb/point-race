import { Point } from "pixi.js";

export default class PointCollection {
  public readonly points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  includes = (point: Point): boolean => {
    return (
      this.points.find(
        (collectionPoint: Point) =>
          collectionPoint.x === point.x && collectionPoint.y === point.y,
      ) !== undefined
    );
  };
}
