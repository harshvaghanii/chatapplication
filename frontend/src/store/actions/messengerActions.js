import axios from "axios";
import { FRIEND_GET_SUCCESS } from "../types/messengerTypes";

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
        } catch (error) {
            console.log(error.response.data);
        }
    };
};
