const express = require("express");
const router = express.Router();

const likedController = require("../controllers/likedController");
const authMiddleware = require("../middlewares/authMiddleware");

// /api/films/liked
router.post("/add-to-liked", authMiddleware.verifyJWT, likedController.addToLiked)
router.delete("/remove-from-liked/:filmID", authMiddleware.verifyJWT, likedController.removeFromLiked)

module.exports = router;