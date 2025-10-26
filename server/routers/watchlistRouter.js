const router = require("express").Router();

const watchlistController = require("../controllers/watchlistController");
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;

// /api/films/watchlist
router.post("/add-to-watchlist", verifyJWT, watchlistController.addToWatchlist)
router.delete("/remove-from-watchlist/:filmID", verifyJWT, watchlistController.removeFromWatchlist)
router.get("/get-watchlist/:username", watchlistController.getWatchlist)

module.exports = router;