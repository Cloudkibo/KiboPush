import * as ActionTypes from '../constants/constants'

export function smsBroadcastsInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_SMS_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        count: action.count
      })
    case ActionTypes.LOAD_TWILIO_NUMBERS:
      return Object.assign({}, state, {
        twilioNumbers: action.twilioNumbers
      })
    case ActionTypes.CURRENT_SMSBROADCAST:
      return Object.assign({}, state, {
        smsBroadcast: action.data
      })
    case ActionTypes.SHOW_SMS_ANALYTICS:
      return Object.assign({}, state, {
        smsAnalytics: action.data
      })
    default:
      return state
  }
}
