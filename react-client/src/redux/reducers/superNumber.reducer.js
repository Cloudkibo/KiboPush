import * as ActionTypes from '../constants/constants'

export function superNumberInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_COMMERCE_TEMPLATES:
      return Object.assign({}, state, {
        templates: action.data
      })
    case ActionTypes.SHOW_ORDERS:
      return Object.assign({}, state, {
        orders: [...state.orders, ...action.orders],
        count: action.count,
        nextPageParameters: action.nextPageParameters
      })
    case ActionTypes.SHOW_ORDERS_OVERWRITE:
      return Object.assign({}, state, {
        orders: action.orders,
        count: action.count,
        nextPageParameters: action.nextPageParameters
      })
    case ActionTypes.SHOW_CHECKOUTS:
      return Object.assign({}, state, {
        checkouts: [...state.checkouts, ...action.checkouts],
        checkoutCount: action.count,
        checkoutNextPageParameters: action.nextPageParameters
      })
    case ActionTypes.SHOW_CHECKOUTS_OVERWRITE:
      return Object.assign({}, state, {
        checkouts: action.checkouts,
        checkoutCount: action.count,
        checkoutNextPageParameters: action.nextPageParameters
      })
    case ActionTypes.SAVE_SUPERNUMBER_PRFERENCES:
      return Object.assign({}, state, {
        superNumberPreferences: action.data
      })
    case ActionTypes.GET_SUMMARISED_ANALYTICS:
      return Object.assign({}, state, {
        summarisedAnalytics: action.data
      })
    case ActionTypes.GET_DETAILED_ANALYTICS:
      return Object.assign({}, state, {
        detailedAnalytics: action.data
      })
    default:
      return state
  }
}
