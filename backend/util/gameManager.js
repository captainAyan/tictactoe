// const gameList = [];
const gameList = new Map();

function addGame(game) {
  gameList.set(game.id, game);
  return game;
}

function getGameById(gameId) {
  return gameList.get(gameId);
}

function getGamesByPlayerId(playerId) {
  const filteredGameList = [];

  gameList.forEach((game) => {
    if (game.player1?.id === playerId || game.player2?.id === playerId) {
      filteredGameList.push(game);
    }
  });

  return filteredGameList;
}

module.exports = {
  addGame,
  getGameById,
  getGamesByPlayerId,
};
