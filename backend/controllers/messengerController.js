const User = require("../models/user");
const Message = require("../models/message");
exports.getFriends = async (req, res) => {
    try {
        const friends = await User.find({});
        const filter = friends.filter((friend) => friend._id != req.myId);
        res.status(200).json({ success: true, friends: filter });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "Internal Server Error!",
            },
        });
    }
};

exports.messageUploadDB = async (req, res) => {
    const { senderName, receiverId, message } = req.body;

    const senderId = req.myId;

    try {
        const insertMessage = await Message.create({
            senderId,
            senderName,
            receiverId,
            message: {
                text: message,
                image: "",
            },
        });

        res.status(201).json({
            success: true,
            message: insertMessage,
        });
    } catch (error) {
        res.json(500).json({
            error: {
                errorMessage: "Internal Server Error!",
            },
        });
    }
};

exports.messageGet = async (req, res) => {
    const friendId = req.params.id;
    const myId = req.myId;

    try {
        let getAllMessages = await Message.find({});
        getAllMessages = getAllMessages.filter((message) => {
            return (
                (message.senderId === myId &&
                    message.receiverId === friendId) ||
                (message.senderId === friendId && message.receiverId === myId)
            );
        });
        res.status(200).json({
            success: true,
            message: getAllMessages,
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage:
                    "Internal Server Error while fetching friend Messages!",
            },
        });
    }
};
