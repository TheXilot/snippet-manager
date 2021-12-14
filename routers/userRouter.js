const {
  create,
  login,
  loggedIn,
  logOut,
  update,
  indexByOne,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = require("express").Router();
// const snippetController = require("../controllers/snippetController");
//const snippetController = require("../controllers/snippetController copy");
// router.get("/", snippetController.index);
router.post("/", create);
router.post("/login", login);
router.get("/loggedIn", loggedIn);
router.get("/logout", logOut);
router.put("/:id", auth, update);
router.get("/:id", auth, indexByOne);
// router.delete("/:id", snippetController.remove);

module.exports = router;
