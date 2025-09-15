const watchlistController = require("../controllers/watchlistController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// /api/films/watchlist
router.post("/add-to-watchlist", authMiddleware.verifyJWT, watchlistController.addToWatchlist)
router.delete("/remove-from-watchlist/:filmID", authMiddleware.verifyJWT, watchlistController.removeFromWatchlist)
router.get("/get-watchlist", authMiddleware.verifyJWT, watchlistController.getWatchlist)

module.exports = router;