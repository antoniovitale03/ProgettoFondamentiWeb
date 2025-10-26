const router = require("express").Router();
const userController = require('../controllers/userController');
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;

// /api/user
router.get("/:username/get-profile-info", userController.getProfileInfo)
router.get("/:username/get-following", userController.getFollowing)
router.get("/:username/get-followers", userController.getFollowers)

router.post("/:friendUsername/follow", verifyJWT, userController.follow)
router.delete("/:userId/unfollow", verifyJWT, userController.unfollow)

router.delete("/delete-account/:confirmEmail", verifyJWT, userController.deleteAccount)
router.get("/get-profile-data", verifyJWT, userController.getProfileData)
router.post("/update-profile", verifyJWT, userController.updateProfile)

router.post("/modify-password", verifyJWT, userController.modifyPassword)

router.get("/:username/get-activity", userController.getActivity)

module.exports = router;