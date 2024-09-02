class Game {
  constructor(gameId) {
    this.id = gameId; // this ID is for the live game not for database
    this.player1 = null; // player with noughts (O)
    this.player2 = null; // player with crosses (X)
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.player1HasNextMove = true;
    this.result = Game.Result.PENDING; // o | x | d | p
    this.rematch = {
      /// for rematch response (id of the current game)
      originalGameId: null,
      /// this is for the rematch request (id of the rematch game)
      newGameId: null,
      /// this won't be null in a new game (id of non-initiator user)
      requesteeId: null,
    };
    this.sessionData = {
      // The index of the current game in the session, starting from 0 index of the game
      gameIndex: 0,

      score: {}, // { { <playerId:objectId>: <scorevalue:int>}, ... }
    };
    this.timestamp = Date.now();
  }

  addPlayer1(player1) {
    if (this.player1) throw new Error("Player 1 has already joined the game");
    if (this.player2 && this.player2.id === player1.id)
      throw new Error("Player 1 and player 2 cannot be the same");

    this.player1 = player1;
  }

  addPlayer2(player2) {
    if (this.player2) throw new Error("Player 2 has already joined the game");
    if (this.player1 && this.player1.id === player2.id)
      throw new Error("Player 1 and player 2 cannot be the same user");

    this.player2 = player2;
  }

  addMove(player, position) {
    // both player have to be joined to make a move
    if (!this.player1 || !this.player2)
      throw new Error("Both player must be added before adding a move");

    // check if game is already completed
    if (this.result !== Game.Result.PENDING) throw new Error("Game is over");

    // determining if player is player1 or player2
    const playerIsPlayer1 = player.id === this.player1.id;

    // making sure if the move by the correct player
    if (playerIsPlayer1 !== this.player1HasNextMove)
      throw new Error(
        `Move is expected from ${
          this.player1HasNextMove ? "Player 1" : "Player 2"
        }`
      );

    // checking if the move is valid
    if (position <= 8 && position >= 0 && this.board[position] !== "")
      throw new Error("Invalid move");

    this.board[position] = this.player1HasNextMove
      ? Game.Symbol.NOUGHT
      : Game.Symbol.CROSS;
    this.player1HasNextMove = !this.player1HasNextMove;

    const result = Game.validate(this.board);
    if (result) this.result = result;

    // session score update
    if (this.result !== Game.Result.PENDING) {
      if (this.result === Game.Result.NOUGHT_WON) {
        // nought has won, that means player1 has won
        const currentScore = this.sessionData.score[this.player1.id];
        this.sessionData.score[this.player1.id] = currentScore + 1;
      } else if (this.result === Game.Result.CROSS_WON) {
        // cross has won, that means player2 has won
        const currentScore = this.sessionData.score[this.player2.id];
        this.sessionData.score[this.player2.id] = currentScore + 1;
      }

      /// otherwise, the game ended in DRAW, and no point needs to be added
    }
  }
}

Game.Result = {
  NOUGHT_WON: "o", // game ended in nought's victory
  CROSS_WON: "x", // game ended in cross's victory
  DRAW: "d", // game ended in draw
  PENDING: "p", // result is pending (game is being played)
};

Game.Symbol = {
  NOUGHT: "o",
  CROSS: "x",
};

Game.validate = (board) => {
  const winPossibilities = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let returnValue = false;

  winPossibilities.forEach((winPossibility) => {
    if (
      board[winPossibility[0]] === board[winPossibility[1]] &&
      board[winPossibility[0]] === board[winPossibility[2]] &&
      board[winPossibility[0]] !== ""
    ) {
      returnValue = board[winPossibility[0]];
    }
  });

  // check if it's a draw
  if (!returnValue) {
    const hasEmptySpot = board.some((str) => str === "");
    if (!hasEmptySpot) return Game.Result.DRAW;
  }

  return returnValue;
};

module.exports = Game;
