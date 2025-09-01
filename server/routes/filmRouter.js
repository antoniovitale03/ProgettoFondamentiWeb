const filmController = require("../controllers/filmController");
const express = require("express");
router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
// /api/films

router.post("/get-film-search-results", filmController.getFilmsFromSearch )
router.get("/getFilm/:filmTitle/:filmID", filmController.getFilm)
router.post("/add-to-watchlist", authMiddleware.verifyJWT, filmController.addToWatchlist)
router.get("/get-watchlist", authMiddleware.verifyJWT, filmController.getWatchlist)
router.post("/add-to-favorites", authMiddleware.verifyJWT, filmController.addToFavorites)
router.get("/get-favorites", authMiddleware.verifyJWT, filmController.getFavorites)
router.post("/save-review", authMiddleware.verifyJWT, filmController.saveReview)
router.get("/get-reviews", authMiddleware.verifyJWT, filmController.getReviews)
router.get("/reviews/:filmID", authMiddleware.verifyJWT, filmController.getRating)
router.post("/add-to-liked", authMiddleware.verifyJWT, filmController.addToLiked)
router.post("/add-to-watched", authMiddleware.verifyJWT, filmController.addToWatched)

module.exports = router;