const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require("multer");
const authMiddleware = require("../middlewares/AuthMiddleware");

// /api/user


router.delete("/delete-account/:confirmEmail", authMiddleware.verifyJWT, userController.deleteAccount)
router.get("/get-profile-data", authMiddleware.verifyJWT, userController.getProfileData)
router.post("/update-profile", authMiddleware.verifyJWT, userController.updateProfile)


// 1. Dici a Multer dove salvare i file
const uploadAvatar = multer({ dest: 'public/uploads/avatars/' });
router.post('/upload-avatar', authMiddleware.verifyJWT, uploadAvatar.single('avatar'), userController.uploadAvatar)
router.post("/remove-avatar", authMiddleware.verifyJWT, userController.removeAvatar)

router.get("/get-activity", authMiddleware.verifyJWT, userController.getActivity)

module.exports = router;