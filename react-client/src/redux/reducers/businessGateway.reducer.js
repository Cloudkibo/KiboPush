import * as ActionTypes from '../constants/constants'

export function businessGatewayInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SAVE_CURRENT_CUSTOMER_INFO:
      return Object.assign({}, state, {
        customersInfo: action.data
      })
    case ActionTypes.SET_DEFAULT_CUSTOMERS_INFO:
      return Object.assign({}, state, {
        customersInfo: action.data
      })
    default:
      return state
  }
}
