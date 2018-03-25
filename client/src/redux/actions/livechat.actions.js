import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'
export const API_URL = '/api'
// import store from '../store/store'

export function showChatSessions (sessions) {
  var sorted = sessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  console.log('sorted sessions', sorted)
  return {
    type: ActionTypes.SHOW_CHAT_SESSIONS,
    sessions: sorted
  }
}

export function updateChatSessions (session, sessions) {
  var temp = sessions
  for (var i = 0; i < temp.length; i++) {
    if (temp[i]._id === session._id) {
      temp[i] = session
    }
  }
  return {
    type: ActionTypes.UPDATE_CHAT_SESSIONS,
    sessions
  }
}

export function socketUpdate (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE,
    data
  }
}

export function showUserChats (userChat) {
  return {
    type: ActionTypes.SHOW_USER_CHAT,
    userChat
  }
}

export function resetSocket () {
  return {
    type: ActionTypes.RESET_SOCKET
  }
}

export function resetUnreadSession () {
  return {
    type: ActionTypes.RESET_UNREAD_SESSION
  }
}

export function loadingUrlMeta (url) {
  return {
    type: ActionTypes.LOADING_URL_META,
    urlValue: url,
    loadingUrl: true
  }
}

export function urlMetaReceived (meta) {
  return {
    type: ActionTypes.GET_URL_META,
    urlMeta: meta,
    loadingUrl: false
  }
}

export function fetchSessions (companyid) {
  return (dispatch) => {
    callApi('sessions', 'post', companyid)
      .then(res => dispatch(showChatSessions(res.payload)))
  }
}

export function fetchSingleSession (sessionid, sessions) {
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => dispatch(updateChatSessions(res.payload, sessions)))
  }
}

export function fetchUserChats (sessionid) {
  return (dispatch) => {
    callApi(`livechat/${sessionid}`)
      .then(res => dispatch(showUserChats(res.payload)))
  }
}

export function uploadAttachment (fileData, handleUpload) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/upload`, {
      method: 'post',
      body: fileData,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('respone', res)
      handleUpload(res)
    })
  }
}

export function deletefile (data, handleRemove) {
  return (dispatch) => {
    callApi(`broadcasts/delete/${data}`)
      .then(res => {
        handleRemove(res)
      })
  }
}

export function sendAttachment (data, handleSendAttachment) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      handleSendAttachment(res)
    })
  }
}

export function sendChatMessage (data, companyId) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      dispatch(fetchSessions(companyId))
    })
  }
}

export function fetchUrlMeta (url) {
  return (dispatch) => {
    dispatch(loadingUrlMeta(url))
    callApi('livechat/geturlmeta', 'post', {url: url}).then(res => {
      console.log('Fetch Url Meta Response', res)
      if (res.status === 'success') {
        dispatch(urlMetaReceived(res.payload))
      } else {
        dispatch(urlMetaReceived({}))
      }
    })
  }
}

export function markRead (sessionid, sessions) {
  return (dispatch) => {
    callApi(`sessions/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
    })
  }
}
