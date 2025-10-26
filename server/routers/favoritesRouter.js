const router = require("express").Router();
const favoritesController = require("../controllers/favoritesController");
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;


// /api/films/favorites
router.post("/add-to-favorites", verifyJWT, favoritesController.addToFavorites)
router.delete("/remove-from-favorites/:filmID", verifyJWT, favoritesController.removeFromFavorites)
router.get("/get-favorites/:username", verifyJWT, favoritesController.getFavorites)

module.exports = router;