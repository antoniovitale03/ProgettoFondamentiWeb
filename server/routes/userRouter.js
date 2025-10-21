const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");

// /api/user
router.get("/:username/get-profile-info", userController.getProfileInfo)
router.get("/:username/get-following", userController.getFollowing)
router.get("/:username/get-followers", userController.getFollowers)

router.post("/:friendUsername/follow", authMiddleware.verifyJWT, userController.follow)
router.delete("/:userId/unfollow", authMiddleware.verifyJWT, userController.unfollow)

router.delete("/delete-account/:confirmEmail", authMiddleware.verifyJWT, userController.deleteAccount)
router.get("/get-profile-data", authMiddleware.verifyJWT, userController.getProfileData)
router.post("/update-profile", authMiddleware.verifyJWT, userController.updateProfile)

router.post("/modify-password", authMiddleware.verifyJWT, userController.modifyPassword)
// Indico a Multer dove salvare i file
const uploadAvatar = multer({ dest: 'public/avatars/' });
router.post('/upload-avatar', authMiddleware.verifyJWT, uploadAvatar.single('avatar'), userController.uploadAvatar)
router.post("/remove-avatar", authMiddleware.verifyJWT, userController.removeAvatar)

router.get("/:username/get-activity", userController.getActivity)

module.exports = router;