const {
  NotificationType,
  GameExpirationSchedulerPreference,
} = require("./constants");
const Game = require("./Game");
const { startScheduler } = require("./taskScheduler");
const { userSocketsList } = require("./userSocketsManager");

const gameList = new Map();

function removeExpiredGames(
  expirationDurationOfActiveGame,
  expirationDurationOfFinishedGame
) {
  console.log("Cleaning expired games");
  gameList.forEach((game, key) => {
    if (
      (new Date() - new Date(game.timestamp) > expirationDurationOfActiveGame &&
        game.result === Game.Result.PENDING) ||
      new Date() - new Date(game.timestamp) > expirationDurationOfFinishedGame
    ) {
      const game = gameList.get(key);

      if (game.player1)
        userSocketsList
          .get(game.player1.id)
          ?.notify(NotificationType.GAME_EXPIRE, game);
      if (game.player2)
        userSocketsList
          .get(game.player2.id)
          ?.notify(NotificationType.GAME_EXPIRE, game);

      gameList.delete(key);
    }
  });
}

function addGame(game) {
  gameList.set(game.id, game);
  startScheduler(
    () =>
      removeExpiredGames(
        GameExpirationSchedulerPreference.EXPIRATION_DURATION_OF_ACTIVE_GAME,
        GameExpirationSchedulerPreference.EXPIRATION_DURATION_OF_FINISHED_GAME
      ),
    () => gameList.size > 0,
    GameExpirationSchedulerPreference.SCHEDULER_DELAY
  );
  return game;
}

function getGameById(gameId) {
  return gameList.get(gameId);
}

function getGamesByPlayerId(playerId) {
  const filteredGameList = [];

  gameList.forEach((game) => {
    if (game.player1?.id === playerId || game.player2?.id === playerId)
      filteredGameList.push(game);
  });

  return filteredGameList;
}

module.exports = {
  addGame,
  getGameById,
  getGamesByPlayerId,
};
