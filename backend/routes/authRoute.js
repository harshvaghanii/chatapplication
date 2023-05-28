const {
    registerController,
    loginController,
    logoutController,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/user-register", registerController);
router.post("/user-login", loginController);
router.post("/user-logout", authMiddleware, logoutController);

module.exports = router;
