const router = require("express").Router();
const auth = require("../middleware/auth");
// const snippetController = require("../controllers/snippetController");
const snippetController = require("../controllers/snippetController copy");
router.get("/", auth, snippetController.index);
router.post("/", auth, snippetController.create);
router.put("/:id", auth, snippetController.update);
router.delete("/:id", auth, snippetController.remove);

module.exports = router;
