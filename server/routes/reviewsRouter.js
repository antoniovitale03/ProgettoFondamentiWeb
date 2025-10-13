const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const reviewsController = require("../controllers/reviewsController");

router.post("/add-review", authMiddleware.verifyJWT, reviewsController.addReview)
router.delete(`/delete-review/:filmID`, authMiddleware.verifyJWT, reviewsController.deleteReview)
router.get("/get-reviews/:username", authMiddleware.verifyJWT, reviewsController.getReviews)

module.exports = router;