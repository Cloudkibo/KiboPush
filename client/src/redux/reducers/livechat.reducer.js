import * as ActionTypes from '../constants/constants'

const initialState = {
  socketSession: '',
  socketData: {},
  userChat: [],
  openSessions: [],
  closeSessions: []
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
      let openSessions = state.openSessions
      let closeSessions = state.closeSessions
      if (action.appendDeleteInfo.deleteFrom === 'open') {
        for (let i = 0; i < openSessions.length; i++) {
          if (action.session._id === openSessions[i]._id) {
            openSessions.splice(i, 1)
          }
        }
      } else if (action.appendDeleteInfo.deleteFrom === 'close') {
        for (let i = 0; i < closeSessions.length; i++) {
          if (action.session._id === closeSessions[i]._id) {
            closeSessions.splice(i, 1)
          }
        }
      }
      if (action.appendDeleteInfo.appendTo === 'open') {
        let openCount = 0
        for (let j = 0; j < openSessions.length; j++) {
          if (action.session._id === openSessions[j]._id) {
            openCount = 1
          }
        }
        if (openCount === 0) {
          openSessions.push(action.session)
        }
      } else if (action.appendDeleteInfo.appendTo === 'close') {
        let closeCount = 0
        for (let j = 0; j < closeSessions.length; j++) {
          if (action.session._id === closeSessions[j]._id) {
            closeCount = 1
          }
        }
        if (closeCount === 0) {
          closeSessions.push(action.session)
        }
      }
      openSessions = openSessions.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      closeSessions = closeSessions.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      return Object.assign({}, state, {
        openSessions: openSessions,
        closeSessions: closeSessions
      })

    case ActionTypes.SHOW_USER_CHAT:
      return Object.assign({}, state, {
        userChat: action.userChat,
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

    default:
      return state
  }
}
