const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let users = [];
const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some((user) => user.userId === userId);
    if (!checkUser) {
        users.push({
            userId,
            socketId,
            userInfo,
        });
    }
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const isActiveFriend = (id) => {
    return users.find((users) => users.userId === id);
};

const userLogout = (id) => {
    users = users.filter((user) => user.userId !== id);
};

io.on("connection", (socket) => {
    console.log("Socket is connecting...");
    socket.on("addUser", (userId, userInfo) => {
        addUser(userId, socket.id, userInfo);
        io.emit("getUser", users);

        const us = users.filter((user) => user.userId !== userId);
        const updateFriends = "new_user_add";
        for (let i = 0; i < us.length; i++) {
            socket.to(us[i].socketId).emit("new_user_add", updateFriends);
        }
    });

    socket.on("sendMessage", (data) => {
        const { receiverId } = data;
        const user = isActiveFriend(receiverId);
        if (!user) return;
        socket.to(user.socketId).emit("getMessage", data);
    });

    socket.on("seenMessage", (msg) => {
        const user = isActiveFriend(msg.senderId);
        if (!user) return;
        socket.to(user.socketId).emit("msgSeenResponse", msg);
    });

    socket.on("deliveredMessage", (msg) => {
        const user = isActiveFriend(msg.senderId);
        if (!user) return;
        socket.to(user.socketId).emit("msgDeliveredResponse", msg);
    });

    socket.on("seen", (data) => {
        const user = isActiveFriend(data.senderId);
        if (!user) return;
        socket.to(user.socketId).emit("seenSuccess", data);
    });

    socket.on("typingMessage", (data) => {
        const { senderId, receiverId, message } = data;
        const user = isActiveFriend(data.receiverId);
        if (!user) return;
        socket.to(user.socketId).emit("getTypingMessage", {
            senderId,
            receiverId,
            message,
        });
    });

    socket.on("logout", (userId) => {
        userLogout(userId);
        io.emit("getUser", users);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUser", users);
    });
});
