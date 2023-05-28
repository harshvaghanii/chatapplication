const User = require("../models/user");
const formidable = require("formidable");
const validator = require("validator");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerController = (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        const { username, email, password, confirmPassword } = fields;
        const { image } = files;

        const error = [];

        if (!username) error.push("Please provide your user name");
        if (!email) error.push("Please provide your email address");
        if (email && !validator.isEmail(email))
            error.push("Please provide a valid email address!");
        if (!password) error.push("Please provide a password!");
        if (!confirmPassword) error.push("Please verify the password!");
        if (password && confirmPassword && password !== confirmPassword)
            error.push("The passwords do not match!");
        if (Object.keys(files).length == 0)
            error.push("Please upload a cover picture!");
        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error,
                },
            });
        } else {
            const getImageName = image.originalFilename;
            const randomNumber = Math.floor(Math.random() * 99999);
            const newImageName =
                randomNumber + getImageName.trim().replaceAll(/\s/g, "");
            const newPath = path.join(
                __dirname,
                "..",
                "..",
                "frontend",
                "public",
                "images",
                `${newImageName}`
            );
            try {
                // Checking if the user email is already present

                const duplicateUser = await User.findOne({
                    email: email,
                });
                if (duplicateUser) {
                    return res.status(404).json({
                        error: {
                            errorMessage: ["User already exists!"],
                        },
                    });
                }

                // After confirming that the user is not a duplicate user

                fs.copyFile(image.filepath, newPath, async (error) => {
                    if (error) {
                        console.log("Error occurred in file path");
                        return res.status(500).json(error);
                    }
                    if (!error) {
                        const user = await User.create({
                            username,
                            email,
                            password: await bcrypt.hash(password, 10),
                            image: newImageName,
                        });

                        const token = jwt.sign(
                            {
                                id: user._id,
                                email: user.email,
                                username: user.username,
                                image: user.image,
                                registerTime: user.createdAt,
                            },
                            process.env.JWT_SEC,
                            { expiresIn: process.env.JWT_EXPIRE }
                        );

                        const options = {
                            expires: new Date(
                                Date.now() +
                                    process.env.COOKIE_EXPIRE *
                                        24 *
                                        60 *
                                        60 *
                                        1000
                            ),
                        };

                        res.status(201)
                            .cookie("authToken", token, options)
                            .json({
                                success: true,
                                message: "You have registered successfully!",
                                token,
                            });
                    } else {
                        res.status(500).json(error);
                    }
                });
            } catch (error) {
                res.status(500).json({
                    error: {
                        errorMessage: ["Internal server error!"],
                    },
                });
            }
        }
    });
};

exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    const error = [];
    if (!email) {
        error.push("Please enter your email address");
    }
    if (!password) {
        error.push("Please enter your password");
    }

    if (email && !validator.isEmail(email)) {
        error.push("Please provide a valid email address!");
    }

    if (error.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: error,
            },
        });
    } else {
        try {
            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                return res.status(400).json({
                    error: {
                        errorMessage: ["Please provide valid credentials!"],
                    },
                });
            }

            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                return res.status(400).json({
                    error: {
                        errorMessage: ["Please provide valid credentials!"],
                    },
                });
            }

            // If credentials entered by user are correct

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    image: user.image,
                    registerTime: user.createdAt,
                },
                process.env.JWT_SEC,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            const options = {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
            };

            res.status(200).cookie("authToken", token, options).json({
                success: true,
                message: "You have logged in successfully!",
                token,
            });
        } catch {
            res.status(400).json({
                error: {
                    errorMessage: ["Internal server error!"],
                },
            });
        }
    }
};

exports.logoutController = (req, res) => {
    res.status(200).cookie("authToken", "").json({
        success: true,
        message: "You have logged out successfully!",
    });
};
