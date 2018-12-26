import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllMessengerAds (data) {
  return {
    type: ActionTypes.SHOW_MESSENGER_ADS,
    data
  }
}

export function fetchMessengerAds () {
  return (dispatch) => {
    callApi('jsonAd').then(res => {
      console.log('response from fetchMessengerAds', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllMessengerAds(res.payload))
      }
    })
  }
}
export function deleteMessengerAd (id, msg) {
  return (dispatch) => {
    callApi(`jsonAd/delete/${id}`, 'delete').then(res => {
      console.log('response from delete json ad', res)
      if (res.status === 'success') {
        msg.success('JSON ad has been deleted')
        dispatch(fetchMessengerAds())
      } else {
        msg.error('Failed to delete Messenger Ad')
      }
    })
  }
}
