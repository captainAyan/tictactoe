const validate = require("./ticTacToeBoardValidator");

module.exports = class Game {
  constructor(gameId, player1) {
    this.id = gameId;
    this.player1 = player1; // player with O
    this.player2 = null; // player with X
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.player1HasNextMove = true;
    this.isCompleted = false;
    this.timestamp = Date.now();
  }

  addPlayer2(player2) {
    if (this.player1.id === player2.id) {
      throw new Error("Player 1 and player 2 cannot be the same user");
    } else if (this.player2) {
      // player2 has already joined the game
      throw new Error("Player 2 has already joined the game");
    } else {
      this.player2 = player2;
    }
  }

  addMove(player, move) {
    if (this.player1Id !== null && this.player2Id !== null) {
      // check if the move is valid
      if (this.gameDate.board[move.position] !== "") {
        throw new Error("Invalid move");
      }

      // add the move
      this.board[move.position] = this.player1HasNextMove ? "o" : "x";

      // check if a player has won or not

      // if no winnings, then update the player1HasNextMove
    } else throw new Error("Players are missing");
  }
};
