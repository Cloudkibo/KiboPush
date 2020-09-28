
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import auth from '../../utility/auth.service'

import { clearSubscriberTags } from '../../redux/actions/tags.actions'
import { clearCustomFieldValues } from '../../redux/actions/customFields.actions'

export const API_URL = '/api'

export function updateSessionProfilePicture(subscriber, profilePic) {
  console.log('updateActiveSessionPicture called')
  return {
    type: ActionTypes.UPDATE_SESSION_PROFILE_PICTURE,
    subscriber,
    profilePic
  }
}

export function unsubscribeSubscriber(subscriberId) {
  return {
    type: ActionTypes.UNSUBSCRIBE_SUBSCRIBER,
    data: {
      subscriberId
    }
  }
}

export function saveNotificationSessionId(data) {
  return {
    type: ActionTypes.REDIRECT_TO_SESSION,
    data: data
  }
}

export function clearUserChat() {
  console.log('clearUserChat called')
  return {
    type: ActionTypes.CLEAR_USER_CHAT
  }
}

export function handleCustomers(customers) {
  console.log('handleCustomers called: ', customers)
  return {
    type: ActionTypes.SHOW_CUSTOMERS,
    data: customers
  }
}

export function updateLiveChatInfo(data) {
  return {
    type: ActionTypes.UPDATE_LIVECHAT_INFO,
    data
  }
}

export function updateSessions(data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS,
    data
  }
}

export function updateSessionsData(session, customerId) {
  if (session.status === 'new') {
    return {
      type: ActionTypes.UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID,
      data: session,
      customerId
    }
  } else {
    return {
      type: ActionTypes.UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID,
      data: session,
      customerId
    }
  }
}

export function showChatSessions(sessions) {
  var subscribers = sessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  var sorted = subscribers.sort(function (a, b) {
    return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  })
  console.log('sorted sessions', sorted)
  return {
    type: ActionTypes.SHOW_CHAT_SESSIONS,
    sessions: sorted
  }
}

export function updateUserChat(message) {
  console.log('updateUserChat called', message)
  return {
    type: ActionTypes.UPDATE_USER_CHAT,
    chat: message
  }
}

export function showOpenChatSessions(sessions, data) {
  var subscribers = sessions.openSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  // var sorted = subscribers.sort(function (a, b) {
  //   return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  // })
  if (data.first_page && (data.page_value !== '' || data.search_value !== '')) {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS_OVERWRITE,
      openSessions: subscribers,
      count: sessions.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS,
      openSessions: subscribers,
      count: sessions.count
    }
  }
}

export function showCloseChatSessions(sessions, firstPage) {
  var subscribers = sessions.closedSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  // var sorted = subscribers.sort(function (a, b) {
  //   return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  // })
  if (firstPage) {
    return {
      type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE,
      closeSessions: subscribers,
      count: sessions.count
    }
  }
  return {
    type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS,
    closeSessions: subscribers,
    count: sessions.count
  }
}
export function updateChatSessions(session, appendDeleteInfo) {
  session.name = `${session.firstName} ${session.lastName}`
  return {
    type: ActionTypes.UPDATE_CHAT_SESSIONS,
    session,
    appendDeleteInfo
  }
}

export function socketUpdate(data) {
  return {
    type: ActionTypes.SOCKET_UPDATE,
    data
  }
}

export function socketUpdateSeen(data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_SEEN,
    data
  }
}

export function setActiveSession(sessionId) {
  return {
    type: ActionTypes.SET_ACTIVE_SESSION,
    activeSession: sessionId
  }
}

export function clearSearchResult() {
  return {
    type: ActionTypes.CLEAR_SEARCH_RESULT
  }
}

export function showUserChats(payload, originalData, count) {
  console.log('showUserChats response', payload)
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.SHOW_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: count
    }
  } else {
    return {
      type: ActionTypes.SHOW_USER_CHAT,
      userChat: payload.chat,
      chatCount: count
    }
  }
}

export function updateAllChat(payload, originalData, sessionId) {
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.ALL_CHAT_OVERWRITE,
      userChat: payload.chat,
      sessionId
    }
  } else {
    return {
      type: ActionTypes.ALL_CHAT_UPDATE,
      userChat: payload.chat,
      sessionId
    }
  }
}

export function resetSocket() {
  return {
    type: ActionTypes.RESET_SOCKET
  }
}

export function setUserChat(sessionId, count) {
  return {
    type: ActionTypes.SET_USER_CHAT,
    sessionId,
    count
  }
}

export function resetActiveSession() {
  return {
    type: ActionTypes.RESET_ACTIVE_SESSION
  }
}

export function resetUnreadSession() {
  return {
    type: ActionTypes.RESET_UNREAD_SESSION
  }
}

export function loadingUrlMeta(url) {
  return {
    type: ActionTypes.LOADING_URL_META,
    urlValue: url,
    loadingUrl: true
  }
}

export function urlMetaReceived(meta) {
  return {
    type: ActionTypes.GET_URL_META,
    urlMeta: meta,
    loadingUrl: false
  }
}

export function showChangeStatus(data) {
  return {
    type: ActionTypes.CHANGE_STATUS,
    data
  }
}

export function showSearchChat(data) {
  return {
    type: ActionTypes.SHOW_SEARCH_CHAT,
    data
  }
}

