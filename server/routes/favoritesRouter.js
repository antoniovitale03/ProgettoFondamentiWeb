const favoritesController = require("../controllers/favoritesController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");


// /api/films/favorites
router.post("/add-to-favorites", authMiddleware.verifyJWT, favoritesController.addToFavorites)
router.delete("/remove-from-favorites/:filmID", authMiddleware.verifyJWT, favoritesController.removeFromFavorites)
router.get("/get-favorites/:username", authMiddleware.verifyJWT, favoritesController.getFavorites)

module.exports = router;