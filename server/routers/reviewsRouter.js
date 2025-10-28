const router = require("express").Router();

const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;
const reviewsController = require("../controllers/reviewsController");

router.post("/add-review", verifyJWT, reviewsController.addReview)
router.delete(`/delete-review/:filmID`, verifyJWT, reviewsController.deleteReview)
router.get("/get-reviews/:username", reviewsController.getReviews)

module.exports = router;