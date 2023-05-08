const jwt = require("jsonwebtoken");
module.exports.authMiddleware = async (req, res, next) => {
    const { authToken } = req.cookies;
    if (authToken) {
        const decodeToken = await jwt.verify(authToken, process.env.JWT_SEC);
        req.myId = decodeToken.id;
        next();
    } else {
        res.status(400).json({
            error: {
                errorMessage: "Please login first!",
            },
        });
    }
};
