import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showChatSessions (sessions, status) {
  console.log(sessions)
  console.log(status)
  return {
    type: ActionTypes.SHOW_CHAT_SESSIONS,
    sessions
  }
}

export function fetchSessions (companyid) {
  console.log('Fetching Chat Sessions')
  console.log(companyid)
  return (dispatch) => {
    callApi('sessions', 'post', companyid)
      .then(res => dispatch(showChatSessions(res.payload, res.status)))
  }
}

export function showUserChats (userChat) {
  console.log(userChat)
  return {
    type: ActionTypes.SHOW_USER_CHAT,
    userChat
  }
}

export function fetchUserChats (sessionid) {
  console.log('Fetching User Chats')
  return (dispatch) => {
    callApi(`livechat/${sessionid}`)
      .then(res => dispatch(showUserChats(res.payload)))
  }
}
