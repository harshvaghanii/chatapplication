import {
    FRIEND_GET_SUCCESS,
    GET_MESSAGE_SUCCESS,
    MESSAGE_SEND_SUCCESS_CLEAR,
    SEND_MESSAGE_SUCCESS,
    SOCKET_MESSAGE_SUCCESS,
    UPDATE_FRIEND_MESSAGE,
} from "../types/messengerTypes";

const messengerState = {
    friends: [],
    messages: [],
    messageSendSuccess: false,
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
                messageSendSuccess: true,
                messages: [...state.messages, payload.message],
            };
        }

        case SOCKET_MESSAGE_SUCCESS: {
            return {
                ...state,
                messages: [...state.messages, payload.message],
            };
        }

        case UPDATE_FRIEND_MESSAGE: {
            const index = state.friends.findIndex(
                (friend) =>
                    friend.friendInfo._id === payload.messageInfo.receiverId ||
                    friend.friendInfo._id === payload.messageInfo.senderId
            );
            state.friends[index].messageInfo = payload.messageInfo;
            return state;
        }

        case MESSAGE_SEND_SUCCESS_CLEAR: {
            return {
                ...state,
                messageSendSuccess: false,
            };
        }

        default: {
            return state;
        }
    }
};
