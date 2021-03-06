import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

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

export function UpdateUnreadCount (data) {
  return {
    type: ActionTypes.UPDATE_UNREAD_COUNT_WHATSAPP,
    data
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
export function socketUpdateWhatsAppSeen (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_WHATSAPP_SEEN,
    data
  }
}
export function socketUpdateWhatsApp (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_WHATSAPP,
    data
  }
}
export function resetSocket (data) {
  return {
    type: ActionTypes.RESET_SOCKET_WHATSAPP,
    data: null
  }
}

export function updateWhatsappChatInfo (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPPCHAT_INFO,
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

export function showOpenSessions (sessions, data) {
  console.log('data', data)
  let openSessions = sessions.openSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    return s
  })

  if (data.first_page) {
    return {
      type: ActionTypes.SHOW_OPEN_WHATSAPP_SESSIONS_OVERWRITE,
      openSessions,
      openCount: sessions.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS,
      openSessions,
      openCount: sessions.count
    }
  }
}
export function showCloseChatSessions (sessions,data) {
  let closeSessions = sessions.closedSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    return s
  })

  if (data.first_page) {
    return {
      type: ActionTypes.SHOW_CLOSE_WHATSAPP_SESSIONS_OVERWRITE,
      closeSessions,
      closeCount: sessions.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS,
      closeSessions,
      closeCount: sessions.count
    }
  }
}

export function fetchOpenSessions (data) {
  console.log('data for fetchOpenSessions', data)
  return (dispatch) => {
    callApi('whatsAppSessions/getOpenSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showOpenSessions(res.payload, data))
      })
  }
}
export function fetchCloseSessions (data) {
  console.log('data for fetchCloseSessions', data)
  return (dispatch) => {
    callApi('whatsAppSessions/getClosedSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showCloseChatSessions(res.payload, data))
      })
  }
}

export function fetchUserChats (id, data,searchMessageId,handleScroll) {
  console.log('data for fetchChat', data)
  return (dispatch) => {
    callApi(`whatsAppChat/getChat/${id}`, 'post', data)
      .then(res => {
        dispatch(showChat(res.payload, data))
        if (handleScroll) {
          if (searchMessageId) {
            handleScroll(searchMessageId)
          } else {
            var chats = res.payload.chat
            if (chats.length > 0) {
              handleScroll(chats[chats.length - 1]._id)
            }
          }
        }
      })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`whatsAppSessions/markread/${sessionid}`).then(res => {
      console.log('Mark as read Response', res)
      dispatch(UpdateUnreadCount(sessionid))
    })
  }
}

export function sendChatMessage (data, callback) {
  console.log('data for sendChatMessage', data)
  return (dispatch) => {
    callApi('whatsAppChat', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
        if (res.status === 'success') {
        console.log('response from sendChatMessage', res)
        console.log('response from fetchChat', res)
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
        dispatch(fetchUserChats(data.contactId, {page: 'first', number: 25})) 
      }
    })
  }
}
export function sendAttachment (data, handleSendAttachment) {
  return (dispatch) => {
    callApi('whatsAppChat', 'post', data).then(res => {
      handleSendAttachment(res)
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
      dispatch(fetchUserChats(data.contactId, {page: 'first', number: 25}))
    })
  }
}

export function createNewContact (data, callback) {
  return (dispatch) => {
    callApi(`whatsAppContacts/create`, 'post', data).then(res => {
      console.log('response from create whatsapp contact', res)
      if (callback) {
        callback(res)
      }
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
export function assignToAgent (data, handleResponse) {
  return (dispatch) => {
    callApi('whatsAppSessions/assignAgent', 'post', data).then(res => {
      console.log('assign to agent response', res)
      if (handleResponse) {
        handleResponse(res)
      }
      dispatch(updateSessions(data))
    })
  }
}

export function assignToTeam (data, handleResponse) {
  console.log('data for assigned to team', data)
  return (dispatch) => {
    callApi('whatsAppSessions/assignTeam', 'post', data).then(res => {
      console.log('assign to team response', res)
      if (handleResponse) {
        handleResponse(res)
      }
      dispatch(updateSessions(data))
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

export function sendNotifications (data) {
  return (dispatch) => {
    callApi('notifications/create', 'post', data).then(res => {})
  }
}

export function searchChat(data) {
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
export function changeStatus (data, handleStatus) {
  return (dispatch) => {
    callApi('whatsAppSessions/changeStatus', 'post', data).then(res => {
      handleStatus(res)
    })
  }
}

export function updatePendingResponse (data, handlePendingResponse) {
  return (dispatch) => {
    callApi(`whatsAppSessions/updatePendingResponse`, 'post', data).then(res => {
      handlePendingResponse(res)
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

export function updatePauseChatbot (payload, handleResponse) {
  console.log('data for updatePauseChatbot', payload)
  return (dispatch) => {
    callApi('whatsAppSessions/updatePauseChatbot', 'post', payload).then(res => {
        handleResponse(res)
        if (res.status === 'success') {
          dispatch(updateSessions(payload))
        }
    })
  }
}
