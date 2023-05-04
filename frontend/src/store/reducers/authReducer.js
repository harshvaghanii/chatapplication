import { REGISTER_FAIL, REGISTER_SUCCESS } from "../types/authTypes";
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

export const authReducer = (state = authState, action) => {
    const { payload, type } = action;
    switch (type) {
        case REGISTER_FAIL: {
            return {
                ...state,
                error: payload.error,
            };
        }
        case REGISTER_SUCCESS: {
            const myInfo = tokenDecode(payload.token);
            return {
                ...state,
                loading: false,
                authenticate: true,
                successMessage: payload.successMessage,
                myInfo,
            };
        }

        default: {
            return state;
        }
    }
};
