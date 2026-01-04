import Move from "./Move";
import Player from "./Player";
import Round from "./Round";
import { Track } from "./Track";

export default class Game {
  public readonly track: Track;
  public readonly rounds: Round[];
  public readonly players: Player[];

  constructor(players: Player[]) {
    this.track = new Track();
    this.rounds = [];
    this.players = players;
  }

  addMove = (move: Move) => {
    let latestRound = this.getLatestRound();
    if (
      latestRound === null ||
      latestRound.moves.length === this.players.length
    ) {
      latestRound = new Round();
      this.rounds.push(latestRound);
    }

    latestRound.moves.push(move);
  };

  getActivePlayer = (): Player => {
    if (this.rounds.length === 0) {
      return this.players[0];
    }

    const latestRound = this.rounds[this.rounds.length - 1];

    for (let i = 0; i < this.players.length; i++) {
      if (latestRound.getByPlayer(this.players[i]) === null) {
        return this.players[i];
      }
    }

    return this.players[0];
  };

  getLatestRound = (): Round | null => {
    if (this.rounds.length === 0) {
      return null;
    }

    return this.rounds[this.rounds.length - 1];
  };
}
