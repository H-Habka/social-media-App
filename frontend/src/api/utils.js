import {store} from '../redux/store'
import { Logout } from '../redux/User/UserActions'

export const CreateInterseptor = (SHARE_ME) => {
    
    SHARE_ME.interceptors.response.use(response => {
        if (response.data.logout) {
            store.dispatch(Logout())
            return response
        }
        return  response
    })
}

export const CreateInterseptor2 = (SHARE_ME) => {
    SHARE_ME.interceptors.request.use(request => {
        request.headers.authorization = store.getState().user.user.token
        return request
    })
}

