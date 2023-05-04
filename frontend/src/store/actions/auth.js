import axios from "axios";
const { REGISTER_FAIL, REGISTER_SUCCESS } = require("../types/authTypes");
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
