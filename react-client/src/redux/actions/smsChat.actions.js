import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showSearchChat (data) {
  return {
    type: ActionTypes.SHOW_SEARCH_CHAT_SMS,
    data
  }
}


export function clearSearchResult () {
  return {
    type: ActionTypes.CLEAR_SEARCH_RESULT_SMS
  }
}


export function searchChat (data) {
  return (dispatch) => {
    callApi('smsChat/search', 'post', data).then(res => {
      if (res.status === 'success') {
        console.log('searchChat results', res.payload)
        dispatch(showSearchChat(res.payload))
      } else {
        console.log('response got from server', res.description)
      }
    })
  }
}

export function showUserChats (payload, originalData) {
  console.log('showUserChats response', payload)
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.SHOW_SMS_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: payload.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_SMS_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: payload.count
    }
  }
}

export function socketUpdateSms (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_SMS,
    data
  }
}

export function showCloseChatSessions (sessions, firstPage) {
  var subscribers = sessions.closedSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  if (firstPage) {
    return {
      type: ActionTypes.SHOW_SMS_CLOSE_CHAT_SESSIONS_OVERWRITE,
      closeSessions: subscribers,
      count: sessions.count
    }
  }
  return {
    type: ActionTypes.SHOW_SMS_CLOSE_CHAT_SESSIONS_OVERWRITE,
    closeSessions: subscribers,
    count: sessions.count
  }
}

export function showOpenChatSessions (sessions, data) {
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
      type: ActionTypes.SHOW_SMS_OPEN_CHAT_SESSIONS_OVERWRITE,
      openSessions: subscribers,
      count: sessions.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_SMS_OPEN_CHAT_SESSIONS_OVERWRITE,
      openSessions: subscribers,
      count: sessions.count
    }
  }
}

export function fetchOpenSessions (data) {
  console.log('fetchOpenSessions data', data)
  return (dispatch) => {
    callApi('smsSessions/getOpenSessions', 'post', data)
      .then(res => {
        console.log('fetchOpenSessions response', res)
        dispatch(showOpenChatSessions(res.payload, data))
      })
  }
}

export function fetchCloseSessions (data) {
  console.log('fetchCloseSessions data', data)
  return (dispatch) => {
    callApi('smsSessions/getClosedSessions', 'post', data)
      .then(res => {
        console.log('fetchCloseSessions response', res)
        dispatch(showCloseChatSessions(res.payload, data.first_page))
      })
  }
}

export function fetchUserChats (sessionid, data, handleFunction) {
  return (dispatch) => {
    callApi(`smsChat/getChat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(showUserChats(res.payload, data))
        if (handleFunction) {
          handleFunction(data.messageId)
        }
      })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`smsSessions/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
    })
  }
}

export function sendChatMessage (data) {
  console.log('data for sendChatMessage', data)
  return (dispatch) => {
    callApi('smsChat', 'post', data)
      .then(res => {
        console.log('response from sendChatMessage', res)
        // dispatch(fetchChat(data.contactId))
      })
  }
}
