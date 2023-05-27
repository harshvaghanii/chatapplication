const {
    getFriends,
    messageUploadDB,
    messageGet,
    imageMessageSend,
    setMessageToSeen,
    setMessageToDelivered,
} = require("../controllers/messengerController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, messageUploadDB);
router.get("/get-message/:id", authMiddleware, messageGet);
router.post("/image-message-send", authMiddleware, imageMessageSend);
router.post("/seen-message", authMiddleware, setMessageToSeen);
router.post("/update-message", authMiddleware, setMessageToDelivered);

module.exports = router;
