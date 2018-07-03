import * as ActionTypes from '../constants/constants'

const initialState = {
  socketSession: '',
  socketData: {},
  userChat: [],
  openSessions: [],
  closeSessions: [],
  openCount: 0,
  closeCount: 0
}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        openSessions: state.openSessions.concat(action.openSessions),
        count: action.count
      })
      // return Object.assign({}, state, {
      //   sessions: action.sessions
      // })

    case ActionTypes.SHOW_OPEN_CHAT_SESSIONS_OVERWRITE:
      return Object.assign({}, state, {
        openSessions: action.openSessions,
        openCount: action.count
      })

    case ActionTypes.SHOW_OPEN_CHAT_SESSIONS:
      return Object.assign({}, state, {
        openSessions: [...state.openSessions, ...action.openSessions],
        openCount: action.count
      })

    case ActionTypes.SHOW_CLOSE_CHAT_SESSIONS:
      return Object.assign({}, state, {
        closeSessions: [...state.closeSessions, ...action.closeSessions],
        closeCount: action.count
      })

    case ActionTypes.SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE:
      return Object.assign({}, state, {
        closeSessions: action.closeSessions,
        count: action.count
      })

    case ActionTypes.UPDATE_CHAT_SESSIONS:
      let openSess = state.openSessions
      let closeSess = state.closeSessions
      if (action.appendDeleteInfo.deleteFrom === 'open') {
        for (let i = 0; i < openSess.length; i++) {
          if (action.session._id === openSess[i]._id) {
            openSess.splice(i, 1)
          }
        }
      } else if (action.appendDeleteInfo.deleteFrom === 'close') {
        for (let i = 0; i < closeSess.length; i++) {
          if (action.session._id === closeSess[i]._id) {
            closeSess.splice(i, 1)
          }
        }
      }
      if (action.appendDeleteInfo.appendTo === 'open') {
        let openCount = 0
        for (let j = 0; j < openSess.length; j++) {
          if (action.session._id === openSess[j]._id) {
            openCount = 1
          }
        }
        if (openCount === 0) {
          openSess.push(action.session)
        }
      } else if (action.appendDeleteInfo.appendTo === 'close') {
        let closeCount = 0
        for (let j = 0; j < closeSess.length; j++) {
          if (action.session._id === closeSess[j]._id) {
            closeCount = 1
          }
        }
        if (closeCount === 0) {
          closeSess.push(action.session)
        }
      }
      openSess = openSess.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      closeSess = closeSess.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      return Object.assign({}, state, {
        openSessions: openSess,
        closeSessions: closeSess,
        openCount: action.appendDeleteInfo.appendTo === 'open'
                    ? (state.openCount + 1) : action.appendDeleteInfo.deleteFrom === 'open'
                    ? (state.openCount - 1) : state.openCount,
        closeCount: action.appendDeleteInfo.appendTo === 'close'
                    ? (state.closeCount + 1) : action.appendDeleteInfo.deleteFrom === 'close'
                    ? (state.closeCount - 1) : state.closeCount
      })

    case ActionTypes.SHOW_USER_CHAT_OVERWRITE:
      return Object.assign({}, state, {
        userChat: action.userChat,
        chatCount: action.chatCount,
        changedStatus: ''
      })

    case ActionTypes.SHOW_USER_CHAT:
      let chat = [...state.userChat, ...action.userChat]
      let orderedChat = chat.sort(function (a, b) {
        return new Date(a.datetime) - new Date(b.datetime)
      })
      return Object.assign({}, state, {
        userChat: orderedChat,
        chatCount: action.chatCount,
        changedStatus: ''
      })

    case ActionTypes.SOCKET_UPDATE:
      return Object.assign({}, state, {
        socketSession: action.data.session_id,
        unreadSession: action.data.session_id,
        socketData: action.data,
        changedStatus: ''
      })

    case ActionTypes.SOCKET_UPDATE_SEEN:
      return Object.assign({}, state, {
        socketSession: action.data.session_id
      })

    case ActionTypes.RESET_SOCKET:
      return Object.assign({}, state, {
        socketSession: '',
        changedStatus: ''
      })

    case ActionTypes.SET_ACTIVE_SESSION:
      return Object.assign({}, state, {
        activeSession: action.activeSession
      })

    case ActionTypes.RESET_ACTIVE_SESSION:
      return Object.assign({}, state, {
        activeSession: ''
      })

    case ActionTypes.RESET_UNREAD_SESSION:
      return Object.assign({}, state, {
        unreadSession: '',
        changedStatus: ''
      })

    case ActionTypes.LOADING_URL_META:
      return Object.assign({}, state, {
        urlValue: action.urlValue,
        loadingUrl: action.loadingUrl,
        changedStatus: ''
      })

    case ActionTypes.GET_URL_META:
      return Object.assign({}, state, {
        urlMeta: action.urlMeta,
        loadingUrl: action.loadingUrl,
        changedStatus: ''
      })
    case ActionTypes.CHANGE_STATUS:
      return Object.assign({}, state, {
        changedStatus: action.data
      })
    case ActionTypes.SHOW_SEARCH_CHAT:
      return Object.assign({}, state, {
        searchChat: action.data
      })

    default:
      return state
  }
}
