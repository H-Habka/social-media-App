import { PinsTypes } from "./PinsTypes"

const INITIAL_STATE = {
    pins: [],
    isLoading: false,
    error: '',
    currentPage: 1,
    prevPage: null,
    nextPage: 2,
    to: null,
    options : {}
}


// export const PinsReducer = (state = INITIAL_STATE, { type, payload }) => {
//     switch (type) {
//         case PinsTypes.FETCH_PINS_BY_PAGE_NUM_INIT:
//             return {
//                 ...state,
//                 isLoading: true,
//                 allPins : state.allPins.filter(pin => pin.categoryId === payload)
//             }
//         case PinsTypes.FETCH_PINS_BY_PAGE_NUM_SUCCESS:
//             if(payload.length){
//                 return {
//                     ...state,
//                     allPins: [...state.allPins, ...payload],
//                     isLoading: false,
//                 }
//             }else{
//                 return {
//                     ...state,
//                     isLoading: false,
//                     allDataFetched : true
//                 }
//             }

//         case PinsTypes.FETCH_PINS_BY_PAGE_NUM_FAILED:
//             return {
//                 ...state,
//                 err: payload,
//                 isLoading: false
//             }
//         case PinsTypes.FETCH_MORE_PINS_ON_SCROLL_INIT:
//             return {
//                 ...state,
//                 isLoading: true,
//             }
//         default: return state
//     }
// }


export const PinsReducer = (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case PinsTypes.FETCH_PINS_INIT:
            return {
                ...state,
                isLoading: true,
                pins: [],
                error : '',
                currentPage: 1,
                prevPage: null,
                nextPage: 2,
                to: null,
                options : payload
            }
        case PinsTypes.FETCH_PINS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                pins: payload.pins,
                currentPage:payload.currentPage,
                prevPage:payload.prevPage,
                nextPage:payload.nextPage,
                to:payload.to
            }
        case PinsTypes.FETCH_PINS_FAIL:
            return {
                ...state,
                isLoading: false,
                error: payload
            }
        case PinsTypes.FETCH_PINS_ONSCROLL_INIT:
            return {
                ...state,
                isLoading: true,
                error : '',
                options : payload
            }
        case PinsTypes.FETCH_PINS_ONSCROLL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                pins: [...state.pins, ...payload.pins],
                currentPage:payload.currentPage,
                prevPage:payload.prevPage,
                nextPage:payload.nextPage,
                to:payload.to
            }
        case PinsTypes.FETCH_PINS_ONSCROLL_FAIL:
            return {
                ...state,
                isLoading: false,
                error: payload
            }
        default: {
            return state
        }

    }
}



