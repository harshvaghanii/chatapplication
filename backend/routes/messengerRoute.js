const { getFriends } = require("../controllers/messengerController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/get-friends", authMiddleware, getFriends);

module.exports = router;
