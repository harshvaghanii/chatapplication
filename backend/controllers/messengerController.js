const User = require("../models/user");
const Message = require("../models/message");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const getLastMessage = async (myId, friendId) => {
    const message = await Message.findOne({
        $or: [
            {
                $and: [
                    {
                        senderId: {
                            $eq: myId,
                        },
                    },
                    {
                        receiverId: {
                            $eq: friendId,
                        },
                    },
                ],
            },
            {
                $and: [
                    {
                        senderId: {
                            $eq: friendId,
                        },
                        receiverId: {
                            $eq: myId,
                        },
                    },
                ],
            },
        ],
    }).sort({
        updatedAt: -1,
    });
    return message;
};

exports.getFriends = async (req, res) => {
    const myId = req.myId;
    let friend_messages = [];
    try {
        const friends = await User.find({
            _id: {
                $ne: myId,
            },
        });
        for (let i = 0; i < friends.length; i++) {
            let lastMessage = await getLastMessage(myId, friends[i]._id);
            friend_messages = [
                ...friend_messages,
                {
                    friendInfo: friends[i],
                    messageInfo: lastMessage,
                },
            ];
        }
        console.log(friend_messages);
        res.status(200).json({ success: true, friends: friend_messages });
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
        let getAllMessages = await Message.find({
            $or: [
                {
                    $and: [
                        {
                            senderId: {
                                $eq: myId,
                            },
                        },
                        {
                            receiverId: {
                                $eq: friendId,
                            },
                        },
                    ],
                },
                {
                    $and: [
                        {
                            senderId: {
                                $eq: friendId,
                            },
                            receiverId: {
                                $eq: myId,
                            },
                        },
                    ],
                },
            ],
        });
        // getAllMessages = getAllMessages.filter((message) => {
        //     return (
        //         (message.senderId === myId &&
        //             message.receiverId === friendId) ||
        //         (message.senderId === friendId && message.receiverId === myId)
        //     );
        // });
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

exports.imageMessageSend = async (req, res) => {
    const form = formidable();
    const senderId = req.myId;
    form.parse(req, async (err, fields, files) => {
        const { senderName, receiverId, imagename } = fields;
        const newPath = path.join(
            __dirname,
            "..",
            "..",
            "frontend",
            "public",
            "images",
            `${imagename}`
        );
        files.image.originalFilename = imagename;
        try {
            fs.copyFile(files.image.filepath, newPath, async (err) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            errorMessage: "Image upload failed!",
                        },
                    });
                }
                const insertMessage = await Message.create({
                    senderId,
                    senderName,
                    receiverId,
                    message: {
                        text: "",
                        image: files.image.originalFilename,
                    },
                });

                res.status(201).json({
                    success: true,
                    message: insertMessage,
                });
            });
        } catch (error) {
            res.status(500).json({
                error: {
                    errorMessage: "Internal Server error!!",
                },
            });
        }
    });
};

exports.setMessageToSeen = async (req, res) => {
    try {
        const messageId = req.body._id;
        await Message.findByIdAndUpdate(messageId, {
            status: "seen",
        });
        res.status(200).json({
            success: true,
            message: "Message status set to Delivered!",
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "Internal Server Error!",
            },
        });
    }
};

exports.setMessageToDelivered = async (req, res) => {
    try {
        const messageId = req.body._id;
        await Message.findByIdAndUpdate(messageId, {
            status: "delivered",
        });
        res.status(200).json({
            success: true,
            message: "Message status set to Delivered!",
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "Internal Server Error!",
            },
        });
    }
};
