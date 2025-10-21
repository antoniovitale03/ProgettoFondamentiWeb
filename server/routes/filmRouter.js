const express = require("express");
const router = express.Router();

const filmController = require("../controllers/filmController");
const watchlistRouter = require("../routes/watchlistRouter");
const favoritesRouter = require("../routes/favoritesRouter");
const likedRouter = require("../routes/likedRouter");
const reviewsRouter = require("../routes/reviewsRouter");
const watchedRouter = require("../routes/watchedRouter");
const homeRouter = require("../routes/homeRouter");
const listsRouter = require("../routes/listsRouter");

const authMiddleware = require("../middlewares/authMiddleware");

// /api/films

router.use("/home", homeRouter)

//non inserisco questo percorso in homeRouter perchè viene usato per msotrare i film simili a partire dalla pagina dei film
router.get("/get-similar-films/:filmID", filmController.getSimilarFilms)

router.get("/get-cast/:filmID", filmController.getCast);
router.get("/get-crew/:filmID", filmController.getCrew);

router.get("/get-all-genres", filmController.getAllGenres)
router.get("/get-archive", filmController.getArchiveFilms)
router.get("/get-search-results/:filmTitle", filmController.getFilmsFromSearch )
router.get("/get-film/:filmID", filmController.getFilm)
router.get("/get-films/:year", filmController.getFilmsByYear)

router.get("/get-actor-info/:actorID", filmController.getActorInfo)
router.get("/get-director-info/:directorID", filmController.getDirectorInfo)

router.use("/lists", listsRouter)
router.use("/watchlist", watchlistRouter)
router.use("/liked", likedRouter)
router.use("/reviews", reviewsRouter)
router.use("/favorites", favoritesRouter)
router.use("/watched", watchedRouter)


module.exports = router;