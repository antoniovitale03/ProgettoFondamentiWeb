const express = require('express');
const router = express.Router(); // Ottieni un router da Express
const authMiddleware = require('../middlewares/AuthMiddleware');
const authController = require('../controllers/authController');

//   /api
router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware.verifyJWT, authController.checkUser);
//  /api/me è l'API che serve per verificare il token inviato e la correttezza dei dati dell'utente nel DB. Viene eseguita
//ogni volta che l'applicazione viene riavviata o viene caricata una pagina, lato front-end si fa una fetch a questa API per verificare
//se c'è una sessione valida per l'utente

module.exports = router;
