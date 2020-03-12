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

export function showChat (data, originalData) {
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.FETCH_CHAT_OVERWRITE,
      chat: data.chat,
      count: data.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_CHAT,
      chat: data.chat,
      count: data.count
    }
  }
}

export function socketUpdateSms (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_SMS,
    data
  }
}

export function showSessions (data) {
  return {
    type: ActionTypes.FETCH_SESSIONS,
    sessions: data.sessions,
    count: data.count
  }
}

export function fetchSessions (data) {
  console.log('data for fetchSessions', data)
  return (dispatch) => {
    callApi('smsChat/getSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showSessions(res.payload))
      })
  }
}

export function fetchChat (id, data) {
  console.log('data for fetchChat', data)
  return (dispatch) => {
    callApi(`smsChat/getChat/${id}`, 'post', data)
      .then(res => {
        console.log('response from fetchChat', res)
        dispatch(showChat(res.payload, data))
      })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`smsChat/markread/${sessionid}`).then(res => {
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
