import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showBroadcasts (data, append) {
  return {
    type: ActionTypes.LOAD_SMS_BROADCASTS_LIST,
    broadcasts: data.broadcasts,
    count: data.count,
    append: append
  }
}

export function setSearchBroadcastResult (data, append) {
  return {
    type: ActionTypes.LOAD_SEARCH_BROADCASTS_LIST,
    broadcasts: data ? data.broadcasts : null,
    count: data ? data.count : null,
    append
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

export function clearSendersInfo () {
  return {
    type: ActionTypes.CLEAR_SENDERS_INFO,
    data: null
  }
}

export function clearSmsAnalytics () {
  return {
    type: ActionTypes.CLEAR_SMS_ANALYTICS,
    data: null
  }
}


export function saveCurrentSmsBroadcast (broadcast) {
  return {
    type: ActionTypes.CURRENT_SMSBROADCAST,
    data: broadcast
  }
}

export function loadBroadcastsList (data, isSelect) {
  console.log('data for loadBroadcastsList', data)
  const append = data.first_page === 'next' && isSelect
  return (dispatch) => {
    callApi('smsBroadcasts', 'post', data)
      .then(res => {
        console.log('response from loadBroadcastsList', res)
        dispatch(showBroadcasts(res.payload, append))
      })
  }
}

export function searchBroadcastList (data) {
  console.log('data for searchBroadcastList', data)
  const append = data.first_page === 'next'
  return (dispatch) => {
    callApi('smsBroadcasts', 'post', data)
      .then(res => {
        console.log('response from searchBroadcastList', res)
        dispatch(setSearchBroadcastResult(res.payload, append))
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
        clearFields()
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

export function fetchResponseDetails (id, responseId, payload, handleResponses, removeLoader) {
  console.log('data for fetchResponseDetails', payload)
  return (dispatch) => {
    callApi(`smsBroadcasts/${id}/responses`, 'post', payload)
      .then(res => {
        console.log('response from fetchResponseDetails', res.payload)
        if (res.status === 'success') {
          if (responseId) {
            dispatch(showSenderInfo(responseId, res.payload))
          } else {
            if (handleResponses) {
              handleResponses(id, res.payload)
            }
          }
        }
        if(removeLoader) {
          removeLoader()
        }
      })
  }
}

export function sendFollowupBroadcast (payload, msg, setToDefault) {
  console.log('data for sendFollowupBroadcast', payload)
  return (dispatch) => {
    callApi(`smsBroadcasts/sendFollowupBroadcast`, 'post', payload)
      .then(res => {
        console.log('response from sendFollowupBroadcast', res.payload)
        if (res.status === 'success') {
         msg.success('Follow-up broadcat sent successfully')
         if (setToDefault) {
          setToDefault()
         }
        } else {
          msg.error(`Unable to send broadcast. ${res.description}`)
        }
      })
  }
}
