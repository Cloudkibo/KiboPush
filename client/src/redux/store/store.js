import { createStore, compose, applyMiddleware } from 'redux'
import initialDataLoad from '../reducers/reducer'
import thunk from 'redux-thunk'

export function configureStore (initialState = {}) {
  return createStore(initialDataLoad, initialState,
    compose(applyMiddleware(thunk)))
}
