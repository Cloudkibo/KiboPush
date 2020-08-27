import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

function setChatbot(data) {
  return {
    type: ActionTypes.SET_WHATSAPP_CHATBOT,
    data
  }
}

export function updateChatbot(data, callback) {
  console.log('data for updateChatbot', data)
  return (dispatch) => {
    callApi('whatsAppChatbot', 'put', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
        if (res.status === 'success') {
          dispatch(setChatbot(res.payload))
        }
      })
  }
}

export function createChatbot(data, callback) {
  console.log('data for createChatbot', data)
  return (dispatch) => {
    callApi('whatsAppChatbot', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
        if (res.status === 'success') {
          dispatch(setChatbot(res.payload))
        }
      })
  }
}

export function fetchChatbot() {
  return (dispatch) => {
    callApi('whatsAppChatbot')
      .then(res => {
        console.log('fetchChatbot respones', res.payload)
        if (res.status === 'success') {
          dispatch(setChatbot(res.payload))
        }
      })
  }
}

export function fetchAnalytics(id, days, callback) {
  return (dispatch) => {
    callApi(`whatsAppChatbot/${id}/stats/${days}`)
      .then(res => {
        console.log('whatsAppChatbot fetchAnalytics response', res.payload)
        if (res.status === 'success') {
          console.log('response from fetchAnalytics', res)
          callback(res)
        }
      })
  }
}
