import { PinsTypes } from "./PinsTypes"
import api from '../../api/index'


const fetchPinsInit = (options) => ({
    type : PinsTypes.FETCH_PINS_INIT,
    payload : options
})
const fetchPinsSuccess = (pins) => ({
    type : PinsTypes.FETCH_PINS_SUCCESS,
    payload : pins
})
const fetchPinsFail = (error) => ({
    type : PinsTypes.FETCH_PINS_FAIL,
    payload : error
})
const fetchPinsOnScrollInit = (options) => ({
    type : PinsTypes.FETCH_PINS_ONSCROLL_INIT,
    payload : options
})
const fetchPinsOnScrollSuccess = (pins) => ({
    type : PinsTypes.FETCH_PINS_ONSCROLL_SUCCESS,
    payload : pins
})
const fetchPinsOnScrollFail = (error) => ({
    type : PinsTypes.FETCH_PINS_ONSCROLL_FAIL,
    payload : error
})

export const fetchPinsInitiator = (options) =>  (dispatch) => {
    dispatch(fetchPinsInit(options))
        api.categories.getPins(options).then(res => {
            dispatch(fetchPinsSuccess(res.data))
        }).catch(err => {
            dispatch(fetchPinsFail(err))
        })
}

export const fetchPinsOnScrollInitiator = (options) =>  (dispatch) => {
    dispatch(fetchPinsOnScrollInit(options))
        api.categories.getPins(options).then(res => {
            dispatch(fetchPinsOnScrollSuccess(res.data))
        }).catch(err => {
            dispatch(fetchPinsOnScrollFail(err))
        })
}

