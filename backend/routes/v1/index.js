const express = require("express");
const { StatusCodes } = require("http-status-codes");

const { userSocketsList } = require("../../util/userSocketsManager");
const { protect } = require("../../middlewares/authMiddleware");
const {
  createGame,
  getGameById,
  getGamesByPlayerId,
} = require("../../util/gameManager");
const { ErrorResponse } = require("../../middlewares/errorMiddleware");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/profile", require("./profileRoutes"));

router.get("/game", protect, (req, res, next) => {
  const games = getGamesByPlayerId(req.user.id);
  res.json(games);
});

router.get("/game/:id", protect, (req, res, next) => {
  const { id: gameId } = req.params;
  const game = getGameById(gameId);

  if (!game)
    throw new ErrorResponse("Game doesn't exist", StatusCodes.NOT_FOUND);

  // checking if the user is one of the players
  if (game.player1.id !== req.user.id && game.player2.id !== req.user.id)
    throw new ErrorResponse("Cannot access game", StatusCodes.FORBIDDEN);

  res.json(game);
});

router.post("/game", protect, (req, res, next) => {
  const game = createGame(req.user);
  res.json(game);
});

router.put("/game/join/:gameId", protect, (req, res, next) => {
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
});

router.put("/game/move/:gameId", protect, (req, res, next) => {
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
});

module.exports = router;
