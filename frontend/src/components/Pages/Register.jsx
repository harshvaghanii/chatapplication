import React, { useState, useEffect } from "react";
import {
    SUCCESS_MESSAGE_CLEAR,
    ERROR_CLEAR,
} from "../../store/types/authTypes";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../store/actions/auth";
import { useAlert } from "react-alert";

const Register = () => {
    const navigate = useNavigate();

    const alert = useAlert();

    const { loading, authenticate, error, successMessage, myInfo } =
        useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: "",
    });
    const [loadImage, setLoadImage] = useState("");

    const inputHandler = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const fileHandler = (e) => {
        if (e.target.files.length !== 0) {
            setUserData({
                ...userData,
                [e.target.name]: e.target.files[0],
            });
        }
        const reader = new FileReader();

        reader.onload = (e) => {
            setLoadImage(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const registerForm = (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword, image } = userData;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("image", image);
        dispatch(userRegister(formData));
    };

    useEffect(() => {
        if (authenticate) {
            navigate("/");
        }

        if (successMessage) {
            alert.success(successMessage);
            setUserData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                image: "",
            });
            dispatch({
                type: SUCCESS_MESSAGE_CLEAR,
            });
        }
        if (error) {
            error.map((err) => alert.error(err));
            dispatch({
                type: ERROR_CLEAR,
            });
        }
    }, [successMessage, error]);

    return (
        <div className="register">
            <div className="card">
                <div className="card-header">
                    <h3>Register</h3>
                </div>

                <div className="card-body">
                    <form onSubmit={registerForm}>
                        <div className="form-group">
                            <label htmlFor="username">User Name</label>
                            <input
                                type="text"
                                onChange={inputHandler}
                                className="form-control"
                                placeholder="Enter your username"
                                id="username"
                                name="username"
                                value={userData.username}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                onChange={inputHandler}
                                className="form-control"
                                placeholder="Enter you email"
                                id="email"
                                name="email"
                                value={userData.email}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                onChange={inputHandler}
                                className="form-control"
                                placeholder="Enter your password"
                                id="password"
                                name="password"
                                value={userData.password}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                onChange={inputHandler}
                                className="form-control"
                                placeholder="Confirm Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                            />
                        </div>

                        <div className="form-group">
                            <div className="file-image">
                                <div className="image">
                                    {loadImage && (
                                        <img
                                            src={loadImage}
                                            alt="Icon Avatar"
                                        />
                                    )}
                                </div>
                                <div className="file">
                                    <label htmlFor="image">Select Image</label>
                                    <input
                                        type="file"
                                        onChange={fileHandler}
                                        className="form-control"
                                        id="image"
                                        name="image"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <input
                                type="submit"
                                value="Register"
                                className="btn"
                            />
                        </div>

                        <div className="form-group">
                            <span>
                                Already have an account?
                                <Link to="/messenger/login"> Login </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
