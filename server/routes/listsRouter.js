const router = require("express").Router();
const verifyJWT = require("../middlewares/authMiddleware").verifyJWT;
const listsController = require("../controllers/listsController");

// /api/films/lists
router.post("/create-list/:listName", verifyJWT, listsController.createList);
router.get("/get-lists/:username", listsController.getLists);
router.get("/get-list/:username/:listName", listsController.getList);

router.post("/add-to-list/:listName", verifyJWT, listsController.addToList);
router.delete("/remove-from-list/:filmID/:listName", verifyJWT, listsController.removeFromList);

module.exports = router;