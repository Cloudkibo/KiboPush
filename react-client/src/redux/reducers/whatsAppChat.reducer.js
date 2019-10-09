import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: [],
  chatCount: 0
}

export function whatsAppChatInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS:
      return Object.assign({}, state, {
        openSessions: action.openSessions,
        openCount: action.count
      })
    case ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS:
      return Object.assign({}, state, {
        closeSessions: action.closeSessions,
        closeCount: action.count
      })
    case ActionTypes.FETCH_WHATSAPP_CHAT_OVERWRITE:
      return Object.assign({}, state, {
        chat: action.chat,
        chatCount: action.count
      })
    case ActionTypes.FETCH_WHATSAPP_CHAT:
      let chat = [...state.chat, ...action.chat]
      let orderedChat = chat.sort(function (a, b) {
        return new Date(a.datetime) - new Date(b.datetime)
      })
      return Object.assign({}, state, {
        chat: orderedChat,
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
    case ActionTypes.SOCKET_UPDATE_WHATSAPP:
      let newchat = state.chat
      newchat.push(action.data)
      return Object.assign({}, state, {
        chat: newchat,
        chatCount: state.chatCount + 1
      })
    case ActionTypes.SHOW_SEARCH_WHATSAPP:
      return Object.assign({}, state, {
        searchChat: action.data
      })
    case ActionTypes.CLEAR_SEARCH_WHATSAPP:
      return Object.assign({}, state, {
        searchChat: []
      })
    default:
      return state
  }
}
