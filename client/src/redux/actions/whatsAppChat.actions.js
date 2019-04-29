import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showChat (data) {
  return {
    type: ActionTypes.FETCH_WHATSAPP_CHAT,
    chat: data.chat,
    count: data.count
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

export function showSessions (data) {
  return {
    type: ActionTypes.FETCH_WHATSAPP_SESSIONS,
    sessions: data.sessions,
    count: data.count
  }
}

export function fetchSessions (data) {
  console.log('data for fetchSessions', data)
  return (dispatch) => {
    callApi('whatsAppChat/getSessions', 'post', data)
      .then(res => {
        console.log('response from fetchSessions', res)
        dispatch(showSessions(res.payload))
      })
  }
}

export function fetchChat (id, data) {
  console.log('data for fetchChat', data)
  return (dispatch) => {
    callApi(`whatsAppChat/getChat/${id}`, 'post', data)
      .then(res => {
        console.log('response from fetchChat', res)
        dispatch(showChat(res.payload))
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
