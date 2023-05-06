import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
    SUCCESS_MESSAGE_CLEAR,
    ERROR_CLEAR,
} from "../../store/types/authTypes";

const Login = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const { authenticate, error, successMessage } = useSelector(
        (state) => state.auth
    );

    const inputHandler = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const loginForm = (e) => {
        e.preventDefault();
        dispatch(userLogin(userData));
    };

    useEffect(() => {
        if (authenticate) {
            navigate("/");
        }

        if (successMessage) {
            alert.success(successMessage);
            dispatch({ type: SUCCESS_MESSAGE_CLEAR });
        }

        if (error) {
            error.map((err) => alert.error(err));
            dispatch({
                type: ERROR_CLEAR,
            });
        }
    }, [successMessage, error, authenticate, navigate, alert, dispatch]);

    return (
        <div className="register">
            <div className="card">
                <div className="card-header">
                    <h3>Login</h3>
                </div>

                <div className="card-body">
                    <form onSubmit={loginForm}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                className="form-control"
                                placeholder="Email"
                                id="email"
                                onChange={inputHandler}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={userData.password}
                                className="form-control"
                                placeholder="Password"
                                id="password"
                                onChange={inputHandler}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="submit"
                                value="login"
                                className="btn"
                            />
                        </div>

                        <div className="form-group">
                            <span>
                                Don't have an Account?
                                <Link to="/messenger/register">Register</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
