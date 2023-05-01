const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const port = process.env.port;
const cors = require("cors");

app.use(cors());

// DB Connection
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

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`Backend server running successfully at port ${port}!`);
});
