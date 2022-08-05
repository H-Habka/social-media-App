import { usertypes } from "./UserTypes";

export const userLogin = (user) =>({
    type: usertypes.USER_LOGIN,
    payload: user
})

export const Logout = () => ({
    type : usertypes.LOGOUT,
})