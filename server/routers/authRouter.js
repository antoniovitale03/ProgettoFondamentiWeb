const router = require("express").Router();
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;
const authController = require('../controllers/authController');
//   /api/auth

//registrazione
router.post("/registration", authController.registerData)
router.post("/registration/verify", authController.registrationVerify)

// login
router.post("/login", authController.login)
router.post("/forgot-password", authController.forgotPassword)
router.post("/login/verify", authController.loginVerify)
router.post("/set-new-password", authController.setNewPassword)

router.post("/refresh", authController.refresh)
router.get("/logout", verifyJWT, authController.logout);

module.exports = router;
