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
        closeCount: action.closeSessions
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
        openSessions: sessions
      })
    default:
      return state
  }
}
