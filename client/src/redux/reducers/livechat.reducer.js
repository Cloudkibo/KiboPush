import * as ActionTypes from '../constants/constants'

const initialState = {
  sessions: [],
  socketSession: '',
}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CHAT_SESSIONS:
      return Object.assign({}, state, {
        sessions: action.sessions
      })

    case ActionTypes.SHOW_USER_CHAT:
      return Object.assign({}, state, {
        userChat: action.userChat
      })
    
    case ActionTypes.SOCKET_UPDATE:
      return Object.assign({}, state, {
        socketSession: action.data.session_id
      })

    default:
      return state
  }
}
