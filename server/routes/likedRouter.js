const router = require("express").Router();

const likedController = require("../controllers/likedController");
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;

// /api/films/liked
router.post("/add-to-liked", verifyJWT, likedController.addToLiked)
router.delete("/remove-from-liked/:filmID", verifyJWT, likedController.removeFromLiked)

module.exports = router;