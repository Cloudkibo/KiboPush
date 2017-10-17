import * as ActionTypes from '../constants/constants'

export function liveChat (state = [], action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions
      })

    case ActionTypes.SHOW_USER_CHAT:
      return Object.assign({}, state, {
        userChat: action.userChat
      })

    default:
      return state
  }
}
