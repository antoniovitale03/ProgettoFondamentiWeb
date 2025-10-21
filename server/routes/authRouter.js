const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
//   /api/auth

//registrazione
router.post("/registration", authController.registerData) //registrazione dati
router.post("/registration/verify", authController.registrationVerify); //verifica codice


// login
router.post("/login", authController.login)
router.post("/forgot-password", authController.forgotPassword)
router.post("/login/verify", authController.loginVerify)
router.post("/set-new-password", authController.setNewPassword)


router.post("/refresh", authController.refresh)

router.get("/logout", authMiddleware.verifyJWT, authController.logout);

module.exports = router;
