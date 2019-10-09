import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showChat (data, originalData) {
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CHAT_OVERWRITE,
      chat: data.chat,
      count: data.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CHAT,
      chat: data.chat,
      count: data.count
    }
  }
}

export function showSearchChat (data) {
  return {
    type: ActionTypes.SHOW_SEARCH_WHATSAPP,
    data
  }
}
export function clearSearchResult () {
  return {
    type: ActionTypes.CLEAR_SEARCH_WHATSAPP
  }
}
export function socketUpdateWhatsApp (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_WHATSAPP,
    data
  }
}

export function updateChat (chat, newChat) {
  let chatData = []
  chatData = chat
  chatData.push(newChat)
  console.log('newChat', newChat)
  console.log('chatData', chatData)
  return {
    type: ActionTypes.UPDATE_WHATSAPP_CHAT,
    chat: chatData
  }
}

export function showOpenSessions (data) {
  return {
    type: ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS,
    openSessions: data.openSessions,
    openCount: data.count
  }
}
export function showCloseChatSessions (data) {
  return {
    type: ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS,
    closeSessions: data.closedSessions,
    closeCount: data.count
  }
}
export function fetchOpenSessions (data) {
  console.log('data for fetchOpenSessions', data)
  return (dispatch) => {
    callApi('whatsAppChat/getOpenSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showOpenSessions(res.payload))
      })
  }
}
export function fetchCloseSessions (data) {
  console.log('data for fetchCloseSessions', data)
  return (dispatch) => {
    callApi('whatsAppChat/getClosedSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showCloseChatSessions(res.payload, data.first_page))
      })
  }
}

export function fetchChat (id, data) {
  console.log('data for fetchChat', data)
  return (dispatch) => {
    callApi(`whatsAppChat/getChat/${id}`, 'post', data)
      .then(res => {
        console.log('response from fetchChat', res)
        dispatch(showChat(res.payload, data))
      })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`whatsAppChat/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
    })
  }
}

export function sendChatMessage (data) {
  console.log('data for sendChatMessage', data)
  return (dispatch) => {
    callApi('whatsAppChat', 'post', data)
      .then(res => {
        console.log('response from sendChatMessage', res)
        dispatch(fetchChat(data.contactId, {page: 'first', number: 25}))
      })
  }
}
export function sendAttachment (data, handleSendAttachment) {
  return (dispatch) => {
    callApi('whatsAppChat', 'post', data).then(res => {
      handleSendAttachment(res)
    })
  }
}
export function changeStatus (data, handleStatus) {
  return (dispatch) => {
    callApi('whatsAppChat/changeStatus', 'post', data).then(res => {
      handleStatus(res)
    })
  }
}

export function updatePendingResponse (data, handlePendingResponse) {
  return (dispatch) => {
    callApi(`whatsAppChat/updatePendingResponse`, 'post', data).then(res => {
      handlePendingResponse(res)
    })
  }
}
export function unSubscribe (id, data) {
  return (dispatch) => {
    callApi(`whatsAppContacts/update/${id}`, 'post', data).then(res => {
      console.log('respo from unSubscribe', res)
      if (res.status === 'success') {
        let fetchData = {
          filter_criteria: {
            pendingResponse: false,
            search_value: '',
            sort_value: -1,
            unreadCount: false,
          },
          first_page: true,
          last_id: 'none',
          number_of_records: 10,
        }
        dispatch(fetchOpenSessions(fetchData))
        dispatch(fetchCloseSessions(fetchData))
      }
    })
  }
}
export function assignToAgent (data) {
  return (dispatch) => {
    callApi('whatsAppChat/assignAgent', 'post', data).then(res => {
      console.log('assign to agent response', res)
      dispatch(updateSessions(data))
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
    callApi('whatsAppChat/assignTeam', 'post', data).then(res => {
      console.log('assign to team response', res)
      dispatch(updateSessions(data))
    })
  }
}

export function searchWhatsAppChat(data) {
  return (dispatch) => {
    callApi('whatsAppChat/search', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(showSearchChat(res.payload))
      } else {
        console.log('response got from server', res.description)
      }
    })
  }
}

export function updateSessions (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_WHATSAPP,
    data
  }
}
export function setCustomFieldValue (body, handleResponse) {
  return () => {
    callApi('whatsAppChat/set_custom_field_value', 'post', body)
    .then(res => {
      handleResponse(res, body)
    })
  }
}
