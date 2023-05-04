import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import { authReducer } from "./reducers/authReducer";
import thunkMiddleware from "redux-thunk";

const rootReducer = combineReducers({ auth: authReducer });

const middleware = [thunkMiddleware];

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;
