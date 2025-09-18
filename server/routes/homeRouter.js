const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const homeController = require("../controllers/homeController");

router.get("/get-home-page-film-info", authMiddleware.verifyJWT, homeController.getHomePageFilmsInfo)
router.get("/get-current-popular-films/page/:pageNumber", homeController.getCurrentPopularFilms)
router.get("/get-upcoming-films/page/:pageNumber", homeController.getUpcomingFilms)
router.get("/get-top-rated-films/page/:pageNumber", homeController.getTopRatedFilms)
router.get("/get-now-playing-films/page/:pageNumber", homeController.getNowPlayingFilms)
router.get("/get-trending-films/page/:pageNumber", homeController.getTrendingFilms)


module.exports = router;