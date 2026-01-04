import Move from "./Move";
import Player from "./Player";

export default class Round {
  public readonly moves: Move[];

  constructor() {
    this.moves = [];
  }

  addMove = (move: Move): void => {
    this.moves.push(move);
  };

  getByPlayer = (player: Player): Move | null => {
    const move = this.moves.find((move: Move) => move.player.id === player.id);

    if (move === undefined) {
      return null;
    }

    return move;
  };
}
