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

io.on("connection", (socket) => {
    console.log("Socket is connecting...");
    socket.on("addUser", (userId, userInfo) => {
        addUser(userId, socket.id, userInfo);
        io.emit("getUser", users);
    });

    socket.on("sendMessage", (data) => {
        const { senderId, senderName, receiverId, time, message } = data;
        const user = isActiveFriend(receiverId);
        if (!user) return;
        socket.to(user.socketId).emit("getMessage", {
            senderId,
            senderName,
            receiverId,
            createdAt: time,
            message,
        });
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUser", users);
    });
});
