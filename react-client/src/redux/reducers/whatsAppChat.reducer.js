import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: [],
  chatCount: 0
}

export function whatsAppChatInfo (state = initialState, action) {
  console.log('whatsapp reducer', action)
  switch (action.type) {
    case ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS:
      return Object.assign({}, state, {
        openSessions: action.openSessions,
        openCount: action.openCount
      })
    case ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS:
      return Object.assign({}, state, {
        closeSessions: action.closeSessions,
        closeCount: action.closeCount
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
    case ActionTypes.UPDATE_UNREAD_COUNT_WHATSAPP:
      let openSessions = [...state.openSessions]
      let openIds = openSessions.map(s => s._id)
      let openIndex = openIds.indexOf(action.data)
      openSessions[openIndex].unreadCount = 0
      return Object.assign({}, state, {
        openSessions: openSessions,
        updateSessionTimeStamp: new Date().toString()
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
      return Object.assign({}, state, {
        socketMessage: action.data,
      })
    case ActionTypes.SOCKET_UPDATE_WHATSAPP_SEEN:
      return Object.assign({}, state, {
        socketSeen: action.data,
      })
    case ActionTypes.RESET_SOCKET_WHATSAPP:
      return Object.assign({}, state, {
        socketMessage: action.data,
        socketSeen: action.data
      })
    case ActionTypes.UPDATE_SESSIONS_WHATSAPP:
      let sessions = state.openSessions
      let ids = sessions.map(s => s._id)
      let index = ids.indexOf(action.data.subscriberId)
      sessions[index].is_assigned = action.data.isAssigned
      sessions[index].assigned_to = {
        type: action.data.teamId ? 'team' : 'agent',
        id: action.data.teamId ? action.data.teamId : action.data.agentId,
        name: action.data.teamName ? action.data.teamName : action.data.agentName
      }
      return Object.assign({}, state, {
        openSessions: [...sessions]
    })
    case ActionTypes.SHOW_SEARCH_WHATSAPP:
      return Object.assign({}, state, {
        searchChat: action.data
      })
    case ActionTypes.CLEAR_SEARCH_WHATSAPP:
      return Object.assign({}, state, {
        searchChat: []
      })
    case ActionTypes.UPDATE_WHATSAPPCHAT_INFO:
      return Object.assign({}, state, action, action.data)
    default:
      return state
  }
}
