import axios from "axios";
import {
    FRIEND_GET_SUCCESS,
    GET_MESSAGE_SUCCESS,
    SEND_MESSAGE_SUCCESS,
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

export const seenMessage = (data) => {
    return async (dispatch) => {
        console.log(data);
    };
};
