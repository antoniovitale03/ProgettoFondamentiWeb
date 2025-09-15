const express = require("express");
const router = express.Router();

const filmController = require("../controllers/filmController");
const watchlistRouter = require("../routes/watchlistRouter");
const favoritesRouter = require("../routes/favoritesRouter");
const likedRouter = require("../routes/likedRouter");
const reviewsRouter = require("../routes/reviewsRouter");
const watchedRouter = require("../routes/watchedRouter");
const homeRouter = require("../routes/homeRouter");

const authMiddleware = require("../middlewares/authMiddleware");

// /api/films

router.use("/home", homeRouter)


router.get("/get-home-page-film-info", authMiddleware.verifyJWT, filmController.getHomePageFilmsInfo)
router.get("/get-current-popular-films/page/:pageNumber", filmController.getCurrentPopularFilms)
router.get("/get-upcoming-films/page/:pageNumber", filmController.getUpcomingFilms)
router.get("/get-top-rated-films/page/:pageNumber", filmController.getTopRatedFilms)
router.get("/get-now-playing-films/page/:pageNumber", filmController.getNowPlayingFilms)
router.get("/get-trending-films/page/:pageNumber", filmController.getTrendingFilms)

router.get("/get-similar/:filmID/:pageNumber", filmController.getSimilarFilms)
router.get("/get-all-genres", filmController.getAllGenres)
router.post("/get-archive-films", filmController.getArchiveFilms)
router.post("/get-film-search-results", filmController.getFilmsFromSearch )
router.get("/getFilm/:filmTitle/:filmID", authMiddleware.verifyJWT, filmController.getFilm)
router.get("/:year/page/:page", authMiddleware.verifyJWT, filmController.getFilmsByYear)



router.use("/watchlist", watchlistRouter)
router.use("/liked", likedRouter)
router.use("/reviews", reviewsRouter)
router.use("/favorites", favoritesRouter)
router.use("/watched", watchedRouter)


router.get("/get-actor-info/:actorID", filmController.getActorInfo)
router.get("/get-director-info/:directorID", filmController.getDirectorInfo)

module.exports = router;