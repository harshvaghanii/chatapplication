const User = require("../models/user");
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
