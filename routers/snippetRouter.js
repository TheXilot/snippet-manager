const router = require("express").Router();
const snippetController = require("../controllers/snippetController");

router.get("/", snippetController.index);
router.post("/", snippetController.create);
router.put("/:id", snippetController.update);
router.delete("/:id", snippetController.remove);

module.exports = router;
