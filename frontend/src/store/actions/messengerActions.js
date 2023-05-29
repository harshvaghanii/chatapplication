import axios from "axios";
import {
    FRIEND_GET_SUCCESS,
    GET_MESSAGE_SUCCESS,
    GET_THEME_SUCCESS,
    SEND_MESSAGE_SUCCESS,
    SET_THEME_SUCCESS,
} from "../types/messengerTypes";

export const getFriends = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/api/messenger/get-friends");
            dispatch({
                type: FRIEND_GET_SUCCESS,
                payload: {
                    friends: response.data.friends,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
};

export const messageSend = (data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/api/messenger/send-message",
                data
            );

            dispatch({
                type: SEND_MESSAGE_SUCCESS,
                payload: {
                    message: response.data.message,
                },
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };
};

export const getMessage = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `/api/messenger/get-message/${id}`
            );
            dispatch({
                type: GET_MESSAGE_SUCCESS,
                payload: {
                    message: response.data.message,
                },
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };
};

export const imageMessageSend = (data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/api/messenger/image-message-send",
                data
            );
            dispatch({
                type: SEND_MESSAGE_SUCCESS,
                payload: {
                    message: response.data.message,
                },
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };
};

export const seenMessage = (message) => {
    return async (dispatch) => {
        try {
            await axios.post("/api/messenger/seen-message", message);
        } catch (error) {
            console.log(error.response.message);
        }
    };
};

export const updateMessage = (message) => {
    return async (dispatch) => {
        try {
            await axios.post("/api/messenger/update-message", message);
        } catch (error) {
            console.log(error.response.message);
        }
    };
};

export const setTheme = (theme) => {
    return async (dispatch) => {
        localStorage.setItem("theme", theme);
        dispatch({
            type: SET_THEME_SUCCESS,
            payload: {
                theme,
            },
        });
    };
};

export const getTheme = () => {
    return async (dispatch) => {
        const theme = localStorage.getItem("theme");
        dispatch({
            type: GET_THEME_SUCCESS,
            payload: {
                theme: theme ? theme : "white",
            },
        });
    };
};