export function emptySocketData() {
  console.log('emptySocketData')
  return {
    type: ActionTypes.EMPTY_SOCKET_DATA
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

export function clearData() {
  console.log('livechat clearData')
  return (dispatch) => {
    dispatch(clearUserChat())
    dispatch(clearCustomFieldValues())
    dispatch(clearSearchResult())
    dispatch(clearSubscriberTags())
  }
}

export function fetchOpenSessions(data) {
  console.log('fetchOpenSessions data', data)
  return (dispatch) => {
    callApi('sessions/getOpenSessions', 'post', data)
      .then(res => {
        console.log('fetchOpenSessions response', res)
        dispatch(showOpenChatSessions(res.payload, data))
      })
  }
}

export function fetchCloseSessions(data) {
  console.log('fetchCloseSessions data', data)
  return (dispatch) => {
    callApi('sessions/getClosedSessions', 'post', data)
      .then(res => {
        console.log('fetchCloseSessions response', res)
        dispatch(showCloseChatSessions(res.payload, data.first_page))
      })
  }
}

export function fetchSingleSession(sessionid, appendDeleteInfo) {
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => {
        console.log('response from fetchSingleSession', res)
        dispatch(updateChatSessions(res.payload, appendDeleteInfo))
      })
  }
}

export function fetchUserChats(sessionid, data, count, handleFunction) {
  return (dispatch) => {
    callApi(`livechat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(updateAllChat(res.payload, data, sessionid))
        dispatch(showUserChats(res.payload, data, count))
        if (handleFunction) {
          handleFunction(data.messageId)
        }
      })
  }
}
export function uploadRecording(fileData, handleUpload) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/uploadRecording`, {
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

export function uploadAttachment(fileData, handleUpload) {
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

export function deletefile(data, handleRemove) {
  return (dispatch) => {
    callApi(`broadcasts/delete/${data}`)
      .then(res => {
        if (handleRemove) {
          handleRemove(res)
        }
      })
  }
}

export function sendAttachment(data, handleSendAttachment) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      console.log('sendAttachment response', res)
      handleSendAttachment(res)
    })
  }
}

export function searchChat(data) {
  return (dispatch) => {
    callApi('livechat/search', 'post', data).then(res => {
      if (res.status === 'success') {
        console.log('searchChat results', res.payload)
        dispatch(showSearchChat(res.payload))
      } else {
        console.log('response got from server', res.description)
      }
    })
  }
}

export function sendChatMessage (data, cb) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      console.log('response from sendChatMessage', res)
      if (cb) cb(res)
      // dispatch(fetchSessions())
      //fetchOpenSessions({first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: {sort_value: -1, page_value: '', search_value: ''}})
    })
  }
}

export function getSMPStatus(callback) {
  return (dispatch) => {
    callApi('livechat/SMPStatus').then(res => {
      console.log('getSMPStatus Response', res)
      callback(res)
    })
  }
}

export function fetchUrlMeta(url) {
  return (dispatch) => {
    dispatch(loadingUrlMeta(url))
    callApi('livechat/geturlmeta', 'post', { url: url }).then(res => {
      console.log('Fetch Url Meta Response', res)
      if (res.status === 'success') {
        dispatch(urlMetaReceived(res.payload))
      } else {
        dispatch(urlMetaReceived({}))
      }
    })
  }
}

export function markRead(sessionid) {
  return (dispatch) => {
    callApi(`sessions/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
    })
  }
}

export function updatePendingResponse(data, callback) {
  return (dispatch) => {
    callApi(`sessions/updatePendingResponse`, 'post', data).then(res => {
      console.log('response from updatePendingSession', res)
      if (callback) callback(res)
    })
  }
}

export function changeStatus(data, handleActiveSession) {
  console.log('changeStatus called')
  return (dispatch) => {
    callApi('sessions/changeStatus', 'post', data).then(res => {
      handleActiveSession(res)
    })
  }
}

export function unSubscribe(data, handleUnsubscribe) {
  return (dispatch) => {
    callApi('subscribers/unSubscribe', 'post', data).then(res => {
      if (handleUnsubscribe) {
        handleUnsubscribe(res)
      }
      dispatch(unsubscribeSubscriber(data.subscriber_id))
    })
  }
}

export function assignToAgent(data, handleResponse) {
  return (dispatch) => {
    callApi('sessions/assignAgent', 'post', data).then(res => {
      console.log('assign to agent response', res)
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function sendNotifications(data) {
  console.log('data for notifications', data)
  return (dispatch) => {
    callApi('notifications/create', 'post', data).then(res => {
      console.log('response from notifications', res)
    })
  }
}

export function assignToTeam(data, handleResponse) {
  console.log('data for assigned to team', data)
  return (dispatch) => {
    callApi('sessions/assignTeam', 'post', data).then(res => {
      console.log('assign to team response', res)
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function fetchTeamAgents(id, handleAgents, type) {
  return (dispatch) => {
    callApi(`teams/fetchAgents/${id}`)
      .then(res => {
        if (res.status === 'success') {
          handleAgents(res.payload, type)
        }
      })
  }
}

export function getCustomers() {
  console.log('getCustomers called')
  return (dispatch) => {
    callApi(`demoApp/getCustomers`)
      .then(res => {
        if (res.status === 'success') {
          console.log(res.payload)
          dispatch(handleCustomers(res.payload))
        } else {
          console.log('ERROR: ', res.payload)
        }
      })
  }
}

export function appendSubscriber(data, session, msg) {
  console.log('appendSubscriber called', data)
  return (dispatch) => {
    callApi(`demoApp/appendSubscriber`, 'post', data)
      .then(res => {
        console.log('response for appendSubscriber: ', res)
        if (res.status === 'success') {
          dispatch(updateSessionsData(session, data.customerId))
          msg.success('Subscriber attached successfully!')
        } else {
          msg.error('Failed to attach subscriber!')
        }
      })
  }
}
