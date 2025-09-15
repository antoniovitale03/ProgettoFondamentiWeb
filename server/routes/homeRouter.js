const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const homeController = require("../controllers/homeController");


module.exports = router;