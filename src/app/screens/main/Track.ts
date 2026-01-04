import { Graphics, Point, Ticker } from "pixi.js";
import type { MainScreen } from "./MainScreen";
import { RacePoint } from "./RacePoint";
import PointCollection from "./PointCollection";
import Move from "./Move";

export class Track {
  private static readonly TRACK_WIDTH = 40;
  private static readonly TRACK_HEIGHT = 20;

  private static readonly EXCLUDED_POINTS = {
    0: [0, 1, 2, 3, 4, 5, 35, 36, 37, 38, 39],
    1: [0, 1, 2, 3, 4, 36, 37, 38, 39],
    2: [0, 1, 2, 3, 37, 38, 39],
    3: [0, 1, 38, 39],
    4: [0, 39],
    5: [17, 18, 19, 20, 21, 22, 23, 24],
    6: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    7: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    8: [
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30,
    ],
    9: [
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30,
    ],
    10: [
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30,
    ],
    11: [
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30,
    ],
    12: [
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30,
    ],
    13: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    14: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    15: [0, 39],
    16: [0, 1, 38, 39],
    17: [0, 1, 2, 3, 37, 38, 39],
    18: [0, 1, 2, 3, 4, 36, 37, 38, 39],
    19: [0, 1, 2, 3, 4, 5, 35, 36, 37, 38, 39],
  };

  public static readonly STARTING_POINTS: PointCollection = new PointCollection(
    [new Point(20, 2), new Point(20, 3)],
  );

  public screen!: MainScreen;

  private racePoints: RacePoint[] = [];
  private yMin = -500;
  private yMax = 500;
  private xMin = -500;
  private xMax = 500;
  private ticker: Ticker;

  constructor() {
    this.ticker = new Ticker();
  }

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    this.ticker.start();
    this.draw();
  }

  public add(point: Point): void {
    const racePoint = new RacePoint(
      point,
      Track.STARTING_POINTS.includes(point),
    );
    racePoint.eventMode = "static";

    this.setScreenPosition(racePoint);
    this.screen.mainContainer.addChild(racePoint);
    this.racePoints.push(racePoint);
  }

  public update(): void { }

  public resize(w: number, h: number): void {
    this.xMin = -w / 2;
    this.xMax = w / 2;
    this.yMin = -h / 2;
    this.yMax = h / 2;
  }

  private draw(): void {
    for (let i = 0; i < Track.TRACK_HEIGHT; i++) {
      for (let j = 0; j < Track.TRACK_WIDTH; j++) {
        if (
          Track.EXCLUDED_POINTS[i] !== undefined &&
          Track.EXCLUDED_POINTS[i].includes(j)
        ) {
          continue;
        }

        this.add(new Point(j, i));
      }
    }

    this.enableAvailablePoints();
  }

  private enableAvailablePoints(): void {
    const activePlayer = this.screen.game.getActivePlayer();
    const currentPosition = activePlayer.currentPosition;
    const previousPosition = activePlayer.previousPosition;

    let targetCoordinate = new Point(currentPosition.x + 2, currentPosition.y);

    if (activePlayer.hasMovedLastRound()) {
      targetCoordinate = new Point(
        currentPosition.x + (currentPosition.x - previousPosition.x),
        currentPosition.y + (currentPosition.y - previousPosition.y),
      );
    }

    this.racePoints.forEach((racePoint: RacePoint) => {
      racePoint.off("pointerdown");
      const deltaX = Math.abs(racePoint.point.x - targetCoordinate.x);
      const deltaY = Math.abs(racePoint.point.y - targetCoordinate.y);

      if (deltaX <= 1 && deltaY <= 1) {
        racePoint.setAvailable();
        racePoint.cursor = "pointer";
        racePoint.on("pointerdown", () => {
          const move = new Move(
            activePlayer,
            Track.STARTING_POINTS.points[0],
            racePoint.point,
          );
          this.screen.game.addMove(move);
          activePlayer.updatePosition(racePoint.point);
          racePoint.setActive();
          this.enableAvailablePoints();
          this.drawLine(currentPosition, racePoint.point, activePlayer.color);
        });
        return;
      }

      racePoint.cursor = "default";
      racePoint.setDefault();
    });
  }

  private drawLine(startPosition: Point, endPosition: Point, color: string) {
    const line = new Graphics();
    this.screen.mainContainer.addChild(line);

    let progress = 0;
    const speed = 0.02;

    const animateLine = (ticker: Ticker) => {
      progress += speed * ticker.deltaTime;

      if (progress > 1) {
        progress = 1;
        this.ticker.remove(animateLine);
      }

      const currentX =
        startPosition.x + (endPosition.x - startPosition.x) * progress;
      const currentY =
        startPosition.y + (endPosition.y - startPosition.y) * progress;

      line
        .clear()
        .moveTo(
          this.getXScreenPosition(startPosition.x),
          this.getYScreenPosition(startPosition.y),
        )
        .lineTo(
          this.getXScreenPosition(currentX),
          this.getYScreenPosition(currentY),
        )
        .stroke({ color: color, width: 2 });
    };

    this.ticker.add(animateLine);
  }

  private setScreenPosition(racePoint: RacePoint): void {
    racePoint.position.set(
      this.getXScreenPosition(racePoint.point.x),
      this.getYScreenPosition(racePoint.point.y),
    );
  }

  private getXScreenPosition(x: number) {
    const widthDistance = (this.xMax - this.xMin) / Track.TRACK_WIDTH;
    return this.xMin + x * widthDistance;
  }
  private getYScreenPosition(y: number) {
    const heightDistance = (this.yMax - this.yMin) / Track.TRACK_HEIGHT;
    return this.yMin + y * heightDistance;
  }
}
