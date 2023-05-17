const {
    getFriends,
    messageUploadDB,
    messageGet,
    imageMessageSend,
} = require("../controllers/messengerController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, messageUploadDB);
router.get("/get-message/:id", authMiddleware, messageGet);
router.post("/image-message-send", authMiddleware, imageMessageSend);

module.exports = router;
