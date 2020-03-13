import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: [],
  chatCount: 0
}

export function smsChatInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SESSIONS_SMS:
      let sessions = [...state.openSessions]
      let ids = sessions.map(s => s._id)
      let index = ids.indexOf(action.data.subscriberId)
      sessions[index].is_assigned = action.data.isAssigned
      sessions[index].assigned_to = {
        type: action.data.teamId ? 'team' : 'agent',
        id: action.data.teamId ? action.data.teamId : action.data.agentId,
        name: action.data.teamName ? action.data.teamName : action.data.agentName
      }
      return Object.assign({}, state, {
        openSessions: sessions,
        updateSessionTimeStamp: new Date().toString()
      })
    case ActionTypes.CLEAR_SEARCH_RESULT_SMS:
      return Object.assign({}, state, {
        searchChat: undefined
      })
    case ActionTypes.SHOW_SEARCH_CHAT_SMS:
      return Object.assign({}, state, {
        searchChat: action.data
      })
    case ActionTypes.SHOW_SMS_OPEN_CHAT_SESSIONS_OVERWRITE:
      return Object.assign({}, state, {
        openSessions: action.openSessions,
        openCount: action.count
      })
    case ActionTypes.SHOW_SMS_CLOSE_CHAT_SESSIONS_OVERWRITE:
      return Object.assign({}, state, {
        closeSessions: action.closeSessions,
        closeCount: action.count
      })
    case ActionTypes.SHOW_SMS_USER_CHAT_OVERWRITE:
      return Object.assign({}, state, {
        userChat: action.userChat,
        chatCount: action.chatCount,
        changedStatus: ''
      })
    case ActionTypes.UPDATE_SMSCHAT_INFO:
      return Object.assign({}, state, action, action.data)
    case ActionTypes.UPDATE_SESSION:
      return Object.assign({}, state, {
        sessions: action.sessions
      })
    case ActionTypes.FETCH_CHAT_OVERWRITE:
      return Object.assign({}, state, {
        chat: action.chat,
        chatCount: action.count
      })
    case ActionTypes.FETCH_CHAT:
      let chat = [...state.chat, ...action.chat]
      let orderedChat = chat.sort(function (a, b) {
        return new Date(a.datetime) - new Date(b.datetime)
      })
      return Object.assign({}, state, {
        chat: orderedChat,
        chatCount: action.count
      })
    case ActionTypes.SOCKET_UPDATE_SMS:
      let newchat = state.chat
      newchat.push(action.data)
      return Object.assign({}, state, {
        chat: newchat,
        chatCount: state.chatCount + 1
      })
    default:
      return state
  }
}
