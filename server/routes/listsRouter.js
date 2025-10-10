const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const listsController = require("../controllers/listsController");

router.post("/create-list/:listName", authMiddleware.verifyJWT, listsController.createList);
router.get("/get-lists/:username", listsController.getLists)

router.get("/add-to-list/:filmID/:listName", authMiddleware.verifyJWT, listsController.addToList)
router.delete("/remove-from-list/:filmID/:listName", authMiddleware.verifyJWT, listsController.removeFromList)


module.exports = router;