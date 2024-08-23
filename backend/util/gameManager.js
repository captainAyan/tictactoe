const { v4: uuid } = require("uuid");

const Game = require("./Game");

// const gameList = [];
const gameList = new Map();

function createGame(player1) {
  const gameId = uuid();
  const game = new Game(gameId, player1);

  gameList.set(gameId, game);

  return game;
}

function getGameById(gameId) {
  return gameList.get(gameId);
}

function getGamesByPlayerId(playerId) {
  const filteredGameList = [];

  gameList.forEach((game) => {
    if (game.player1.id === playerId || game.player2?.id === playerId) {
      filteredGameList.push(game);
    }
  });

  return filteredGameList;
}

function getGamesByCreatorId(playerId) {
  const filteredGameList = [];

  gameList.forEach((game) => {
    if (game.player1.id === playerId) {
      filteredGameList.push(game);
    }
  });

  return filteredGameList;
}

module.exports = {
  createGame,
  getGameById,
  getGamesByPlayerId,
  getGamesByCreatorId,
};
