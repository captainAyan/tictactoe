const express = require("express");

const router = express.Router();
const {
  getProfile,
  deleteProfile,
} = require("../../controllers/userController");
const { protect } = require("../../middlewares/authMiddleware");

router.get("/", protect, getProfile);
router.get("/:id", protect, getProfile);
router.delete("/", protect, deleteProfile);

module.exports = router;
