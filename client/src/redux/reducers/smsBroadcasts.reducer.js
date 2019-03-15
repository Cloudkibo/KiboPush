import * as ActionTypes from '../constants/constants'

export function smsBroadcastsInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_SMS_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        count: action.count
      })
    default:
      return state
  }
}
