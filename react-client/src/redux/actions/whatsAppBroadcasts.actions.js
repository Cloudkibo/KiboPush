import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showBroadcasts (data) {
  return {
    type: ActionTypes.LOAD_WHATSAPP_BROADCASTS_LIST,
    broadcasts: data.broadcasts,
    count: data.count
  }
}

export function loadBroadcastsList (data) {
  console.log('data for loadBroadcastsList', data)
  return (dispatch) => {
    callApi('whatsAppBroadcasts', 'post', data)
      .then(res => {
        console.log('response from loadBroadcastsList', res)
        dispatch(showBroadcasts(res.payload))
      })
  }
}

export function sendBroadcast (data, clearFields) {
  console.log('data for sendBroadcast', data)
  return (dispatch) => {
    callApi('whatsAppBroadcasts/sendBroadcast', 'post', data)
      .then(res => {
        console.log('response from sendBroadcast', res)
        if (res.status === 'success') {
          clearFields()
        }
      })
  }
}

export function getCount (data, onGetCount) {
  console.log('data for sendBroadcast', data)
  return (dispatch) => {
    callApi('whatsAppBroadcasts/getCount', 'post', {'segmentation': data})
      .then(res => {
        console.log('response from getCount', res.payload)
        if (onGetCount) {
          onGetCount(res.payload)
        }
      })
  }
}
