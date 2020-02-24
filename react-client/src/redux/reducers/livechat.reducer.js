import * as ActionTypes from '../constants/constants'

const initialState = {
  socketSession: '',
  socketData: {},
  userChat: []
}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EMPTY_SOCKET_DATA:
      return Object.assign({}, state, {
        socketData: {}
      })
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        openSessions: state.openSessions.concat(action.openSessions),
        count: action.count
      })

    case ActionTypes.UPDATE_SESSIONS:
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
        openSessions: sessions,
        updateSessionTimeStamp: new Date().toString()
      })

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
        closeCount: action.count
      })

    case ActionTypes.UPDATE_CHAT_SESSIONS:
      let openSess = state.openSessions
      let closeSess = state.closeSessions
      if (action.appendDeleteInfo) {
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
      }

      openSess = openSess.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      closeSess = closeSess.sort(function (a, b) {
        return new Date(b.last_activity_time) - new Date(a.last_activity_time)
      })
      let open = openSess.map(sess => sess._id)
      let indexOpen = open.indexOf(action.session._id)
      if (indexOpen !== -1) {
        openSess[indexOpen].lastPayload = action.session.lastPayload
        openSess[indexOpen].lastDateTime = action.session.lastDateTime
        openSess[indexOpen].last_activity_time = action.session.last_activity_time
        if (action.session.lastRepliedBy) {
          openSess[indexOpen].lastRepliedBy = action.session.lastRepliedBy
        } else if (openSess[indexOpen].lastRepliedBy) {
          openSess[indexOpen].lastRepliedBy = null
        }
      }
      let close = closeSess.map(sess => sess._id)
      let indexClose = close.indexOf(action.session._id)
      if (indexClose !== -1) {
        closeSess[indexClose].lastPayload = action.session.lastPayload
        closeSess[indexClose].lastDateTime = action.session.lastDateTime
        closeSess[indexClose].last_activity_time = action.session.last_activity_time
        if (action.session.lastRepliedBy) {
          openSess[indexClose].lastRepliedBy = action.session.lastRepliedBy
        } else if (closeSess[indexClose].lastRepliedBy) {
          openSess[indexClose].lastRepliedBy = null
        }
      }
      return Object.assign({}, state, {
        openSessions: openSess,
        closeSessions: closeSess,
        openCount: action.appendDeleteInfo ? (action.appendDeleteInfo.appendTo === 'open')
                    ? (state.openCount + 1) : action.appendDeleteInfo.deleteFrom === 'open'
                    ? (state.openCount - 1) : state.openCount : state.openCount,
        closeCount: action.appendDeleteInfo ? action.appendDeleteInfo.appendTo === 'close'
                    ? (state.closeCount + 1) : action.appendDeleteInfo.deleteFrom === 'close'
                    ? (state.closeCount - 1) : state.closeCount : state.closeCount,
        updateSessionTimeStamp: new Date().toString()
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
        socketSession: action.data.subscriber_id,
        unreadSession: action.data.subscriber_id,
        socketData: action.data,
        socketMessage: action.data.message,
        changedStatus: ''
      })

    case ActionTypes.SOCKET_UPDATE_SEEN:
      return Object.assign({}, state, {
        socketSession: action.data.session_id
      })

    case ActionTypes.UPDATE_USER_CHAT:
      let newChat = state.userChat
      newChat.push(action.chat)
      return Object.assign({}, state, {
        userChat: newChat,
        socketData: state.socketData
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
    case ActionTypes.CLEAR_SEARCH_RESULT:
      return Object.assign({}, state, {
        searchChat: undefined
      })

    case ActionTypes.SHOW_CUSTOMERS:
      console.log('action.customers', action.customers)
      return Object.assign({}, state, {
        customers: action.data
      })

    case ActionTypes.UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID:
      let tempOpen = state.openSessions
      for (let i = 0; i < tempOpen.length; i++) {
        if (tempOpen[i]._id === action.data._id) {
          tempOpen[i].customerId = action.customerId
          break
        }
      }
      return Object.assign({}, state, {
        openSessions: tempOpen
      })

    case ActionTypes.UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID:
      let tempClose = state.closeSessions
      for (let i = 0; i < tempClose.length; i++) {
        if (tempClose[i]._id === action.data._id) {
          tempClose[i].customerId = action.customerId
          break
        }
      }
      return Object.assign({}, state, {
        openSessions: tempClose
      })

    default:
      return state
  }
}
