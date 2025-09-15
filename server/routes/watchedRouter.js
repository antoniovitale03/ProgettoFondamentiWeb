const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/AuthMiddleware");
const watchedController = require("../controllers/watchedController");

router.post("/add-to-watched", authMiddleware.verifyJWT, watchedController.addToWatched)
router.delete("/remove-from-watched/:filmID", authMiddleware.verifyJWT, watchedController.removeFromWatched)
router.get("/get-watched", authMiddleware.verifyJWT, watchedController.getWatched)

module.exports = router;