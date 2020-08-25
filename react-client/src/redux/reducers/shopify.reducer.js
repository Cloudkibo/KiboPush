import * as ActionTypes from '../constants/constants'

const initialState = {
  store: null
}

export function shopifyInfo(state = initialState, action) {
  console.log('shopify reducer', action)
  switch (action.type) {
    case ActionTypes.FETCH_SHOPIFY_STORE:
      return Object.assign({}, state, {
        store: action.data
      })
    default:
      return state
  }
}
