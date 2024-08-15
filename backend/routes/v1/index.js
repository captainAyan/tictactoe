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

router.post("/game", protect, (req, res, next) => {
  const game = createGame(req.user);
  res.json(game);
});

router.put("/game/join", protect, (req, res, next) => {
  const { gameId } = req.body;

  const game = getGameById(gameId);

  try {
    // addPlayer2 can throw error
    game.addPlayer2(req.user);
  } catch (error) {
    throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
  }

  userSocketsList.get(game.player1.id).notify("player2_join", game);
  res.json(game);
});

router.put("/game/move", protect, (req, res, next) => {
  const { gameId } = req.body;

  const game = getGameById(gameId);

  try {
    game.addMove(req.user, req.body.move);
  } catch (error) {
    throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
  }

  res.json(game);
});

module.exports = router;
