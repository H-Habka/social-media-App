import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { userReducer } from "./User/UserReducer";
import { categoriesReducer } from "./categories/categoriesReducer";
import { PinsReducer } from "./Pins/PinsReducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist : ['user']
}

const rootReducer = combineReducers({
    user: userReducer,
    categories : categoriesReducer,
    pins : PinsReducer
})


export default persistReducer(persistConfig,rootReducer )

