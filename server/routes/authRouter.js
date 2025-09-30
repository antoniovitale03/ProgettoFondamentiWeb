const express = require('express');
const router = express.Router(); // Ottieni un router da Express
const authMiddleware = require('../middlewares/AuthMiddleware');
const authController = require('../controllers/authController');
//   /api/auth

router.post("/registration/data", authController.registerdata); //registrazione dati
router.post("/registration/verify", authController.verifycode); //verifica codice
router.post("/login", authController.login);
router.post("/refresh", authController.refresh)
router.post("/forgot-password", authController.forgotPassword) //imposto nuova password

router.post("/modify-password", authMiddleware.verifyJWT, authController.modifyPassword)

router.post("/logout", authController.logout);



module.exports = router;
