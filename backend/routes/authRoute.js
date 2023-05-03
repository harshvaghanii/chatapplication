const { registerController } = require("../controllers/authController");

const router = require("express").Router();

router.post("/user-register", registerController);

module.exports = router;
