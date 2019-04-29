import * as ActionTypes from '../constants/constants'

export function smsBroadcastsInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_SMS_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        count: action.count
      })
    case ActionTypes.LOAD_TWILIO_NUMBERS:
      console.log('action', action)
      return Object.assign({}, state, {
        twilioNumbers: action.twilioNumbers
      })
    default:
      return state
  }
}
