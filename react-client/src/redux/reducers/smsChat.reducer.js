import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: [],
  chatCount: 0
}

export function smsChatInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CLEAR_SEARCH_RESULT_SMS:
      return Object.assign({}, state, {
        searchChat: undefined
      })
    case ActionTypes.SHOW_SEARCH_CHAT_SMS:
      return Object.assign({}, state, {
        searchChat: action.data
      })
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
