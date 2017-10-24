import * as ActionTypes from '../constants/constants'

const initialState = {
  sessions: [],
  socketSession: '',
  userChat: [],
}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions,
        socketSession: ''
      })

    case ActionTypes.SHOW_USER_CHAT:
      return Object.assign({}, state, {
        userChat: action.userChat,
        socketSession: ''
      })
    
    case ActionTypes.SOCKET_UPDATE:
      return Object.assign({}, state, {
        socketSession: action.data.session_id
      })
    
    case ActionTypes.RESET_SOCKET:
      return Object.assign({}, state, {
        socketSession: ''
      })

    case ActionTypes.LOADING_URL_META:
      return Object.assign({}, state, {
        urlValue: action.urlValue,
        loadingUrl: action.loadingUrl
      })

    case ActionTypes.GET_URL_META:
      return Object.assign({}, state, {
        urlMeta: action.urlMeta,
        loadingUrl: action.loadingUrl
      })

    default:
      return state
  }
}
