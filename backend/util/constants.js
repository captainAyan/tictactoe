const NotificationType = {
  PLAYER_JOIN: "player_join",
  MOVE: "move",
  REMATCH_REQUEST: "rematch_request",
  REMATCH_RESPONSE: "rematch_response",
  GAME_EXPIRE: "game_expire",
};

const GameExpirationSchedulerPreference = {
  EXPIRATION_DURATION_OF_ACTIVE_GAME: 120000, // 2 minutes
  EXPIRATION_DURATION_OF_FINISHED_GAME: 240000, // 4 minutes
  SCHEDULER_DELAY: 30000, // 30 seconds
};

module.exports = { NotificationType, GameExpirationSchedulerPreference };
