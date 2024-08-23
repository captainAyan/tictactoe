const express = require("express");

const {
  getGames,
  getGame,
  createGame,
  joinGame,
  addMove,
  createRematchGame,
} = require("../../controllers/gameController");
const { protect } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getGames);
router.get("/:id", protect, getGame);
router.post("/", protect, createGame);
router.put("/join/:gameId", protect, joinGame);
router.put("/move/:gameId", protect, addMove);
router.post("/rematch/:gameId", protect, createRematchGame);

module.exports = router;
