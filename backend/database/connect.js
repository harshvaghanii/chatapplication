const mongoose = require("mongoose");

// DB Connection

const connect = () => {
    mongoose
        .connect(
            process.env.MONGO_URL,
            { useNewUrlParser: true, useUnifiedTopology: true },
            mongoose.set("strictQuery", false)
        )
        .then(() => {
            console.log("DB Connection Successful");
        })
        .catch((e) => console.log(e));
};

module.exports = connect;
