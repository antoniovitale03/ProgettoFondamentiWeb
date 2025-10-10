const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const listsController = require("../controllers/listsController");

router.post("/create-list/:listName", authMiddleware.verifyJWT, listsController.createList);
router.get("/get-lists/:username", listsController.getLists)

module.exports = router;