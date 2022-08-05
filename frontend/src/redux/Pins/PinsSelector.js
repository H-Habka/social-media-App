import {createSelector} from 'reselect'


export const pins = (state) => state.pins.pins
export const isLoading = (state) => state.pins.isLoading
export const to = (state) => state.pins.to
export const currentPage = (state) => state.pins.currentPage
export const pinsOptions = (state) => state.pins.options