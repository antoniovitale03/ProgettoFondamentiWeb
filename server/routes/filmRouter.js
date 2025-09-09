const filmController = require("../controllers/filmController");
const express = require("express");
router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
// /api/films

router.post("/get-film-search-results", filmController.getFilmsFromSearch )
router.get("/getFilm/:filmTitle/:filmID", authMiddleware.verifyJWT, filmController.getFilm)
router.get("/:year/page/:page", authMiddleware.verifyJWT, filmController.getFilmsByYear)

router.post("/add-to-watchlist", authMiddleware.verifyJWT, filmController.addToWatchlist)
router.delete("/remove-from-watchlist/:filmID", authMiddleware.verifyJWT, filmController.removeFromWatchlist)
router.get("/get-watchlist", authMiddleware.verifyJWT, filmController.getWatchlist)

router.post("/add-to-favorites", authMiddleware.verifyJWT, filmController.addToFavorites)
router.delete("/remove-from-favorites/:filmID", authMiddleware.verifyJWT, filmController.removeFromFavorites)
router.get("/get-favorites", authMiddleware.verifyJWT, filmController.getFavorites)
router.post("/save-review", authMiddleware.verifyJWT, filmController.saveReview)
router.delete(`/delete-review/:filmID`, authMiddleware.verifyJWT, filmController.deleteReview)
router.get("/get-reviews", authMiddleware.verifyJWT, filmController.getReviews)

router.post("/add-to-liked", authMiddleware.verifyJWT, filmController.addToLiked)
router.delete("/remove-from-liked/:filmID", authMiddleware.verifyJWT, filmController.removeFromLiked)

router.post("/add-to-watched", authMiddleware.verifyJWT, filmController.addToWatched)
router.delete("/remove-from-watched/:filmID", authMiddleware.verifyJWT, filmController.removeFromWatched)
router.get("/get-watched", authMiddleware.verifyJWT, filmController.getWatched)

router.get("/get-actor-info/:actorID", filmController.getActorInfo)
router.get("/get-director-info/:directorID", filmController.getDirectorInfo)

module.exports = router;