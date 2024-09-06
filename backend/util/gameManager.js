const Game = require("./Game");
const { startScheduler } = require("./taskScheduler");
const { userSocketsList } = require("./userSocketsManager");

const EXPIRATION_DURATION_OF_ACTIVE_GAME = 120000;
const EXPIRATION_DURATION_OF_FINISHED_GAME = 240000;
const SCHEDULER_DELAY = 30000;

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
      if (gameList.get(key).player1)
        userSocketsList
          .get(gameList.get(key).player1.id)
          .notify("game_expire", game);
      if (gameList.get(key).player2)
        userSocketsList
          .get(gameList.get(key).player2.id)
          .notify("game_expire", game);

      gameList.delete(key);
    }
  });
}

function addGame(game) {
  gameList.set(game.id, game);
  startScheduler(
    () =>
      removeExpiredGames(
        EXPIRATION_DURATION_OF_ACTIVE_GAME,
        EXPIRATION_DURATION_OF_FINISHED_GAME
      ),
    () => gameList.size > 0,
    SCHEDULER_DELAY
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
