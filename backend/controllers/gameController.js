const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");

const {
  addGame,
  getGameById,
  getGamesByPlayerId,
} = require("../util/gameManager");
const { userSocketsList } = require("../util/userSocketsManager");
const { ErrorResponse } = require("../middlewares/errorMiddleware");
const Game = require("../util/Game");

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
  const game = new Game(uuid());
  game.addPlayer1(req.user);
  game.sessionData.score[req.user.id] = 0;

  addGame(game);

  res.json(game);
};

const joinGame = (req, res, next) => {
  const { gameId } = req.params;

  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  // if the game is a rematch, and the user is not the requestee
  if (game.rematch.requesteeId && req.user.id !== game.rematch.requesteeId) {
    throw new ErrorResponse(
      "Not allowed to join this game",
      StatusCodes.FORBIDDEN
    );
  }

  try {
    // if player1 is not null, then try adding user as player2
    if (game.player1) game.addPlayer2(req.user);
    else game.addPlayer1(req.user);
  } catch (error) {
    throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
  }

  // adding user.id to sessionData.points Map
  // (ONLY works when joining new game NOT REMATCH
  if (!game.sessionData.score[req.user.id])
    game.sessionData.score[req.user.id] = 0;

  userSocketsList.get(game.player1.id).notify("player_join", game);
  userSocketsList.get(game.player2.id).notify("player_join", game);
  res.json(game);
};

const addMove = (req, res, next) => {
  const { gameId } = req.params;
  const { position } = req.body;

  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  if (game.player1.id !== req.user.id && game.player2.id !== req.user.id)
    throw new ErrorResponse("User is not a player", StatusCodes.FORBIDDEN);

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

  const newGame = new Game(uuid());
  addGame(newGame);
  newGame.sessionData = game.sessionData;
  newGame.sessionData.gameIndex += 1;

  // assigning current game's id ot newGame's originalGameId of rematch
  newGame.rematch.originalGameId = game.id;

  // assigning newGame's id to current game's rematchGameId field
  game.rematch.newGameId = newGame.id;

  // if rematch initiator is player1, make them player2
  if (game.player1.id === req.user.id) {
    // user is the player1 -> in the new game they become player2
    newGame.addPlayer2(req.user);

    // adding requesteeId (non-initiator user) to rematch
    newGame.rematch.requesteeId = game.player2.id;

    // notifying the other player (non-initiator of the rematch)
    userSocketsList.get(game.player2.id).notify("rematch_request", game);
  }
  // else if rematch initiator is player2, make them player1
  else if (game.player2.id === req.user.id) {
    // user is the player2 -> in the new game they become player1
    newGame.addPlayer1(req.user);

    // adding requesteeId (non-initiator user) to rematch
    newGame.rematch.requesteeId = game.player1.id;

    // notifying the other player (non-initiator of the rematch)
    userSocketsList.get(game.player1.id).notify("rematch_request", game);
  }

  /// sending the newGame to the rematch initiator
  userSocketsList.get(req.user.id).notify("rematch_response", newGame);

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
