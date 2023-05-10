const {
    getFriends,
    messageUploadDB,
    messageGet,
} = require("../controllers/messengerController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, messageUploadDB);
router.get("/get-message/:id", authMiddleware, messageGet);

module.exports = router;
