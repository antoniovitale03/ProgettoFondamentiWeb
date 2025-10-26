const router = require("express").Router();

const filmController = require("../controllers/filmController");
const watchlistRouter = require(".//watchlistRouter");
const favoritesRouter = require(".//favoritesRouter");
const likedRouter = require(".//likedRouter");
const reviewsRouter = require(".//reviewsRouter");
const watchedRouter = require(".//watchedRouter");
const homeRouter = require(".//homeRouter");
const listsRouter = require(".//listsRouter");

const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;

// /api/films

router.use("/home", homeRouter)

//non inserisco questo percorso in homeRouter perchè viene usato per msotrare i film simili a partire dalla pagina dei film
router.get("/get-similar-films", filmController.getSimilarFilms)

router.get("/get-cast/:filmID", filmController.getCast);
router.get("/get-crew/:filmID", filmController.getCrew);

router.get("/get-all-genres", filmController.getAllGenres)
router.get("/get-archive", filmController.getArchiveFilms)
router.get("/get-search-results/:filmTitle", filmController.getFilmsFromSearch )
router.get("/get-film/:filmID", verifyJWT, filmController.getFilm)
router.get("/get-films/:year", filmController.getFilmsByYear)

router.get("/get-actor-info/:actorID", filmController.getActorInfo)
router.get("/get-director-info/:directorID", filmController.getDirectorInfo)

router.use("/watchlist", watchlistRouter)
router.use("/liked", likedRouter)
router.use("/reviews", reviewsRouter)
router.use("/favorites", favoritesRouter)
router.use("/watched", watchedRouter)
router.use("/lists", listsRouter)

module.exports = router;