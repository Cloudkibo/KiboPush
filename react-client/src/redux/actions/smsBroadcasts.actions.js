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
