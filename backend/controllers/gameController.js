const { StatusCodes } = require("http-status-codes");

const {
  createGame: _createGame,
  getGameById,
  getGamesByPlayerId,
} = require("../util/gameManager");
const { userSocketsList } = require("../util/userSocketsManager");
const { ErrorResponse } = require("../middlewares/errorMiddleware");

const getGames = (req, res, next) => {
  const games = getGamesByPlayerId(req.user.id);
  res.json(games);
};

const getGame = (req, res, next) => {
  const { id: gameId } = req.params;
  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  // checking if the user is one of the players
  if (game.player1.id !== req.user.id && game.player2.id !== req.user.id)
    throw new ErrorResponse("Cannot access game", StatusCodes.FORBIDDEN);

  res.json(game);
};

const createGame = (req, res, next) => {
  const game = _createGame(req.user);
  res.json(game);
};

const joinGame = (req, res, next) => {
  const { gameId } = req.params;

  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  try {
    // addPlayer2 can throw error
    game.addPlayer2(req.user);
  } catch (error) {
    throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
  }

  userSocketsList.get(game.player1.id).notify("player2_join", game);
  res.json(game);
};

const addMove = (req, res, next) => {
  const { gameId } = req.params;
  const { position } = req.body;

  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  try {
    game.addMove(req.user, position);
  } catch (error) {
    throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
  }

  userSocketsList.get(game.player1.id).notify("move", game);
  userSocketsList.get(game.player2.id).notify("move", game);
  res.json(game);
};

const createRematchGame = (req, res, next) => {
  const { gameId } = req.params;

  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exits", StatusCodes.NOT_FOUND);

  const newGame = _createGame(game.player2);
  newGame.addPlayer2(game.player1);

  userSocketsList
    .get(game.player1.id)
    .notify("rematch", { creator: req.user, rematchToGameId: gameId, newGame });
  userSocketsList
    .get(game.player2.id)
    .notify("rematch", { creator: req.user, rematchToGameId: gameId, newGame });

  res.json(newGame);
};

module.exports = {
  getGames,
  getGame,
  createGame,
  joinGame,
  addMove,
  createRematchGame,
};
