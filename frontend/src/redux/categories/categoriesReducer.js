import { categoriesTypes } from "./categoriesTypes";

const INITIAL_STATE = {
    categories : '',
}

export const categoriesReducer = (state=INITIAL_STATE , {type,payload}) => {
    switch(type){
        case categoriesTypes.FETCH_CATEGORIES :
            return {
                ...state,
                categories : payload
            } 
        
        default : return state
    }
}