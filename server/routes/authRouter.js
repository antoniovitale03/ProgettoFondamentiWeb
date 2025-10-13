const express = require('express');
const router = express.Router(); // Ottieni un router da Express
const authMiddleware = require('../middlewares/AuthMiddleware');
const authController = require('../controllers/authController');
//   /api/auth

router.post("/registration", authController.registerdata); //registrazione dati
router.post("/registration/verify", authController.registrationVerify); //verifica codice

router.post("/login", authController.login);
router.post("/login/verify", authController.loginVerify)

router.post("/refresh", authController.refresh)
router.post("/forgot-password", authController.forgotPassword)
router.post("/set-new-password", authController.setNewPassword)

router.post("/modify-password", authMiddleware.verifyJWT, authController.modifyPassword)

router.get("/logout", authMiddleware.verifyJWT, authController.logout);



module.exports = router;
