import { usertypes } from "./UserTypes"

const INITIAL_STATE = {
    user: null
}

export const userReducer = (state = INITIAL_STATE, {type, payload}) =>{
    switch(type){
        case usertypes.USER_LOGIN:
            return {
                ...state,
                user : payload
            }
        case usertypes.LOGOUT:
            return {
                ...state,
                user: null
            }
        default: return state
    }

}