import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showBroadcasts (data) {
  return {
    type: ActionTypes.LOAD_SMS_BROADCASTS_LIST,
    broadcasts: data.broadcasts,
    count: data.count
  }
}

export function showTwilioNumbers (data) {
  console.log('data in showTwilioNumbers', data)
  return {
    type: ActionTypes.LOAD_TWILIO_NUMBERS,
    twilioNumbers: data
  }
}


export function showAnalytics (data) {
  console.log('data in showAnalytics', data)
  return {
    type: ActionTypes.SHOW_SMS_ANALYTICS,
    data
  }
}

export function showSenderInfo (id, data) {
  console.log('data in showSenderInfo', data)
  return {
    type: ActionTypes.SHOW_SENDERS_INFO,
    sendersInfo: data,
    responseId: id
  }
}



export function saveCurrentSmsBroadcast (broadcast) {
  return {
    type: ActionTypes.CURRENT_SMSBROADCAST,
    data: broadcast
  }
}

export function loadBroadcastsList (data) {
  console.log('data for loadBroadcastsList', data)
  return (dispatch) => {
    callApi('smsBroadcasts', 'post', data)
      .then(res => {
        console.log('response from loadBroadcastsList', res)
        dispatch(showBroadcasts(res.payload))
      })
  }
}

export function loadTwilioNumbers () {
  return (dispatch) => {
    callApi('smsBroadcasts/getTwilioNumbers')
      .then(res => {
        console.log('response from loadTwilioNumbers', res)
        dispatch(showTwilioNumbers(res.payload))
      })
  }
}

export function sendBroadcast (data, clearFields, msg) {
  console.log('data for sendBroadcast', data)
  return (dispatch) => {
    callApi('smsBroadcasts/sendBroadcast', 'post', data)
      .then(res => {
        console.log('response from sendBroadcast', res)
        if (res.status === 'success') {
          msg.success(res.description)
        } else {
          msg.error(res.description)
        }
        dispatch(clearFields())
      })
  }
}

export function getCount (data, onGetCount) {
  console.log('data for sendBroadcast', data)
  return (dispatch) => {
    callApi('smsBroadcasts/getCount', 'post', data)
      .then(res => {
        console.log('response from getCount', res.payload)
        if (onGetCount) {
          onGetCount(res.payload)
        }
      })
  }
}

export function fetchSmsAnalytics (id) {
  console.log('data for fetchSmsAnalytics', id)
  return (dispatch) => {
    callApi(`smsBroadcasts/${id}/analytics`, 'get')
      .then(res => {
        console.log('response from analytics', res.payload)
        if (res.status === 'success') {
          dispatch(showAnalytics(res.payload))
        }
      })
  }
}

export function fetchResponseDetails (id, responseId, payload) {
  console.log('data for fetchResponseDetails', payload)
  return (dispatch) => {
    callApi(`smsBroadcasts/${id}/responses`, 'post', payload)
      .then(res => {
        console.log('response from fetchResponseDetails', res.payload)
        if (res.status === 'success') {
          dispatch(showSenderInfo(responseId, res.payload))
        }
      })
  }
}
