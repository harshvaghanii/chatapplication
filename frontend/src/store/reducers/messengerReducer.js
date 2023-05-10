import {
    FRIEND_GET_SUCCESS,
    GET_MESSAGE_SUCCESS,
    SEND_MESSAGE_SUCCESS,
} from "../types/messengerTypes";

const messengerState = {
    friends: [],
    messages: [],
};

export const messengerReducer = (state = messengerState, action) => {
    const { type, payload } = action;
    switch (type) {
        case FRIEND_GET_SUCCESS: {
            return {
                ...state,
                friends: payload.friends,
            };
        }

        case GET_MESSAGE_SUCCESS: {
            return {
                ...state,
                messages: payload.message,
            };
        }

        case SEND_MESSAGE_SUCCESS: {
            return {
                ...state,
                messages: [...state.messages, payload.message],
            };
        }

        default: {
            return state;
        }
    }
};
