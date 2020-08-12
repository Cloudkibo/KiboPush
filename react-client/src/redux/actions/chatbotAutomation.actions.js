import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { getAccountsUrl } from '../../utility/utils'
import auth from '../../utility/auth.service'

function showChatbots (data) {
  return {
    type: ActionTypes.SHOW_CHATBOTS,
    data
  }
}

export function fetchChatbots () {
  return (dispatch) => {
    callApi('chatbots')
      .then(res => {
        console.log('response from fetchChatbots', res)
        if (res.status === 'success') {
          dispatch(showChatbots(res.payload))
        } else {
          dispatch(showChatbots([]))
        }
      })
  }
}

export function createChatbot (data, callback) {
  return (dispatch) => {
    callApi('chatbots', 'post', data)
      .then(res => {
        console.log('response from createChatbot', res)
        callback(res)
      })
  }
}

export function fetchChatbotDetails (id, callback) {
  return (dispatch) => {
    callApi(`chatbots/${id}/details`)
      .then(res => {
        console.log('response from fetchChatbotDetails', res)
        callback(res)
      })
  }
}

export function uploadAttachment (filedata, handleFunction) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${getAccountsUrl()}/uploadFile`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      handleFunction(res)
    })
  }
}

export function handleAttachment (data, callback) {
  return (dispatch) => {
    callApi(`messageBlock/attachment`, 'post', data)
      .then(res => {
        console.log('response from handleAttachment', res)
        callback(res)
      })
  }
}

export function handleMessageBlock (data, callback) {
  return (dispatch) => {
    callApi('messageBlock', 'post', data)
      .then(res => {
        console.log('response from handleMessageBlock', res)
        callback(res)
      })
  }
}

export function updateChatbot (data, callback) {
  return (dispatch) => {
    callApi('chatbots', 'put', data)
      .then(res => {
        console.log('response from updateChatbot', res)
        callback(res)
      })
  }
}

export function deleteMessageBlock (ids, callback) {
  return (dispatch) => {
    callApi('messageBlock', 'delete', {ids})
      .then(res => {
        console.log('response from deleteMessageBlock', res)
        callback(res)
      })
  }
}

export function fetchChatbot (id, callback) {
  return (dispatch) => {
    callApi(`chatbots/${id}/fetch`)
      .then(res => {
        console.log('response from fetchChatbot', res)
        callback(res)
      })
  }
}

export function fetchBackup (id, callback) {
  return (dispatch) => {
    callApi(`chatbots/${id}/fetchBackup`)
      .then(res => {
        console.log('response from fetchBackup', res)
        callback(res)
      })
  }
}

export function createBackup (data, callback) {
  return (dispatch) => {
    callApi(`chatbots/createBackup`, 'post', data)
      .then(res => {
        console.log('response from createBackup', res)
        callback(res)
      })
  }
}

export function restoreBackup (data, callback) {
  return (dispatch) => {
    callApi(`chatbots/restoreBackup`, 'post', data)
      .then(res => {
        console.log('response from restoreBackup', res)
        callback(res)
      })
  }
}

export function fetchAnalytics (id, days, callback) {
  console.log('data for fetchAnalytics', id, days)
  return (dispatch) => {
    callApi(`chatbots/${id}/stats/${days}`, 'get')
      .then(res => {
        console.log('response from fetchAnalytics', res)
        callback(res)
      })
  }
}
