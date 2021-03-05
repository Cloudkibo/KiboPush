import * as ActionTypes from '../constants/constants'

export function superNumberInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_COMMERCE_TEMPLATES:
      return Object.assign({}, state, {
        templates: action.data
      })
    case ActionTypes.SHOW_ORDERS:
      return Object.assign({}, state, {
        orders: action.data
      })
    default:
      return state
  }
}
