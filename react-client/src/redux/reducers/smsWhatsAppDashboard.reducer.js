import * as ActionTypes from '../constants/constants'

export function smsWhatsAppDashboardInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_SENT_SEEN:
      return Object.assign({}, state, {
        sentSeenData: action.data
      })
    case ActionTypes.SHOW_SUBSCRIBER_SUMMARY:
      return Object.assign({}, state, {
        subscriberSummary: action.data
      })
    case ActionTypes.SHOW_CARDBOXES_DATA:
      return Object.assign({}, state, {
        cardBoxesData: action.data
      })
    case ActionTypes.SHOW_METRICS:
      return Object.assign({}, state, {
        metrics: action.data
      })
    default:
      return state
  }
}
