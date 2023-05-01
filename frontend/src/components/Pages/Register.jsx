import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
    const [userData, setUserDate] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: "",
    });

    const inputHandler = (e) => {
        setUserDate({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="register">
            <div className="card">
                <div className="card-header">
                    <h3>Register</h3>
                </div>

                <div className="card-body">
                    <form>
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
                                <div className="image"></div>
                                <div className="file">
                                    <label htmlFor="image">Select Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        name="image"
                                        value={userData.image}
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
