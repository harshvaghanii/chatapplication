import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    SUCCESS_MESSAGE_CLEAR,
    ERROR_CLEAR,
} from "../types/authTypes";
import jwt_decode from "jwt-decode";
const authState = {
    loading: true,
    authenticate: false,
    error: "",
    successMessage: "",
    myInfo: "",
};

const tokenDecode = (token) => {
    const decodedToken = jwt_decode(token);
    const expTime = new Date(decodedToken.exp * 1000);
    if (new Date() > expTime) return null;
    return decodedToken;
};

const getToken = localStorage.getItem("authToken");
if (getToken) {
    const getInfo = tokenDecode(getToken);
    if (getInfo) {
        authState.myInfo = getInfo;
        authState.authenticate = true;
        authState.loading = false;
    }
}

export const authReducer = (state = authState, action) => {
    const { payload, type } = action;
    switch (type) {
        case REGISTER_FAIL: {
            return {
                ...state,
                loading: true,
                authenticate: false,
                error: payload.error,
                successMessage: "",
                myInfo: "",
            };
        }
        case REGISTER_SUCCESS: {
            const myInfo = tokenDecode(payload.token);
            return {
                ...state,
                loading: false,
                authenticate: true,
                error: "",
                successMessage: payload.successMessage,
                myInfo,
            };
        }

        case SUCCESS_MESSAGE_CLEAR: {
            return {
                ...state,
                successMessage: "",
            };
        }

        case ERROR_CLEAR: {
            return {
                ...state,
                error: "",
            };
        }

        default: {
            return state;
        }
    }
};
