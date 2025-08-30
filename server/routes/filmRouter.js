const filmController = require("../controllers/filmController");
const express = require("express");
router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
// /api/films

router.post("/getFilmSearchResults", filmController.getFilmsFromSearch )
router.post("/findFilm", filmController.findFilm)
router.post("/add-to-watchlist", authMiddleware.verifyJWT, filmController.addToWatchlist)
router.get("/get-watchlist", authMiddleware.verifyJWT, filmController.getWatchlist)

module.exports = router;