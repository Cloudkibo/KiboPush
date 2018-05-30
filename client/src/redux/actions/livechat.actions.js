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

export function showOpenChatSessions (sessions, data) {
  var sorted = sessions.openSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  console.log('sorted sessions', sorted)
  if (data.first_page && (data.page_value !== '' || data.search_value !== '')) {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS_OVERWRITE,
      openSessions: sorted,
      count: sessions.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS,
      openSessions: sorted,
      count: sessions.count
    }
  }
}

export function showCloseChatSessions (sessions, firstPage) {
  var sorted = sessions.closedSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  console.log('sorted sessions', sorted)
  if (firstPage) {
    return {
      type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE,
      closeSessions: sorted,
      count: sessions.count
    }
  }
  return {
    type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS,
    closeSessions: sorted,
    count: sessions.count
  }
}
export function updateChatSessions (session, sessions, status) {
  let openSessions = sessions.openSessions
  let closeSessions = sessions.closeSessions
  if (status === 'resolved') {
    closeSessions.push(session)
    for (let i = 0; i < openSessions.length; i++) {
      if (session._id === openSessions[i]._id) {
        openSessions.splice(i, 1)
      }
    }
    openSessions = openSessions.sort(function (a, b) {
      return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    })
  } else {
    openSessions.push(session)
    for (let i = 0; i < closeSessions.length; i++) {
      if (session._id === closeSessions[i]._id) {
        closeSessions.splice(i, 1)
      }
    }
    closeSessions = closeSessions.sort(function (a, b) {
      return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    })
  }

  return {
    type: ActionTypes.UPDATE_CHAT_SESSIONS,
    openSessions,
    closeSessions
  }
}

export function socketUpdate (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE,
    data
  }
}

export function socketUpdateSeen (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_SEEN,
    data
  }
}

export function setActiveSession (sessionId) {
  return {
    type: ActionTypes.SET_ACTIVE_SESSION,
    activeSession: sessionId
  }
}

export function showUserChats (userChat) {
  console.log('showUserChats response', userChat)
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

export function resetActiveSession () {
  return {
    type: ActionTypes.RESET_ACTIVE_SESSION
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

export function showChangeStatus (data) {
  return {
    type: ActionTypes.CHANGE_STATUS,
    data
  }
}

export function fetchSessions () {
  return (dispatch) => {
    callApi('sessions')
      .then(res => {
        console.log('fetchSessions response', res)
        dispatch(showChatSessions(res.payload))
      })
  }
}

export function fetchOpenSessions (data) {
  console.log('fetchOpenSessions data', data)
  return (dispatch) => {
    callApi('sessions/getOpenSessions', 'post', data)
      .then(res => {
        console.log('fetchOpenSessions response', res)
        dispatch(showOpenChatSessions(res.payload, data))
      })
  }
}

export function fetchCloseSessions (data) {
  console.log('fetchCloseSessions data', data)
  return (dispatch) => {
    callApi('sessions/getClosedSessions', 'post', data)
      .then(res => {
        console.log('fetchCloseSessions response', res)
        dispatch(showCloseChatSessions(res.payload, data.first_page))
      })
  }
}

export function fetchSingleSession (sessionid, sessions, status) {
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => dispatch(updateChatSessions(res.payload, sessions, status)))
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

export function sendChatMessage (data) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      dispatch(fetchSessions())
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

export function changeStatus (data, sessions, handleActiveSession) {
  console.log('changeStatus called')
  return (dispatch) => {
    callApi('sessions/changeStatus', 'post', data).then(res => {
      // dispatch(fetchSingleSession(data._id, sessions, data.status))
      handleActiveSession()
    })
  }
}

export function unSubscribe (data) {
  return (dispatch) => {
    callApi('sessions/unSubscribe', 'post', data).then(res => {
      dispatch(fetchSessions())
    })
  }
}

export function assignToAgent (data) {
  return (dispatch) => {
    callApi('sessions/assignAgent', 'post', data).then(res => {
      dispatch(fetchSessions())
    })
  }
}

export function sendNotifications (data) {
  return (dispatch) => {
    callApi('notifications/create', 'post', data).then(res => {})
  }
}

export function assignToTeam (data) {
  console.log('data for assigned to team', data)
  return (dispatch) => {
    callApi('sessions/assignTeam', 'post', data).then(res => {
      dispatch(fetchSessions())
    })
  }
}

export function fetchTeamAgents (id, handleAgents) {
  return (dispatch) => {
    callApi(`teams/fetchAgents/${id}`)
      .then(res => {
        if (res.status === 'success') {
          handleAgents(res.payload)
        }
      })
  }
}
