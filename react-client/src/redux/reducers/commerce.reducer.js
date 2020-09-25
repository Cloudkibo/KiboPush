import * as ActionTypes from '../constants/constants'

const initialState = {
  store: null
}

export function commerceInfo(state = initialState, action) {
  console.log('commerce reducer', action)
  switch (action.type) {
    case ActionTypes.FETCH_STORE:
      return Object.assign({}, state, {
        store: action.data
      })
    default:
      return state
  }
}
