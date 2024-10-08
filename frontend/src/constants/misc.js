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

export const NotificationType = {
  PLAYER_JOIN: "player_join",
  MOVE: "move",
  REMATCH_REQUEST: "rematch_request",
  REMATCH_RESPONSE: "rematch_response",
  GAME_EXPIRE: "game_expire",
};
