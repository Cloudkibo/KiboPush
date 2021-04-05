import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

function showChatbots(data) {
  return {
    type: ActionTypes.SHOW_CHATBOTS,
    data
  }
}

export function fetchChatbots(callback) {
  return (dispatch) => {
    callApi('configure/chatbot')
      .then(res => {
        console.log('response from fetchChatbots', res)
        if (res.status === 'success') {
          dispatch(showChatbots(res.payload))
          if (callback) callback(res)
        } else {
          dispatch(showChatbots([]))
        }
      })
  }
}

export function createChatbot(data, callback) {
  return (dispatch) => {
    callApi('configure/chatbot', 'post', data)
      .then(res => {
        console.log('response from createChatbot', res)
        if (callback) {
          callback(res)
        }
      })
  }
}

export function fetchChatbotDetails(id, callback) {
  return (dispatch) => {
    callApi(`configure/chatbot/${id}/details`)
      .then(res => {
        console.log('response from fetchChatbotDetails', res)
        callback(res)
      })
  }
}

export function handleMessageBlock(data, callback) {
  return (dispatch) => {
    callApi('configure/chatbot/block', 'post', data)
      .then(res => {
        console.log('response from handleMessageBlock', res)
        callback(res)
      })
  }
}

export function updateChatbot(data, callback) {
  return (dispatch) => {
    callApi('configure/chatbot', 'put', data)
      .then(res => {
        console.log('response from updateChatbot', res)
        callback(res)
      })
  }
}

export function updateEcommerceChatbot(id, data, callback) {
  return (dispatch) => {
    callApi(`configure/chatbot/${id}`, 'put', data)
      .then(res => {
        console.log('response from updateEcommerceChatbot', res)
        callback(res)
      })
  }
}

export function deleteMessageBlock(ids, callback) {
  return (dispatch) => {
    callApi('configure/chatbot/block', 'delete', { ids })
      .then(res => {
        console.log('response from deleteMessageBlock', res)
        callback(res)
      })
  }
}
