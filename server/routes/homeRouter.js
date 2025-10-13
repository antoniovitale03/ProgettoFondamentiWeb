const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/get-home-page-films", homeController.getHomePageFilms)
router.get("/get-current-popular-films", homeController.getCurrentPopularFilms)
router.get("/get-upcoming-films/page/:pageNumber", homeController.getUpcomingFilms)
router.get("/get-top-rated-films/page/:pageNumber", homeController.getTopRatedFilms)
router.get("/get-now-playing-films/page/:pageNumber", homeController.getNowPlayingFilms)
router.get("/get-trending-films/page/:pageNumber", homeController.getTrendingFilms)

module.exports = router;