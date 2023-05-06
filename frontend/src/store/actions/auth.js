import axios from "axios";
const {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
} = require("../types/authTypes");

export const userRegister = (data) => {
    return async (dispatch) => {
        const config = {
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "multipart/form-data",
            },
        };

        try {
            const response = await axios.post(
                "/api/messenger/user-register",
                data,
                config
            );
            localStorage.setItem("authToken", response.data.token);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: {
                    successMessage: response.data.message,
                    token: response.data.token,
                },
            });
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage,
                },
            });
        }
    };
};

export const userLogin = (data) => {
    return async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.post(
                "/api/messenger/user-login",
                data,
                config
            );
            console.log(response);
            localStorage.setItem("authToken", response.data.token);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    successMessage: response.data.message,
                    token: response.data.token,
                },
            });
        } catch (error) {
            dispatch({
                type: LOGIN_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage,
                },
            });
        }
    };
};
