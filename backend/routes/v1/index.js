const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/game", require("./gameRoutes"));

module.exports = router;
