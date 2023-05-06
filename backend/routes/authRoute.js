const {
    registerController,
    loginController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/user-register", registerController);
router.post("/user-login", loginController);

module.exports = router;
