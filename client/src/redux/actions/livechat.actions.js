import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showChatSessions (sessions) {
  return {
    type: ActionTypes.SHOW_CHAT_SESSIONS,
    sessions
  }
}

export function fetchSessions () {
  console.log('Fetching Chat Sessions')
  return (dispatch) => {
    callApi('sessions', 'post')
      .then(res => dispatch(showChatSessions(res.payload)))
  }
}

export function showUserChats (userChat) {
  return {
    type: ActionTypes.SHOW_USER_CHAT,
    userChat
  }
}

export function fetchUserChats (sessionid) {
  console.log('Fetching User Chats')
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => dispatch(showUserChats(res.payload)))
  }
}
