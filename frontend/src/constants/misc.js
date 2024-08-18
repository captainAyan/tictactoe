// States
/// Lobby - You can join or create a game
/// Play  - You're playing
/// Score - game is over, and score is being displayed
export const GameState = { LOBBY: "l", PLAY: "p", SCORE: "s" };

// Results
/// Nought won - Player 1 won
/// Cross won  - Player 2 won
/// DRAW       - Game was a draw
/// PENDING    - There is result (game is going on)
export const GameResult = {
  NOUGHT_WON: "o",
  CROSS_WON: "x",
  DRAW: "d",
  PENDING: "p",
};

export const NotificationType = { PLAYER2_JOIN: "player2_join", MOVE: "move" };
