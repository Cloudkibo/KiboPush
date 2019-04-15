import * as ActionTypes from '../constants/constants'

export function whatsAppChatInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_WHATSAPP_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions,
        count: action.count
      })
    case ActionTypes.FETCH_WHATSAPP_CHAT:
      return Object.assign({}, state, {
        chat: action.chat,
        chatCount: action.count
      })
    case ActionTypes.UPDATE_WHATSAPP_SESSION:
      return Object.assign({}, state, {
        sessions: action.sessions
      })
    case ActionTypes.UPDATE_WHATSAPP_CHAT:
      console.log('UPDATE_WHATSAPP_CHAT', action.chat)
      return Object.assign({}, state, {
        chat: action.chat
      })
    default:
      return state
  }
}
