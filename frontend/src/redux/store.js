import {createStore , applyMiddleware} from 'redux'
import {persistStore} from 'redux-persist'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

const middleWares = [logger,thunk]

export const store = createStore(rootReducer, applyMiddleware(...middleWares))

export const persistor = persistStore(store)