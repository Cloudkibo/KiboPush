import * as ActionTypes from '../constants/constants'

export function botsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_BOTS:
      return Object.assign({}, state, {
        bots: action.data,
        botTemplate: ''
      })
    case ActionTypes.SHOW_ANALYTICS:
      return Object.assign({}, state, {
        analytics: action.data
      })
    case ActionTypes.SHOW_BOTS_NEW:
      return Object.assign({}, state, {
        bots: action.bots,
        count: action.count,
        botTemplate: ''
      })
    case ActionTypes.SHOW_CREATED_BOT:
      return Object.assign({}, state, {
        createdBot: action.data
      })
    case ActionTypes.SHOW_BOT_DETAILS:
      return Object.assign({}, state, {
        botDetails: action.data
      })
    case ActionTypes.APPLY_BOT_TEMPLATE:
      return Object.assign({}, state, {
        botTemplate: action.data
      })
    case ActionTypes.SHOW_WAITING_REPLY_LIST:
      return Object.assign({}, state, {
        waitingReplyList: action.data
      })
    case ActionTypes.SHOW_UNANSWERED_QUERIES:
      return Object.assign({}, state, {
        unansweredQueriesList: action.data
      })
    default:
      return state
  }
}
