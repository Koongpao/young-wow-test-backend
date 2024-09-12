const { Router } = require("express")
const controller = require("../controllers/usersController")

const router = Router();

router.get("/", controller.getAllUsers)
router.get("/:id", controller.getUserById)
router.post("/", controller.registerUser)

module.exports = router