import * as ActionTypes from '../constants/constants'

let initState = {
  searchBroadcastResult: [],
  broadcasts: [],
  count: 0
}
export function smsBroadcastsInfo (state = initState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SMS_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts:  action.append ? [...state.broadcasts, ...action.broadcasts] : action.broadcasts,
        count: action.count
      })
    case ActionTypes.NEW_SMS_BROADCAST_SOCKET:
        return Object.assign({}, state, {
          newSmsBroadcast:  action.newSmsBroadcast
        })
    case ActionTypes.UPDATE_SMS_BROADCAST:
      return Object.assign({}, state, {
        broadcasts: [action.broadcast, ...state.broadcasts],
        count: state.count + 1,
        newSmsBroadcast: null
      })
    case ActionTypes.SMS_DELIVERY_EVENT:
      return Object.assign({}, state, {
        smsDeliveryInfo: action.data
      })
    case ActionTypes.SMS_RESPONSE_EVENT:
      return Object.assign({}, state, {
        smsResponseInfo: action.data
      })
    case ActionTypes.LOAD_SEARCH_BROADCASTS_LIST:
      return Object.assign({}, state, {
        //searchBroadcastResult: state.searchBroadcastResult && state.searchBroadcastResult.length > 0 && action.broadcasts ? [...state.searchBroadcastResult, ...action.broadcasts] : action.broadcasts,
        searchBroadcastResult: action.append ? [...state.searchBroadcastResult, ...action.broadcasts] : action.broadcasts ,
        searchCount: action.count
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
    case ActionTypes.CLEAR_SMS_ANALYTICS:
      return Object.assign({}, state, {
        smsAnalytics: action.data
      })
    case ActionTypes.SHOW_SENDERS_INFO:
      let updateSenderInfo = state.sendersInfo ? state.sendersInfo : {}
      updateSenderInfo[action.responseId] = action.sendersInfo    
      return Object.assign({}, state, {
        sendersInfo: {...updateSenderInfo}
      })
    case ActionTypes.UPDATE_SENDERS_INFO: 
      return Object.assign({}, state, {
        sendersInfo: action.data
      })
    case ActionTypes.CLEAR_SENDERS_INFO:
      return Object.assign({}, state, {
        sendersInfo: action.data
      })
    default:
      return state
  }
}
