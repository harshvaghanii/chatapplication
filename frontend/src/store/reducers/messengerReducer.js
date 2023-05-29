import {
    LOGOUT_SUCCESS,
    MESSAGE_GET_SUCCESS_CLEAR,
    UPDATE,
} from "../types/authTypes";
import {
    FRIEND_GET_SUCCESS,
    GET_MESSAGE_SUCCESS,
    MESSAGE_SEND_SUCCESS_CLEAR,
    SEEN_MESSAGE,
    SEND_MESSAGE_SUCCESS,
    SOCKET_MESSAGE_SUCCESS,
    UPDATE_FRIEND_MESSAGE,
    DELIVERED_MESSAGE,
    SEEN_ALL,
    GET_THEME_SUCCESS,
    SET_THEME_SUCCESS,
    NEW_USER_ADD,
    NEW_USER_ADD_CLEAR,
} from "../types/messengerTypes";

const messengerState = {
    friends: [],
    messages: [],
    messageSendSuccess: false,
    message_get_success: false,
    themeMode: "",
    new_user_add: "",
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
                message_get_success: true,
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
            state.friends[index].messageInfo.status = payload.status;
            return state;
        }

        case MESSAGE_SEND_SUCCESS_CLEAR: {
            return {
                ...state,
                messageSendSuccess: false,
            };
        }

        case SEEN_MESSAGE: {
            const index = state.friends.findIndex(
                (friend) =>
                    friend.friendInfo._id === payload.messageInfo.receiverId ||
                    friend.friendInfo._id === payload.messageInfo.senderId
            );
            state.friends[index].messageInfo.status = "seen";
            return {
                ...state,
            };
        }

        case DELIVERED_MESSAGE: {
            const index = state.friends.findIndex(
                (friend) =>
                    friend.friendInfo._id === payload.messageInfo.receiverId ||
                    friend.friendInfo._id === payload.messageInfo.senderId
            );
            state.friends[index].messageInfo.status = "delivered";
            return {
                ...state,
            };
        }

        case UPDATE: {
            const index = state.friends.findIndex(
                (friend) => friend.friendInfo._id === payload.id
            );
            if (state.friends[index]?.messageInfo) {
                state.friends[index].messageInfo.status = "seen";
            }
            return {
                ...state,
            };
        }

        case MESSAGE_GET_SUCCESS_CLEAR: {
            return {
                ...state,
                message_get_success: false,
            };
        }

        case SEEN_ALL: {
            const index = state.friends.findIndex(
                (friend) => friend.friendInfo._id === payload.receiverId
            );
            state.friends[index].messageInfo.status = "seen";
            return {
                ...state,
            };
        }

        case SET_THEME_SUCCESS: {
            return {
                ...state,
                themeMode: payload.theme,
            };
        }

        case GET_THEME_SUCCESS: {
            return {
                ...state,
                themeMode: payload.theme,
            };
        }

        case LOGOUT_SUCCESS: {
            return {
                ...state,
                loading: true,
                authenticate: false,
                error: "",
                successMessage: "Logged Out successfully!",
                myInfo: "",
            };
        }

        case NEW_USER_ADD: {
            return {
                ...state,
                new_user_add: payload.new_user_add,
            };
        }

        case NEW_USER_ADD_CLEAR: {
            return {
                ...state,
                new_user_add: "",
            };
        }

        default: {
            return state;
        }
    }
};
