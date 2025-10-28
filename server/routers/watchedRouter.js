const router = require("express").Router();

const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;
const watchedController = require("../controllers/watchedController");

router.post("/add-to-watched", verifyJWT, watchedController.addToWatched)
router.delete("/remove-from-watched/:filmID", verifyJWT, watchedController.removeFromWatched)
router.get("/get-watched/:username", watchedController.getWatched)

module.exports = router;