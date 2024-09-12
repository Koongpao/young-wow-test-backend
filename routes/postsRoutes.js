const { Router } = require("express");
const controller = require("../controllers/postsController");
const verifyToken = require("../middleware/authenticate");

const router = Router();

router.get("/", controller.getAllPosts);
router.get("/:id", controller.getPostById);
router.post("/", verifyToken, controller.createPost);
router.put("/:id", verifyToken, controller.updatePost);
router.delete("/:id", verifyToken, controller.deletePost);

module.exports = router;
