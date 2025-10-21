const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const watchedController = require("../controllers/watchedController");

router.post("/add-to-watched", authMiddleware.verifyJWT, watchedController.addToWatched)
router.delete("/remove-from-watched/:filmID", authMiddleware.verifyJWT, watchedController.removeFromWatched)
router.get("/get-watched/:username", authMiddleware.verifyJWT, watchedController.getWatched)

module.exports = router;