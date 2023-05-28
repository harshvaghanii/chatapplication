const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.port || 5000;
const cors = require("cors");
const connectDB = require("./database/connect");
app.use(cors());
const auth = require("./routes/authRoute");
const messenger = require("./routes/messengerRoute");
const cookieParser = require("cookie-parser");
// Calling the connect database method
connectDB();

app.use(express.json());
app.use(cookieParser());
// Configuring the end points
app.use("/api/messenger", auth);
app.use("/api/messenger", messenger);

app.listen(port, () => {
    console.log(`Backend server running successfully at port ${port}!`);
});
