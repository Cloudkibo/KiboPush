import * as ActionTypes from '../constants/constants'

export function smsChatInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions,
        count: action.count
      })
    // case ActionTypes.FETCH_CHAT:
    //   return Object.assign({}, state, {
    //     chat: action.chat,
    //     chatCount: action.count
    //   })
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
    case ActionTypes.SOCKET_UPDATE:
      return Object.assign({}, state, {
        socketSession: action.data.session_id,
        unreadSession: action.data.session_id,
        socketData: action.data,
        socketMessage: action.data.message,
        changedStatus: ''
      })
    default:
      return state
  }
}
