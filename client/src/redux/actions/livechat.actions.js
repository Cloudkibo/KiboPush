
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

export function updateUserChat (message, chat) {
  console.log('updateUserChat called', message)
  let userChat = chat
  userChat.push(message)
  return {
    type: ActionTypes.UPDATE_USER_CHAT,
    chat: userChat
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
export function updateChatSessions (session, appendDeleteInfo) {
  return {
    type: ActionTypes.UPDATE_CHAT_SESSIONS,
    session,
    appendDeleteInfo
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

export function clearSearchResult () {
  return {
    type: ActionTypes.CLEAR_SEARCH_RESULT
  }
}

export function showUserChats (payload, originalData) {
  console.log('showUserChats response', payload)
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.SHOW_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: payload.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_USER_CHAT,
      userChat: payload.chat,
      chatCount: payload.count
    }
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

export function showSearchChat (data) {
  return {
    type: ActionTypes.SHOW_SEARCH_CHAT,
    data
  }
}

// export function fetchSessions () {
//   return (dispatch) => {
//     callApi('sessions')
//       .then(res => {
//         console.log('fetchSessions response', res)
//         dispatch(showChatSessions(res.payload))
//       })
//   }
// }

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

export function fetchSingleSession (sessionid, appendDeleteInfo) {
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => dispatch(updateChatSessions(res.payload, appendDeleteInfo)))
  }
}

export function fetchUserChats (sessionid, data, handleFunction) {
  return (dispatch) => {
    callApi(`livechat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(showUserChats(res.payload, data))
        if (handleFunction) {
          handleFunction(data.messageId)
        }
      })
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

export function searchChat (data) {
  return (dispatch) => {
    callApi('livechat/search', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(showSearchChat(res.payload))
      } else {
        console.log('response got from server', res.description)
      }
    })
  }
}

export function sendChatMessage (data) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      // dispatch(fetchSessions())
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

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`sessions/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
    })
  }
}

export function changeStatus (data, handleActiveSession) {
  console.log('changeStatus called')
  return (dispatch) => {
    callApi('sessions/changeStatus', 'post', data).then(res => {
      if (data.status === 'new') {
        dispatch(fetchSingleSession(data._id, {appendTo: 'open', deleteFrom: 'close'}))
      } else {
        dispatch(fetchSingleSession(data._id, {appendTo: 'close', deleteFrom: 'open'}))
      }
      handleActiveSession()
    })
  }
}

export function unSubscribe (data) {
  return (dispatch) => {
    callApi('sessions/unSubscribe', 'post', data).then(res => {
      // dispatch(fetchSessions())
    })
  }
}

export function assignToAgent (data) {
  return (dispatch) => {
    callApi('sessions/assignAgent', 'post', data).then(res => {
      // dispatch(fetchSessions())
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
      // dispatch(fetchSessions())
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
