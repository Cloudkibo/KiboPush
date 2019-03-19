import * as ActionTypes from '../constants/constants'

export function smsChatInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions,
        count: action.count
      })
    case ActionTypes.FETCH_CHAT:
      return Object.assign({}, state, {
        chat: action.chat,
        chatCount: action.count
      })
    case ActionTypes.UPDATE_SESSION:
      return Object.assign({}, state, {
        sessions: action.sessions
      })
    default:
      return state
  }
}
