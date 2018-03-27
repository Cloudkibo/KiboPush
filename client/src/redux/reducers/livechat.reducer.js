import * as ActionTypes from '../constants/constants'

const initialState = {
  socketSession: '',
  socketData: {},
  userChat: []
}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions
      })

    case ActionTypes.UPDATE_CHAT_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions,
        changedStatus: ''
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

    case ActionTypes.RESET_SOCKET:
      return Object.assign({}, state, {
        socketSession: '',
        changedStatus: ''
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
