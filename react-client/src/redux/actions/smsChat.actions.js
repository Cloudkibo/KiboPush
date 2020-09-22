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

export function updateSmsChatInfo (data) {
  return {
    type: ActionTypes.UPDATE_SMSCHAT_INFO,
    data
  }
}
export function UpdateUnreadCount (data) {
  return {
    type: ActionTypes.UPDATE_UNREAD_COUNT,
    data
  }
}
export function updateSessions (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_SMS,
    data
  }
}

export function showTwilioNumbers (data) {
  console.log('data in showTwilioNumbers', data)
  return {
    type: ActionTypes.LOAD_TWILIO_NUMBERS,
    twilioNumbers: data
  }
}

export function loadTwilioNumbers () {
  return (dispatch) => {
    callApi('smsSessions/getTwilioNumbers')
      .then(res => {
        console.log('response from loadTwilioNumbers', res)
        dispatch(showTwilioNumbers(res.payload))
      })
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

export function assignToAgent (data, handleResponse) {
  return (dispatch) => {
    callApi('smsSessions/assignAgent', 'post', data).then(res => {
      console.log('assign to agent response', res)
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function assignToTeam (data, handleResponse) {
  console.log('data for assigned to team', data)
  return (dispatch) => {
    callApi('smsSessions/assignTeam', 'post', data).then(res => {
      console.log('assign to team response', res)
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
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

export function showUserChats (payload, originalData, count) {
  console.log('showUserChats response', payload)
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.SHOW_SMS_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: count
    }
  } else {
    return {
      type: ActionTypes.SHOW_SMS_USER_CHAT,
      userChat: payload.chat,
      chatCount: count
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
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
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
    type: ActionTypes.SHOW_SMS_CLOSE_CHAT_SESSIONS,
    closeSessions: subscribers,
    count: sessions.count
  }
}

export function showOpenChatSessions (sessions, data) {
  var subscribers = sessions.openSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
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
      type: ActionTypes.SHOW_SMS_OPEN_CHAT_SESSIONS,
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

export function fetchUserChats (sessionid, data, count, handleFunction) {
  return (dispatch) => {
    callApi(`smsChat/getChat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(showUserChats(res.payload, data, count))
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
      dispatch(UpdateUnreadCount(sessionid))
    })
  }
}

export function sendChatMessage (data, callback) {
  console.log('data for sendChatMessage', data)
  return (dispatch) => {
    callApi('smsChat', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
        console.log('response from sendChatMessage', res)
        // dispatch(fetchChat(data.contactId))
      })
  }
}
export function updatePendingResponse (data, callback) {
  return (dispatch) => {
    callApi(`smsSessions/updatePendingResponse`, 'post', data).then(res => {
      console.log('response from updatePendingSession', res)
      if (callback) callback(res)
    })
  }
}

export function changeStatus (data, handleActiveSession) {
  console.log('changeStatus called')
  return (dispatch) => {
    callApi('smsSessions/changeStatus', 'post', data).then(res => {
      handleActiveSession(changeStatus)
    })
  }
}
